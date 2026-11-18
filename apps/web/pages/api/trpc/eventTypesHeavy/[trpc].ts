import { createNextApiHandler } from "@rondevu/trpc/server/createNextApiHandler";
import { eventTypesRouter } from "@rondevu/trpc/server/routers/viewer/eventTypes/heavy/_router";

export default createNextApiHandler(eventTypesRouter);
