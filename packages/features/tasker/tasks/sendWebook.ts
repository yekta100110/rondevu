import process from "node:process";
import {
  parseWebhookVersion,
  WebhookVersion,
} from "@calcom/features/webhooks/lib/interface/IWebhookRepository";
import sendPayload from "@calcom/features/webhooks/lib/sendPayload";
import { prisma } from "@calcom/prisma";
import { z } from "zod";

const sendWebhookPayloadSchema = z.object({
  secretKey: z.string().nullable(),
  triggerEvent: z.string(),
  createdAt: z.string(),
  webhook: z.object({
    id: z.string().optional(),
    subscriberUrl: z.string().url(),
    platform: z.boolean().optional(),
    appId: z.string().nullable(),
    payloadTemplate: z.string().nullable(),
    version: z.nativeEnum(WebhookVersion),
  }),
  // TODO: Define the data schema
  data: z.any(),
});

export async function sendWebhook(payload: string): Promise<void> {
  try {
    const { secretKey, triggerEvent, createdAt, webhook, data } = sendWebhookPayloadSchema.parse(
      JSON.parse(payload)
    );
    let destination = webhook;
    let signingSecret = secretKey;
    const current = webhook.id
      ? await prisma.webhook.findUnique({
          where: { id: webhook.id },
          select: {
            active: true,
            platform: true,
            subscriberUrl: true,
            secret: true,
            appId: true,
            payloadTemplate: true,
            version: true,
          },
        })
      : null;
    if (webhook.id && !current) return;
    if (webhook.platform || current?.platform) {
      if (process.env.RONDEVU_PLATFORM_WEBHOOK_ENABLE !== "1") return;
      if (
        !current?.active ||
        !current.platform ||
        !current.secret ||
        current.appId ||
        current.payloadTemplate
      ) {
        return;
      }
      destination = { ...webhook, ...current, platform: true, version: parseWebhookVersion(current.version) };
      signingSecret = current.secret;
    }
    const result = await sendPayload(signingSecret, triggerEvent, createdAt, destination, data);
    if (!result.ok) throw new Error(`Webhook delivery failed with HTTP ${result.status}`);
  } catch (error) {
    throw error;
  }
}
