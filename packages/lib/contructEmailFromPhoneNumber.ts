import { normalizePhoneNumber } from "./normalizePhoneNumber";

export const contructEmailFromPhoneNumber = (phoneNumber: string) => {
  const normalized = normalizePhoneNumber(phoneNumber, "twilio");
  const cleanedPhoneNumber = normalized ? normalized.replace(/\D/g, "") : phoneNumber.replace(/\D/g, "");
  return `${cleanedPhoneNumber}@sms.rondevu.org`;
};
