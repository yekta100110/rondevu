import { DI_TOKENS } from "@rondevu/features/di/tokens";
import { ScheduleRepository } from "@rondevu/features/schedules/repositories/ScheduleRepository";

import { createModule } from "../di";

export const scheduleRepositoryModule = createModule();
scheduleRepositoryModule
  .bind(DI_TOKENS.SCHEDULE_REPOSITORY)
  .toClass(ScheduleRepository, [DI_TOKENS.PRISMA_CLIENT]); // Maps 'prismaClient' param to PRISMA_CLIENT token
