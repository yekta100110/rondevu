import { createNextApiHandler } from "@rondevu/trpc/server/createNextApiHandler";
import { oooRouter } from "@rondevu/trpc/server/routers/viewer/ooo/_router";

export default createNextApiHandler(oooRouter);
