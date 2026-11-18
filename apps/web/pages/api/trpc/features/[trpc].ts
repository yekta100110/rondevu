import { createNextApiHandler } from "@rondevu/trpc/server/createNextApiHandler";
import { featureFlagRouter } from "@rondevu/trpc/server/routers/features/_router";

export default createNextApiHandler(featureFlagRouter, true, "features");
