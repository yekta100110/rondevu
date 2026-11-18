import { createNextApiHandler } from "@rondevu/trpc/server/createNextApiHandler";
import { appsRouter } from "@rondevu/trpc/server/routers/viewer/apps/_router";

export default createNextApiHandler(appsRouter);
