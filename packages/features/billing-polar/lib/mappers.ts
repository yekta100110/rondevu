import type { models } from "@polar-sh/sdk/2026-10";
import type { OrderSnapshot, SubscriptionSnapshot } from "./types";

const toDate = (value: string) => new Date(value);
const toDateOrNull = (value: string | null | undefined) => (value ? new Date(value) : null);

type SubscriptionCore = Pick<
  models.OrderSubscription,
  | "id"
  | "customer_id"
  | "product_id"
  | "status"
  | "cancel_at_period_end"
  | "current_period_start"
  | "current_period_end"
  | "ended_at"
  | "created_at"
  | "modified_at"
>;

function mapSubscriptionCore(sub: SubscriptionCore, externalCustomerId: string | null): SubscriptionSnapshot {
  return {
    id: sub.id,
    customerId: sub.customer_id,
    externalCustomerId,
    productId: sub.product_id,
    status: sub.status,
    cancelAtPeriodEnd: sub.cancel_at_period_end,
    currentPeriodStart: toDate(sub.current_period_start),
    currentPeriodEnd: toDate(sub.current_period_end),
    endedAt: toDateOrNull(sub.ended_at),
    createdAt: toDate(sub.created_at),
    // Polar leaves modified_at null until the first change; created_at is then the version.
    modifiedAt: toDate(sub.modified_at ?? sub.created_at),
  };
}

export function mapSubscription(sub: models.Subscription): SubscriptionSnapshot {
  return {
    ...mapSubscriptionCore(sub, sub.customer.external_id ?? null),
    pendingUpdate: sub.pending_update
      ? { productId: sub.pending_update.product_id, appliesAt: toDate(sub.pending_update.applies_at) }
      : null,
  };
}

export function mapOrder(order: models.Order): OrderSnapshot {
  const externalCustomerId = order.customer.external_id ?? null;
  return {
    id: order.id,
    customerId: order.customer_id,
    externalCustomerId,
    subscriptionId: order.subscription_id,
    status: order.status,
    billingReason: order.billing_reason,
    totalAmount: order.total_amount,
    refundedAmount: order.refunded_amount,
    currency: order.currency,
    createdAt: toDate(order.created_at),
    modifiedAt: toDate(order.modified_at ?? order.created_at),
    subscription: order.subscription ? mapSubscriptionCore(order.subscription, externalCustomerId) : null,
  };
}
