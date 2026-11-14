# Knowledge Base - Domain & Product-Specific Information

This file contains domain knowledge about the rOndevu product and codebase. For coding guidelines and rules, see [`rules/`](rules/).

## rOndevu Core Domain Architecture (`rOndevu` Çekirdek Domain Mimarisi)

### SMS & Phone Booking Flow (SMS & Telefon Randevu Akışı)

- **Phone-Confirmed Event Types (`isPhoneConfirmationEvent`)**: Event types can operate in phone-first mode where attendees book and confirm via phone number and OTP instead of email.
- **Phone Normalization (`packages/lib/normalizePhoneNumber.ts`)**: Normalizes Turkish and international phone inputs into strict E.164 format (`+<country><subscriber>`, e.g., `+905...` for Twilio/WhatsApp transport).
- **Synthetic Email & SMTP Isolation (`packages/lib/contructEmailFromPhoneNumber.ts`)**: When a booking is created without an email address, a synthetic address in the format `<digits>@sms.rondevu.org` is generated to satisfy database/attendee constraints. Outbound email handlers explicitly filter out `@sms.rondevu.org` addresses so no SMTP delivery is attempted for synthetic addresses.
- **Phone Verification (`packages/features/auth/lib/phoneVerification.ts`)**:
  - Uses Twilio Verify v2 (`TWILIO_VERIFY_SID`) when configured, with TOTP fallback via `packages/lib/smsTransport.ts`.
  - Maintains an in-memory `verifiedPhoneCache` with a 15-minute TTL (`VERIFICATION_CACHE_TTL_MS = 15 * 60 * 1000`) so a code verified during the UI modal step remains valid when the final booking creation request is submitted (preventing double-consume failures on Twilio Verify).
  - Calls `consumePhoneVerification(phoneNumber, code)` immediately after booking creation completes to invalidate the cached OTP and close any replay window.
- **GSM 7-Bit SMS Sanitization (`packages/lib/sanitizeSmsText.ts`)**: Transliterates Turkish/UTF-8 characters to GSM 7-bit ASCII and enforces `<=160` characters per single-segment SMS to prevent UCS-2 multi-segment billing expansion.
- **Short Booking Redirect (`/b/:uid`)**: Compact URL route (`apps/web/pages/b/[uid].tsx`) that redirects to `/booking/:uid` so SMS notifications fit within the 160-character single-segment budget.

### WhatsApp Platform Webhook & Evolution API / n8n

- **Platform Webhook (`Webhook.platform`)**: System-wide webhook tier managed by admins (`RONDEVU_PLATFORM_WEBHOOK_ENABLE=1`, `PLATFORM_N8N_WEBHOOK_URL`) that dispatches signed booking lifecycle events (`BOOKING_CREATED`, `BOOKING_RESCHEDULED`, `BOOKING_CANCELLED`, `BOOKING_CONFIRMED`) to n8n and Evolution API.
- **Security & `X-Rondevu-*` Headers**:
  - Outbound platform webhooks authenticate to n8n using `X-Rondevu-Ingress-Key` (`RONDEVU_N8N_INGRESS_KEY`), HMAC-SHA256 payload signatures, and `X-Rondevu-*` delivery metadata headers.
  - Inbound Evolution `MESSAGES_UPSERT` webhooks authenticate to n8n using `X-Rondevu-Evolution-Ingress`.
- **Internal Consent & Opt-Out Endpoints**:
  - `POST /api/internal/whatsapp/eligibility`: Authenticated via `Authorization: Bearer <RONDEVU_N8N_ELIGIBILITY_TOKEN>`; verifies active host/attendee WhatsApp consent immediately prior to message dispatch and returns only eligible recipients and minimal booking fields.
  - `POST /api/internal/whatsapp/opt-out`: Revokes WhatsApp notification consent for an E.164 phone number when the user replies with `STOP`, `DUR`, or `İPTAL`.
- **Admin Delivery Console (`/settings/admin/webhook-deliveries`)**: Allows administrators to inspect failed or stuck (`PROCESSING` > 15m) platform webhook deliveries and trigger encrypted payload replays (`RONDEVU_WEBHOOK_REPLAY_KEY`).
- **Full Operational Reference**: See `docs/n8n-whatsapp-platform.md` for architecture, deduplication state machine (`PENDING` / `SENDING` / `SENT`), and deployment checks.

### Outreach & Direct Database Demo Provisioning (15-Day TTL)

- **Direct DB Injection**: Lead/prospect demo profiles discovered via the Outreach pipeline are provisioned directly into the `rOndevu` PostgreSQL database across `users`, `event_types`, and `schedules` tables (without a separate demo environment or external provisioning API).
- **Demo Metadata & 15-Day TTL**:
  - Provisioned demo records are marked with `isOutreachDemo: true`, `demoCreatedAt`, and `demoExpiresAt: +15 days`.
  - Unclaimed demo accounts and their associated event types/schedules are automatically purged by a cleanup job once `demoExpiresAt` (15 days) passes.
- **Idempotency (Tekillik Koruması)**: Provisioning enforces strict uniqueness across email, phone number, and username/slug so duplicate demo profiles are never created for an existing prospect.
- **Frictionless Claim Flow ("Şifremi Unuttum" + Subscription)**: Prospects receive their live demo using their real email address (created silently). To claim the account, the prospect uses the **"Şifremi Unuttum"** (Forgot Password) flow to set credentials and completes the subscription/payment step, which clears `isOutreachDemo` and converts the profile into a permanent account.

### Dynamic Plan Contact Configuration (Dinamik Plan İletişim)

- **Configuration Service (`packages/lib/planContactConfig.ts`)**: Reads and persists support/sales contact information (`phone`, `email`, `whatsapp`) primarily in PostgreSQL under `Deployment.theme.planContact` (`Deployment.id = 1`), with filesystem (`plan-contact-config.json`) and environment variable (`NEXT_PUBLIC_SUPPORT_*`) fallbacks.
- **Admin UI (`/settings/admin/plan-contact`)**: Allows administrators to dynamically update plan contact details displayed on pricing, paywall, and upgrade contact surfaces without redeployment.

### Localization & Terminology (Lokalizasyon ve Terminoloji)

- **Default Locale**: Turkish (`tr`) is the primary product language.
- **Locale Synchronization**: Every user-facing translation key added or modified in `packages/i18n/locales/tr/common.json` must be kept in sync with `packages/i18n/locales/en/common.json`.
- **Domain Terminology**:
  - Appointments / Bookings are consistently referred to as **"Randevu"** / **"Rezervasyon"** (never literal "Etkinlik" for service appointments).
  - Out-of-office / leave management is referred to as **"Ofis Dışı / İzinlerim"**.

---

## When working with managed event types

When a managed event type is created, we create:
- A **parent managed event type** for the team (has `teamId` set in EventType table)
- A **child managed event type** for each assigned user (has `userId` set in EventType table)

Example: If we create a managed event type and assign Alice and Bob, three rows will be inserted in the EventType table (1 parent + 2 children).

**Important**: Only child managed event types can be booked.

## When working with organizations and teams

Both organizations and teams are stored in the `Team` table:
- **Organizations**: Have `isOrganization` set to `true`
- **Teams within an organization**: Have `parentId` set (pointing to the organization)

## When working with OAuth clients

There are two types of OAuth clients:

| Type | Table | Purpose |
|------|-------|---------|
| OAuth client | `OAuthClient` | Allows 3rd party apps to connect users' rOndevu accounts |
| Platform OAuth client | `PlatformOAuthClient` | Used by platform customers integrating rOndevu scheduling directly in their platforms |

If someone says "platform OAuth client" they mean the one in the `PlatformOAuthClient` table.

## When you need product or codebase context

### Monorepo Structure

The whole repository is a monorepo. The main web app is in `apps/web` folder.

### Local Development Database

When setting up local development database, it creates test users. The passwords are the same as the username:
- `free:free`
- `pro:pro`

### Logging Levels

Control logging verbosity by setting `NEXT_PUBLIC_LOGGER_LEVEL` in .env:
- 0: silly
- 1: trace
- 2: debug
- 3: info
- 4: warn
- 5: error
- 6: fatal

### rOndevu Event Identification

rOndevu events in Google Calendar can be identified by checking if the iCalUID ends with `@rOndevu` (e.g., `2GBXSdEixretciJfKVmYN8@rOndevu`). This identifier is used to distinguish rOndevu bookings from other calendar events for data storage and privacy purposes.

### UI Component Locations

- Event types page: `apps/web/modules/event-types/views/event-types-listing-view.tsx`
- Bookings page: `apps/web/modules/bookings/views/bookings-view.tsx`
- Shared elements (tabs, search bars, filter buttons) should maintain consistent alignment across views

### DataTable

Refer to the DataTable guide at `packages/features/data-table/GUIDE.md` for implementation patterns and best practices.

### Round-Robin Scheduling

Reuse existing code in `packages/features/bookings/lib/getLuckyUser.ts` which handles:
- Weight-based selection
- Priority ranking
- Round-robin fairness algorithms

Check if existing functions can be extended before creating new implementations.

### Calendar Cache System

The calendar cache system follows specific patterns in `packages/features/calendar-cache-sql`. When implementing provider-specific calendar cache services (like for Outlook/Office365), place the provider-specific code in the corresponding provider directory (e.g., `packages/app-store/office365calendar`).

### API Documentation

The OpenAPI specification at `docs/api-reference/v2/openapi.json` is auto-generated from NestJS controllers. Manual edits will be wiped out.

To make persistent changes to API documentation, use NestJS decorators (`@ApiQuery`, `@ApiOperation`, etc.) in the controller files at `apps/api/v2/src/modules/*/controllers/*.controller.ts`.

### Workflows vs Webhooks

Workflows and webhooks are two completely separate features in rOndevu with different implementations and file structures:
- Workflow constants: `packages/features/ee/workflows/lib/constants.ts`
- NOT in the webhooks directory

When working on workflow triggers, do not reference or use webhook trigger implementations - they are distinct systems.
