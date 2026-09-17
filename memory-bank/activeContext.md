# Active Context — rOndevu

## Current Focus
- Rebranding completed: Cal.diy / Cal.com → rOndevu
- 25+ files modified, 4 new SVG logo files created
- All user-facing Cal.diy references removed

## Recent Changes (this session)
1. **constants.ts** — APP_NAME, COMPANY_NAME, URLs, logos all updated to rOndevu
2. **SEO/Meta** — Twitter handles @calcom → @rondevu in layout.tsx and next-seo.config.ts
3. **New Logo SVGs** — rondevu-logo-dark.svg, rondevu-logo-white.svg, rondevu-icon.svg, rondevu-icon-white.svg
4. **UI Components** — Credits, OAuth, Video views updated with new logo refs
5. **Platform Atoms** — Removed hardcoded app.cal.com URLs
6. **Business Logic** — SMS email domain, getCalcomUrl, webhook docs all updated
7. **DevOps** — Dockerfile, docker-compose.yml, checkly config renamed
8. **Security** — SECURITY.md translated to Turkish with rOndevu branding
9. **Config** — package.json, app.json, checkly.config.ts renamed

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
