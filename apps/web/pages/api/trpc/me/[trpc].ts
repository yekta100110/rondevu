import { createNextApiHandler } from "@rondevu/trpc/server/createNextApiHandler";
import { meRouter } from "@rondevu/trpc/server/routers/viewer/me/_router";

export default createNextApiHandler(meRouter);
