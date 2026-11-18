import { getWebhookFeature } from "@rondevu/features/di/webhooks/containers/webhook";
import type { Webhook } from "@rondevu/features/webhooks/lib/dto/types";
import type { TrpcSessionUser } from "@rondevu/trpc/server/types";
import type { TListInputSchema } from "./list.schema";

type ListOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TListInputSchema;
};

export const listHandler = async ({ ctx, input }: ListOptions): Promise<Webhook[]> => {
  const { repository } = getWebhookFeature();

  return repository.listWebhooks({
    userId: ctx.user.id,
    appId: input?.appId,
    eventTypeId: input?.eventTypeId,
    eventTriggers: input?.eventTriggers,
  });
};
