import { createNextApiHandler } from "@rondevu/trpc/server/createNextApiHandler";
import { loggedInViewerRouter } from "@rondevu/trpc/server/routers/loggedInViewer/_router";

export default createNextApiHandler(loggedInViewerRouter);
