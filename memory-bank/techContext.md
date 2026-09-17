# Tech Context — rOndevu

## Tech Stack
- **Framework**: Next.js 13+ (App Router + Pages Router hybrid)
- **Language**: TypeScript 5.9 (strict mode)
- **Database**: PostgreSQL + Prisma ORM (schema: 2852 lines)
- **API**: tRPC (type-safe) + NestJS REST API v2
- **Auth**: NextAuth.js
- **Styling**: Tailwind CSS
- **Monorepo**: Yarn 4.12 Workspaces + Turborepo
- **Testing**: Vitest (unit), Playwright (E2E)
- **i18n**: next-i18next
- **Video**: Daily.co
- **Linter/Formatter**: Biome 2.3
- **Package Manager**: Yarn 4.12

## Monorepo Structure
- `apps/web` — Main Next.js application
- `apps/api/v2` — NestJS REST API
- `apps/docs` — Documentation
- `packages/prisma` — Database schema and migrations
- `packages/trpc` — tRPC server routers
- `packages/ui` — Shared UI components
- `packages/features` — 61 feature modules (business logic)
- `packages/lib` — 154+ shared utilities
- `packages/app-store` — Third-party integrations
- `packages/i18n` — Translation files
- `packages/emails` — Email templates
- `packages/embeds` — Embed components
- `packages/platform` — Platform abstraction layer

## Key Commands
- `yarn dev` — Start dev server
- `yarn build` — Production build
- `yarn type-check:ci --force` — Type check
- `yarn biome check --write .` — Lint and format
- `TZ=UTC yarn test` — Run unit tests
- `yarn prisma generate` — Regenerate types
- `yarn prisma studio` — Database GUI

## Development Notes
- TypeScript and ESLint build errors are currently ignored in next.config
- The project uses both App Router and Pages Router (migration in progress)
- Prisma generates: Client types, Zod types, Kysely types, Enum types
