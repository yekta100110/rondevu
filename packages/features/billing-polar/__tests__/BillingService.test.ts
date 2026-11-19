import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BillingService } from "../services/BillingService";
import {
  CUSTOMER_ID,
  createFakeGateway,
  d,
  FakeBillingRepository,
  MONTHLY_PRODUCT,
  subscriptionSnapshot,
  testConfig,
  YEARLY_PRODUCT,
} from "./fakes";

const MID_PERIOD = d("2026-11-15T00:00:00Z");
const AFTER_PERIOD = d("2026-12-01T00:00:01Z");

describe("BillingService", () => {
  let repo: FakeBillingRepository;
  let gateway: ReturnType<typeof createFakeGateway>;
  let service: BillingService;

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(MID_PERIOD);
    repo = new FakeBillingRepository();
    repo.addUser({ id: 1, email: "owner@example.com", name: "Ayşe" });
    gateway = createFakeGateway();
    service = new BillingService({ billingRepository: repo, polarGateway: gateway, config: testConfig });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("first payment", () => {
    it("activates the paid plan from order.paid and keeps access until the period end", async () => {
      const result = await service.applyOrderSnapshot({
        id: "ord_1",
        customerId: CUSTOMER_ID,
        externalCustomerId: "1",
        subscriptionId: "sub_1",
        status: "paid",
        billingReason: "subscription_create",
        totalAmount: 99000,
        refundedAmount: 0,
        currency: "try",
        createdAt: d("2026-11-01T00:00:00Z"),
        modifiedAt: d("2026-11-01T00:00:05Z"),
        subscription: { ...subscriptionSnapshot(), pendingUpdate: undefined },
      });

      expect(result).toEqual({ applied: true, userId: 1 });
      const status = await service.getStatus(1, MID_PERIOD);
      expect(status).toMatchObject({
        hasAccess: true,
        plan: "MONTHLY",
        status: "active",
        currentPeriodEnd: d("2026-12-01T00:00:00Z"),
        accessEndsAt: d("2026-12-01T00:00:00Z"),
        isLive: true,
      });
      expect((await service.getStatus(1, AFTER_PERIOD)).hasAccess).toBe(false);
    });

    it("turns a paying outreach demo into a permanent account", async () => {
      repo.addUser({
        id: 1,
        metadata: {
          isOutreachDemo: true,
          demoCreatedAt: "2026-11-01",
          demoExpiresAt: "2026-11-16",
          other: 1,
        },
      });

      await service.applySubscriptionSnapshot(subscriptionSnapshot());

      const metadata = repo.users.get(1)?.metadata as Record<string, unknown>;
      expect(metadata.isOutreachDemo).toBe(false);
      expect(metadata.demoExpiresAt).toBeUndefined();
      expect(metadata.demoCreatedAt).toBe("2026-11-01");
      expect(metadata.other).toBe(1);
      expect(typeof metadata.demoClaimedAt).toBe("string");
    });

    it("does not claim a demo for a subscription that never got paid", async () => {
      repo.addUser({ id: 1, metadata: { isOutreachDemo: true, demoExpiresAt: "2026-11-16" } });
      await service.applySubscriptionSnapshot(subscriptionSnapshot({ status: "incomplete" }));
      expect((repo.users.get(1)?.metadata as Record<string, unknown>).isOutreachDemo).toBe(true);
    });

    it("falls back to the stored Polar customer id when external id is missing", async () => {
      await service.applySubscriptionSnapshot(subscriptionSnapshot());
      const result = await service.applySubscriptionSnapshot(
        subscriptionSnapshot({ externalCustomerId: null, modifiedAt: d("2026-11-02T00:00:00Z") })
      );
      expect(result).toEqual({ applied: true, userId: 1 });
    });

    it("ignores unknown products and customers", async () => {
      expect(
        await service.applySubscriptionSnapshot(subscriptionSnapshot({ productId: "prod_other" }))
      ).toEqual({
        applied: false,
        reason: "unknown_product",
      });
      expect(
        await service.applySubscriptionSnapshot(
          subscriptionSnapshot({ externalCustomerId: "999", customerId: "x" })
        )
      ).toEqual({ applied: false, reason: "unknown_customer" });
    });
  });

  describe("renewal", () => {
    it("extends access when the next period is paid", async () => {
      await service.applySubscriptionSnapshot(subscriptionSnapshot());
      await service.applySubscriptionSnapshot(
        subscriptionSnapshot({
          currentPeriodStart: d("2026-12-01T00:00:00Z"),
          currentPeriodEnd: d("2027-01-01T00:00:00Z"),
          modifiedAt: d("2026-12-01T00:00:10Z"),
        })
      );
      const status = await service.getStatus(1, AFTER_PERIOD);
      expect(status.hasAccess).toBe(true);
      expect(status.currentPeriodEnd).toEqual(d("2027-01-01T00:00:00Z"));
    });

    it("renews a yearly plan for a full year", async () => {
      await service.applySubscriptionSnapshot(
        subscriptionSnapshot({
          productId: YEARLY_PRODUCT,
          currentPeriodStart: d("2027-11-01T00:00:00Z"),
          currentPeriodEnd: d("2028-11-01T00:00:00Z"),
          modifiedAt: d("2027-11-01T00:00:00Z"),
        })
      );
      const status = await service.getStatus(1, d("2028-06-01T00:00:00Z"));
      expect(status).toMatchObject({ hasAccess: true, plan: "YEARLY" });
    });

    it("keeps access for 7 days after a renewal goes past due, then closes it", async () => {
      await service.applySubscriptionSnapshot(subscriptionSnapshot());
      const pastDue = {
        status: "past_due",
        currentPeriodStart: d("2026-12-01T00:00:00Z"),
        currentPeriodEnd: d("2027-01-01T00:00:00Z"),
      };
      await service.applySubscriptionSnapshot(
        subscriptionSnapshot({ ...pastDue, modifiedAt: d("2026-12-01T00:00:10Z") })
      );
      // A later dunning retry must not push the deadline out.
      await service.applySubscriptionSnapshot(
        subscriptionSnapshot({ ...pastDue, modifiedAt: d("2026-12-04T00:00:00Z") })
      );

      const graceEnd = d("2026-12-08T00:00:10Z");
      expect(await service.getStatus(1, d("2026-12-08T00:00:09Z"))).toMatchObject({
        hasAccess: true,
        status: "past_due",
        accessEndsAt: graceEnd,
      });
      expect(await service.getStatus(1, graceEnd)).toMatchObject({ hasAccess: false, isLive: true });
    });

    it("counts the grace period from Polar's past_due_at when it is sent", async () => {
      await service.applySubscriptionSnapshot(
        subscriptionSnapshot({
          status: "past_due",
          pastDueAt: d("2026-12-01T06:00:00Z"),
          modifiedAt: d("2026-12-02T00:00:00Z"),
        })
      );
      expect((await service.getStatus(1)).accessEndsAt).toEqual(d("2026-12-08T06:00:00Z"));
    });

    it("restores access when the past-due payment recovers", async () => {
      const renewed = {
        currentPeriodStart: d("2026-12-01T00:00:00Z"),
        currentPeriodEnd: d("2027-01-01T00:00:00Z"),
      };
      await service.applySubscriptionSnapshot(
        subscriptionSnapshot({ ...renewed, status: "past_due", modifiedAt: d("2026-12-01T00:00:10Z") })
      );
      await service.applySubscriptionSnapshot(
        subscriptionSnapshot({ ...renewed, status: "active", modifiedAt: d("2026-12-03T00:00:00Z") })
      );
      expect((await service.getStatus(1, d("2026-12-04T00:00:00Z"))).hasAccess).toBe(true);
    });
  });

  describe("plan change", () => {
    beforeEach(async () => {
      await service.applySubscriptionSnapshot(subscriptionSnapshot());
    });

    it("upgrades monthly to yearly on the same subscription and charges the difference now", async () => {
      gateway.updateSubscription.mockResolvedValue(
        subscriptionSnapshot({
          productId: YEARLY_PRODUCT,
          currentPeriodEnd: d("2027-11-15T00:00:00Z"),
          modifiedAt: d("2026-11-15T00:00:00Z"),
        })
      );

      const status = await service.changePlan({ userId: 1, plan: "YEARLY" });

      expect(gateway.updateSubscription).toHaveBeenCalledWith("sub_1", {
        kind: "changeProduct",
        productId: YEARLY_PRODUCT,
        prorationBehavior: "invoice",
      });
      expect(gateway.createCheckout).not.toHaveBeenCalled();
      expect(status.plan).toBe("YEARLY");
      expect(repo.subscriptions.size).toBe(1);
    });

    it("schedules yearly to monthly for the end of the paid year and can undo it", async () => {
      await service.applySubscriptionSnapshot(
        subscriptionSnapshot({
          id: "sub_1",
          productId: YEARLY_PRODUCT,
          currentPeriodEnd: d("2027-11-01T00:00:00Z"),
          modifiedAt: d("2026-11-02T00:00:00Z"),
        })
      );
      gateway.updateSubscription.mockResolvedValueOnce(
        subscriptionSnapshot({
          productId: YEARLY_PRODUCT,
          currentPeriodEnd: d("2027-11-01T00:00:00Z"),
          modifiedAt: d("2026-11-03T00:00:00Z"),
          pendingUpdate: { productId: MONTHLY_PRODUCT, appliesAt: d("2027-11-01T00:00:00Z") },
        })
      );

      const scheduled = await service.changePlan({ userId: 1, plan: "MONTHLY" });

      expect(gateway.updateSubscription).toHaveBeenLastCalledWith("sub_1", {
        kind: "changeProduct",
        productId: MONTHLY_PRODUCT,
        prorationBehavior: "next_period",
      });
      expect(scheduled).toMatchObject({
        plan: "YEARLY",
        pendingPlan: "MONTHLY",
        pendingPlanAppliesAt: d("2027-11-01T00:00:00Z"),
      });

      gateway.updateSubscription.mockResolvedValueOnce(
        subscriptionSnapshot({
          productId: YEARLY_PRODUCT,
          currentPeriodEnd: d("2027-11-01T00:00:00Z"),
          modifiedAt: d("2026-11-04T00:00:00Z"),
          pendingUpdate: null,
        })
      );
      const undone = await service.changePlan({ userId: 1, plan: "YEARLY" });
      expect(gateway.updateSubscription).toHaveBeenLastCalledWith("sub_1", { kind: "clearPendingUpdate" });
      expect(undone.pendingPlan).toBeNull();
    });

    it("rejects invalid plan changes", async () => {
      await expect(service.changePlan({ userId: 1, plan: "MONTHLY" })).rejects.toThrow("billing_same_plan");
      await expect(service.changePlan({ userId: 2, plan: "YEARLY" })).rejects.toThrow(
        "billing_no_subscription"
      );

      await service.applySubscriptionSnapshot(
        subscriptionSnapshot({ cancelAtPeriodEnd: true, modifiedAt: d("2026-11-05T00:00:00Z") })
      );
      await expect(service.changePlan({ userId: 1, plan: "YEARLY" })).rejects.toThrow("billing_resume_first");

      await service.applySubscriptionSnapshot(
        subscriptionSnapshot({ status: "past_due", modifiedAt: d("2026-11-06T00:00:00Z") })
      );
      await expect(service.changePlan({ userId: 1, plan: "YEARLY" })).rejects.toThrow(
        "billing_payment_past_due"
      );
      expect(gateway.updateSubscription).not.toHaveBeenCalled();
    });
  });

  describe("cancellation", () => {
    beforeEach(async () => {
      await service.applySubscriptionSnapshot(subscriptionSnapshot());
    });

    it("cancels at period end and keeps access until then", async () => {
      gateway.updateSubscription.mockResolvedValue(
        subscriptionSnapshot({ cancelAtPeriodEnd: true, modifiedAt: d("2026-11-10T00:00:00Z") })
      );

      await service.cancelAtPeriodEnd(1);

      expect(gateway.updateSubscription).toHaveBeenCalledWith("sub_1", {
        kind: "cancelAtPeriodEnd",
        value: true,
      });
      expect(await service.getStatus(1, MID_PERIOD)).toMatchObject({
        hasAccess: true,
        cancelAtPeriodEnd: true,
      });
      expect((await service.getStatus(1, AFTER_PERIOD)).hasAccess).toBe(false);
    });

    it("does not call Polar again when already scheduled to cancel", async () => {
      await service.applySubscriptionSnapshot(
        subscriptionSnapshot({ cancelAtPeriodEnd: true, modifiedAt: d("2026-11-10T00:00:00Z") })
      );
      await service.cancelAtPeriodEnd(1);
      expect(gateway.updateSubscription).not.toHaveBeenCalled();
    });

    it("resumes a cancellation", async () => {
      await service.applySubscriptionSnapshot(
        subscriptionSnapshot({ cancelAtPeriodEnd: true, modifiedAt: d("2026-11-10T00:00:00Z") })
      );
      gateway.updateSubscription.mockResolvedValue(
        subscriptionSnapshot({ cancelAtPeriodEnd: false, modifiedAt: d("2026-11-11T00:00:00Z") })
      );

      const status = await service.resume(1);

      expect(gateway.updateSubscription).toHaveBeenCalledWith("sub_1", {
        kind: "cancelAtPeriodEnd",
        value: false,
      });
      expect(status.cancelAtPeriodEnd).toBe(false);
    });

    it("refuses to resume a subscription that is not scheduled to cancel", async () => {
      await expect(service.resume(1)).rejects.toThrow("billing_not_scheduled_to_cancel");
    });

    it("ends access immediately when the subscription is revoked", async () => {
      await service.applySubscriptionSnapshot(
        subscriptionSnapshot({
          status: "canceled",
          endedAt: d("2026-11-10T00:00:00Z"),
          modifiedAt: d("2026-11-10T00:00:00Z"),
        })
      );
      expect(await service.getStatus(1, MID_PERIOD)).toMatchObject({
        hasAccess: false,
        isLive: false,
        accessEndsAt: d("2026-11-10T00:00:00Z"),
      });
    });
  });

  describe("refunds", () => {
    const paidOrder = {
      id: "ord_1",
      customerId: CUSTOMER_ID,
      externalCustomerId: "1",
      subscriptionId: "sub_1",
      status: "paid",
      billingReason: "subscription_create",
      totalAmount: 99000,
      refundedAmount: 0,
      currency: "try",
      createdAt: d("2026-11-01T00:00:00Z"),
      modifiedAt: d("2026-11-01T00:00:05Z"),
      subscription: { ...subscriptionSnapshot(), pendingUpdate: undefined },
    };

    it("takes access back after a full refund of the paying order", async () => {
      await service.applyOrderSnapshot(paidOrder);
      await service.applyOrderSnapshot({
        ...paidOrder,
        status: "refunded",
        refundedAmount: 99000,
        modifiedAt: d("2026-11-05T00:00:00Z"),
      });
      expect(await service.getStatus(1, MID_PERIOD)).toMatchObject({
        hasAccess: false,
        refunded: true,
        accessEndsAt: d("2026-11-05T00:00:00Z"),
      });
    });

    it("keeps access after a partial refund", async () => {
      await service.applyOrderSnapshot(paidOrder);
      await service.applyOrderSnapshot({
        ...paidOrder,
        status: "partially_refunded",
        refundedAmount: 10000,
        modifiedAt: d("2026-11-05T00:00:00Z"),
      });
      expect((await service.getStatus(1, MID_PERIOD)).hasAccess).toBe(true);
    });

    it("does not let a late order.paid undo a refund", async () => {
      await service.applyOrderSnapshot({
        ...paidOrder,
        status: "refunded",
        refundedAmount: 99000,
        modifiedAt: d("2026-11-05T00:00:00Z"),
      });
      await service.applyOrderSnapshot(paidOrder);
      expect(repo.orders.get("ord_1")?.status).toBe("refunded");
      expect((await service.getStatus(1, MID_PERIOD)).hasAccess).toBe(false);
    });

    it("ignores orders that are not for a subscription", async () => {
      expect(
        await service.applyOrderSnapshot({ ...paidOrder, subscriptionId: null, subscription: null })
      ).toEqual({
        applied: false,
        reason: "not_a_subscription",
      });
    });
  });

  describe("out-of-order snapshots", () => {
    it("drops a snapshot older than the stored one", async () => {
      await service.applySubscriptionSnapshot(
        subscriptionSnapshot({ cancelAtPeriodEnd: true, modifiedAt: d("2026-11-10T00:00:00Z") })
      );
      const result = await service.applySubscriptionSnapshot(
        subscriptionSnapshot({ cancelAtPeriodEnd: false, modifiedAt: d("2026-11-09T00:00:00Z") })
      );
      expect(result).toEqual({ applied: false, reason: "stale" });
      expect((await service.getStatus(1, MID_PERIOD)).cancelAtPeriodEnd).toBe(true);
    });

    it("keeps a scheduled plan change when an order snapshot without pending data arrives", async () => {
      await service.applySubscriptionSnapshot(
        subscriptionSnapshot({
          productId: YEARLY_PRODUCT,
          pendingUpdate: { productId: MONTHLY_PRODUCT, appliesAt: d("2027-11-01T00:00:00Z") },
        })
      );
      await service.applySubscriptionSnapshot(
        subscriptionSnapshot({
          productId: YEARLY_PRODUCT,
          pendingUpdate: undefined,
          modifiedAt: d("2026-11-02T00:00:00Z"),
        })
      );
      expect((await service.getStatus(1, MID_PERIOD)).pendingPlan).toBe("MONTHLY");
    });
  });

  describe("checkout", () => {
    it("creates a checkout tied to the user id", async () => {
      const { url } = await service.createCheckout({ userId: 1, plan: "YEARLY" });

      expect(url).toBe("https://polar.test/c");
      expect(gateway.createCheckout).toHaveBeenCalledWith(
        expect.objectContaining({
          productId: YEARLY_PRODUCT,
          externalCustomerId: "1",
          customerEmail: "owner@example.com",
          customerName: "Ayşe",
          locale: "tr",
          successUrl: expect.stringContaining("/billing/success?checkout_id={CHECKOUT_ID}"),
        })
      );
    });

    it("leaves placeholder demo and SMS addresses for the customer to fill in", async () => {
      repo.addUser({ id: 1, email: "lead-42@demo.rondevu.org" });
      await service.createCheckout({ userId: 1, plan: "MONTHLY" });
      repo.addUser({ id: 1, email: "905551112233@sms.rondevu.org" });
      await service.createCheckout({ userId: 1, plan: "MONTHLY" });
      for (const [call] of gateway.createCheckout.mock.calls) expect(call.customerEmail).toBeNull();
    });

    it("blocks a second subscription while one is live", async () => {
      await service.applySubscriptionSnapshot(subscriptionSnapshot());
      await expect(service.createCheckout({ userId: 1, plan: "YEARLY" })).rejects.toThrow(
        "billing_subscription_exists"
      );
    });

    it("allows a new checkout after the previous subscription ended", async () => {
      await service.applySubscriptionSnapshot(
        subscriptionSnapshot({ status: "canceled", endedAt: d("2026-12-01T00:00:00Z") })
      );
      await expect(service.createCheckout({ userId: 1, plan: "MONTHLY" })).resolves.toEqual({
        url: "https://polar.test/c",
      });
    });

    it("fails clearly when products are not configured", async () => {
      service = new BillingService({
        billingRepository: repo,
        polarGateway: gateway,
        config: { ...testConfig, products: { MONTHLY: null, YEARLY: null } },
      });
      await expect(service.createCheckout({ userId: 1, plan: "MONTHLY" })).rejects.toThrow(
        "billing_not_configured"
      );
    });
  });

  describe("portal and sync", () => {
    it("opens the customer portal only for customers known to Polar", async () => {
      await expect(service.createPortalUrl(1)).rejects.toThrow("billing_no_subscription");
      await service.applySubscriptionSnapshot(subscriptionSnapshot());
      await expect(service.createPortalUrl(1)).resolves.toEqual({ url: "https://polar.test/portal" });
      expect(gateway.createCustomerPortalUrl).toHaveBeenCalledWith(
        expect.objectContaining({ externalCustomerId: "1" })
      );
    });

    it("pulls subscriptions from Polar when a webhook is late", async () => {
      gateway.listSubscriptionsByExternalCustomerId.mockResolvedValue([subscriptionSnapshot()]);
      const status = await service.syncFromPolar(1);
      expect(gateway.listSubscriptionsByExternalCustomerId).toHaveBeenCalledWith("1");
      expect(status.plan).toBe("MONTHLY");
    });

    it("reports a user without any subscription as unpaid", async () => {
      expect(await service.getStatus(1)).toMatchObject({
        hasAccess: false,
        plan: null,
        hasBillingHistory: false,
      });
    });
  });
});
