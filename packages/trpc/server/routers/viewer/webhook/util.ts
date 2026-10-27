import { prisma } from "@calcom/prisma";
import { TRPCError } from "@trpc/server";
import authedProcedure from "../../../procedures/authedProcedure";
import { webhookIdAndEventTypeIdSchema } from "./types";

export const createWebhookProcedure = () => {
  return authedProcedure.input(webhookIdAndEventTypeIdSchema.optional()).use(async ({ ctx, input, next }) => {
    if (!input) return next();

    const { id, webhookId, eventTypeId } = input;
    const lookupId = id || webhookId;

    if (lookupId) {
      // Check if user is authorized to edit webhook
      const webhook = await prisma.webhook.findUnique({
        where: { id: lookupId },
        select: {
          id: true,
          userId: true,
          eventTypeId: true,
          teamId: true,
          platform: true,
        },
      });

      if (!webhook) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (eventTypeId && eventTypeId !== webhook.eventTypeId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      if (webhook.platform) {
        if (ctx.user.role !== "ADMIN") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
      } else if (webhook.teamId) {
        const membership = await prisma.membership.findFirst({
          where: { userId: ctx.user.id, teamId: webhook.teamId, accepted: true },
          select: { role: true },
        });
        if (!membership || !["ADMIN", "OWNER"].includes(membership.role)) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
      } else if (webhook.eventTypeId) {
        const eventType = await prisma.eventType.findUnique({
          where: { id: webhook.eventTypeId },
          select: { id: true, userId: true },
        });

        if (!eventType) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        if (eventType.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
      } else if (webhook.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
    } else if (eventTypeId) {
      const eventType = await prisma.eventType.findUnique({
        where: { id: eventTypeId },
        select: { id: true, userId: true },
      });

      if (!eventType) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (eventType.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
    } else if ("teamId" in input && typeof input.teamId === "number") {
      const membership = await prisma.membership.findFirst({
        where: { userId: ctx.user.id, teamId: input.teamId, accepted: true },
        select: { role: true },
      });
      if (!membership || !["ADMIN", "OWNER"].includes(membership.role)) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
    }

    return next();
  });
};

export const webhookProcedure = createWebhookProcedure();
