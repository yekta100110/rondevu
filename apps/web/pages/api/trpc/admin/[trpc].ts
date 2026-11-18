import { createNextApiHandler } from "@rondevu/trpc/server/createNextApiHandler";
import { adminRouter } from "@rondevu/trpc/server/routers/viewer/admin/_router";

export default createNextApiHandler(adminRouter);
