import { createNextApiHandler } from "@rondevu/trpc/server/createNextApiHandler";
import { holidaysRouter } from "@rondevu/trpc/server/routers/viewer/holidays/_router";

export default createNextApiHandler(holidaysRouter);
