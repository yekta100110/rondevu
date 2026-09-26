/**
 * Normalizes phone numbers to standard format according to target provider (E.164 for Twilio/general)
 */
export function normalizePhoneNumber(
  phone: string,
  target: "twilio" | "netgsm" | "general" = "general"
): string {
  if (!phone) return "";
  const trimmed = phone.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return "";

  if (target === "twilio" || target === "general") {
    // If it starts with + and already has international digits
    if (trimmed.startsWith("+")) {
      return `+${digits}`;
    }
    // If it starts with 00 (international call prefix)
    if (digits.startsWith("00")) {
      return `+${digits.substring(2)}`;
    }
    // Turkey specific normalizations:
    // 90XXXXXXXXXX (12 digits) -> +90XXXXXXXXXX
    if (digits.startsWith("90") && digits.length === 12) {
      return `+${digits}`;
    }
    // 05XXXXXXXXX (11 digits with leading 0) -> +905XXXXXXXXX
    if (digits.startsWith("0") && digits.length === 11) {
      return `+9${digits}`;
    }
    // 5XXXXXXXXX (10 digits standard mobile) -> +905XXXXXXXXX
    if (digits.length === 10) {
      return `+90${digits}`;
    }
    return `+${digits}`;
  }

  if (target === "netgsm") {
    // Netgsm expects 10 digits without leading 0 (e.g., 5521191987) or 12 digits (905521191987)
    if (digits.startsWith("90") && digits.length === 12) return digits.substring(2);
    if (digits.startsWith("0") && digits.length === 11) return digits.substring(1);
    return digits;
  }

  return `+${digits}`;
}

export default normalizePhoneNumber;
