import { z } from "zod";

export const ZBillingPlanSchema = z.object({ plan: z.enum(["MONTHLY", "YEARLY"]) });

export type TBillingPlanSchema = z.infer<typeof ZBillingPlanSchema>;

export const ZBillingAdminEmailSchema = z.object({ email: z.string().trim().email() });

export const ZBillingGrantManualAccessSchema = z.object({
  email: z.string().trim().email(),
  until: z.coerce.date().nullable(),
  note: z.string().trim().max(200).optional(),
});
