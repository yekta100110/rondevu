# rOndevu — AI Agent & Engineering Guide

You are a senior **rOndevu** engineer working in a Yarn/Turbo monorepo (retaining the internal `@calcom/*` workspace scope for package compatibility). You prioritize type safety, security, clean vertical-slice boundaries, and small, reviewable diffs.

## Product Vision & Target Architecture

- **Product Positioning:** `rOndevu` (`rondevu.org`) is a WhatsApp- and SMS-first appointment and calendar management SaaS platform built for vertical sectors in Turkey and local markets (clinics, beauty centers, consulting offices, hair/barber salons, and local service businesses). It is the flagship vertical SaaS product under our Umbrella Brand / Venture Studio ecosystem.
- **De-Cal'ification Principle:** Although the codebase originated as a `Cal.com` / `Cal.diy` fork, you must actively avoid and strip away unnecessary Cal.com `app-store` integrations and heavy enterprise/organization complexity. The core architecture is a lean, modular backbone consisting of:
  1. **Core Appointment & Availability Engine**
  2. **WhatsApp Notification & Consent Backbone (Evolution API + n8n)**
  3. **SMS & Phone Verification (OTP) Backbone (Twilio Verify & Programmable SMS / Netgsm)**
  4. **Local Payment, Plan Contact & Notification Layer**
  5. **Outreach Direct-DB Demo Provisioning Engine (15-Day TTL)**

---

## Do

- Use `select` instead of `include` in Prisma queries for performance and security
- Use `import type { X }` for TypeScript type imports
- Use early returns to reduce nesting: `if (!booking) return null;`
- Use `ErrorWithCode` for errors in non-tRPC files (services, repositories, utilities); use `TRPCError` only in tRPC routers
- Use conventional commits: `feat:`, `fix:`, `refactor:`
- Create PRs in draft mode by default
- Run `yarn type-check:ci --force` before concluding CI failures are unrelated to your changes
- Import directly from source files, not barrel files (`index.ts`), while strictly respecting `@calcom/ui` `package.json` `exports` paths (e.g., `@calcom/ui/components/button` or `@calcom/ui/components/logo`, never `@calcom/ui` or unexported deep paths like `@calcom/ui/components/logo/Logo`)
- Add translations to **both** `packages/i18n/locales/tr/common.json` (default language `tr`) and `packages/i18n/locales/en/common.json` for all UI strings
- Use `date-fns` or native `Date` instead of Day.js when timezone awareness isn't needed
- Avoid $O(n^2)$ nested loops in scheduling and availability calculations
- Put permission checks in `page.tsx`, never in `layout.tsx`
- Use `ast-grep` for searching if available; otherwise use `rg` (ripgrep), then fall back to `grep`
- Use Biome for formatting and linting (`yarn biome check --write .`)
- Only add code comments that explain **why**, not **what** — see [code comment guidelines](agents/rules/quality-code-comments.md)

## Don't

- Never use `as any` - use proper type-safe solutions instead
- Never expose `credential.key` field in API responses or queries
- Never commit secrets, API keys, or `.env` files
- Never modify `*.generated.ts` files directly - they're created by app-store-cli
- Never put business logic in repositories - that belongs in Services
- Never use barrel imports from `index.ts` files
- Never import deep internal paths from `@calcom/ui` that are not declared in `packages/ui/package.json` `exports`
- Never import `@calcom/trpc` or `apps/web` inside `packages/features`
- Never import `*Repository` or upper-layer packages inside `packages/lib`
- Never skip running type checks before pushing
- Never create large PRs (>500 lines or >10 files) - split them instead
- Never add comments that simply restate what the code does (e.g., `// Get the user` above a `getUser()` call)

---

## Architecture & Mandatory Technical Rules

### 1. Monorepo Package Dependency Hierarchy
Respect the strict unidirectional dependency hierarchy across workspaces:

```text
packages/lib -> packages/app-store -> packages/features -> packages/trpc -> apps/web
```

- **No Circular Dependencies:** Packages may only import from layers to their left.
- **`packages/lib` Purity:** `packages/lib` is the lowest-level shared utility layer. Never import repositories (`*Repository.ts`), `@calcom/features`, `@calcom/trpc`, or `apps/web` inside `packages/lib`.

### 2. `packages/features` vs `apps/web/modules` Separation
- **`packages/features`:** Framework-agnostic business logic, domain services (`*Service.ts`), data repositories (`*Repository.ts`), and reusable feature logic. **`packages/features` must NEVER import `@calcom/trpc` or `apps/web`.**
- **`apps/web/modules`:** Next.js route views (`*-view.tsx`), `trpc.*` React hooks, and web-specific UI wiring.

### 3. Barrel Import (`index.ts`) Prohibition & `@calcom/ui` Export Map Warning
- Do not import from `index.ts` barrel files (e.g., `import { Button } from "@calcom/ui"` is forbidden because it pulls the entire UI bundle into the compilation graph).
- **Critical `@calcom/ui` Export Map Rule:** `packages/ui/package.json` defines a strict `exports` map. Importing unexported deep file paths such as `@calcom/ui/components/logo/Logo` passes IDE checks in some setups but **breaks the Next.js production build** (`Module not found: Package path ./components/logo/Logo is not exported`). Always import using the exact subpath declared in `packages/ui/package.json` `exports` (e.g., `@calcom/ui/components/logo`, `@calcom/ui/components/form`, `@calcom/ui/components/button`).

### 4. Repository (`*Repository.ts`) vs Service (`*Service.ts`) & Dependency Injection
- **Repositories (`*Repository.ts`):** Pure data-access layer containing Prisma queries with explicit `select` clauses. Never place business rules, third-party API calls, or orchestration logic inside repositories.
- **Services (`*Service.ts`):** Domain business logic, validation, and multi-repository orchestration.
- **Dependency Injection (`@evyweb/ioctopus`):** Wire services and repositories via DI modules (`packages/features/di/`) rather than hardcoding stateful singletons, enabling clean unit testing and decoupling.

### 5. Build Order Gotcha (Schema & tRPC Changes)
When modifying `packages/prisma/schema.prisma` or `packages/trpc` routers/types, running type-check directly will fail with stale generated types. Always execute in this exact order:

```bash
# 1. Regenerate Prisma client & enums (if enum-generator.ts fails, run `yarn install` first)
yarn prisma generate

# 2. Rebuild tRPC workspace outputs so downstream packages see updated router types
yarn workspace @calcom/trpc run build

# 3. Run full CI type check
yarn type-check:ci --force
```

### 6. Error Handling (`ErrorWithCode` vs `TRPCError`)
- In services, repositories, and utilities, always throw `ErrorWithCode` (from `@calcom/lib/errors`).
- Use `TRPCError` **only** inside tRPC router files (`packages/trpc/server/routers/`).

### 7. Next.js App Router Page-Level Authorization (`page.tsx` vs `layout.tsx`)
- In Next.js App Router (`apps/web/app/`), layouts do not re-render on client-side navigation and execute in parallel with pages. Always place authentication, session, and permission checks inside `page.tsx`, **never** solely in `layout.tsx`.

### 8. Performance: Day.js Weight & $O(n^2)$ Loop Prevention
- **Day.js:** `Day.js` with timezone plugins is expensive when instantiated thousands of times during slot generation. Use `date-fns` or native `Date` / numeric epoch timestamps when timezone conversion is not required.
- **No $O(n^2)$ Scheduling Loops:** Never use nested `.find()` / `.filter()` / `.some()` array scans across bookings, busy times, or availability slots. Pre-index collections with `Map` or `Set` and use sorted interval comparisons.

---

## rOndevu Core Modules & Domain Rules

### 1. Language, Terminology & Theme Standards (`i18n` & Dark-First UI)
- **Default Language (`tr`):** Turkish (`tr`) is the default product language. Every UI string addition or change must update **both** `packages/i18n/locales/tr/common.json` and `packages/i18n/locales/en/common.json` simultaneously.
- **Mandatory Turkish Terminology:**
  - Use **"Randevu / Rezervasyon"** instead of "Toplantı / Etkinlik".
  - Use **"Ofis Dışı / İzinlerim"** instead of "OOO / Out of Office".
  - **Forbidden Word:** Never use the word **"altyapı"** in user-facing Turkish copy.
- **Default Theme:** `rOndevu` is dark-first (`#141414` / `#121214` primary dark surfaces).

### 2. SMS & Phone Verification (OTP) Backbone
- **`packages/sms/`:** Appointment lifecycle SMS manager (`SMSManager`) and localized SMS templates for attendees and hosts.
- **`packages/lib/smsTransport.ts`:** Multi-provider SMS transport abstraction supporting **Twilio** (`Programmable SMS`), **Netgsm**, **Webhook**, and **Simulation** modes via `sendTransactionalSms`.
- **`packages/lib/sanitizeSmsText.ts`:** Transliterates Turkish characters (`ğ, ü, ş, ı, ö, ç, Ğ, Ü, Ş, İ, Ö, Ç`) into GSM 7-bit safe ASCII and enforces the single-segment `<= 160` character limit so carriers never split or double-bill transactional SMS messages.
- **`packages/lib/normalizePhoneNumber.ts`:** Normalizes local Turkish numbers (`05xx...`, `5xx...`, `905xx...`) and international inputs into strict E.164 format (`+905xxxxxxxxx`).
- **`packages/lib/contructEmailFromPhoneNumber.ts`:** Generates and detects synthetic email addresses (`<digits>@sms.rondevu.org`, via `isSmsGeneratedEmail`) for phone-only booking attendees who book without an email address.
- **`packages/features/auth/lib/phoneVerification.ts`:** Manages Twilio Verify OTP checks, maintaining a 15-minute `verifiedPhoneCache` (`VERIFY_TTL_MS = 15 * 60 * 1000`) and single-use consumption via `consumePhoneVerification` during booking creation or signup.

### 3. WhatsApp & Platform Webhook Backbone (Evolution API + n8n)
- **Reference Documentation:** Always consult [`docs/n8n-whatsapp-platform.md`](docs/n8n-whatsapp-platform.md) before modifying webhook delivery, consent, or WhatsApp notification flows.
- **Pipeline:** `rOndevu Platform Webhook` -> `n8n` (`deploy/n8n-platform-webhook.workflow.json` & `deploy/n8n-evolution-optout.workflow.json`) -> `Evolution API`.
- **Internal Endpoints:**
  - `POST /api/internal/whatsapp/eligibility`: Authenticated via `RONDEVU_N8N_ELIGIBILITY_TOKEN`; verifies real-time attendee/host WhatsApp opt-in consent immediately prior to message dispatch.
  - `POST /api/internal/whatsapp/opt-out`: Processes inbound `STOP`, `DUR`, or `İPTAL` messages from Evolution API to revoke WhatsApp consent for that E.164 phone number.
- **Delivery Monitoring & Replay:** `/settings/admin/webhook-deliveries` allows administrators to inspect failed platform webhook deliveries (encrypted at rest via `RONDEVU_WEBHOOK_REPLAY_KEY`) and trigger manual replays.
- **Security Headers:** Outbound and inbound flows rely on `X-Rondevu-Signature` (HMAC-SHA256), `X-Rondevu-Timestamp`, `X-Rondevu-Event-Id`, `X-Rondevu-Trigger`, `X-Rondevu-Ingress-Key`, and `X-Rondevu-Evolution-Ingress`.

### 4. Outreach & Direct-DB Demo Injection (15-Day TTL)
- **Direct PostgreSQL Provisioning:** Instead of maintaining a separate demo environment or custom provisioning HTTP API, prospective business leads are injected directly into the `rOndevu` PostgreSQL database (`users`, `event_types`, `schedules`).
- **Demo Markers & 15-Day TTL:** Injected accounts are flagged with `isOutreachDemo: true`, `demoCreatedAt`, and `demoExpiresAt` (`+15 days`).
- **Idempotency (Uniqueness Protection):** Never create duplicate demo records for the same email address, normalized E.164 phone number, or `username`/slug; existing demo profiles must be preserved.
- **Automated 15-Day Cleanup:** Unclaimed demo accounts and their dependent records (`event_types`, `schedules`, etc.) whose `demoExpiresAt` has passed (`15 days`) are automatically purged by the scheduled cleanup job.
- **Frictionless Claiming (Password Reset + Paywall):** When a prospect likes their live demo, they claim the account via the **"Şifremi Unuttum" (Forgot Password)** flow and complete payment/subscription, which clears `isOutreachDemo: false` and converts the profile into a permanent account exempt from TTL cleanup.

### 5. Dynamic Plan Contact Configuration
- **`packages/lib/planContactConfig.ts` & `/settings/admin/plan-contact`:** Manages dynamic administrator contact channels (WhatsApp, phone, email) for Monthly/Annual subscription activation stored in the database (`App_Settings`).

---

## PR Size Guidelines

Large PRs are difficult to review, prone to errors, and slow down the development process. Always aim for smaller, self-contained PRs that are easier to understand and review.

### Size Limits

- **Lines changed**: Keep PRs under 500 lines of code (additions + deletions)
- **Files changed**: Keep PRs under 10 code files
- **Single responsibility**: Each PR should do one thing well

**Note**: These limits apply to code files only. Non-code files like documentation (README.md, CHANGELOG.md), lock files (yarn.lock, package-lock.json), and auto-generated files are excluded from the count.

### How to Split Large Changes

When a task requires extensive changes, break it into multiple PRs:

1. **By layer**: Separate database/schema changes, backend logic, and frontend UI into different PRs
2. **By feature component**: Split a feature into its constituent parts (e.g., API endpoint PR, then UI PR, then integration PR)
3. **By refactor vs feature**: Do preparatory refactoring in a separate PR before adding new functionality
4. **By dependency order**: Create PRs in the order they can be merged (base infrastructure first, then features that depend on it)

### Examples of Good PR Splits

**Instead of one large "Add booking notifications" PR:**
- PR 1: Add notification preferences schema and migration
- PR 2: Add notification service and API endpoints
- PR 3: Add notification UI components
- PR 4: Integrate notifications into booking flow

**Instead of one large "Refactor calendar sync" PR:**
- PR 1: Extract calendar sync logic into dedicated service
- PR 2: Add new calendar provider abstraction
- PR 3: Migrate existing providers to new abstraction
- PR 4: Add new calendar provider support

### Benefits of Smaller PRs

- Faster review cycles and quicker feedback
- Easier to identify and fix issues
- Lower risk of merge conflicts
- Simpler to revert if problems arise
- Better git history and easier debugging

## Commands

See [agents/commands.md](agents/commands.md) for full reference. Key commands:

```bash
yarn type-check:ci --force                # Type check (always run before pushing)
yarn biome check --write .                # Lint and format
TZ=UTC yarn test                          # Run unit tests
yarn prisma generate                      # Regenerate types after schema changes
yarn workspace @calcom/trpc run build     # Rebuild tRPC after schema/router changes
```

## Boundaries

### Always do
- Run type check on changed files before committing
- Run relevant tests before pushing
- Use `select` in Prisma queries
- Update both `tr` and `en` translation files (`packages/i18n/locales/{tr,en}/common.json`)
- Follow conventional commits for PR titles
- Run Biome before pushing

### Ask first
- Adding new dependencies
- Schema changes to `packages/prisma/schema.prisma`
- Changes affecting multiple packages
- Deleting files
- Running full build or E2E suites

### Never do
- Commit secrets, API keys, or `.env` files
- Expose `credential.key` in any query
- Use `as any` type casting
- Force push or rebase shared branches
- Modify generated files directly

## Project Structure

```text
apps/web/                    # Main Next.js application (App Router & modules)
packages/prisma/             # PostgreSQL schema (schema.prisma) and migrations
packages/trpc/               # tRPC API layer (routers in server/routers/)
packages/ui/                 # Shared UI components (respect package.json exports)
packages/features/           # Framework-agnostic domain services & repositories
packages/sms/                # SMS lifecycle manager (SMSManager) and templates
packages/app-store/          # Calendar & third-party integrations (lean subset)
packages/lib/                # Lowest-level shared utilities (SMS transport, E.164, etc.)
packages/i18n/               # TR (default) and EN localization files
docs/                        # Platform architecture & runbooks (n8n-whatsapp-platform.md)
```

### Key files
- Routes: `apps/web/app/` (App Router)
- Route UI modules: `apps/web/modules/`
- Database schema: `packages/prisma/schema.prisma`
- tRPC routers: `packages/trpc/server/routers/`
- Translations: `packages/i18n/locales/tr/common.json` & `packages/i18n/locales/en/common.json`
- SMS & OTP utilities: `packages/lib/smsTransport.ts`, `packages/lib/sanitizeSmsText.ts`, `packages/lib/normalizePhoneNumber.ts`, `packages/features/auth/lib/phoneVerification.ts`
- WhatsApp platform guide: `docs/n8n-whatsapp-platform.md`
- Plan contact config: `packages/lib/planContactConfig.ts`
- Workflow constants: `packages/features/ee/workflows/lib/constants.ts`

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript (strict)
- **Database**: PostgreSQL with Prisma ORM
- **API**: tRPC for type-safe APIs
- **Auth & OTP**: NextAuth.js + Twilio Verify (`verifiedPhoneCache`)
- **Messaging**: WhatsApp (Evolution API + n8n platform webhooks) & SMS (Twilio / Netgsm, GSM 7-bit `<=160` chars)
- **DI Container**: `@evyweb/ioctopus`
- **Styling**: Tailwind CSS (dark-first `#141414` / `#121214`)
- **Testing**: Vitest (unit), Playwright (E2E)
- **i18n**: next-i18next (`tr` default, `en` secondary)

## Code Examples

### Good error handling

```typescript
// Good - Descriptive error with context (use ErrorWithCode in services/repositories)
import { ErrorWithCode } from "@calcom/lib/errors";

throw new ErrorWithCode(
  "NO_AVAILABLE_SLOTS",
  `Unable to create booking: User ${userId} has no available time slots for ${date}`
);

// Bad - Generic error
throw new Error("Booking failed");
```

For which error class to use (`ErrorWithCode` vs `TRPCError`) and concrete examples, see [quality-error-handling](agents/rules/quality-error-handling.md).

### Good Prisma query

```typescript
// Good - Use select for performance and security
const booking = await prisma.booking.findFirst({
  select: {
    id: true,
    title: true,
    user: {
      select: {
        id: true,
        name: true,
        email: true,
      }
    }
  }
});

// Bad - Include fetches all fields including sensitive ones
const booking = await prisma.booking.findFirst({
  include: { user: true }
});
```

### Good imports

```typescript
// Good - Type imports and exported subpath imports
import type { User } from "@prisma/client";
import { Button } from "@calcom/ui/components/button";
import { Logo } from "@calcom/ui/components/logo";

// Bad - Regular import for types, barrel imports, or unexported deep UI paths
import { User } from "@prisma/client";
import { Button } from "@calcom/ui";
import { Logo } from "@calcom/ui/components/logo/Logo"; // Breaks production build!
```

### API v2 Imports (apps/api/v2)

When importing from `@calcom/features` or `@calcom/trpc` into `apps/api/v2`, **do not import directly** because the API v2 app's `tsconfig.json` doesn't have path mappings for these modules, which causes "module not found" errors.

Instead, re-export from `packages/platform/libraries/index.ts` and import from `@calcom/platform-libraries`:

```typescript
// Step 1: In packages/platform/libraries/index.ts, add the export
export { ProfileRepository } from "@calcom/features/profile/repositories/ProfileRepository";

// Step 2: In apps/api/v2, import from platform-libraries
import { ProfileRepository } from "@calcom/platform-libraries";

// Bad - Direct import causes module not found error in apps/api/v2
import { ProfileRepository } from "@calcom/features/profile/repositories/ProfileRepository";
```

## PR Checklist

- [ ] Title follows conventional commits: `feat(scope): description`
- [ ] Type check passes: `yarn type-check:ci --force`
- [ ] Lint passes: `yarn lint:fix` / `yarn biome check --write .`
- [ ] Relevant tests pass (`TZ=UTC yarn test`)
- [ ] Diff is small and focused (<500 lines, <10 files)
- [ ] No secrets or API keys committed
- [ ] UI strings added to both `tr` and `en` translation files (`packages/i18n/locales/{tr,en}/common.json`)
- [ ] Created as draft PR

## When Stuck

- Ask a clarifying question before making large speculative changes
- Propose a short plan for complex tasks
- Open a draft PR with notes if unsure about approach
- Fix type errors before test failures - they're often the root cause
- Run `yarn prisma generate` (and `yarn install` if `enum-generator.ts` fails), followed by `yarn workspace @calcom/trpc run build` if you see missing enum/type errors

## Spec-Driven Development (Opt-In)

For complex features, you can use spec-driven development when explicitly requested.

**To enable:** Tell the AI "use spec-driven development" or "follow the spec workflow"

See [SPEC-WORKFLOW.md](SPEC-WORKFLOW.md) for the full workflow documentation.

## Extended Documentation

For detailed information, see the `agents/` and `docs/` directories:

- **[agents/README.md](agents/README.md)** - Rules index and architecture overview
- **[agents/rules/](agents/rules/)** - Modular engineering rules
- **[agents/commands.md](agents/commands.md)** - Complete command reference
- **[agents/knowledge-base.md](agents/knowledge-base.md)** - Domain knowledge and business rules
- **[docs/n8n-whatsapp-platform.md](docs/n8n-whatsapp-platform.md)** - Platform webhook -> n8n -> Evolution API WhatsApp architecture & runbook
