import { createNextApiHandler } from "@rondevu/trpc/server/createNextApiHandler";
import { oAuthRouter } from "@rondevu/trpc/server/routers/viewer/oAuth/_router";

export default createNextApiHandler(oAuthRouter);
