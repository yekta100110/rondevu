import { createNextApiHandler } from "@rondevu/trpc/server/createNextApiHandler";
import { calVideoRouter } from "@rondevu/trpc/server/routers/viewer/calVideo/_router";

export default createNextApiHandler(calVideoRouter);
