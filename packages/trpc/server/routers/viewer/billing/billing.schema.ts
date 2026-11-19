import { z } from "zod";

export const ZBillingPlanSchema = z.object({ plan: z.enum(["MONTHLY", "YEARLY"]) });

export type TBillingPlanSchema = z.infer<typeof ZBillingPlanSchema>;
