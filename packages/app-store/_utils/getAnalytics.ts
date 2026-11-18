import logger from "@rondevu/lib/logger";
import type { AnalyticsService } from "@rondevu/types/AnalyticsService";
import type { CredentialPayload } from "@rondevu/types/Credential";

import { AnalyticsServiceMap } from "../analytics.services.generated";

const log = logger.getSubLogger({ prefix: ["AnalyticsManager"] });

export const getAnalyticsService = async ({
  credential,
}: {
  credential: CredentialPayload;
}): Promise<AnalyticsService | null> => {
  if (!credential || !credential.key) return null;
  const { type: analyticsType } = credential;

  const analyticsName = analyticsType.split("_")[0];

  const analyticsAppImportFn = (
    AnalyticsServiceMap as Record<
      string,
      Promise<{ default?: (credential: CredentialPayload) => AnalyticsService }>
    >
  )[analyticsName];

  if (!analyticsAppImportFn) {
    log.warn(`analytics app not implemented`);
    return null;
  }

  const analyticsApp = await analyticsAppImportFn;

  const createAnalyticsService = analyticsApp.default;

  if (!createAnalyticsService || typeof createAnalyticsService !== "function") {
    log.warn(`analytics of type ${analyticsType} is not implemented`);
    return null;
  }

  return createAnalyticsService(credential);
};
