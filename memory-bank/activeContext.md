# Active Context — rOndevu

## Current Focus
- Rebranding completed: Cal.diy / Cal.com → rOndevu
- 25+ files modified, 4 new SVG logo files created
- All user-facing Cal.diy references removed

## Recent Changes (this session)
1. **Logo Dark Mode Inversion Fix** — Assigned `LOGO = "/rondevu-logo-dark.svg"` (`#292929`) so Tailwind's `dark:invert` properly produces white text in dark mode on mobile and desktop.
2. **Logo Size & Clarity Enhancement** — Vectorized the "rOndevu" wordmark into exact SVG paths with tight bounding viewBox (`0.5 7.3 91.7 18.6`), eliminating 50%+ wasted vertical space. Increased default `Logo.tsx` sizing from `h-4/h-5` to `h-5/h-6 sm:h-7` so rendered text is ~3x larger and razor sharp.
3. **Login View Title Fix** — Replaced hardcoded `Cal.diy` in `apps/web/modules/auth/login-view.tsx` with `{APP_NAME}` (`rOndevu`).
4. **Additional Branding Cleanup** — Updated `refer/page.tsx`, `service-worker.js`, `verify-email-view.tsx`, `Embed.tsx`, and `oauth-provider.e2e.ts`.
5. **Favicon & Icon Exact Geometric Centering** — Recalculated bounding boxes for the "rOn" glyphs across all favicons, app icons (`android-chrome`, `apple-touch-icon`, `mstile`, `favicon-16/32/ico`, and SVG icons). Fixed the ~63.6px vertical baseline gap offset by translating the text path so that top margin equals bottom margin and left margin equals right margin with dead-center alignment.
6. **Default Language Set to Turkish (`tr`) & Translation Enhancement** —
   - Configured `i18n.json` (`source: "tr"`) and `packages/i18n/next-i18next.config.js` (`defaultLocale: "tr"`, fallback: `["tr", "en"]`).
   - Updated `getLocale.ts`, `getLocaleFromRequest.ts`, and `apps/web/app/layout.tsx` so all visitors and new users automatically start in Turkish by default, while preserving explicit cookie or token preferences.
   - Updated `UserRepository.ts` so newly created users have `locale: "tr"` in Postgres and their default schedule is created in Turkish ("Çalışma saatleri").
   - Updated `schema.prisma` default attendee locale to `"tr"`.
   - Added all 41 missing keys to `packages/i18n/locales/tr/common.json` (0 missing keys remaining out of 4,731).
   - Cleaned up 50+ legacy `Cal.diy` / `Cal.com` references in Turkish translations to `rOndevu`.
   - Refined home page, event-types dashboard, login, and navigation translations.
7. **Git Pushed** — Pushed clean commits to `origin/main`.
8. **Onboarding Plan Update** —
   - Replaced `$15/kullanıcı/ay` ($15/user/mo) with "Geliştirme aşamasında" ("Under development") in `tr/common.json` and `en/common.json`.
   - Disabled the "Ekibimle birlikte" (Team) plan in `apps/web/modules/onboarding/getting-started/onboarding-view.tsx` with `disabled: true`, styled as unselectable, reset store fallback, and prevented submission.
9. **Homepage & Pricing Section Added** —
   - Replaced `/` automatic redirect to `/auth/login` in `apps/web/app/page.tsx` with a dedicated minimal, modern `HomeView` (`apps/web/modules/home/home-view.tsx`).
   - Integrated top navigation with rOndevu logo and "Giriş Yap" button linked to `/auth/login` (or "Panele Git" if session exists).
   - Designed a minimal pricing section adhering to rOndevu design aesthetics:
     - Monthly: 1.000 ₺ / ay
     - Yearly: 10.000 ₺ / yıl (with 12.000 ₺ struck through, highlighting 2 months free and 2.000 ₺ savings).
   - Added `BackgroundGrid` consistent with the login view, feature highlights, and minimal footer.
   - Fixed login flow default redirect from `/` to `/event-types` so logged-in users go straight to their dashboard.
10. **Build Error Fix (`module-not-found`)** —
    - Resolved Next.js production build failure in Docker (`yarn --cwd apps/web workspace @calcom/web run build`).
    - Cause: `apps/web/modules/home/home-view.tsx` had an invalid deep import `@calcom/ui/components/logo/Logo`.
    - Fix: Changed import to `@calcom/ui/components/logo` to conform to `packages/ui/package.json` exports map.
11. **System Theme Persistence & Initial Dark Mode Support** —
    - Added synchronous blocking script in `apps/web/app/layout.tsx` to detect system prefers-color-scheme immediately before paint and apply `.dark`.
    - Configured `defaultTheme: "system"` in `getThemeProviderProps.ts`.
    - Moved homepage to `apps/web/app/(use-page-wrapper)/page.tsx` so `CalcomThemeProvider` wraps it.
12. **Homepage Simplification & Pricing Update** —
    - Updated pricing cards to 990 ₺/month and 9.900 ₺/year (11.880 ₺ struck through, 1.980 ₺ savings).
    - Reduced verbose lists to 3-4 clean, impactful bullets per plan.
    - Linked plan buttons to `/plan-bilgi?plan=monthly` and `/plan-bilgi?plan=yearly`.
13. **Framer-Motion Login Card Animation** —
    - Implemented smooth stagger entrance animation for card container and inputs in `apps/web/modules/auth/login-view.tsx`.
14. **Minimalist Plan Information & Contact Page (`/plan-bilgi`)** —
    - Created `apps/web/app/(use-page-wrapper)/plan-bilgi/page.tsx` and `plan-bilgi-view.tsx` with contact phone `0552 119 19 87` and email `y_ekta@icloud.com`.
15. **"Randevu" Terminology Update** —
    - Replaced 22 "toplantı/etkinlik planlandı" translation strings in `packages/i18n/locales/tr/common.json` with "Randevu".
16. **Email Turkish Default & Dark Mode Overhaul** —
    - Changed fallback locales in `buildCalEventFromBooking.ts`, `BookingEmailSmsHandler.ts`, `CalendarEventBuilder.ts`, `passwordResetRequest.ts`, `confirm.handler.ts` to `"tr"`.
    - Redesigned `BaseEmailHtml.tsx`, `V2BaseEmailHtml.tsx`, `EmailHead.tsx`, `Info.tsx`, `WhenInfo.tsx`, `WhoInfo.tsx`, `LocationInfo.tsx`, `ManageLink.tsx`, `CallToAction.tsx`, and `EmailBodyLogo.tsx` with dark theme (`#121214` outer background, `#1c1c1f` cards, `#2e2e34` borders, `#ffffff`/`#f4f4f5` text, `#a1a1aa` subtitles, white SVG logo).
17. **SMS Altyapısı & Admin Kontrol Menüsü (`/settings/admin/sms`)** —
    - Created `packages/sms/sms-transport.ts` supporting Twilio, Netgsm, Webhooks, and Simulation fallback.
    - Integrated dispatch into `packages/sms/sms-manager.ts`.
    - Added `getSMSConfig` and `sendTestSMS` tRPC endpoints in `viewer/admin`.
    - Built comprehensive SMS Control Menu in `apps/web/modules/settings/admin/sms-view.tsx` and route `/settings/admin/sms`.
    - Added "SMS Yönetimi" link to admin settings sidebar.
18. **Homepage Revamp & 12 Core Features Architecture** —
    - Replaced generic landing content with explicit title: *"Herkes için randevu altyapısı"*.
    - Built interactive `HeroBookingMockup` component directly simulating the booking flow (Tarih & Saat Seçimi ➔ Telefon/E-posta Doğrulama [OTP] ➔ Başarı Kartı & Google Meet) using 100% dummy data (`Dr. Zeynep Kaya`, `ahmet.yilmaz@ornek.com`), completely hiding real screenshot info.
    - Built `AdminFeatureCards` structuring the 12 core features into 4 operational blocks (Zaman & Müsaitlik Hakimiyeti, Güvenlik & No-Show Koruması, İletişim & Otomasyon, Özel Alan Adı & Birebir Destek) with dark-mode admin UI mockups.
    - Built `FaqSection` accordion directly answering 8 critical practical questions.
19. **Cal.diy Rebranding & Domain Normalization (`rondevu.org`)** —
    - System-wide replacement of all `rondevu.com.tr` references with official domain `rondevu.org`.
    - Cal.diy publisher replaced with rOndevu across all 98 app-store apps and license headers.
20. **Calendar Sync Clarification & Ofis Dışında Real UI Reproduction** —
    - Fixed SSS & Homepage calendar sync explanations: Appointments booked on rOndevu are automatically exported to Google/Apple calendar; external personal calendar events do NOT block rOndevu availability slots.
    - Revamped "Ofis Dışında" module in `AdminFeatureCards` to authentically reproduce user screenshots (`interface/`): includes list view, search & filters, dummy values (`Kongre Katılımı & Yıllık İzin`) replacing test text, interactive Danışan Rezervasyon Görünümü (date 25 with 🤕), and "Ofis Dışında Ol" modal overlay.
    - Eliminated raw "OOO" acronym throughout Turkish (`İzinlerim`, `Ofis Dışı`, `Ekip İzinleri`) and English locales.
    - Fixed "Tatil günleri" tab crash: `GoogleCalendarClient` no longer throws when `GOOGLE_CALENDAR_API_KEY` is missing and provides built-in offline Turkish public holidays fallback.
21. **Configurable Plan Contact Info & Admin Security Control** —
    - Created `packages/lib/planContactConfig.ts` with database storage (`Deployment.theme.planContact`) and file backup.
    - Created `publicViewer.getPlanContact` query and `viewer.admin.updatePlanContact` mutation guarded by `authedAdminProcedure` with strict Zod validation.
    - Built Admin Management page `/settings/admin/plan-contact` (`plan-contact-view.tsx`) with sanitized link generation (`tel:`, `wa.me`, `mailto:`) preventing XSS/injection.
    - Made `/plan-bilgi` contact details dynamic with real-time backend synchronization.
22. **Production Deployment Readiness & Security Audit Verification** —
    - Audited all modified and added files for secrets, tokens, API keys, and credential leakage: 0 leaked secrets found.
    - Verified strict role-based access control (`authedAdminProcedure`) for admin operations and read-only schema for public contact query.
    - Sanitized all dynamic links (`tel:`, `https://wa.me/`, `mailto:`) with `encodeURIComponent` and digit-only sanitizers to prevent XSS / malicious URL protocol injections.
    - Added `interface/` screenshot files and runtime backup `plan-contact-config.json` to `.gitignore`.
    - Biome lint and formatting checks passed with 0 errors.
    - tRPC server and client type checks verified (`build:server` and `build:react` compile with 0 errors).
23. **User Feedback Implementation (Homepage Polish, Exact Mockup Fidelity, SMS Infrastructure Fixes)** —
    - **Admin Plan İletişim Bilgileri Homepage Sync**: Dynamically synchronized homepage (`/`) with `/settings/admin/plan-contact` via `trpc.publicViewer.getPlanContact`. Added live phone, WhatsApp, and email buttons in Block 4 of `AdminFeatureCards` and in a dedicated consultation bar right below the pricing cards on `home-view.tsx`, plus dynamic contact email in the footer.
    - **Hero Step 3 Exact Screenshot Fidelity**: Restored Step 3 confirmation card in `HeroBookingMockup.tsx` to match `Screenshot 2026-09-25 at 16-57-09` with top navigation `< Rezervasyonlara dön`, `Host` badge, and 4 authentic square calendar buttons (Google `G`, Microsoft Outlook, Microsoft 365, Apple Calendar `.ics`).
    - **Monochrome Design Aesthetic Restored**: Toned down loud accent colors across homepage components (`HeroBookingMockup`, `AdminFeatureCards` Blocks 1-4, `home-view`, and `FaqSection`), adopting Cal/rOndevu's minimalist monochromatic tokens (`bg-default`, `border-subtle`, `bg-muted/20`, `text-emphasis`, `text-subtle`).
    - **Block 2 Layout & Spacing Overhaul**: Expanded container padding to `p-6 sm:p-8 space-y-6`, created a wide, comfortable segmented switcher control for "Randevular & No-Show" vs "Ofis Dışında", and cleanly decoupled the client preview ("Danışan randevu ekranı önizlemesi") into its own spacious, distinct card with clear border divider.
    - **Phone OTP Verification & Cancellation SMS Fix**:
      - Implemented SMS OTP dispatch in `sendEmailVerificationByCode` when `isSmsCalEmail(email)` is detected.
      - Updated `useBookingForm.ts` to construct phone-email fallback so phone-only bookings trigger the Booker verification dialog.
      - Updated `VerifyCodeDialog.tsx` to show "Telefon Numaranızı Doğrulayın".
      - Fixed `handleCancelBooking.ts` and `event-cancelled-sms.ts` so organizers cancelling bookings triggers Turkish cancellation SMS to attendee phone numbers.
    - **FAQ Calendar Answer Simplified**: Updated Question 5 in `FaqSection.tsx` to concisely state that bookings are automatically exported to Google Takvim and Apple Calendar.
24. **Docker Deploy Build Fix (`TS2307: Cannot find module '@calcom/sms/sms-manager'`)** —
    - Resolved Docker build step `RUN yarn workspace @calcom/trpc run build` failure.
    - Cause: `packages/features/auth/lib/verifyEmail.ts` was importing `@calcom/sms/sms-manager`, which was not a mapped workspace package in the yarn monorepo.
    - Fix: Updated line 117 to `await import("@calcom/lib/smsTransport")` where `sendSMS` is exported from the official `@calcom/lib` package.
    - Verified: `yarn workspace @calcom/trpc run build` completed successfully (exit code 0).
25. **SMS Verification & Notification Infrastructure Overhaul** —
    - Fixed phone-constructed email normalization in `packages/lib/contructEmailFromPhoneNumber.ts` to strictly strip non-digits (`\D/g`), eliminating space-induced format exceptions (`90 552 ...` -> `905521191987@sms.rondevu.org`).
    - Fixed phone number normalization in `packages/lib/smsTransport.ts` for Twilio and Netgsm, eliminating spaces in `normalizePhoneNumber`.
    - Fixed `sendEmailVerificationByCode` in `packages/features/auth/lib/verifyEmail.ts`: checks `isSmsCalEmail(email)` first to bypass email watchlist checks, generates TOTP, sends SMS OTP, and triggers verify modal without crashing.
    - Fixed `RegularBookingService.ts`: validates verification code against `effectiveBookerEmail` (`bookerEmail || contructEmailFromPhoneNumber(bookerPhoneNumber)`), prevents crash on empty booker email, and saves attendee email/phone properly in database.
    - Fixed `getBookingData.ts` to support both `responses.attendeePhoneNumber` and `responses.phone`.
    - Fixed `email-manager.ts`: filters out `@sms.rondevu.org` pseudo-emails from SMTP queues, decouples SMS dispatch via `Promise.allSettled` and isolated try/catch so SMTP errors never block SMS notifications.
    - Fixed `event-scheduled-sms.ts` and `event-rescheduled-sms.ts` with crash-proof Turkish default messages and multi-locale fallback.
    - Created `packages/sms/package.json` declaring `@calcom/sms` as a monorepo workspace package.
    - Updated `BookEventForm.tsx` to display "Telefonu Doğrula" when verifying phone number.
    - Updated `EventAdvancedTab.tsx` so `requiresBookerEmailVerification` toggle title/description dynamically changes to "Telefon (SMS) Doğrulaması" when "Phone" confirmation is active.
    - All 8 SMSManager unit tests passed and lifecycle notifications verified.
26. **Plan Contact Information Sync & Admin Management Overhaul** —
    - Fixed tRPC path mismatch: updated client queries from non-existent `trpc.publicViewer` to `trpc.viewer.public.getPlanContact`.
    - Added global React Query cache invalidation in `plan-contact-view.tsx` on mutation success: invalidates both `utils.viewer.admin.getPlanContact` and `utils.viewer.public.getPlanContact` so any active view or route transition immediately accesses the fresh contact info.
    - Updated TanStack Query mutation loading property in `plan-contact-view.tsx` to `updateMutation.isPending`.
    - Added "Varsayılana Sıfırla" (Reset to Defaults) one-click button in admin view with confirmation dialog.
    - Integrated Server-Side Rendering (SSR) in `apps/web/app/(use-page-wrapper)/page.tsx` and `plan-bilgi/page.tsx`: pre-fetches `getPlanContactConfig()` and passes `initialContact` to `HomeView` and `PlanBilgiView` to eliminate initial default flash and seed React Query's `initialData`.
    - Synchronized `AdminFeatureCards.tsx` with `HomeView`: passes `contactConfig` prop down so all contact touchpoints on `/` (Consultation Bar, Feature Card 4, and Footer) are 100% unified.
    - Added Next.js route revalidation in `updatePlanContact.handler.ts` (`revalidatePath("/")`, `revalidatePath("/plan-bilgi")`).
    - Overhauled `packages/lib/planContactConfig.ts` with named Prisma client import (`import { prisma } from "@calcom/prisma"`), multi-path directory resolution for JSON backups (`apps/web`, root, cwd), resilient `Deployment.theme` parsing, and non-blocking database fallback.
    - Verified all 5 test scenarios in `test_plan_contact_sync.ts` and confirmed zero TypeScript errors on changed files.
27. **Homepage Terminology, "Tek Fiyata Premium Erişim" & Mobile Booking Flow Overhaul** —
    - **Hero Title Alignment**: Updated the main headline on `/` (`home-view.tsx`) from *"Herkes için randevu altyapısı"* to *"Herkes için randevu sistemi"*, and aligned `site.webmanifest`.
    - **"Tek Fiyata Premium Erişim" Vurgusu**:
      - Added a prominent badge and header above the 12 features in `home-view.tsx` clarifying that all advanced features are available without tiered plan locks or artificial barriers.
      - Overhauled the pricing section header, badges, and card copies on `home-view.tsx` and `plan-bilgi-view.tsx`: emphasizes that there are no different tiered packages or access restrictions, both monthly (990 ₺) and yearly (9.900 ₺) options include 100% of all features without limits.
      - Updated FAQ Question 8 in `FaqSection.tsx` to explicitly explain that single-price premium access is standard and zero commissions or hidden fees exist.
    - **Mobile Booking Flow Responsive Overhaul (`HeroBookingMockup.tsx`)**:
      - Resolved `doktorzeynep.com` URL slipping down: restructured browser top bar into a 2-tier responsive layout with a dedicated truncated URL pill and mac traffic dots that never break or wrap onto multiple lines.
      - Transformed step switcher on mobile into a clean 3-column equal grid with concise responsive labels (`1. Tarih`, `2. Form`, `3. Onay`) that fit all screen widths (down to 320px) without overflow.
      - Resolved cramped layout in Step 1: added dividers on mobile between service details and calendar, converted calendar days into uniform `h-8 sm:h-9` square touch targets, and placed available time slots side-by-side in a 3-column row on mobile (`grid grid-cols-3 gap-2 lg:grid-cols-1`) so users do not have to endlessly scroll.
      - Refined Step 2 and Step 3 on mobile with comfortable input padding, responsive summary table layout, and wrapping calendar icons.
28. **Phone Verification Gate & Provider-Agnostic SMS Lifecycle Overhaul** —
    - **Twilio Architecture & Dokploy Compatibility**:
      - Separated OTP phone verification (Twilio Verify v2 API with `TWILIO_VERIFY_SID`) from transactional notifications (Twilio Programmable Messaging API with `TWILIO_MESSAGING_SID` / `TWILIO_PHONE_NUMBER`).
      - Supported both `TWILIO_SID || TWILIO_ACCOUNT_SID` and `TWILIO_TOKEN || TWILIO_AUTH_TOKEN` in `smsTransport.ts` and `phoneVerification.ts` for direct compatibility with Dokploy env vars.
    - **Provider-Agnostic SMS Layer**:
      - Built `packages/lib/sms/types.ts` defining `ISmsProvider`, `SMSPayload`, and `SMSResponse`.
      - Refactored `packages/lib/smsTransport.ts` into a decoupled adapter pattern (`TwilioSmsProvider`, `NetgsmSmsProvider`, `WebhookSmsProvider`, `SimulationSmsProvider`) with factory instantiation.
    - **Mandatory Phone Verification Gate**:
      - Fixed `FormBuilder.tsx` to automatically set `requiresBookerEmailVerification: true` when switching confirmation to `"phone"`.
      - Locked the verification toggle to checked in `EventAdvancedTab.tsx` when `isPhoneConfirmation` is active.
      - Fixed `useVerifyEmail.ts` so `renderConfirmNotVerifyEmailButtonCond` does not bypass OTP for phone bookings until validated.
      - Fixed `RegularBookingService.ts`: backend strictly enforces that `verificationCode` is provided and validated when `eventType.requiresBookerEmailVerification || isPhoneOnlyEvent || isPhoneBooking`.
      - Integrated Twilio Verify API in `phoneVerification.ts` (`/Verifications` and `/VerificationCheck`) with TOTP fallback.
    - **Complete End-to-End SMS Lifecycle**:
      - Removed artificial constraint in `sms-manager.ts` (`isSmsCalEmail(attendee.email)`): transactional SMS (confirmation, rescheduling, cancellation) is now delivered to any attendee with a valid phone number.
      - Implemented `EventReminderSMS` (`packages/sms/attendee/event-reminder-sms.ts`).
      - Implemented Tasker `sendSms` handler in `packages/features/tasker/tasks/sendSms.ts` and registered it in `tasks/index.ts`.
      - Created `scheduleReminderSmsTrigger.ts` in booking creation pipeline to enqueue reminders 24h or 2h prior to booking start time.
      - Added cancellation cleanup in `handleCancelBooking.ts` via `tasker.cancelWithReference(booking.uid, "sendSms")`.
      - Updated SMS unit tests in `packages/sms/test/sms-manager.test.ts` (all 8 tests passing).

## What Was NOT Changed (by design)
- `@calcom/*` package namespace — internal implementation detail, changing would break 1000s of imports
- App store config.json files — 3rd party integration descriptions, non-critical
- Test mock data with cal.com URLs — non-functional
- README.md — needs full rewrite for rOndevu

## Next Steps
- Push changes to remote repository (`origin/main`).
- On Dokploy server deployment: Ensure `TWILIO_SID`, `TWILIO_TOKEN`, `TWILIO_PHONE_NUMBER`, `TWILIO_MESSAGING_SID`, `TWILIO_VERIFY_SID` are active, and restart the containers.

## Brand Asset Details
- Wordmark SVGs (`cal-logo-word*.svg`, `rondevu-logo-*.svg`): Scaled to fit original 84x26 box dimensions with 17px font, avoiding layout overflow.
- Favicon & App Icons (`apple-touch-icon.png`, `android-chrome-*.png`, `favicon-*.png`, `favicon.ico`): Rendered in Cal Sans font, exact original dark rounded-rectangle gradient, silver metallic bevel, and "rOn" lettering with no red accent.
- Windows Metro Tiles (`mstile-*.png`): Pure black background with centered white "rOn".
- Safari Pinned Tab (`safari-pinned-tab.svg`): Exact vector glyph paths of "rOn" centered in 700x700 viewBox.
- Email Header Logos (`logo.png`, `CalLogo@2x.png`): "rOndevu" wordmark in dark #292929 matching original transparent header dimensions.
