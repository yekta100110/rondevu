import { getConnectedApps } from "@rondevu/app-store/_utils/getConnectedApps";
import { prisma } from "@rondevu/prisma";
import type { TrpcSessionUser } from "@rondevu/trpc/server/types";

import type { TIntegrationsInputSchema } from "./integrations.schema";

type IntegrationsOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TIntegrationsInputSchema;
};

export const integrationsHandler = async ({ ctx, input }: IntegrationsOptions) => {
  const user = ctx.user;
  return getConnectedApps({ user, input, prisma });
};
