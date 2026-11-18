import type { AppMeta } from "@rondevu/types/App";

export const shouldRedirectToAppOnboarding = (appMetadata: AppMeta) => {
  const hasEventTypes = appMetadata?.extendsFeature === "EventType";
  return hasEventTypes;
};
