import { createNextApiHandler } from "@rondevu/trpc/server/createNextApiHandler";
import { apiKeysRouter } from "@rondevu/trpc/server/routers/viewer/apiKeys/_router";

export default createNextApiHandler(apiKeysRouter);