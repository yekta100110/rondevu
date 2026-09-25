import { getPlanContactConfig } from "@calcom/lib/planContactConfig";

import type { TrpcSessionUser } from "../../../types";

type GetPlanContactOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
};

export default async function getPlanContactHandler(_opts: GetPlanContactOptions) {
  return getPlanContactConfig();
}
