export default function isSmsCalEmail(email: string) {
  return email.endsWith("@sms.rondevu.com.tr") || email.endsWith("@sms.cal.com");
}
