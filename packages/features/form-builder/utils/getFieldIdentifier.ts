import { getValidRhfFieldName } from "@rondevu/lib/getValidRhfFieldName";

export const getFieldIdentifier = (name: string) => {
  return getValidRhfFieldName(name);
};
