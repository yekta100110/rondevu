import { OAuthClientRepository } from "@rondevu/features/oauth/repositories/OAuthClientRepository";
import type { PrismaClient } from "@rondevu/prisma";

type ListUserClientsOptions = {
  ctx: {
    user: {
      id: number;
    };
    prisma: PrismaClient;
  };
};

export const listUserClientsHandler = async ({ ctx }: ListUserClientsOptions) => {
  const userId = ctx.user.id;

  const oAuthClientRepository = new OAuthClientRepository(ctx.prisma);

  return oAuthClientRepository.findByUserId(userId);
};
