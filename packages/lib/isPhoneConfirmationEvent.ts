export interface BookingFieldLike {
  name?: string;
  hidden?: boolean;
  required?: boolean;
  verify?: boolean;
  metadata?: Record<string, unknown>;
}

export interface EventWithBookingFields {
  bookingFields?: BookingFieldLike[] | null;
  metadata?: Record<string, unknown> | null;
  requiresPhoneVerification?: boolean;
}

/**
 * Determines whether an event requires phone confirmation (SMS OTP) instead of or in addition to email.
 * Supports:
 * 1. Explicit metadata designation (`confirmationOption: "phone"`, `verificationOption: "phone"`, or `requiresPhoneVerification: true`).
 * 2. Explicit field verification flag (`phoneField.verify === true`).
 * 3. Fallback: Phone is required and email is hidden or optional.
 */
export function isPhoneConfirmationEvent(
  bookingFieldsOrEvent?: BookingFieldLike[] | EventWithBookingFields | null,
  metadataArg?: Record<string, unknown> | null
): boolean {
  if (!bookingFieldsOrEvent) return false;

  let bookingFields: BookingFieldLike[] | null = null;
  let metadata: Record<string, unknown> | null = metadataArg ?? null;

  if (Array.isArray(bookingFieldsOrEvent)) {
    bookingFields = bookingFieldsOrEvent;
  } else if (typeof bookingFieldsOrEvent === "object") {
    bookingFields = bookingFieldsOrEvent.bookingFields ?? null;
    metadata = metadataArg ?? (bookingFieldsOrEvent.metadata as Record<string, unknown> | null) ?? null;
    if (bookingFieldsOrEvent.requiresPhoneVerification === true) {
      return true;
    }
  }

  if (!bookingFields || !Array.isArray(bookingFields)) return false;

  const phoneField = bookingFields.find((f) => f?.name === "attendeePhoneNumber" || f?.name === "phone");
  const emailField = bookingFields.find((f) => f?.name === "email");

  // If there is no visible phone field, phone OTP cannot be conducted
  if (!phoneField || phoneField.hidden) {
    return false;
  }

  // 1. Explicit metadata designation (e.g. organizer chose Phone verification in settings)
  const metaConfirmation =
    (metadata?.confirmationOption as string | undefined) ||
    (metadata?.verificationOption as string | undefined) ||
    (metadata?.confirmationType as string | undefined);

  if (metaConfirmation === "phone" || metadata?.requiresPhoneVerification === true) {
    return true;
  }

  if (metaConfirmation === "email") {
    return false;
  }

  // 2. Explicit field-level verification flag
  if (phoneField.verify || phoneField.metadata?.verify) {
    return true;
  }

  // 3. Fallback: Phone is required while email is omitted, hidden, or not required
  return Boolean(phoneField.required && (!emailField || emailField.hidden || !emailField.required));
}

export default isPhoneConfirmationEvent;
