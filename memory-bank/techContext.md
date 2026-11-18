# Tech Context — rOndevu

## Tech Stack
- **Framework**: Next.js (App Router + Pages Router hybrid, Turbopack production build support)
- **Language**: TypeScript 5.9 (strict mode)
- **Database**: PostgreSQL + Prisma ORM (Client, Zod, Kysely, and Enum generators)
- **API**: tRPC (internal type-safe routers) + NestJS REST API v2 + Next.js Internal/Cron Route Handlers
- **Auth**: NextAuth.js (session anchored to immutable user ID; supports password-reset claim flow for outreach demos)
- **Styling & UI**: Tailwind CSS, dark-first theme (`#141414` / `#121214` surfaces), `Inter` (`latin`, `latin-ext`) + `Cal Sans` typography, scoped Framer SSR DOM/CSS (`apps/web/public/cal_files/`) for `/` and `/pricing`
- **Messaging & Verification**:
  - **SMS OTP**: Twilio Verify v2 REST API (`TWILIO_VERIFY_SID`) + bounded `verifiedPhoneCache`
  - **Transactional SMS**: Provider-agnostic transport (`Twilio` Programmable Messaging, `Netgsm`, `Webhook`, `Simulation`) with GSM 7-bit ASCII transliteration (`sanitizeSmsText.ts`)
  - **WhatsApp Automation**: Platform Webhook (HMAC-SHA256) → n8n (`n8nio/n8n:2.45.4`) → Evolution API (`wp.rondevu.org`, Baileys/WhatsApp Web session)
- **Monorepo**: Yarn 4.12 Workspaces + Turborepo
- **Testing**: Vitest (unit), Playwright (E2E)
- **i18n**: `next-i18next` (default locale: `tr`, fallback: `["tr", "en"]`) + centralized `home-translations.ts` for marketing pages
- **Linter/Formatter**: Biome 2.3
- **Deployment**: Docker / Dokploy Swarm (`dokploy-network`), Cloudflare Tunnel (`wp.rondevu.org` → `127.0.0.1:8080`)

## Monorepo Structure
- `apps/web` — Main Next.js application (Booker, Dashboard, Admin panels, Marketing `/` & `/pricing`, Internal API routes)
- `apps/api/v2` — NestJS REST API
- `packages/prisma` — PostgreSQL schema, migrations, and Prisma extensions (`bookingIdempotencyKeyExtension`)
- `packages/trpc` — tRPC server routers and handlers
- `packages/ui` — Shared UI components and icon sprites
- `packages/features` — Self-contained domain modules (`auth`, `bookings`, `availability`, `webhooks`, `tasker`, etc.)
- `packages/lib` — Shared utilities (`smsTransport.ts`, `sanitizeSmsText.ts`, `normalizePhoneNumber.ts`, `planContactConfig.ts`, `rateLimit.ts`, `validateCronAuth.ts`)
- `packages/sms` — `@rondevu/sms` workspace package (`SMSManager`, 1-segment GSM 7-bit attendee/organizer SMS templates, unit tests)
- `packages/app-store` — External calendar integrations (Google Calendar, Apple Calendar; unused rOndevu bloat targeted for De-Cal'ification)
- `packages/i18n` — Turkish (`tr`) and English (`en`) translation catalogs (`common.json` with 0 missing Turkish keys)
- `packages/emails` — Transactional email templates
- `deploy/` — n8n workflow templates (`n8n-platform-webhook.workflow.json`, `n8n-evolution-optout.workflow.json`)

## Key Internal Routes & Admin Views
- `/api/internal/whatsapp/eligibility` — Bearer-authenticated (`RONDEVU_N8N_ELIGIBILITY_TOKEN`) POST route verifying host/guest WhatsApp consent prior to Evolution API dispatch
- `/api/internal/whatsapp/opt-out` — Bearer-authenticated POST route processing inbound `STOP` / `DUR` / `İPTAL` opt-out events from n8n/Evolution
- `/api/tasks/cron` — Authenticated (`CRON_API_KEY`) tasker queue processor for scheduled reminders (`EventReminderSMS`) and cleanup sweeps
- `/settings/admin/sms` — Admin SMS provider & transport control panel
- `/settings/admin/plan-contact` — Admin configuration UI for `PlanContactConfig` (Phone, WhatsApp, Email)
- `/settings/admin/webhook-deliveries` — Admin inspection and encrypted payload replay screen for platform webhook deliveries
- `/settings/developer/webhooks` — Platform & user webhook management

## Key Environment Variables (Runtime / Dokploy)
- **SMS & Twilio**: `TWILIO_ACCOUNT_SID` (or `TWILIO_SID`), `TWILIO_AUTH_TOKEN` (or `TWILIO_TOKEN`), `TWILIO_VERIFY_SID`, `TWILIO_MESSAGING_SID`, `TWILIO_PHONE_NUMBER`
- **WhatsApp / n8n Platform Webhook**:
  - `RONDEVU_PLATFORM_WEBHOOK_ENABLE=1` (deployment gate)
  - `PLATFORM_N8N_WEBHOOK_URL` (private n8n webhook URL on `dokploy-network`)
  - `PLATFORM_N8N_ALLOW_PRIVATE_HTTP=1`
  - `RONDEVU_N8N_INGRESS_KEY` (`X-Rondevu-Ingress-Key` header auth)
  - `RONDEVU_N8N_ELIGIBILITY_TOKEN` (Bearer token for `/api/internal/whatsapp/{eligibility,opt-out}`)
  - `RONDEVU_WEBHOOK_REPLAY_KEY` (32-byte Base64 key for encrypting failed webhook payloads)
- **Cron & Security**: `CRON_API_KEY`, `NEXTAUTH_SECRET`, `CALENDSO_ENCRYPTION_KEY`

## Key Commands
- `yarn dev` — Start development server
- `yarn --cwd apps/web workspace @rondevu/web run build` — Production Next.js build for web app
- `yarn workspace @rondevu/trpc run build` — Build and type-check tRPC server/client packages
- `npx tsc --project packages/trpc/tsconfig.server.json --noEmit` — Fast server-side TypeScript verification
- `yarn biome check --write .` — Lint and format with Biome
- `TZ=UTC yarn vitest run` — Run unit test suites
- `yarn prisma generate` — Regenerate Prisma client and Zod/Kysely types

## Development & Operational Notes
- `turbo.json` passes `RONDEVU_*` and `PLATFORM_N8N_*` environment variables through to the Next.js runtime.
- Turkish (`tr`) is the default locale across UI, database defaults (`User.locale`, `Attendee.locale`), default schedule names (`"Çalışma saatleri"`), and transactional notifications.
- All Turkish customer-facing copy avoids corporate rOndevu jargon (using `"Randevu"` instead of `"Toplantı"`, `"İzinlerim / Ofis Dışında"` instead of `"OOO"`, and zero instances of `"altyapı"` on marketing pages).
