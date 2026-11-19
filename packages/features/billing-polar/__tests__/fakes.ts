import { vi } from "vitest";
import type { PolarBillingConfig, PolarGateway, SubscriptionSnapshot } from "../lib/types";
import type {
  BillingOrderWrite,
  BillingSubscriptionRecord,
  BillingSubscriptionWrite,
  BillingUserRecord,
  IBillingRepository,
} from "../repositories/BillingRepository";

export const MONTHLY_PRODUCT = "prod_monthly";
export const YEARLY_PRODUCT = "prod_yearly";
export const CUSTOMER_ID = "cus_1";

export const testConfig: PolarBillingConfig = {
  accessToken: "polar_oat_test",
  webhookSecret: "whsec_test_secret",
  server: "sandbox",
  products: { MONTHLY: MONTHLY_PRODUCT, YEARLY: YEARLY_PRODUCT },
};

/** In-memory repository with the same "never overwrite a newer version" semantics as Prisma. */
export class FakeBillingRepository implements IBillingRepository {
  users = new Map<number, BillingUserRecord>();
  subscriptions = new Map<string, BillingSubscriptionRecord>();
  orders = new Map<string, BillingOrderWrite>();
  webhookEvents = new Map<string, string>();

  addUser(user: Partial<BillingUserRecord> & { id: number }) {
    this.users.set(user.id, {
      email: `u${user.id}@example.com`,
      name: null,
      locale: "tr",
      metadata: {},
      ...user,
    });
  }

  async findUserById(userId: number) {
    return this.users.get(userId) ?? null;
  }

  async updateUserMetadata(
    userId: number,
    metadata: Parameters<IBillingRepository["updateUserMetadata"]>[1]
  ) {
    const user = this.users.get(userId);
    if (user) this.users.set(userId, { ...user, metadata });
  }

  async findSubscriptionsByUserId(userId: number) {
    return Array.from(this.subscriptions.values())
      .filter((sub) => sub.userId === userId)
      .sort((a, b) => b.polarCreatedAt.getTime() - a.polarCreatedAt.getTime());
  }

  async findUserIdByPolarCustomerId(polarCustomerId: string) {
    return (
      Array.from(this.subscriptions.values()).find((sub) => sub.polarCustomerId === polarCustomerId)
        ?.userId ?? null
    );
  }

  async upsertSubscriptionIfNotOlder(data: BillingSubscriptionWrite) {
    const { pending, ...fields } = data;
    const existing = this.subscriptions.get(data.id);
    if (existing && existing.polarModifiedAt > data.polarModifiedAt) return false;
    this.subscriptions.set(data.id, {
      ...fields,
      userId: existing?.userId ?? data.userId,
      pendingPlan: pending ? pending.plan : (existing?.pendingPlan ?? null),
      pendingPlanAppliesAt: pending ? pending.appliesAt : (existing?.pendingPlanAppliesAt ?? null),
    });
    return true;
  }

  async upsertOrderIfNotOlder(data: BillingOrderWrite) {
    const existing = this.orders.get(data.id);
    if (existing && existing.polarModifiedAt > data.polarModifiedAt) return false;
    this.orders.set(data.id, { ...data, userId: existing?.userId ?? data.userId });
    return true;
  }

  async findLatestSettledOrderBySubscriptionIds(subscriptionIds: string[]) {
    const settled = Array.from(this.orders.values())
      .filter((order) => order.subscriptionId && subscriptionIds.includes(order.subscriptionId))
      .filter((order) => ["paid", "refunded", "partially_refunded"].includes(order.status))
      .sort((a, b) => b.polarCreatedAt.getTime() - a.polarCreatedAt.getTime());
    const latest = new Map<string | null, (typeof settled)[number]>();
    for (const order of settled)
      if (!latest.has(order.subscriptionId)) latest.set(order.subscriptionId, order);
    return Array.from(latest.values()).map(({ subscriptionId, status, polarModifiedAt }) => ({
      subscriptionId,
      status,
      polarModifiedAt,
    }));
  }

  async isWebhookEventProcessed(webhookId: string) {
    return this.webhookEvents.has(webhookId);
  }

  async recordWebhookEvent(webhookId: string, type: string) {
    this.webhookEvents.set(webhookId, type);
  }
}

export function createFakeGateway() {
  return {
    createCheckout: vi
      .fn<PolarGateway["createCheckout"]>()
      .mockResolvedValue({ url: "https://polar.test/c" }),
    updateSubscription: vi.fn<PolarGateway["updateSubscription"]>(),
    createCustomerPortalUrl: vi
      .fn<PolarGateway["createCustomerPortalUrl"]>()
      .mockResolvedValue("https://polar.test/portal"),
    listSubscriptionsByExternalCustomerId: vi
      .fn<PolarGateway["listSubscriptionsByExternalCustomerId"]>()
      .mockResolvedValue([]),
  };
}

export const d = (iso: string) => new Date(iso);

export function subscriptionSnapshot(overrides: Partial<SubscriptionSnapshot> = {}): SubscriptionSnapshot {
  return {
    id: "sub_1",
    customerId: CUSTOMER_ID,
    externalCustomerId: "1",
    productId: MONTHLY_PRODUCT,
    status: "active",
    cancelAtPeriodEnd: false,
    currentPeriodStart: d("2026-11-01T00:00:00Z"),
    currentPeriodEnd: d("2026-12-01T00:00:00Z"),
    endedAt: null,
    createdAt: d("2026-11-01T00:00:00Z"),
    modifiedAt: d("2026-11-01T00:00:00Z"),
    pendingUpdate: null,
    ...overrides,
  };
}
