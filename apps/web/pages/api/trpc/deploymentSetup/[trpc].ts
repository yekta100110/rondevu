import { createNextApiHandler } from "@rondevu/trpc/server/createNextApiHandler";
import { deploymentSetupRouter } from "@rondevu/trpc/server/routers/viewer/deploymentSetup/_router";

export default createNextApiHandler(deploymentSetupRouter);
