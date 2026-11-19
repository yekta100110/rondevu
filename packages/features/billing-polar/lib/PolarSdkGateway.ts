import { createPolar, errors, type models } from "@polar-sh/sdk/2026-10";
import { ErrorCode } from "@rondevu/lib/errorCodes";
import { ErrorWithCode } from "@rondevu/lib/errors";
import logger from "@rondevu/lib/logger";
import { mapSubscription } from "./mappers";
import type {
  CreateCheckoutRequest,
  PolarBillingConfig,
  PolarGateway,
  SubscriptionSnapshot,
  SubscriptionUpdateRequest,
} from "./types";

type PolarClient = ReturnType<typeof createPolar>;

const log = logger.getSubLogger({ prefix: ["[billing-polar]"] });

async function callPolar<T>(operation: string, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof ErrorWithCode) throw error;
    // SDK error messages embed the request/response body (customer email, name), so only the
    // status code is logged.
    const statusCode =
      typeof error === "object" && error !== null && "statusCode" in error ? error.statusCode : undefined;
    log.error(`Polar ${operation} failed`, {
      statusCode,
      name: error instanceof Error ? error.name : "unknown",
    });
    throw new ErrorWithCode(ErrorCode.InternalServerError, "billing_provider_error");
  }
}

function toSdkUpdate(request: SubscriptionUpdateRequest): models.SubscriptionUpdate {
  switch (request.kind) {
    case "changeProduct":
      return { product_id: request.productId, proration_behavior: request.prorationBehavior };
    case "cancelAtPeriodEnd":
      return { cancel_at_period_end: request.value };
    case "clearPendingUpdate":
      return { pending_update: null };
  }
}

export class PolarSdkGateway implements PolarGateway {
  private client: PolarClient | null = null;

  constructor(private readonly config: PolarBillingConfig) {}

  private getClient(): PolarClient {
    if (this.client) return this.client;
    if (!this.config.accessToken) {
      throw new ErrorWithCode(ErrorCode.InternalServerError, "billing_not_configured");
    }
    this.client = createPolar({ accessToken: this.config.accessToken, environment: this.config.server });
    return this.client;
  }

  async createCheckout(input: CreateCheckoutRequest): Promise<{ url: string }> {
    const checkout = await callPolar("checkouts.create", () =>
      this.getClient().checkouts.create({
        products: [input.productId],
        external_customer_id: input.externalCustomerId,
        customer_email: input.customerEmail,
        customer_name: input.customerName,
        success_url: input.successUrl,
        return_url: input.returnUrl,
        locale: input.locale,
        metadata: { userId: input.externalCustomerId },
      })
    );
    return { url: checkout.url };
  }

  async updateSubscription(
    subscriptionId: string,
    request: SubscriptionUpdateRequest
  ): Promise<SubscriptionSnapshot> {
    const subscription = await callPolar("subscriptions.update", () =>
      this.getClient().subscriptions.update(subscriptionId, toSdkUpdate(request))
    );
    return mapSubscription(subscription);
  }

  async createCustomerPortalUrl(input: { externalCustomerId: string; returnUrl: string }): Promise<string> {
    const session = await callPolar("customerSessions.create", () =>
      this.getClient().customerSessions.create({
        external_customer_id: input.externalCustomerId,
        return_url: input.returnUrl,
      })
    );
    return session.customer_portal_url;
  }

  async listSubscriptionsByExternalCustomerId(externalCustomerId: string): Promise<SubscriptionSnapshot[]> {
    return callPolar("subscriptions.list", async () => {
      const snapshots: SubscriptionSnapshot[] = [];
      for await (const subscription of this.getClient().subscriptions.iterList({
        external_customer_id: externalCustomerId,
        limit: 100,
      })) {
        snapshots.push(mapSubscription(subscription));
      }
      return snapshots;
    });
  }

  async revokeSubscription(subscriptionId: string): Promise<SubscriptionSnapshot> {
    return callPolar("subscriptions.revoke", async () => {
      const client = this.getClient();
      try {
        return mapSubscription(await client.subscriptions.revoke(subscriptionId));
      } catch (error) {
        // A retried webhook may find the subscription already ended; that is the outcome we wanted.
        if (error instanceof errors.AlreadyCanceledSubscription) {
          return mapSubscription(await client.subscriptions.get(subscriptionId));
        }
        throw error;
      }
    });
  }
}
