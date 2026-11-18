import { createNextApiHandler } from "@rondevu/trpc/server/createNextApiHandler";
import { travelSchedulesRouter } from "@rondevu/trpc/server/routers/viewer/travelSchedules/_router";

export default createNextApiHandler(travelSchedulesRouter);
