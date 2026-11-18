import { createNextApiHandler } from "@rondevu/trpc/server/createNextApiHandler";
import { userAdminRouter } from "@rondevu/trpc/server/routers/viewer/users/_router";

export default createNextApiHandler(userAdminRouter);
