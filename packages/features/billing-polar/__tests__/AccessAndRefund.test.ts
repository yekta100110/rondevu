import { ErrorCode } from "@rondevu/lib/errorCodes";
import { ErrorWithCode } from "@rondevu/lib/errors";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { OrderSnapshot } from "../lib/types";
import { BillingService } from "../services/BillingService";
import {
  CUSTOMER_ID,
  createFakeGateway,
  d,
  FakeBillingRepository,
  subscriptionSnapshot,
  testConfig,
} from "./fakes";

const NOW = d("2026-11-15T00:00:00Z");

const paidOrder = (overrides: Partial<OrderSnapshot> = {}): OrderSnapshot => ({
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
  ...overrides,
});

const revokedSnapshot = () =>
  subscriptionSnapshot({
    status: "canceled",
    endedAt: d("2026-11-12T00:00:00Z"),
    modifiedAt: d("2026-11-12T00:00:01Z"),
  });

describe("BillingService access gate", () => {
  let repo: FakeBillingRepository;
  let gateway: ReturnType<typeof createFakeGateway>;
  let service: BillingService;

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(NOW);
    repo = new FakeBillingRepository();
    repo.addUser({ id: 1, email: "owner@example.com" });
    gateway = createFakeGateway();
    service = new BillingService({ billingRepository: repo, polarGateway: gateway, config: testConfig });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("denies a user with no subscription, demo or manual access", async () => {
    expect(await service.getAccess(1)).toEqual({ hasAccess: false, reason: null, until: null });
    expect(await service.hasAccess(404)).toBe(false);
  });

  it("always lets admins in", async () => {
    repo.addUser({ id: 1, role: "ADMIN" });
    expect(await service.getAccess(1)).toMatchObject({ hasAccess: true, reason: "admin" });
  });

  it("lets an outreach demo in until demoExpiresAt, not after", async () => {
    repo.addUser({ id: 1, metadata: { isOutreachDemo: true, demoExpiresAt: "2026-11-20T00:00:00.000Z" } });
    expect(await service.getAccess(1)).toEqual({
      hasAccess: true,
      reason: "outreach_demo",
      until: d("2026-11-20T00:00:00Z"),
    });
    expect(await service.hasAccess(1, d("2026-11-20T00:00:00Z"))).toBe(false);
  });

  it("does not treat a demo without an expiry as unlimited", async () => {
    repo.addUser({ id: 1, metadata: { isOutreachDemo: true } });
    expect(await service.hasAccess(1)).toBe(false);
  });

  it("honours manual access without an end date and with a future end date", async () => {
    await service.grantManualAccess({
      adminUserId: 9,
      email: "OWNER@example.com",
      until: null,
      note: "whatsapp",
    });
    expect(await service.getAccess(1)).toEqual({ hasAccess: true, reason: "manual", until: null });

    await service.grantManualAccess({
      adminUserId: 9,
      email: "owner@example.com",
      until: d("2026-12-01T00:00:00Z"),
      note: null,
    });
    expect(await service.hasAccess(1, d("2026-11-30T23:59:59Z"))).toBe(true);
    expect(await service.hasAccess(1, d("2026-12-01T00:00:00Z"))).toBe(false);
  });

  it("removes manual access", async () => {
    await service.grantManualAccess({ adminUserId: 9, email: "owner@example.com", until: null, note: null });
    await service.removeManualAccess("owner@example.com");
    expect(await service.hasAccess(1)).toBe(false);
  });

  it("reports manual access by email for the admin page", async () => {
    await service.grantManualAccess({
      adminUserId: 9,
      email: "owner@example.com",
      until: null,
      note: "elle",
    });
    expect(await service.findAccessByEmail(" owner@example.com ")).toMatchObject({
      userId: 1,
      access: { hasAccess: true, reason: "manual" },
      manual: { until: null, note: "elle" },
    });
    await expect(service.findAccessByEmail("nobody@example.com")).rejects.toThrow("billing_user_not_found");
  });

  it("grants access through a paid subscription", async () => {
    await service.applySubscriptionSnapshot(subscriptionSnapshot());
    expect(await service.getAccess(1)).toEqual({
      hasAccess: true,
      reason: "subscription",
      until: d("2026-12-01T00:00:00Z"),
    });
  });
});

describe("BillingService full refund", () => {
  let repo: FakeBillingRepository;
  let gateway: ReturnType<typeof createFakeGateway>;
  let service: BillingService;

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(NOW);
    repo = new FakeBillingRepository();
    repo.addUser({ id: 1 });
    gateway = createFakeGateway();
    service = new BillingService({ billingRepository: repo, polarGateway: gateway, config: testConfig });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("revokes the Polar subscription so it cannot charge again", async () => {
    gateway.revokeSubscription.mockResolvedValue(revokedSnapshot());
    await service.applyOrderSnapshot(paidOrder());
    await service.applyOrderSnapshot(
      paidOrder({ status: "refunded", refundedAmount: 99000, modifiedAt: d("2026-11-12T00:00:00Z") })
    );

    expect(gateway.revokeSubscription).toHaveBeenCalledWith("sub_1");
    expect(await service.getStatus(1)).toMatchObject({ hasAccess: false, isLive: false, status: "canceled" });
  });

  it("does not revoke for a partial refund", async () => {
    await service.applyOrderSnapshot(paidOrder());
    await service.applyOrderSnapshot(
      paidOrder({
        status: "partially_refunded",
        refundedAmount: 10000,
        modifiedAt: d("2026-11-12T00:00:00Z"),
      })
    );
    expect(gateway.revokeSubscription).not.toHaveBeenCalled();
    expect(await service.hasAccess(1)).toBe(true);
  });

  it("does not revoke when an older order is refunded", async () => {
    await service.applyOrderSnapshot(paidOrder({ id: "ord_old", createdAt: d("2026-10-01T00:00:00Z") }));
    await service.applyOrderSnapshot(paidOrder({ id: "ord_new" }));
    await service.applyOrderSnapshot(
      paidOrder({
        id: "ord_old",
        createdAt: d("2026-10-01T00:00:00Z"),
        status: "refunded",
        refundedAmount: 99000,
        modifiedAt: d("2026-11-12T00:00:00Z"),
      })
    );
    expect(gateway.revokeSubscription).not.toHaveBeenCalled();
  });

  it("does not call Polar again when the subscription has already ended", async () => {
    await service.applyOrderSnapshot(paidOrder());
    await service.applySubscriptionSnapshot(revokedSnapshot());
    await service.applyOrderSnapshot(
      paidOrder({ status: "refunded", refundedAmount: 99000, modifiedAt: d("2026-11-13T00:00:00Z") })
    );
    expect(gateway.revokeSubscription).not.toHaveBeenCalled();
  });

  it("fails loudly when Polar refuses the revoke", async () => {
    gateway.revokeSubscription.mockRejectedValue(
      new ErrorWithCode(ErrorCode.InternalServerError, "billing_provider_error")
    );
    await service.applyOrderSnapshot(paidOrder());
    await expect(
      service.applyOrderSnapshot(
        paidOrder({ status: "refunded", refundedAmount: 99000, modifiedAt: d("2026-11-12T00:00:00Z") })
      )
    ).rejects.toThrow("billing_provider_error");
    // Access is already closed by the refund even though Polar still has to be told.
    expect(await service.hasAccess(1)).toBe(false);
  });
});
