export default function isSmsCalEmail(email: string) {
  return email.endsWith("@sms.rondevu.org") || email.endsWith("@sms.cal.com");
}
