import { WEBAPP_URL } from "@rondevu/lib/constants";
import { ErrorCode } from "@rondevu/lib/errorCodes";
import { ErrorWithCode } from "@rondevu/lib/errors";
import isSmsCalEmail from "@rondevu/lib/isSmsCalEmail";
import { computeAccessEndsAt, isLiveSubscription } from "../lib/access";
import { planForProduct } from "../lib/config";
import type {
  BillingPlanKey,
  BillingStatus,
  OrderSnapshot,
  PolarBillingConfig,
  PolarGateway,
  SubscriptionSnapshot,
  SubscriptionUpdateRequest,
} from "../lib/types";
import type {
  BillingSubscriptionRecord,
  BillingSubscriptionWrite,
  IBillingRepository,
} from "../repositories/BillingRepository";

export interface BillingServiceDeps {
  billingRepository: IBillingRepository;
  polarGateway: PolarGateway;
  config: PolarBillingConfig;
}

export type ApplyResult =
  | { applied: true; userId: number }
  | { applied: false; reason: "unknown_product" | "unknown_customer" | "stale" | "not_a_subscription" };

const SETTINGS_BILLING_PATH = "/settings/my-account/billing";

const badRequest = (key: string) => new ErrorWithCode(ErrorCode.BadRequest, key);
const notFound = (key: string) => new ErrorWithCode(ErrorCode.NotFound, key);

// Polar rejects addresses whose domain does not accept mail; for placeholder addresses the customer
// types a real one on the checkout page instead.
const isPlaceholderEmail = (email: string) => isSmsCalEmail(email) || email.endsWith("@demo.rondevu.org");

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

type EvaluatedSubscription = {
  record: BillingSubscriptionRecord;
  accessEndsAt: Date | null;
  refunded: boolean;
};

export class BillingService {
  constructor(private readonly deps: BillingServiceDeps) {}

  async getStatus(userId: number, now: Date = new Date()): Promise<BillingStatus> {
    const evaluated = await this.evaluateSubscriptions(userId);
    const withAccess = evaluated.find((sub) => sub.accessEndsAt !== null && sub.accessEndsAt > now);
    const current =
      withAccess ?? evaluated.find((sub) => isLiveSubscription(sub.record)) ?? evaluated[0] ?? null;

    if (!current) {
      return {
        hasAccess: false,
        plan: null,
        status: null,
        subscriptionId: null,
        currentPeriodEnd: null,
        accessEndsAt: null,
        cancelAtPeriodEnd: false,
        pendingPlan: null,
        pendingPlanAppliesAt: null,
        refunded: false,
        isLive: false,
        hasBillingHistory: false,
      };
    }

    const { record } = current;
    return {
      hasAccess: current === withAccess,
      plan: record.plan,
      status: record.status,
      subscriptionId: record.id,
      currentPeriodEnd: record.currentPeriodEnd,
      accessEndsAt: current.accessEndsAt,
      cancelAtPeriodEnd: record.cancelAtPeriodEnd,
      pendingPlan: record.pendingPlan,
      pendingPlanAppliesAt: record.pendingPlanAppliesAt,
      refunded: current.refunded,
      isLive: isLiveSubscription(record),
      hasBillingHistory: true,
    };
  }

  async createCheckout(input: { userId: number; plan: BillingPlanKey }): Promise<{ url: string }> {
    const productId = this.deps.config.products[input.plan];
    if (!productId) throw new ErrorWithCode(ErrorCode.InternalServerError, "billing_not_configured");

    const user = await this.deps.billingRepository.findUserById(input.userId);
    if (!user) throw notFound("billing_user_not_found");

    // Polar would happily open a second subscription; a plan switch must go through changePlan.
    const live = await this.findLiveSubscription(input.userId);
    if (live) throw badRequest("billing_subscription_exists");

    return this.deps.polarGateway.createCheckout({
      productId,
      externalCustomerId: String(user.id),
      customerEmail: isPlaceholderEmail(user.email) ? null : user.email,
      customerName: user.name,
      successUrl: `${WEBAPP_URL}/billing/success?checkout_id={CHECKOUT_ID}`,
      returnUrl: `${WEBAPP_URL}${SETTINGS_BILLING_PATH}`,
      locale: user.locale === "en" ? "en" : "tr",
    });
  }

  async changePlan(input: { userId: number; plan: BillingPlanKey }): Promise<BillingStatus> {
    const live = await this.findLiveSubscription(input.userId);
    if (!live) throw notFound("billing_no_subscription");
    if (live.status === "past_due") throw badRequest("billing_payment_past_due");
    if (live.cancelAtPeriodEnd) throw badRequest("billing_resume_first");

    let request: SubscriptionUpdateRequest;
    if (live.plan === input.plan) {
      if (!live.pendingPlan) throw badRequest("billing_same_plan");
      request = { kind: "clearPendingUpdate" };
    } else {
      const productId = this.deps.config.products[input.plan];
      if (!productId) throw new ErrorWithCode(ErrorCode.InternalServerError, "billing_not_configured");
      request = {
        kind: "changeProduct",
        productId,
        // Upgrades are charged the prorated difference right away; a downgrade to monthly waits
        // until the already-paid year runs out so the customer never loses paid time.
        prorationBehavior: input.plan === "YEARLY" ? "invoice" : "next_period",
      };
    }

    await this.updateAndApply(live, request);
    return this.getStatus(input.userId);
  }

  async cancelAtPeriodEnd(userId: number): Promise<BillingStatus> {
    const live = await this.findLiveSubscription(userId);
    if (!live) throw notFound("billing_no_subscription");
    if (!live.cancelAtPeriodEnd) {
      await this.updateAndApply(live, { kind: "cancelAtPeriodEnd", value: true });
    }
    return this.getStatus(userId);
  }

  async resume(userId: number): Promise<BillingStatus> {
    const live = await this.findLiveSubscription(userId);
    if (!live?.cancelAtPeriodEnd) throw badRequest("billing_not_scheduled_to_cancel");
    await this.updateAndApply(live, { kind: "cancelAtPeriodEnd", value: false });
    return this.getStatus(userId);
  }

  async createPortalUrl(userId: number): Promise<{ url: string }> {
    const subscriptions = await this.deps.billingRepository.findSubscriptionsByUserId(userId);
    if (subscriptions.length === 0) throw notFound("billing_no_subscription");
    const url = await this.deps.polarGateway.createCustomerPortalUrl({
      externalCustomerId: String(userId),
      returnUrl: `${WEBAPP_URL}${SETTINGS_BILLING_PATH}`,
    });
    return { url };
  }

  /** Pulls the customer's subscriptions from Polar; covers a webhook that is late or was lost. */
  async syncFromPolar(userId: number): Promise<BillingStatus> {
    const snapshots = await this.deps.polarGateway.listSubscriptionsByExternalCustomerId(String(userId));
    for (const snapshot of snapshots) {
      await this.applySubscriptionSnapshot({ ...snapshot, externalCustomerId: String(userId) });
    }
    return this.getStatus(userId);
  }

  async applySubscriptionSnapshot(snapshot: SubscriptionSnapshot): Promise<ApplyResult> {
    const plan = planForProduct(this.deps.config, snapshot.productId);
    if (!plan) return { applied: false, reason: "unknown_product" };

    const userId = await this.resolveUserId(snapshot.externalCustomerId, snapshot.customerId);
    if (userId === null) return { applied: false, reason: "unknown_customer" };

    const written = await this.deps.billingRepository.upsertSubscriptionIfNotOlder(
      this.toSubscriptionWrite(snapshot, userId, plan)
    );
    if (!written) return { applied: false, reason: "stale" };

    await this.claimOutreachDemoIfPaid(userId);
    return { applied: true, userId };
  }

  async applyOrderSnapshot(order: OrderSnapshot): Promise<ApplyResult> {
    if (!order.subscriptionId || !order.subscription) return { applied: false, reason: "not_a_subscription" };
    if (!planForProduct(this.deps.config, order.subscription.productId)) {
      return { applied: false, reason: "unknown_product" };
    }

    const userId = await this.resolveUserId(order.externalCustomerId, order.customerId);
    if (userId === null) return { applied: false, reason: "unknown_customer" };

    const orderWritten = await this.deps.billingRepository.upsertOrderIfNotOlder({
      id: order.id,
      userId,
      subscriptionId: order.subscriptionId,
      status: order.status,
      billingReason: order.billingReason,
      totalAmount: order.totalAmount,
      refundedAmount: order.refundedAmount,
      currency: order.currency,
      polarCreatedAt: order.createdAt,
      polarModifiedAt: order.modifiedAt,
    });

    // The embedded subscription may be the first we hear of it (order.paid before subscription.created).
    const subscriptionResult = await this.applySubscriptionSnapshot(order.subscription);
    if (!orderWritten && !subscriptionResult.applied) return { applied: false, reason: "stale" };
    return { applied: true, userId };
  }

  private async evaluateSubscriptions(userId: number): Promise<EvaluatedSubscription[]> {
    const records = await this.deps.billingRepository.findSubscriptionsByUserId(userId);
    const latestOrders = await this.deps.billingRepository.findLatestSettledOrderBySubscriptionIds(
      records.map((record) => record.id)
    );
    const latestOrderBySubscription = new Map(latestOrders.map((order) => [order.subscriptionId, order]));

    return records.map((record) => {
      const latestOrder = latestOrderBySubscription.get(record.id);
      return {
        record,
        accessEndsAt: computeAccessEndsAt(
          record,
          latestOrder ? { status: latestOrder.status, modifiedAt: latestOrder.polarModifiedAt } : null
        ),
        refunded: latestOrder?.status === "refunded",
      };
    });
  }

  private async findLiveSubscription(userId: number): Promise<BillingSubscriptionRecord | null> {
    const records = await this.deps.billingRepository.findSubscriptionsByUserId(userId);
    return records.find((record) => isLiveSubscription(record)) ?? null;
  }

  private async updateAndApply(live: BillingSubscriptionRecord, request: SubscriptionUpdateRequest) {
    const updated = await this.deps.polarGateway.updateSubscription(live.id, request);
    await this.applySubscriptionSnapshot({ ...updated, externalCustomerId: String(live.userId) });
  }

  private async resolveUserId(externalCustomerId: string | null, customerId: string): Promise<number | null> {
    if (externalCustomerId && /^\d+$/.test(externalCustomerId)) {
      const user = await this.deps.billingRepository.findUserById(Number(externalCustomerId));
      if (user) return user.id;
    }
    return this.deps.billingRepository.findUserIdByPolarCustomerId(customerId);
  }

  private toSubscriptionWrite(
    snapshot: SubscriptionSnapshot,
    userId: number,
    plan: BillingPlanKey
  ): BillingSubscriptionWrite {
    let pending: BillingSubscriptionWrite["pending"];
    if (snapshot.pendingUpdate === null) {
      pending = { plan: null, appliesAt: null };
    } else if (snapshot.pendingUpdate) {
      const pendingPlan = snapshot.pendingUpdate.productId
        ? planForProduct(this.deps.config, snapshot.pendingUpdate.productId)
        : null;
      pending = { plan: pendingPlan, appliesAt: pendingPlan ? snapshot.pendingUpdate.appliesAt : null };
    }

    return {
      id: snapshot.id,
      userId,
      polarCustomerId: snapshot.customerId,
      productId: snapshot.productId,
      plan,
      status: snapshot.status,
      cancelAtPeriodEnd: snapshot.cancelAtPeriodEnd,
      currentPeriodStart: snapshot.currentPeriodStart,
      currentPeriodEnd: snapshot.currentPeriodEnd,
      endedAt: snapshot.endedAt,
      polarCreatedAt: snapshot.createdAt,
      polarModifiedAt: snapshot.modifiedAt,
      pending,
    };
  }

  /**
   * A paying outreach demo becomes a permanent account: once `isOutreachDemo` is false the
   * outreach TTL cleanup job no longer selects it.
   */
  private async claimOutreachDemoIfPaid(userId: number): Promise<void> {
    const user = await this.deps.billingRepository.findUserById(userId);
    if (!user || !isPlainObject(user.metadata) || user.metadata.isOutreachDemo !== true) return;

    const status = await this.getStatus(userId);
    if (!status.hasAccess) return;

    const { demoExpiresAt: _expired, ...rest } = user.metadata;
    await this.deps.billingRepository.updateUserMetadata(userId, {
      ...rest,
      isOutreachDemo: false,
      demoClaimedAt: new Date().toISOString(),
    });
  }
}
