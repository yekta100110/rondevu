import { webhooks } from "@polar-sh/sdk/2026-10";
import { ErrorCode } from "@rondevu/lib/errorCodes";
import { ErrorWithCode } from "@rondevu/lib/errors";
import logger from "@rondevu/lib/logger";
import { mapOrder, mapSubscription } from "../lib/mappers";
import type { PolarBillingConfig } from "../lib/types";
import type { IBillingRepository } from "../repositories/BillingRepository";
import type { ApplyResult, BillingService } from "./BillingService";

export interface PolarWebhookServiceDeps {
  billingService: BillingService;
  billingRepository: IBillingRepository;
  config: PolarBillingConfig;
}

export type WebhookHandleResult = {
  status: 202 | 400 | 403;
  outcome: "processed" | "ignored" | "duplicate" | "invalid_signature" | "invalid_payload" | "unknown_type";
  detail?: string;
};

const log = logger.getSubLogger({ prefix: ["[polar-webhook]"] });

const SUBSCRIPTION_EVENTS = new Set([
  "subscription.created",
  "subscription.updated",
  "subscription.active",
  "subscription.canceled",
  "subscription.uncanceled",
  "subscription.revoked",
  "subscription.past_due",
  "subscription.cycled",
]);

const ORDER_EVENTS = new Set(["order.created", "order.paid", "order.updated", "order.refunded"]);

export class PolarWebhookService {
  constructor(private readonly deps: PolarWebhookServiceDeps) {}

  async handle(rawBody: string, headers: Record<string, string>): Promise<WebhookHandleResult> {
    const secret = this.deps.config.webhookSecret;
    if (!secret) throw new ErrorWithCode(ErrorCode.InternalServerError, "billing_webhook_not_configured");

    let event: webhooks.WebhookPayload;
    try {
      event = await webhooks.validateEvent(rawBody, headers, secret);
    } catch (error) {
      if (error instanceof webhooks.PolarWebhookVerificationError) {
        return { status: 403, outcome: "invalid_signature" };
      }
      // Signed but unknown to this SDK version: acknowledge so Polar does not retry forever.
      if (error instanceof webhooks.PolarWebhookUnknownTypeError)
        return { status: 202, outcome: "unknown_type" };
      if (error instanceof webhooks.PolarWebhookError) return { status: 400, outcome: "invalid_payload" };
      throw error;
    }

    // webhook-id is stable across Polar's retries of one delivery; resource ids are not unique per event.
    const webhookId = headers["webhook-id"];
    if (await this.deps.billingRepository.isWebhookEventProcessed(webhookId)) {
      return { status: 202, outcome: "duplicate" };
    }

    const result = await this.dispatch(event);
    // Recorded only after success: a crash mid-way leaves the id unrecorded so Polar's retry reprocesses
    // it, and the version guard makes reprocessing harmless.
    await this.deps.billingRepository.recordWebhookEvent(webhookId, event.type);

    if (result && !result.applied && result.reason === "unknown_customer") {
      log.warn(`Polar ${event.type} could not be matched to a user`, { webhookId });
    }
    return {
      status: 202,
      outcome: result?.applied ? "processed" : "ignored",
      detail: result && !result.applied ? result.reason : undefined,
    };
  }

  private async dispatch(event: webhooks.WebhookPayload): Promise<ApplyResult | null> {
    if (SUBSCRIPTION_EVENTS.has(event.type) && isSubscriptionEvent(event)) {
      return this.deps.billingService.applySubscriptionSnapshot(mapSubscription(event.data));
    }
    if (ORDER_EVENTS.has(event.type) && isOrderEvent(event)) {
      return this.deps.billingService.applyOrderSnapshot(mapOrder(event.data));
    }
    return null;
  }
}

type SubscriptionEvent = Extract<webhooks.WebhookPayload, { type: `subscription.${string}` }>;
type OrderEvent = Extract<webhooks.WebhookPayload, { type: `order.${string}` }>;

function isSubscriptionEvent(event: webhooks.WebhookPayload): event is SubscriptionEvent {
  return event.type.startsWith("subscription.");
}

function isOrderEvent(event: webhooks.WebhookPayload): event is OrderEvent {
  return event.type.startsWith("order.");
}
