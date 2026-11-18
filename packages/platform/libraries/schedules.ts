export {
  ScheduleRepository,
  type FindDetailedScheduleByIdReturnType,
} from "@rondevu/features/schedules/repositories/ScheduleRepository";

export {
  updateSchedule,
  type UpdateScheduleResponse,
} from "@rondevu/features/schedules/services/ScheduleService";
export { UserAvailabilityService } from "@rondevu/features/availability/lib/getUserAvailability";

export {
  createHandler as createScheduleHandler,
  type CreateScheduleHandlerReturn,
} from "@rondevu/trpc/server/routers/viewer/availability/schedule/create.handler";
export { ZCreateInputSchema as CreateScheduleSchema } from "@rondevu/trpc/server/routers/viewer/availability/schedule/create.schema";

export {
  listHandler as getAvailabilityListHandler,
  type GetAvailabilityListHandlerReturn,
} from "@rondevu/trpc/server/routers/viewer/availability/list.handler";
export {
  duplicateHandler as duplicateScheduleHandler,
  type DuplicateScheduleHandlerReturn,
} from "@rondevu/trpc/server/routers/viewer/availability/schedule/duplicate.handler";

export { getScheduleByEventSlugHandler } from "@rondevu/trpc/server/routers/viewer/availability/schedule/getScheduleByEventTypeSlug.handler";
