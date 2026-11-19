export type SubscriptionAccessInput = {
  status: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  endedAt: Date | null;
};

export type LatestOrderInput = { status: string; modifiedAt: Date } | null;

const PAID_THROUGH_PERIOD_END = new Set(["active", "trialing", "canceled"]);

/**
 * Access always follows money actually collected: a subscription is usable until the end of the
 * period it paid for, never beyond it.
 */
export function computeAccessEndsAt(
  sub: SubscriptionAccessInput,
  latestOrder: LatestOrderInput
): Date | null {
  let accessEndsAt: Date | null = null;

  if (PAID_THROUGH_PERIOD_END.has(sub.status)) {
    accessEndsAt = sub.currentPeriodEnd;
  } else if (sub.status === "past_due") {
    // Polar rolls the period forward before the renewal charge fails, so the paid coverage ended
    // where the unpaid period starts. There is no grace period while Polar retries the card.
    accessEndsAt = sub.currentPeriodStart;
  }

  if (!accessEndsAt) return null;

  if (sub.endedAt && sub.endedAt < accessEndsAt) accessEndsAt = sub.endedAt;

  // A full refund of the order that paid for the current coverage takes the coverage back.
  if (latestOrder?.status === "refunded" && latestOrder.modifiedAt < accessEndsAt) {
    accessEndsAt = latestOrder.modifiedAt;
  }

  return accessEndsAt;
}

const LIVE_STATUSES = new Set(["active", "trialing", "past_due"]);

/** A live subscription still exists on Polar and can be changed, cancelled or renewed. */
export function isLiveSubscription(sub: { status: string; endedAt: Date | null }): boolean {
  return LIVE_STATUSES.has(sub.status) && sub.endedAt === null;
}
