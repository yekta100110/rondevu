import { updateSchedule } from "@rondevu/features/schedules/services/ScheduleService";
import { prisma } from "@rondevu/prisma";
import type { TrpcSessionUser } from "@rondevu/trpc/server/types";

import type { TUpdateInputSchema } from "./update.schema";

type User = NonNullable<TrpcSessionUser>;
type UpdateOptions = {
  ctx: {
    user: { id: User["id"]; defaultScheduleId: User["defaultScheduleId"]; timeZone: User["timeZone"] };
  };
  input: TUpdateInputSchema;
};

export const updateHandler = async ({ input, ctx }: UpdateOptions) => {
  const { user } = ctx;
  return updateSchedule({
    input,
    user,
    prisma,
  });
};
