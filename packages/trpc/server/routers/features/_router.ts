import { getFeaturesRepository } from "@rondevu/features/di/containers/FeaturesRepository";
import type { AppFlags } from "@rondevu/features/flags/config";
import publicProcedure from "@rondevu/trpc/server/procedures/publicProcedure";
import { router } from "@rondevu/trpc/server/trpc";
import { z } from "zod";
import { map } from "./map";

export const featureFlagRouter = router({
  list: publicProcedure.query(async () => {
    const featuresRepository = getFeaturesRepository();
    return featuresRepository.getAllFeatures();
  }),
  checkTeamFeature: publicProcedure
    .input(
      z.object({
        teamId: z.number(),
        feature: z.string(),
      })
    )
    .query(async ({ input }) => {
      const featuresRepository = getFeaturesRepository();
      return featuresRepository.checkIfTeamHasFeature(input.teamId, input.feature as keyof AppFlags);
    }),
  map,
});
