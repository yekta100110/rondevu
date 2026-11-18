import { EventTypeHostService } from "@rondevu/features/host/services/EventTypeHostService";
import type { PaginatedAvailabilityHostsResponse } from "@rondevu/features/host/services/IEventTypeHostService";
import type { PrismaClient } from "@rondevu/prisma/client";

import type { TrpcSessionUser } from "../../../types";
import type { TGetHostsForAvailabilityInputSchema } from "./getHostsForAvailability.schema";

type GetHostsForAvailabilityInput = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
    prisma: PrismaClient;
  };
  input: TGetHostsForAvailabilityInputSchema;
};

export type { PaginatedAvailabilityHostsResponse as GetHostsForAvailabilityResponse };
export type { AvailabilityHost } from "@rondevu/features/host/services/IEventTypeHostService";

export const getHostsForAvailabilityHandler = async ({
  ctx,
  input,
}: GetHostsForAvailabilityInput): Promise<PaginatedAvailabilityHostsResponse> => {
  const service = new EventTypeHostService(ctx.prisma);
  return service.getHostsForAvailability({
    eventTypeId: input.eventTypeId,
    cursor: input.cursor ?? undefined,
    limit: input.limit,
    search: input.search,
  });
};
