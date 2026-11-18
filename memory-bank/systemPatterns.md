# System Patterns — rOndevu

## Architecture
- **Monorepo**: Yarn 4 Workspaces + Turborepo for build orchestration
- **Frontend**: Next.js with App Router (newer pages & marketing/legal routes) + Pages Router (legacy)
- **API Layer**: Dual — tRPC for internal type-safe calls, NestJS REST for external v2 API, plus dedicated Next.js internal/cron API routes
- **Database**: PostgreSQL via Prisma ORM with Zod validation layer
- **Messaging & Automation Backbone**:
  - **SMS & OTP**: Provider-agnostic `ISmsProvider` (`TwilioSmsProvider`, `NetgsmSmsProvider`, `WebhookSmsProvider`, `SimulationSmsProvider`) + Twilio Verify v2 for OTP
  - **WhatsApp**: System-wide Platform Webhook → n8n (`2.45.4`) → Evolution API (`wp.rondevu.org`) with recipient consent & opt-out loop

## Key Codebase Design Patterns

### Repository/Service Pattern (packages/features/)
- Each feature is a self-contained module under `packages/features/`
- Business logic goes in Services, not Repositories
- Repositories handle data access only (with `select` not `include`)

### tRPC Router Pattern (packages/trpc/)
- Routers in `packages/trpc/server/routers/`
- Use `TRPCError` only in routers
- Use `ErrorWithCode` in services/repositories/utilities

### Import Pattern
- Import directly from source files, not barrel files
- Use `import type { X }` for type-only imports
- Respect `packages/ui/package.json` export maps (e.g. `@rondevu/ui/components/logo`, `@rondevu/ui/components/form`)
- API v2 re-exports through `@rondevu/platform-libraries`

### Error Handling & Security Patterns
- `TRPCError` in tRPC routers only; `ErrorWithCode` everywhere else
- **Cron Auth (`validateCronAuth.ts`)**: Constant-time bearer secret validation across all tasker and web cron routes (rejects unconfigured secrets / `"Bearer undefined"`)
- **In-Memory Rate Limit Fallback (`rateLimit.ts`)**: Bounded (`MAX_MEMORY_STORE_SIZE = 10000`) sliding-window token bucket when `UNKEY_ROOT_KEY` is absent, protecting SMS OTP and booking endpoints

### Database Pattern
- Always use `select` over `include` in Prisma queries
- Never expose `credential.key` in API responses
- Run `yarn prisma generate` after schema changes
- `bookingIdempotencyKeyExtension` generates `idempotencyKey` for both `ACCEPTED` and `PENDING` bookings and nulls it on `CANCELLED`/`REJECTED` to allow slot re-booking without race conditions

---

## rOndevu Core Domain Patterns

### 1. SMS Transport, GSM 7-bit Sanitization & Phone-First Booking
- **Provider Abstraction (`packages/lib/smsTransport.ts` & `@rondevu/sms`)**: Decouples transactional SMS sending (`Twilio`, `Netgsm`, `Webhook`, `Simulation`) from OTP verification (`Twilio Verify v2`). SMS dispatch is isolated from SMTP email failures via `Promise.allSettled`.
- **GSM 7-bit ASCII Sanitization (`packages/lib/sanitizeSmsText.ts`)**: Automatically transliterates Turkish characters (`ç, ğ, ı, İ, ö, ş, ü`), circumflex vowels, and smart punctuation into standard GSM 7-bit ASCII prior to dispatch. All attendee templates (`packages/sms/attendee/`) are compressed to `<= 160` characters (single segment, using `/b/:uid` short links) to prevent UCS-2 fallback and Twilio Error 30044.
- **Synthetic SMS Email (`<digits>@sms.rondevu.org`)**: Phone-only attendees without an email address receive a canonical synthetic email generated via `contructEmailFromPhoneNumber` after E.164 normalization (`normalizePhoneNumber.ts`). Supported end-to-end across booking creation, OTP bypass of email watchlist, historical no-show enrichment (`enrichHistoricalNoShow.ts`), and unauthenticated capability-URL cancellation (`handleCancelBooking.ts`).
- **Single-Use OTP Cache (`verifiedPhoneCache` in `phoneVerification.ts`)**: Because Twilio Verify's `VerificationCheck` API is strictly single-use, approved phone verifications are cached in a bounded (`MAX_VERIFIED_PHONE_CACHE_SIZE = 10000`) in-memory store with a 15-minute sliding TTL, invalidated on OTP resend (`clearPhoneVerificationCache`), and immediately consumed upon booking completion (`consumePhoneVerification`) to prevent replay attacks.

### 2. Platform Webhook → n8n → Evolution API (WhatsApp Pipeline)
- **System-Wide Platform Webhook**: Managed by administrators at `/settings/developer/webhooks` (gated by `RONDEVU_PLATFORM_WEBHOOK_ENABLE=1`). Targets only the configured private n8n URL (`PLATFORM_N8N_WEBHOOK_URL`), signs raw payloads with a 64-character HMAC-SHA256 secret, and uses DNS-pinned outbound requests without redirect following (`AbortSignal.timeout(10000)`).
- **Encrypted Replay & Delivery Tracking**: Failed platform webhook deliveries store encrypted payloads (`RONDEVU_WEBHOOK_REPLAY_KEY`) for manual operator replay via `/settings/admin/webhook-deliveries`.
- **Consent & Eligibility Gate (`POST /api/internal/whatsapp/eligibility`)**: Authenticated via `RONDEVU_N8N_ELIGIBILITY_TOKEN`. Before n8n dispatches any WhatsApp message through Evolution API, it queries this endpoint with `bookingUid` and `triggerEvent` to verify explicit host/attendee WhatsApp opt-in and fetch sanitized recipient metadata.
- **Inbound Opt-Out Loop (`POST /api/internal/whatsapp/opt-out`)**: Evolution API forwards inbound `MESSAGES_UPSERT` events to n8n; messages matching `STOP`, `DUR`, or `İPTAL` call the internal opt-out endpoint to immediately revoke WhatsApp consent for that E.164 phone number.

### 3. Dynamic Plan Contact Configuration (`PlanContactConfig`)
- **Single Source of Truth (`planContactConfig.ts`)**: Admin-configurable sales/support contact channels (Phone, WhatsApp, Email) stored authoritatively in PostgreSQL (`/settings/admin/plan-contact` via `authedAdminProcedure`) and exposed publicly via `trpc.viewer.public.getPlanContact` and SSR `getPlanContactConfig()`.
- **No-Card Conversion Flow**: Pricing cards (`990 ₺/ay` & `9.900 ₺/yıl`), homepage CTAs, and legal pages (`/privacy`, `/tos`) consume `PlanContactConfig` to open `PlanContactModal` with sanitized `tel:`, `mailto:`, and WhatsApp links instead of Stripe checkout forms.

### 4. Outreach Direct DB Demo Provisioning & 15-Day TTL Claim Pattern
- **Direct PostgreSQL Injection**: Instead of maintaining a separate demo cluster or public provisioning HTTP API, the Outreach engine provisions prospect profiles directly into `rOndevu`'s PostgreSQL database (`users`, `event_types`, `schedules`) with idempotency checks on email, phone, and username/slug.
- **15-Day TTL Metadata**: Demo accounts are flagged with `isOutreachDemo: true`, `demoCreatedAt`, and `demoExpiresAt` (`+15 days`). Unclaimed demo accounts and their dependent records are purged automatically by a scheduled cleanup job after 15 days.
- **Frictionless Claim via Password Reset**: Prospect accounts are created silently under the prospect's real email address. When the prospect likes their live demo page, they claim ownership via the **"Şifremi Unuttum" (Forgot Password)** flow and convert to a permanent account upon completing payment/subscription (clearing `isOutreachDemo`).

### 5. De-Rondevu'ification & Modular Venture Studio Boundaries
- **Progressive De-Rondevu'ification**: Enterprise/Organization/Team tiers and unused `packages/app-store` integrations are stripped from user-facing surfaces and progressively pruned from the codebase.
- **Reusable Studio Primitives**: Auth, SMS/WhatsApp messaging transports, webhook signing/replay, and outreach demo provisioning are structured with clean module boundaries so they can be reused across sister SaaS products under the Umbrella Brand.

## Component Relationships
- `apps/web` → consumes `packages/trpc`, `packages/ui`, `packages/features`, `packages/lib`, `packages/sms`
- `apps/api/v2` → consumes `packages/platform` (which re-exports from features/trpc)
- `packages/features` → consumes `packages/prisma`, `packages/lib`, `packages/sms`
- `packages/trpc` → consumes `packages/prisma`, `packages/features`, `packages/lib`
- `packages/sms` → consumes `packages/lib` (`smsTransport.ts`, `sanitizeSmsText.ts`), `packages/prisma`
