import { createNextApiHandler } from "@rondevu/trpc/server/createNextApiHandler";
import { googleWorkspaceRouter } from "@rondevu/trpc/server/routers/viewer/googleWorkspace/_router";

export default createNextApiHandler(googleWorkspaceRouter);
