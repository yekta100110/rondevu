import process from "node:process";
import {
  cancelNoShowTasksForBooking,
  deleteWebhookScheduledTriggers,
  updateTriggerForExistingBookings,
} from "@calcom/features/webhooks/lib/scheduleTrigger";
import { validateWebhookDestination } from "@calcom/features/webhooks/lib/validateWebhookDestination";
import { prisma } from "@calcom/prisma";
import type { TrpcSessionUser } from "@calcom/trpc/server/types";
import { TRPCError } from "@trpc/server";
import type { TEditInputSchema } from "./edit.schema";

type EditOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TEditInputSchema;
};

export const editHandler = async ({ input, ctx }: EditOptions) => {
  const { id, webhookId: _webhookId, eventTypeId: _eventTypeId, ...data } = input;

  const webhook = await prisma.webhook.findUnique({
    where: {
      id,
    },
  });

  if (!webhook) {
    return null;
  }

  // SSRF validation: only validate if URL is being changed
  if (data.subscriberUrl && data.subscriberUrl !== webhook.subscriberUrl) {
    if (!(await validateWebhookDestination(data.subscriberUrl, webhook.platform))) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Webhook URL is not allowed",
      });
    }
  }

  if (webhook.platform) {
    const { user } = ctx;
    if (user?.role !== "ADMIN") {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
  }
  if (
    webhook.platform &&
    ((data.secret !== undefined && !data.secret) || (data.active && !data.secret && !webhook.secret))
  ) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Platform webhook signing secret is required" });
  }
  if (
    webhook.platform &&
    (data.payloadTemplate ||
      data.appId ||
      (data.active && ((data.payloadTemplate ?? webhook.payloadTemplate) || (data.appId ?? webhook.appId))))
  ) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Platform webhook must use the full payload" });
  }
  if (webhook.platform && data.active && process.env.RONDEVU_PLATFORM_WEBHOOK_ENABLE !== "1") {
    throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Platform webhook activation is disabled" });
  }

  const updatedWebhook = await prisma.webhook.update({
    where: {
      id,
    },
    data: {
      ...data,
      time: data.time ?? null,
      timeUnit: data.timeUnit ?? null,
    },
  });

  if (data.active) {
    const activeTriggersBefore = webhook.active ? webhook.eventTriggers : [];
    await updateTriggerForExistingBookings(webhook, activeTriggersBefore, updatedWebhook.eventTriggers);
  } else if (!data.active && webhook.active) {
    await cancelNoShowTasksForBooking({
      webhook: {
        id: webhook.id,
        userId: webhook.userId,
        teamId: webhook.teamId,
        eventTypeId: webhook.eventTypeId,
      },
    });
    await deleteWebhookScheduledTriggers({ webhookId: webhook.id });
  }

  return updatedWebhook;
};
