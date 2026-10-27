import process from "node:process";
import { updateTriggerForExistingBookings } from "@calcom/features/webhooks/lib/scheduleTrigger";
import { validateWebhookDestination } from "@calcom/features/webhooks/lib/validateWebhookDestination";
import { prisma } from "@calcom/prisma";
import type { Prisma, Webhook } from "@calcom/prisma/client";
import { EventTypeMetaDataSchema } from "@calcom/prisma/zod-utils";
import type { TrpcSessionUser } from "@calcom/trpc/server/types";
import { TRPCError } from "@trpc/server";
import { v4 } from "uuid";
import type { TCreateInputSchema } from "./create.schema";

type CreateOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TCreateInputSchema;
};

export const createHandler = async ({ ctx, input }: CreateOptions) => {
  const { user } = ctx;

  if (!(await validateWebhookDestination(input.subscriberUrl, input.platform))) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Webhook URL is not allowed",
    });
  }

  const { webhookId: _webhookId, ...inputWithoutWebhookId } = input;
  const webhookData: Prisma.WebhookCreateInput = {
    id: v4(),
    ...inputWithoutWebhookId,
    active: input.platform ? false : input.active,
  };
  if (input.platform && user.role !== "ADMIN") {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  if (input.platform && (input.eventTypeId || input.teamId)) {
    throw new TRPCError({ code: "BAD_REQUEST" });
  }
  if (input.platform && (input.payloadTemplate || input.appId)) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Platform webhook must use the full payload" });
  }
  if (input.platform && !input.secret) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Platform webhook signing secret is required" });
  }
  if (input.teamId && !input.platform) {
    const membership = await prisma.membership.findFirst({
      where: { userId: user.id, teamId: input.teamId, accepted: true, role: { in: ["ADMIN", "OWNER"] } },
      select: { teamId: true },
    });
    if (!membership) throw new TRPCError({ code: "FORBIDDEN" });
  }
  if (input.eventTypeId && !input.platform) {
    const eventType = await prisma.eventType.findFirst({
      where: { id: input.eventTypeId, userId: user.id },
      select: { id: true },
    });
    if (!eventType) throw new TRPCError({ code: "FORBIDDEN" });
  }
  if (
    input.platform &&
    (!process.env.RONDEVU_N8N_INGRESS_KEY ||
      !process.env.RONDEVU_N8N_ELIGIBILITY_TOKEN ||
      Buffer.from(process.env.RONDEVU_WEBHOOK_REPLAY_KEY ?? "", "base64").length !== 32)
  ) {
    throw new TRPCError({ code: "PRECONDITION_FAILED", message: "n8n credentials are not configured" });
  }

  if (!input.platform && !input.eventTypeId) {
    webhookData.user = { connect: { id: user.id } };
  }

  if (input.eventTypeId) {
    const parentManagedEvt = await prisma.eventType.findFirst({
      where: {
        id: input.eventTypeId,
        parentId: {
          not: null,
        },
      },
      select: {
        parentId: true,
        metadata: true,
      },
    });

    if (parentManagedEvt?.parentId) {
      const isLocked = !EventTypeMetaDataSchema.parse(parentManagedEvt.metadata)?.managedEventConfig
        ?.unlockedFields?.webhooks;
      if (isLocked) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
    }
  }

  let newWebhook: Webhook;
  try {
    newWebhook = await prisma.webhook.create({
      data: webhookData,
    });
  } catch (error) {
    // Avoid printing raw prisma error on frontend
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create webhook" });
  }

  await updateTriggerForExistingBookings(newWebhook, [], newWebhook.eventTriggers);

  return newWebhook;
};
