import { updatePlanContactConfig } from "@calcom/lib/planContactConfig";
import type { z } from "zod";
import type { TrpcSessionUser } from "../../../types";
import type { ZUpdatePlanContactSchema } from "./updatePlanContact.schema";

type UpdatePlanContactOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: z.infer<typeof ZUpdatePlanContactSchema>;
};

export default async function updatePlanContactHandler({ input }: UpdatePlanContactOptions) {
  const result = await updatePlanContactConfig(input);

  try {
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/");
    revalidatePath("/plan-bilgi");
  } catch {
    // Non-fatal if executed outside Next.js request context (e.g. tests or standalone scripts)
  }

  return result;
}
