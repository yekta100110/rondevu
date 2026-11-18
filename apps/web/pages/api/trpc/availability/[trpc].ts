import { createNextApiHandler } from "@rondevu/trpc/server/createNextApiHandler";
import { availabilityRouter } from "@rondevu/trpc/server/routers/viewer/availability/_router";

export default createNextApiHandler(availabilityRouter);
