import { createNextApiHandler } from "@rondevu/trpc/server/createNextApiHandler";
import { feedbackRouter } from "@rondevu/trpc/server/routers/viewer/feedback/_router";

export default createNextApiHandler(feedbackRouter);
