import { createNextApiHandler } from "@rondevu/trpc/server/createNextApiHandler";
import { authRouter } from "@rondevu/trpc/server/routers/viewer/auth/_router";

export default createNextApiHandler(authRouter);
