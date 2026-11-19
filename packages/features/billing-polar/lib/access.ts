export type SubscriptionAccessInput = {
  status: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  endedAt: Date | null;
  pastDueAt: Date | null;
};

export const PAST_DUE_GRACE_MS = 7 * 24 * 60 * 60 * 1000;

export type LatestOrderInput = { status: string; modifiedAt: Date } | null;

const PAID_THROUGH_PERIOD_END = new Set(["active", "trialing", "canceled"]);

/**
 * Access follows the period that was paid for; the only extension is the past-due grace period.
 */
export function computeAccessEndsAt(
  sub: SubscriptionAccessInput,
  latestOrder: LatestOrderInput
): Date | null {
  let accessEndsAt: Date | null = null;

  if (PAID_THROUGH_PERIOD_END.has(sub.status)) {
    accessEndsAt = sub.currentPeriodEnd;
  } else if (sub.status === "past_due") {
    // A failed renewal keeps the account usable for 7 days from the moment it went past due while
    // Polar retries the card; a recovered payment flips the status back to active.
    const pastDueSince = sub.pastDueAt ?? sub.currentPeriodStart;
    accessEndsAt = new Date(pastDueSince.getTime() + PAST_DUE_GRACE_MS);
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
