import { createNextApiHandler } from "@rondevu/trpc/server/createNextApiHandler";
import { slotsRouter } from "@rondevu/trpc/server/routers/viewer/slots/_router";

export default createNextApiHandler(slotsRouter);
