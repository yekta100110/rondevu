# System Patterns — rOndevu

## Architecture
- **Monorepo**: Yarn 4 Workspaces + Turborepo for build orchestration
- **Frontend**: Next.js with App Router (newer pages) + Pages Router (legacy)
- **API Layer**: Dual — tRPC for internal type-safe calls, NestJS REST for external v2 API
- **Database**: PostgreSQL via Prisma ORM with Zod validation layer

## Key Design Patterns

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
- API v2 re-exports through `@calcom/platform-libraries`

### Error Handling
- `TRPCError` in tRPC routers only
- `ErrorWithCode` everywhere else
- Descriptive error messages with context

### Database Pattern
- Always use `select` over `include` in Prisma queries
- Never expose `credential.key` in API responses
- Run `yarn prisma generate` after schema changes

## Component Relationships
- `apps/web` → consumes `packages/trpc`, `packages/ui`, `packages/features`, `packages/lib`
- `apps/api/v2` → consumes `packages/platform` (which re-exports from features/trpc)
- `packages/features` → consumes `packages/prisma`, `packages/lib`
- `packages/trpc` → consumes `packages/prisma`, `packages/features`
