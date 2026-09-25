export const contructEmailFromPhoneNumber = (phoneNumber: string) => {
  const cleanedPhoneNumber = phoneNumber.replace(/\D/g, "");
  return `${cleanedPhoneNumber}@sms.rondevu.org`;
};
