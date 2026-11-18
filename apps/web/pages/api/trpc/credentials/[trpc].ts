import { createNextApiHandler } from "@rondevu/trpc/server/createNextApiHandler";
import { credentialsRouter } from "@rondevu/trpc/server/routers/viewer/credentials/_router";

export default createNextApiHandler(credentialsRouter);
