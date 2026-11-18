import EventManager from "@rondevu/features/bookings/lib/EventManager";

export { getPublicEvent, type PublicEventType } from "@rondevu/features/eventtypes/lib/getPublicEvent";

export { getBulkUserEventTypes, getBulkTeamEventTypes } from "@rondevu/app-store/_utils/getBulkEventTypes";

export { createHandler as createEventType } from "@rondevu/trpc/server/routers/viewer/eventTypes/heavy/create.handler";
export { updateHandler as updateEventType } from "@rondevu/trpc/server/routers/viewer/eventTypes/heavy/update.handler";

export { listWithTeamHandler } from "@rondevu/trpc/server/routers/viewer/eventTypes/listWithTeam.handler";

export type { TUpdateInputSchema as TUpdateEventTypeInputSchema } from "@rondevu/trpc/server/routers/viewer/eventTypes/heavy/update.schema";
export type { EventTypesPublic } from "@rondevu/features/eventtypes/lib/getEventTypesPublic";
export { getEventTypesPublic } from "@rondevu/features/eventtypes/lib/getEventTypesPublic";
export { parseEventTypeColor } from "@rondevu/lib/isEventTypeColor";

export {
  EventTypeMetaDataSchema,
  eventTypeBookingFields,
  eventTypeLocations,
} from "@rondevu/prisma/zod-utils";

export type { EventTypeMetadata } from "@rondevu/prisma/zod-utils";

export { validateCustomEventName } from "@rondevu/features/eventtypes/lib/eventNaming";
export { EventManager };
export { getEventTypeById } from "@rondevu/features/eventtypes/lib/getEventTypeById";
export { getEventTypesByViewer } from "@rondevu/features/eventtypes/lib/getEventTypesByViewer";
export type { EventType } from "@rondevu/features/eventtypes/lib/getEventTypeById";
export type { EventTypesByViewer } from "@rondevu/features/eventtypes/lib/getEventTypesByViewer";
export type { UpdateEventTypeReturn } from "@rondevu/trpc/server/routers/viewer/eventTypes/heavy/update.handler";
export { bulkUpdateEventsToDefaultLocation } from "@rondevu/app-store/_utils/bulkUpdateEventsToDefaultLocation";
export { bulkUpdateTeamEventsToDefaultLocation } from "@rondevu/app-store/_utils/bulkUpdateTeamEventsToDefaultLocation";
