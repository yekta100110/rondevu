import { WEBAPP_URL, IS_CALCOM } from "./constants";

export const getCalcomUrl = () => {
  if (IS_CALCOM) {
    return "https://rondevu.com.tr";
  }
  return WEBAPP_URL;
};
