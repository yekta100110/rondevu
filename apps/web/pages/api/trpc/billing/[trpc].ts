import { createNextApiHandler } from "@rondevu/trpc/server/createNextApiHandler";
import { billingRouter } from "@rondevu/trpc/server/routers/viewer/billing/_router";

export default createNextApiHandler(billingRouter);
