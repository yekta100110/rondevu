import { getPlanContactConfig } from "@calcom/lib/planContactConfig";

export async function getPlanContactHandler() {
  return getPlanContactConfig();
}

export default getPlanContactHandler;
