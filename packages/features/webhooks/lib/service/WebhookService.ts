import { createHash, createHmac } from "node:crypto";
import process from "node:process";
import { prisma } from "@calcom/prisma";
import { WebhookTriggerEvents } from "@calcom/prisma/enums";
import type { WebhookDeliveryResult, WebhookSubscriber } from "../dto/types";
import { encryptReplayBody } from "../encryptReplayBody";
import type { WebhookPayload } from "../factory/types";
import type { ILogger, ITasker } from "../interface/infrastructure";
import type { IWebhookRepository, IWebhookService } from "../interface/services";
import { postWebhookSafely } from "../postWebhookSafely";
import { validateWebhookDestination } from "../validateWebhookDestination";

export class WebhookService implements IWebhookService {
  private readonly log: ILogger;

  constructor(
    private readonly repository: IWebhookRepository,
    private readonly tasker: ITasker,
    logger: ILogger
  ) {
    this.log = logger.getSubLogger({ prefix: ["[WebhookService]"] });
  }

  protected async sendWebhook(
    trigger: WebhookTriggerEvents,
    payload: WebhookPayload,
    subscriber: WebhookSubscriber
  ): Promise<WebhookDeliveryResult> {
    try {
      if (subscriber.platform && process.env.RONDEVU_PLATFORM_WEBHOOK_ENABLE !== "1") {
        return {
          ok: false,
          status: 0,
          message: "Platform webhook disabled",
          subscriberUrl: subscriber.subscriberUrl,
          webhookId: subscriber.id,
        };
      }
      // TODO: Ideally we should inject this flag as well. Would be awesome when we would be able to unit test without mocking env variables too. Also with trigger.dev, this would be further worked on, so we can leave this as is for now
      if (process.env.TASKER_ENABLE_WEBHOOKS === "1" && !subscriber.platform) {
        return await this.scheduleWebhook(trigger, payload, subscriber);
      } else {
        return await this.sendWebhookDirectly(trigger, payload, subscriber);
      }
    } catch (error) {
      return {
        ok: false,
        status: 0,
        message: "Webhook delivery failed",
        duration: 0,
        subscriberUrl: subscriber.subscriberUrl,
        webhookId: subscriber.id,
      };
    }
  }

  private async scheduleWebhook(
    trigger: WebhookTriggerEvents,
    payload: WebhookPayload,
    subscriber: WebhookSubscriber
  ): Promise<WebhookDeliveryResult> {
    if (!this.tasker) {
      throw new Error("Tasker not injected - ensure proper DI configuration");
    }

    await this.tasker.create(
      "sendWebhook",
      JSON.stringify({
        secretKey: subscriber.secret,
        triggerEvent: trigger,
        createdAt: new Date().toISOString(),
        webhook: subscriber,
        data: payload.payload,
      })
    );

    return {
      ok: true,
      status: 200,
      message: "Webhook scheduled successfully",
      duration: 0,
      subscriberUrl: subscriber.subscriberUrl,
      webhookId: subscriber.id,
    };
  }

  private async sendWebhookDirectly(
    trigger: WebhookTriggerEvents,
    payload: WebhookPayload,
    subscriber: WebhookSubscriber
  ): Promise<WebhookDeliveryResult> {
    const { subscriberUrl } = subscriber;
    if (!subscriberUrl) throw new Error("Missing subscriber URL");
    if (subscriber.platform && (subscriber.appId || subscriber.payloadTemplate)) {
      throw new Error("Platform webhook must use the full payload");
    }
    const ingressKey = process.env.RONDEVU_N8N_INGRESS_KEY;
    if (
      subscriber.platform &&
      (!subscriber.secret || !ingressKey || !process.env.RONDEVU_WEBHOOK_REPLAY_KEY)
    ) {
      throw new Error("Platform webhook credentials are missing");
    }
    if (!(await validateWebhookDestination(subscriberUrl, subscriber.platform))) {
      throw new Error("Webhook destination is not allowed");
    }

    const body = JSON.stringify({
      triggerEvent: trigger,
      createdAt: payload.createdAt,
      payload: payload.payload,
    });

    const signature = subscriber.secret
      ? createHmac("sha256", subscriber.secret).update(body).digest("hex")
      : "no-secret-provided";
    const eventId = createHash("sha256").update(body).digest("hex");

    const delivery = await prisma.webhookDelivery.upsert({
      where: { webhookId_eventId: { webhookId: subscriber.id, eventId } },
      create: {
        webhookId: subscriber.id,
        eventId,
        bodyEncrypted: subscriber.platform ? encryptReplayBody(body) : null,
      },
      update: {},
      select: { id: true, status: true },
    });
    if (delivery.status === "SUCCESS") {
      return { ok: true, status: 200, subscriberUrl, webhookId: subscriber.id };
    }
    const claimed = await prisma.webhookDelivery.updateMany({
      where: { id: delivery.id, status: { in: ["PENDING", "FAILED"] } },
      data: { status: "PROCESSING" },
    });
    if (!claimed.count) {
      return {
        ok: false,
        status: 409,
        message: "Delivery already in progress",
        subscriberUrl,
        webhookId: subscriber.id,
      };
    }

    let status = 0;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        if (subscriber.platform) {
          const current = await prisma.webhook.findUnique({
            where: { id: subscriber.id },
            select: { active: true, platform: true, subscriberUrl: true, secret: true },
          });
          if (
            !current?.active ||
            !current.platform ||
            current.subscriberUrl !== subscriberUrl ||
            current.secret !== subscriber.secret ||
            process.env.RONDEVU_PLATFORM_WEBHOOK_ENABLE !== "1"
          ) {
            await prisma.webhookDelivery.update({ where: { id: delivery.id }, data: { status: "FAILED" } });
            return {
              ok: false,
              status: 0,
              message: "Platform webhook disabled or changed",
              subscriberUrl,
              webhookId: subscriber.id,
            };
          }
        }
        status = await postWebhookSafely({
          url: subscriberUrl,
          body,
          platform: subscriber.platform,
          headers: {
            "Content-Type": "application/json",
            "X-Cal-Signature-256": signature,
            "X-Cal-Webhook-Version": subscriber.version,
            "X-Rondevu-Event-Id": eventId,
            "X-Rondevu-Timestamp": payload.createdAt,
            ...(subscriber.platform && ingressKey ? { "X-Rondevu-Ingress-Key": ingressKey } : {}),
          },
        });
        await prisma.webhookDelivery.update({
          where: { id: delivery.id },
          data: { attempts: { increment: 1 }, lastHttpCode: status },
        });
        if (status >= 200 && status < 300) {
          await prisma.webhookDelivery.update({
            where: { id: delivery.id },
            data: { status: "SUCCESS", bodyEncrypted: null },
          });
          return { ok: true, status, subscriberUrl, webhookId: subscriber.id };
        }
        if (status !== 429 && status < 500) break;
      } catch {
        await prisma.webhookDelivery.update({
          where: { id: delivery.id },
          data: { attempts: { increment: 1 } },
        });
      }
      if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 500 * 4 ** attempt));
    }
    await prisma.webhookDelivery.update({ where: { id: delivery.id }, data: { status: "FAILED" } });
    return {
      ok: false,
      status,
      message: status ? `HTTP ${status}` : "Network failure",
      subscriberUrl,
      webhookId: subscriber.id,
    };
  }

  async getSubscribers(options: Parameters<IWebhookRepository["getSubscribers"]>[0]) {
    return this.repository.getSubscribers(options);
  }

  async processWebhooks(
    trigger: WebhookTriggerEvents,
    payload: WebhookPayload,
    subscribers: WebhookSubscriber[]
  ): Promise<void> {
    if (subscribers.length === 0) {
      this.log.debug("No subscribers to process for trigger:", { trigger });
      return;
    }

    const promises = subscribers.map(async (subscriber) => {
      try {
        this.log.debug("Processing webhook", {
          trigger,
          webhookId: subscriber.id,
        });

        const result = await this.sendWebhook(trigger, payload, subscriber);

        if (result.ok) {
          this.log.debug(`Webhook sent successfully`, {
            trigger,
            webhookId: subscriber.id,
            statusCode: result.status,
          });
        } else {
          this.log.error(`Webhook failed`, {
            error: result.message,
            trigger,
            webhookId: subscriber.id,
            statusCode: result.status,
          });
        }
        return result.ok;
      } catch (err) {
        this.log.error("Error sending webhook", {
          error: "Webhook delivery error",
          trigger,
          webhookId: subscriber.id,
        });
        // Re-throw to ensure Promise.allSettled captures the failure
        throw err;
      }
    });

    // Use Promise.allSettled to prevent single webhook failure from killing entire processor
    const results = await Promise.allSettled(promises);

    // Log summary for monitoring
    const successCount = results.filter((result) => result.status === "fulfilled" && result.value).length;
    const failureCount = results.length - successCount;

    this.log.info(`Webhook processing completed for ${trigger}`, {
      totalSubscribers: subscribers.length,
      successful: successCount,
      failed: failureCount,
    });

    // Log individual failures for debugging
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        const subscriber = subscribers[index];
        this.log.error(`Webhook processing failed for subscriber`, {
          trigger,
          webhookId: subscriber?.id,
          error: "Webhook delivery error",
        });
      }
    });
  }

  async scheduleTimeBasedWebhook(
    trigger: WebhookTriggerEvents,
    scheduledAt: Date,
    bookingData: {
      id: number;
      uid: string;
      eventTypeId: number | null;
      userId: number | null;
      teamId?: number | null;
      responses?: Record<string, unknown>;
    },
    subscriber: WebhookSubscriber,
    evt: Record<string, unknown>,
    isDryRun = false
  ): Promise<void> {
    if (isDryRun) return;

    try {
      if (!this.tasker) {
        throw new Error("Tasker not injected - ensure proper DI configuration");
      }
      await this.tasker.create(
        "sendWebhook",
        JSON.stringify({
          secretKey: subscriber.secret,
          triggerEvent: trigger,
          createdAt: new Date().toISOString(),
          webhook: subscriber,
          data: {
            bookingId: bookingData.id,
            eventTypeId: bookingData.eventTypeId,
            userId: bookingData.userId,
            teamId: bookingData.teamId,
            responses: bookingData.responses,
            evt,
          },
        }),
        { scheduledAt, referenceUid: `booking-${bookingData.id}-${trigger}` }
      );
    } catch (error) {
      this.log.error("Failed to schedule time-based webhook", {
        trigger,
        bookingId: bookingData.id,
        error: "Webhook scheduling error",
      });
    }
  }

  async cancelScheduledWebhooks(
    bookingId: number,
    triggers: WebhookTriggerEvents[] = [
      WebhookTriggerEvents.MEETING_STARTED,
      WebhookTriggerEvents.MEETING_ENDED,
    ],
    isDryRun = false
  ): Promise<void> {
    if (isDryRun) return;

    try {
      if (!this.tasker) {
        throw new Error("Tasker not injected - ensure proper DI configuration");
      }
      const cancellationPromises = triggers.map(async (trigger) => {
        const referenceUid = `booking-${bookingId}-${trigger}`;
        try {
          await this.tasker.cancelWithReference(referenceUid, "sendWebhook");
          return { trigger, success: true };
        } catch (error) {
          this.log.warn(`Failed to cancel webhook for trigger ${trigger}:`, {
            error: error instanceof Error ? error.message : String(error),
          });
          return { trigger, success: false, error };
        }
      });

      const results = await Promise.allSettled(cancellationPromises);

      // Log any failures for monitoring
      const failures = results.filter((result) => result.status === "rejected");
      if (failures.length > 0) {
        this.log.warn(`Some webhook cancellations failed:`, { failureCount: failures.length });
      }
    } catch (error) {
      this.log.error("Failed to cancel scheduled webhooks", {
        bookingId,
        triggers,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async scheduleDelayedWebhooks(
    trigger: WebhookTriggerEvents,
    payload: WebhookPayload,
    scheduledAt: Date,
    options?: { teamId?: number | number[] | null; orgId?: number | null },
    subscribers?: WebhookSubscriber[],
    isDryRun = false
  ): Promise<void> {
    if (isDryRun) return;

    const webhookSubscribers =
      subscribers ||
      (await this.repository.getSubscribers({
        userId: null,
        eventTypeId: null,
        triggerEvent: trigger,
        teamId: options?.teamId,
        orgId: options?.orgId,
        oAuthClientId: undefined,
      }));

    if (!webhookSubscribers.length) return;

    try {
      if (!this.tasker) {
        throw new Error("Tasker not injected - ensure proper DI configuration");
      }
      const createdAt = new Date().toISOString();

      await Promise.all(
        webhookSubscribers.map((subscriber) =>
          this.tasker.create(
            "sendWebhook",
            JSON.stringify({
              secretKey: subscriber.secret,
              triggerEvent: trigger,
              createdAt,
              webhook: subscriber,
              data: payload.payload,
            }),
            { scheduledAt }
          )
        )
      );
    } catch (error) {
      this.log.error("Failed to schedule delayed webhooks", {
        trigger,
        scheduledAt,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}
