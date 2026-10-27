import process from "node:process";
import { DEFAULT_WEBHOOK_VERSION } from "@calcom/features/webhooks/lib/interface/IWebhookRepository";
import type { EventPayloadType } from "@calcom/features/webhooks/lib/sendPayload";
import sendPayload from "@calcom/features/webhooks/lib/sendPayload";
import { validateWebhookDestination } from "@calcom/features/webhooks/lib/validateWebhookDestination";
import { getTranslation } from "@calcom/i18n/server";
import type { TrpcSessionUser } from "@calcom/trpc/server/types";
import type { TTestTriggerInputSchema } from "./testTrigger.schema";

type TestTriggerOptions = {
  ctx: { user: NonNullable<TrpcSessionUser> };
  input: TTestTriggerInputSchema;
};

export const testTriggerHandler = async ({ ctx, input }: TestTriggerOptions) => {
  const { url, type, payloadTemplate = null, secret = null } = input;

  // SSRF validation for webhook URL
  const platform = ctx.user.role === "ADMIN" && url === process.env.PLATFORM_N8N_WEBHOOK_URL;
  if (platform && payloadTemplate)
    return { ok: false, status: 400, message: "Platform webhook must use the full payload" };
  if (!(await validateWebhookDestination(url, platform))) {
    return {
      ok: false,
      status: 400,
      message: "Webhook URL is not allowed",
    };
  }

  const translation = await getTranslation("en", "common");
  const language = {
    locale: "en",
    translate: translation,
  };

  const data: EventPayloadType = {
    type: "Test",
    title: "Test trigger event",
    description: "",
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    attendees: [
      {
        email: "jdoe@example.com",
        name: "John Doe",
        timeZone: "Europe/London",
        language,
      },
    ],
    organizer: {
      name: "rOndevu",
      email: "no-reply@rondevu.org",
      timeZone: "Europe/London",
      language,
    },
  };

  try {
    const webhook = {
      subscriberUrl: url,
      appId: null,
      payloadTemplate,
      version: DEFAULT_WEBHOOK_VERSION,
      platform,
    };
    return await sendPayload(secret, type, new Date().toISOString(), webhook, data);
  } catch {
    return {
      ok: false,
      status: 500,
    };
  }
};
