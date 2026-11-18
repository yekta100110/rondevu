import { createNextApiHandler } from "@rondevu/trpc/server/createNextApiHandler";
import { publicViewerRouter } from "@rondevu/trpc/server/routers/publicViewer/_router";

export default createNextApiHandler(publicViewerRouter, true);
