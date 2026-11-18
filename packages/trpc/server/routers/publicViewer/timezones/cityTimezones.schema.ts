import { z } from "zod";

export const cityTimezonesSchema = z.object({
  RondevuVersion: z.string(),
});

export type CityTimezonesSchema = z.infer<typeof cityTimezonesSchema>;
