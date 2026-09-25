import { WEBAPP_URL, IS_CALCOM } from "./constants";

export const getCalcomUrl = () => {
  if (IS_CALCOM) {
    return "https://rondevu.org";
  }
  return WEBAPP_URL;
};
