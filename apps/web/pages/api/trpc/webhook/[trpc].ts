import { createNextApiHandler } from "@rondevu/trpc/server/createNextApiHandler";
import { webhookRouter } from "@rondevu/trpc/server/routers/viewer/webhook/_router";

export default createNextApiHandler(webhookRouter);
