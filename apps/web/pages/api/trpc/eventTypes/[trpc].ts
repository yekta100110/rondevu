import { createNextApiHandler } from "@rondevu/trpc/server/createNextApiHandler";
import { eventTypesRouter } from "@rondevu/trpc/server/routers/viewer/eventTypes/_router";

export default createNextApiHandler(eventTypesRouter);
