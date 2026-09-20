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

## What Was NOT Changed (by design)
- `@calcom/*` package namespace — internal implementation detail, changing would break 1000s of imports
- App store config.json files — 3rd party integration descriptions, non-critical
- Test mock data with cal.com URLs — non-functional
- README.md — needs full rewrite for rOndevu

## Next Steps
- Write a new README.md for rOndevu (Turkish)
- Set up `.env` from `.env.example`
- Set up PostgreSQL and run migrations
- Verify build works (`yarn build`)
- Optionally batch-update app-store config descriptions

## Brand Asset Details
- Wordmark SVGs (`cal-logo-word*.svg`, `rondevu-logo-*.svg`): Scaled to fit original 84x26 box dimensions with 17px font, avoiding layout overflow.
- Favicon & App Icons (`apple-touch-icon.png`, `android-chrome-*.png`, `favicon-*.png`, `favicon.ico`): Rendered in Cal Sans font, exact original dark rounded-rectangle gradient, silver metallic bevel, and "rOn" lettering with no red accent.
- Windows Metro Tiles (`mstile-*.png`): Pure black background with centered white "rOn".
- Safari Pinned Tab (`safari-pinned-tab.svg`): Exact vector glyph paths of "rOn" centered in 700x700 viewBox.
- Email Header Logos (`logo.png`, `CalLogo@2x.png`): "rOndevu" wordmark in dark #292929 matching original transparent header dimensions.
