import { getPlanContactConfig } from "@rondevu/lib/planContactConfig";

export async function getPlanContactHandler() {
  return getPlanContactConfig();
}

export default getPlanContactHandler;
