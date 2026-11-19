export type BillingPlanKey = "MONTHLY" | "YEARLY";

export type PendingPlanChange = { productId: string | null; appliesAt: Date };

/** Provider-neutral view of a Polar subscription (from a webhook, an order or an API response). */
export type SubscriptionSnapshot = {
  id: string;
  customerId: string;
  externalCustomerId: string | null;
  productId: string;
  status: string;
  cancelAtPeriodEnd: boolean;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  endedAt: Date | null;
  createdAt: Date;
  modifiedAt: Date;
  /** `undefined` when the source payload does not carry it (order snapshots), so it must not be overwritten. */
  pendingUpdate?: PendingPlanChange | null;
};

export type OrderSnapshot = {
  id: string;
  customerId: string;
  externalCustomerId: string | null;
  subscriptionId: string | null;
  status: string;
  billingReason: string;
  totalAmount: number;
  refundedAmount: number;
  currency: string;
  createdAt: Date;
  modifiedAt: Date;
  subscription: SubscriptionSnapshot | null;
};

export type SubscriptionUpdateRequest =
  | { kind: "changeProduct"; productId: string; prorationBehavior: "invoice" | "next_period" }
  | { kind: "cancelAtPeriodEnd"; value: boolean }
  | { kind: "clearPendingUpdate" };

export type CreateCheckoutRequest = {
  productId: string;
  externalCustomerId: string;
  customerEmail: string | null;
  customerName: string | null;
  successUrl: string;
  returnUrl: string;
  locale: "tr" | "en";
};

/** The subset of the Polar API the billing feature depends on; mocked in unit tests. */
export interface PolarGateway {
  createCheckout(input: CreateCheckoutRequest): Promise<{ url: string }>;
  updateSubscription(
    subscriptionId: string,
    request: SubscriptionUpdateRequest
  ): Promise<SubscriptionSnapshot>;
  createCustomerPortalUrl(input: { externalCustomerId: string; returnUrl: string }): Promise<string>;
  listSubscriptionsByExternalCustomerId(externalCustomerId: string): Promise<SubscriptionSnapshot[]>;
}

export type PolarBillingConfig = {
  accessToken: string | null;
  webhookSecret: string | null;
  server: "sandbox" | "production";
  products: Record<BillingPlanKey, string | null>;
};

export type BillingStatus = {
  hasAccess: boolean;
  plan: BillingPlanKey | null;
  status: string | null;
  subscriptionId: string | null;
  currentPeriodEnd: Date | null;
  accessEndsAt: Date | null;
  cancelAtPeriodEnd: boolean;
  pendingPlan: BillingPlanKey | null;
  pendingPlanAppliesAt: Date | null;
  refunded: boolean;
  /** True while a subscription exists on Polar that can still be changed or renewed. */
  isLive: boolean;
  hasBillingHistory: boolean;
};
