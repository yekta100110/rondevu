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
