import { getBookingForReschedule } from "@rondevu/features/bookings/lib/get-booking";
import getAllUserBookings from "@rondevu/features/bookings/lib/getAllUserBookings";
import { getBookingFieldsWithSystemFields } from "@rondevu/features/bookings/lib/getBookingFields";
import getBookingInfo from "@rondevu/features/bookings/lib/getBookingInfo";
import handleCancelBooking from "@rondevu/features/bookings/lib/handleCancelBooking";
import handleMarkNoShow from "@rondevu/features/handleMarkNoShow";
import { getTranslation } from "@rondevu/i18n/server";
import { symmetricDecrypt, symmetricEncrypt } from "@rondevu/lib/crypto";
import type { Prisma } from "@rondevu/prisma/client";
import { credentialForCalendarServiceSelect } from "@rondevu/prisma/selects/credential";
import { paymentDataSelect } from "@rondevu/prisma/selects/payment";

export { slugify } from "@rondevu/lib/slugify";
export { slugifyLenient } from "@rondevu/lib/slugify-lenient";
export { getBookingForReschedule };

export { getWebhookProducer } from "@rondevu/features/di/webhooks/containers/webhook";
export { getUsernameList } from "@rondevu/features/eventtypes/lib/defaultEvents";
export {
  DEFAULT_WEBHOOK_VERSION,
  WebhookVersion,
} from "@rondevu/features/webhooks/lib/interface/IWebhookRepository";
export type { IWebhookProducerService } from "@rondevu/features/webhooks/lib/interface/WebhookProducerService";
export {
  AttributeType,
  CreationSource,
  MembershipRole,
  PeriodType,
  SchedulingType,
  TimeUnit,
  WebhookTriggerEvents,
} from "@rondevu/prisma/enums";
export type { CalendarEvent, EventBusyDate } from "@rondevu/types/Calendar";

export { handleMarkNoShow };

export type {
  BookingCreateBody,
  BookingResponse,
} from "@rondevu/features/bookings/types";
export type { ConnectedCalendar } from "@rondevu/features/calendars/lib/CalendarManager";
export {
  getBusyCalendarTimes,
  updateEvent,
} from "@rondevu/features/calendars/lib/CalendarManager";
export type { ConnectedDestinationCalendars } from "@rondevu/features/calendars/lib/getConnectedDestinationCalendars";
export { getConnectedDestinationCalendarsAndEnsureDefaultsInDb } from "@rondevu/features/calendars/lib/getConnectedDestinationCalendars";
export type { CityTimezones } from "@rondevu/features/cityTimezones/cityTimezonesHandler";
export { cityTimezonesHandler } from "@rondevu/features/cityTimezones/cityTimezonesHandler";
export { ENABLE_ASYNC_TASKER, MINUTES_TO_BOOK } from "@rondevu/lib/constants";
export { TRPCError } from "@trpc/server";

export { getAllUserBookings };
export { getBookingInfo };
export { handleCancelBooking };

export { dynamicEvent } from "@rondevu/features/eventtypes/lib/defaultEvents";
export { parseBookingLimit } from "@rondevu/lib/intervalLimits/isBookingLimits";
export { parseRecurringEvent } from "@rondevu/lib/isRecurringEvent";
export {
  bookingMetadataSchema,
  teamMetadataSchema,
  userMetadata,
} from "@rondevu/prisma/zod-utils";

export { symmetricEncrypt, symmetricDecrypt };

export { getTranslation };

export { validateCustomEventName } from "@rondevu/features/eventtypes/lib/eventNaming";

export type TeamQuery = Prisma.TeamGetPayload<{
  select: {
    id: true;
    credentials: {
      select: typeof import("@rondevu/prisma/selects/credential").credentialForCalendarServiceSelect;
    };
    name: true;
    logoUrl: true;
    members: {
      select: {
        role: true;
      };
    };
  };
}>;

export { credentialForCalendarServiceSelect };
export { paymentDataSelect };
export { confirmHandler as confirmBookingHandler } from "@rondevu/trpc/server/routers/viewer/bookings/confirm.handler";
export { getBookingFieldsWithSystemFields };

export { checkAdminOrOwner } from "@rondevu/features/auth/lib/checkAdminOrOwner";
export { sendLocationChangeEmailsAndSMS } from "@rondevu/emails/email-manager";
export { verifyCodeUnAuthenticated } from "@rondevu/features/auth/lib/verifyCodeUnAuthenticated";
export { sendEmailVerificationByCode } from "@rondevu/features/auth/lib/verifyEmail";
export { getCalendarLinks } from "@rondevu/features/bookings/lib/getCalendarLinks";
export { BookingReferenceRepository } from "@rondevu/features/bookingReference/repositories/BookingReferenceRepository";
export { BookingAccessService } from "@rondevu/features/bookings/services/BookingAccessService";
export { CredentialRepository } from "@rondevu/features/credentials/repositories/CredentialRepository";
export type { OrgMembershipLookup } from "@rondevu/features/di/modules/OrgMembershipLookup";
export type { OAuth2Tokens } from "@rondevu/features/oauth/services/OAuthService";
export { OAuthService } from "@rondevu/features/oauth/services/OAuthService";
export { generateSecret } from "@rondevu/features/oauth/utils/generateSecret";
export { ProfileRepository } from "@rondevu/features/profile/repositories/ProfileRepository";
export { SelectedCalendarRepository } from "@rondevu/features/selectedCalendar/repositories/SelectedCalendarRepository";
export type { Tasker } from "@rondevu/features/tasker/tasker";
export { getTasker } from "@rondevu/features/tasker/tasker-factory";
export { buildCalEventFromBooking } from "@rondevu/lib/buildCalEventFromBooking";
export { getVideoCallUrlFromCalEvent } from "@rondevu/lib/RondevuEventParser";
export { verifyCodeChallenge } from "@rondevu/lib/pkce";
export { encryptServiceAccountKey } from "@rondevu/lib/server/serviceAccountKey";
export { validateUrlForSSRFSync } from "@rondevu/lib/ssrfProtection";
export type { TraceContext } from "@rondevu/lib/tracing";
export { distributedTracing } from "@rondevu/lib/tracing/factory";
export {
  type BookingWithUserAndEventDetails,
  bookingWithUserAndEventDetailsSelect,
} from "@rondevu/prisma/selects/booking";
export { checkEmailVerificationRequired } from "@rondevu/trpc/server/routers/publicViewer/checkIfUserEmailVerificationRequired.handler";
export type { CredentialForCalendarService } from "@rondevu/types/Credential";

// === Stubs for deleted EE features still imported by API v2 ===

// Round-robin reassignment removed (EE feature) — stubs for API v2
export async function roundRobinManualReassignment(_args: {
  bookingId: number;
  newUserId: number;
  orgId?: number | null;
  reassignReason?: string;
  reassignedById?: number;
  emailsEnabled?: boolean;
  platformClientParams?: unknown;
  actionSource?: string;
  reassignedByUuid?: string;
}): Promise<void> {
  // No-op in community edition
}

export async function roundRobinReassignment(_args: {
  bookingId: number;
  orgId?: number | null;
  emailsEnabled?: boolean;
  platformClientParams?: unknown;
  reassignedById?: number;
  actionSource?: string;
  reassignedByUuid?: string;
}): Promise<void> {
  // No-op in community edition
}

// createApiKeyHandler removed (EE feature) — stub for API v2
export async function createApiKeyHandler(_args: {
  ctx: { user: { id: number } };
  input: {
    note?: string | null;
    neverExpires?: boolean;
    expiresAt?: Date | null;
    teamId?: number;
  };
}): Promise<string> {
  throw new Error("API key creation is not available in community edition");
}

// getClientSecretFromPayment removed (EE feature) — stub for API v2
export function getClientSecretFromPayment(payment: { data: Record<string, unknown> }): string | null {
  const data = payment.data;
  if (data && typeof data === "object" && "client_secret" in data) {
    return data.client_secret as string;
  }
  return null;
}

// verifyCodeAuthenticated removed (EE feature) — stub for API v2
export async function verifyCodeAuthenticated(_args: {
  user: { id: number; email?: string; [key: string]: unknown };
  email: string;
  code: string;
}): Promise<boolean> {
  return false;
}

// createNewUsersConnectToOrgIfExists removed (EE feature) — stub for API v2
export async function createNewUsersConnectToOrgIfExists(_args: {
  invitations: { usernameOrEmail: string; role: string }[];
  creationSource?: string;
  teamId: number;
  isOrg: boolean;
  parentId: number | null;
  autoAcceptEmailDomain: string;
  orgConnectInfoByUsernameOrEmail: Record<string, { orgId: number; autoAccept: boolean }>;
  isPlatformManaged?: boolean;
  timeFormat?: number;
  weekStart?: string;
  timeZone?: string;
  language?: string;
}): Promise<{ id: number; email: string; username: string }[]> {
  throw new Error("Organization user creation is not available in community edition");
}

// sendVerificationCode removed (EE feature) — stub for API v2
export async function sendVerificationCode(_phoneNumber: string): Promise<void> {
  throw new Error("Phone verification is not available in community edition");
}

// verifyPhoneNumber removed (EE feature) — stub for API v2
export async function verifyPhoneNumber(
  _phoneNumber: string,
  _code: string,
  _userId: number,
  _teamId?: number
): Promise<boolean> {
  throw new Error("Phone verification is not available in community edition");
}
