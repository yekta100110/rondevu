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
  return updatePlanContactConfig(input);
}
