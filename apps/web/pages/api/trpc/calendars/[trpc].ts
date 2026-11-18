import { createNextApiHandler } from "@rondevu/trpc/server/createNextApiHandler";
import { calendarsRouter } from "@rondevu/trpc/server/routers/viewer/calendars/_router";

export default createNextApiHandler(calendarsRouter);
