import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BillingService } from "../services/BillingService";
import { PolarWebhookService } from "../services/PolarWebhookService";
import { CUSTOMER_ID, createFakeGateway, FakeBillingRepository, MONTHLY_PRODUCT, testConfig } from "./fakes";

const NOW = new Date("2026-11-15T00:00:00Z");

const sign = (secret: string, id: string, timestamp: number, body: string) =>
  `v1,${createHmac("sha256", secret).update(`${id}.${timestamp}.${body}`).digest("base64")}`;

let deliveryCounter = 0;

function delivery(payload: unknown, options: { id?: string; secret?: string; signature?: string } = {}) {
  const body = JSON.stringify(payload);
  const id = options.id ?? `msg_${++deliveryCounter}`;
  const timestamp = Math.floor(Date.now() / 1000);
  return {
    body,
    headers: {
      "webhook-id": id,
      "webhook-timestamp": String(timestamp),
      "webhook-signature":
        options.signature ?? sign(options.secret ?? "whsec_test_secret", id, timestamp, body),
    },
  };
}

type SubscriptionFields = {
  status?: string;
  cancel_at_period_end?: boolean;
  current_period_start?: string;
  current_period_end?: string;
  ended_at?: string | null;
  modified_at?: string | null;
  product_id?: string;
};

function subscriptionData(fields: SubscriptionFields = {}) {
  return {
    id: "sub_1",
    created_at: "2026-11-01T00:00:00Z",
    modified_at: "2026-11-01T00:00:00Z",
    status: "active",
    cancel_at_period_end: false,
    current_period_start: "2026-11-01T00:00:00Z",
    current_period_end: "2026-12-01T00:00:00Z",
    ended_at: null,
    customer_id: CUSTOMER_ID,
    product_id: MONTHLY_PRODUCT,
    customer: { id: CUSTOMER_ID, external_id: "1" },
    pending_update: null,
    ...fields,
  };
}

const subscriptionEvent = (type: string, fields: SubscriptionFields = {}) => ({
  type,
  timestamp: fields.modified_at ?? "2026-11-01T00:00:00Z",
  data: subscriptionData(fields),
});

function orderEvent(type: string, fields: { status: string; refunded_amount?: number; modified_at: string }) {
  const { customer: _customer, pending_update: _pending, ...subscription } = subscriptionData();
  return {
    type,
    timestamp: fields.modified_at,
    data: {
      id: "ord_1",
      created_at: "2026-11-01T00:00:00Z",
      modified_at: fields.modified_at,
      status: fields.status,
      billing_reason: "subscription_create",
      total_amount: 99000,
      refunded_amount: fields.refunded_amount ?? 0,
      currency: "try",
      customer_id: CUSTOMER_ID,
      subscription_id: "sub_1",
      customer: { id: CUSTOMER_ID, external_id: "1" },
      subscription,
    },
  };
}

describe("PolarWebhookService", () => {
  let repo: FakeBillingRepository;
  let billingService: BillingService;
  let webhookService: PolarWebhookService;

  const send = (payload: unknown, options?: Parameters<typeof delivery>[1]) => {
    const { body, headers } = delivery(payload, options);
    return webhookService.handle(body, headers);
  };

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(NOW);
    repo = new FakeBillingRepository();
    repo.addUser({ id: 1, metadata: { isOutreachDemo: true, demoExpiresAt: "2026-11-16T00:00:00Z" } });
    billingService = new BillingService({
      billingRepository: repo,
      polarGateway: createFakeGateway(),
      config: testConfig,
    });
    webhookService = new PolarWebhookService({ billingService, billingRepository: repo, config: testConfig });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("rejects a delivery with an invalid signature", async () => {
    const result = await send(subscriptionEvent("subscription.active"), { signature: "v1,invalid" });
    expect(result).toMatchObject({ status: 403, outcome: "invalid_signature" });
    expect(repo.subscriptions.size).toBe(0);
  });

  it("rejects a delivery signed with another secret", async () => {
    const result = await send(subscriptionEvent("subscription.active"), { secret: "whsec_other" });
    expect(result.status).toBe(403);
  });

  it("acknowledges signed event types this SDK does not know", async () => {
    expect(await send({ type: "unknown.thing", data: {} })).toMatchObject({
      status: 202,
      outcome: "unknown_type",
    });
  });

  it("refuses to run without a webhook secret", async () => {
    webhookService = new PolarWebhookService({
      billingService,
      billingRepository: repo,
      config: { ...testConfig, webhookSecret: null },
    });
    await expect(send(subscriptionEvent("subscription.active"))).rejects.toThrow(
      "billing_webhook_not_configured"
    );
  });

  it("activates the plan on first payment (order.paid) and claims the demo account", async () => {
    const result = await send(
      orderEvent("order.paid", { status: "paid", modified_at: "2026-11-01T00:00:05Z" })
    );

    expect(result).toMatchObject({ status: 202, outcome: "processed" });
    expect(await billingService.getStatus(1)).toMatchObject({ hasAccess: true, plan: "MONTHLY" });
    expect((repo.users.get(1)?.metadata as Record<string, unknown>).isOutreachDemo).toBe(false);
  });

  it("processes a redelivered webhook only once", async () => {
    const payload = subscriptionEvent("subscription.active");
    const applySpy = vi.spyOn(billingService, "applySubscriptionSnapshot");

    await send(payload, { id: "msg_same" });
    const second = await send(payload, { id: "msg_same" });

    expect(second).toMatchObject({ status: 202, outcome: "duplicate" });
    expect(applySpy).toHaveBeenCalledTimes(1);
  });

  it("ignores an older event that arrives after a newer one", async () => {
    await send(
      subscriptionEvent("subscription.canceled", {
        cancel_at_period_end: true,
        modified_at: "2026-11-10T00:00:00Z",
      })
    );
    const late = await send(
      subscriptionEvent("subscription.active", { modified_at: "2026-11-01T00:00:00Z" })
    );

    expect(late).toMatchObject({ status: 202, outcome: "ignored", detail: "stale" });
    expect((await billingService.getStatus(1)).cancelAtPeriodEnd).toBe(true);
  });

  it("renews access on subscription.updated with the next period", async () => {
    await send(subscriptionEvent("subscription.active"));
    await send(
      subscriptionEvent("subscription.updated", {
        current_period_start: "2026-12-01T00:00:00Z",
        current_period_end: "2027-01-01T00:00:00Z",
        modified_at: "2026-12-01T00:00:05Z",
      })
    );
    vi.setSystemTime(new Date("2026-12-10T00:00:00Z"));
    expect(await billingService.getStatus(1)).toMatchObject({
      hasAccess: true,
      currentPeriodEnd: new Date("2027-01-01T00:00:00Z"),
    });
  });

  it("keeps access after subscription.canceled until the period ends, then uncanceled restores renewal", async () => {
    await send(subscriptionEvent("subscription.active"));
    await send(
      subscriptionEvent("subscription.canceled", {
        cancel_at_period_end: true,
        modified_at: "2026-11-10T00:00:00Z",
      })
    );
    expect(await billingService.getStatus(1)).toMatchObject({ hasAccess: true, cancelAtPeriodEnd: true });

    await send(subscriptionEvent("subscription.uncanceled", { modified_at: "2026-11-11T00:00:00Z" }));
    expect((await billingService.getStatus(1)).cancelAtPeriodEnd).toBe(false);
  });

  it("closes access on subscription.past_due and on subscription.revoked", async () => {
    await send(subscriptionEvent("subscription.active"));
    await send(
      subscriptionEvent("subscription.past_due", {
        status: "past_due",
        current_period_start: "2026-12-01T00:00:00Z",
        current_period_end: "2027-01-01T00:00:00Z",
        modified_at: "2026-12-01T00:00:05Z",
      })
    );
    vi.setSystemTime(new Date("2026-12-02T00:00:00Z"));
    expect(await billingService.getStatus(1)).toMatchObject({ hasAccess: false, status: "past_due" });

    await send(
      subscriptionEvent("subscription.revoked", {
        status: "canceled",
        ended_at: "2026-12-01T12:00:00Z",
        current_period_start: "2026-12-01T00:00:00Z",
        current_period_end: "2027-01-01T00:00:00Z",
        modified_at: "2026-12-01T12:00:00Z",
      })
    );
    expect(await billingService.getStatus(1)).toMatchObject({
      hasAccess: false,
      status: "canceled",
      isLive: false,
    });
  });

  it("takes access back on order.refunded", async () => {
    await send(orderEvent("order.paid", { status: "paid", modified_at: "2026-11-01T00:00:05Z" }));
    await send(
      orderEvent("order.refunded", {
        status: "refunded",
        refunded_amount: 99000,
        modified_at: "2026-11-12T00:00:00Z",
      })
    );
    expect(await billingService.getStatus(1)).toMatchObject({ hasAccess: false, refunded: true });
  });

  it("acknowledges events for customers it cannot match without retrying", async () => {
    const payload = subscriptionEvent("subscription.active");
    payload.data.customer = { id: "cus_unknown", external_id: "999" };
    payload.data.customer_id = "cus_unknown";
    expect(await send(payload)).toMatchObject({
      status: 202,
      outcome: "ignored",
      detail: "unknown_customer",
    });
  });
});
