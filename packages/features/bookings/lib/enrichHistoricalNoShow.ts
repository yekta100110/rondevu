import isSmsCalEmail from "@calcom/lib/isSmsCalEmail";
import type { PrismaClient } from "@calcom/prisma";
import { BookingStatus } from "@calcom/prisma/enums";

/**
 * Extracts digit characters from a string.
 */
function extractDigits(val?: string | null): string {
  if (!val) return "";
  return val.replace(/\D/g, "");
}

/**
 * Normalizes email address for lookup.
 */
function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Collects candidate search terms (emails and phone variations) for batch querying.
 */
function collectSearchTerms(attendees: ReadonlyArray<{ email: string; phoneNumber?: string | null }>): {
  emails: Set<string>;
  phones: Set<string>;
} {
  const emails = new Set<string>();
  const phones = new Set<string>();

  for (const attendee of attendees) {
    if (attendee.email) {
      const email = normalizeEmail(attendee.email);
      emails.add(email);

      if (isSmsCalEmail(email)) {
        const smsDigits = extractDigits(email.split("@")[0]);
        if (smsDigits) {
          phones.add(smsDigits);
          if (smsDigits.length >= 10) {
            const last10 = smsDigits.slice(-10);
            phones.add(`+90${last10}`);
            phones.add(`0${last10}`);
            phones.add(last10);
            phones.add(`90${last10}`);
            emails.add(`90${last10}@sms.rondevu.org`);
            emails.add(`90${last10}@sms.cal.com`);
          }
        }
      }
    }

    if (attendee.phoneNumber) {
      const rawPhone = attendee.phoneNumber.trim();
      phones.add(rawPhone);

      const digits = extractDigits(rawPhone);
      if (digits) {
        phones.add(digits);
        if (digits.length >= 10) {
          const last10 = digits.slice(-10);
          phones.add(`+90${last10}`);
          phones.add(`0${last10}`);
          phones.add(last10);
          phones.add(`90${last10}`);
          emails.add(`90${last10}@sms.rondevu.org`);
          emails.add(`90${last10}@sms.cal.com`);
        }
      }
    }
  }

  return { emails, phones };
}

/**
 * Determines whether two attendee contact records match (either by email or phone digits).
 */
export function areContactsMatching(
  a: { email: string; phoneNumber?: string | null },
  b: { email: string; phoneNumber?: string | null }
): boolean {
  const aIsSms = isSmsCalEmail(a.email);
  const bIsSms = isSmsCalEmail(b.email);

  // 1. Direct standard email match (ignoring synthetic SMS emails)
  if (!aIsSms && !bIsSms) {
    if (normalizeEmail(a.email) === normalizeEmail(b.email)) {
      return true;
    }
  }

  // 2. Phone / synthetic SMS email digit cross-match
  const aDigits: string[] = [];
  if (a.phoneNumber) {
    const d = extractDigits(a.phoneNumber);
    if (d) aDigits.push(d);
  }
  if (aIsSms) {
    const d = extractDigits(a.email.split("@")[0]);
    if (d) aDigits.push(d);
  }

  const bDigits: string[] = [];
  if (b.phoneNumber) {
    const d = extractDigits(b.phoneNumber);
    if (d) bDigits.push(d);
  }
  if (bIsSms) {
    const d = extractDigits(b.email.split("@")[0]);
    if (d) bDigits.push(d);
  }

  for (const d1 of aDigits) {
    for (const d2 of bDigits) {
      if (d1 === d2) return true;
      if (d1.length >= 10 && d2.length >= 10 && d1.slice(-10) === d2.slice(-10)) {
        return true;
      }
      if (d1.length >= 7 && d2.length >= 7 && (d1.endsWith(d2) || d2.endsWith(d1))) {
        return true;
      }
    }
  }

  return false;
}

export type EnrichedAttendeeWithNoShow<TAttendee> = TAttendee & {
  historicalNoShowCount: number;
};

export type EnrichedBookingWithNoShow<TBooking, TAttendee> = Omit<TBooking, "attendees"> & {
  historicalNoShowCount: number;
  attendees: Array<EnrichedAttendeeWithNoShow<TAttendee>>;
};

/**
 * Enriches a list of bookings with historical no-show counts for each attendee
 * under the current organizer, executing a single batch query to prevent N+1 issues.
 */
export async function enrichBookingsWithHistoricalNoShow<
  TAttendee extends { id: number; email: string; phoneNumber?: string | null },
  TBooking extends {
    id: number;
    startTime: Date | string;
    attendees: ReadonlyArray<TAttendee>;
  },
>({
  bookings,
  prisma,
  organizerUserId,
}: {
  bookings: TBooking[];
  prisma: PrismaClient;
  organizerUserId: number;
}): Promise<Array<EnrichedBookingWithNoShow<TBooking, TAttendee>>> {
  if (!bookings.length) {
    return [];
  }

  // Extract all unique attendees across all retrieved bookings
  const allCurrentAttendees = bookings.flatMap((b) => b.attendees);
  const { emails, phones } = collectSearchTerms(allCurrentAttendees);

  const orConditions = [];
  if (emails.size > 0) {
    orConditions.push({ email: { in: Array.from(emails) } });
  }
  if (phones.size > 0) {
    orConditions.push({ phoneNumber: { in: Array.from(phones) } });
  }

  // If no contact terms to query, return default 0 counts
  if (orConditions.length === 0) {
    return bookings.map((booking) => ({
      ...booking,
      historicalNoShowCount: 0,
      attendees: booking.attendees.map((attendee) => ({
        ...attendee,
        historicalNoShowCount: 0,
      })),
    }));
  }

  // Single batch query across the entire page of bookings
  const pastNoShowAttendees = await prisma.attendee.findMany({
    where: {
      noShow: true,
      booking: {
        userId: organizerUserId,
        status: {
          notIn: [BookingStatus.CANCELLED, BookingStatus.REJECTED],
        },
      },
      OR: orConditions,
    },
    select: {
      id: true,
      email: true,
      phoneNumber: true,
      bookingId: true,
      booking: {
        select: {
          id: true,
          startTime: true,
        },
      },
    },
  });

  return bookings.map((booking) => {
    const bookingStartTime = new Date(booking.startTime).getTime();

    const enrichedAttendees = booking.attendees.map((attendee) => {
      const distinctPastBookingIds = new Set<number>();

      for (const pastAttendee of pastNoShowAttendees) {
        // Exclude the current booking itself
        if (!pastAttendee.bookingId || pastAttendee.bookingId === booking.id) {
          continue;
        }

        // Only count appointments scheduled strictly prior to the current booking
        if (pastAttendee.booking?.startTime) {
          const pastStartTime = new Date(pastAttendee.booking.startTime).getTime();
          if (pastStartTime >= bookingStartTime) {
            continue;
          }
        }

        if (areContactsMatching(attendee, pastAttendee)) {
          distinctPastBookingIds.add(pastAttendee.bookingId);
        }
      }

      return {
        ...attendee,
        historicalNoShowCount: distinctPastBookingIds.size,
      };
    });

    const maxCount = enrichedAttendees.reduce((max, a) => Math.max(max, a.historicalNoShowCount), 0);

    return {
      ...booking,
      historicalNoShowCount: maxCount,
      attendees: enrichedAttendees,
    };
  });
}
