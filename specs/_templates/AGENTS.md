# AGENTS.md — rOndevu: {Feature Name}

## Project Context

{Brief description of what this rOndevu feature does and how it fits into the vertical SaaS / Venture Studio architecture}

## Before Starting Work

1. Read `memory-bank/projectbrief.md` and `memory-bank/systemPatterns.md`
2. Read `specs/{feature}/design.md`
3. Check `specs/{feature}/implementation.md` for current progress
4. Review existing implementations in `{relevant directories}`

## rOndevu Code Patterns

- Follow Repository/Service separation (`packages/features/`) and tRPC router conventions (`packages/trpc/`)
- Use `select` over `include` in Prisma queries; never expose `credential.key`
- Keep SMS templates GSM 7-bit compliant (`<= 160` chars via `sanitizeSmsText.ts`) and support phone-only attendees (`<digits>@sms.rondevu.org`) where relevant
- Default to natural Turkish (`tr`) terminology (`Randevu`, `İzinlerim`, `Katılmadı`) alongside English (`en`) i18n parity
- {Feature-specific patterns}

## Don't

- Don't add features outside `design.md`
- Don't reintroduce rOndevu / rOndevu enterprise, organization, or unused `app-store` bloat
- Don't skip unit tests or Biome / TypeScript verification
- {Feature-specific don'ts}
