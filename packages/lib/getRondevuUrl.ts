import { WEBAPP_URL, IS_RONDEVU } from "./constants";

export const getRondevuUrl = () => {
  if (IS_RONDEVU) {
    return "https://rondevu.org";
  }
  return WEBAPP_URL;
};
