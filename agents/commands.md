# rOndevu Build, Test & Development Commands

## Development Commands

- `yarn dev` - Start development server for web app
- `yarn dev:all` - Start web, website, and console apps
- `yarn dev:api` - Start web app with API proxy and API
- `yarn dev:console` - Start web app with console
- `yarn dx` - Start development with database setup

## Build Commands

- `yarn build` - Build all packages and apps
- `yarn workspace @rondevu/trpc run build` - Build tRPC workspace (run after modifying tRPC routers/procedures)
- `yarn prisma generate` - Regenerate Prisma client and TypeScript types after schema updates
- `yarn build:ai` - Build AI package specifically
- `yarn clean` - Remove build artifacts (node_modules, .next, .turbo, dist)

## Lint & Type Check

- `yarn biome check --write <path>` - Run targeted Biome lint & format check/fix on specific file(s)
- `yarn lint` - Run Biome across the codebase
- `yarn lint:fix` - Run Biome and apply safe fixes
- `yarn lint:report` - Generate Biome lint report
- `yarn type-check` - Run TypeScript type checking
- `yarn type-check:ci --force` - Run full CI TypeScript type checking (bypasses Turbo cache; run before tests)
- `yarn format` - Format code with Biome

## Testing Commands

### Unit Tests

- `TZ=UTC yarn vitest run <path>` - Run unit tests for a specific file in UTC timezone (recommended targeted verification)
- `TZ=UTC yarn test` - Run unit tests (vitest) with consistent UTC timezone
- `yarn test <filename>` - Run tests for specific file
- `yarn test <filename> -t "<testName>"` - Run specific test by name for specific file
- `yarn tdd` - Run tests in watch mode
- `yarn test:ui` - Run tests with UI interface

### Integration Tests

- `TZ=UTC VITEST_MODE=integration yarn test` - Run integration tests (vitest)
- `TZ=UTC VITEST_MODE=integration yarn test <filename>` - Run integration tests for specific file
- `TZ=UTC VITEST_MODE=integration yarn test <filename> -t "<testName>"` - Run specific integration test by name for specific file


### End-to-End Tests

- `yarn e2e` - Run end-to-end tests (Playwright)
- `yarn e2e <filename>` - Run E2E tests for specific file
- `yarn e2e <filename> --grep "<testName>"` - Run specific E2E test by name
- `yarn e2e:app-store` - Run app store E2E tests
- `yarn e2e:embed` - Run embed E2E tests
- `yarn test-e2e` - Run database seed + E2E tests

## Database Commands

- `yarn prisma` - Run Prisma CLI commands
- `yarn prisma generate` - Generate Prisma Client and enum types
- `yarn db-seed` - Seed database with test data
- `yarn db-deploy` - Deploy database migrations
- `yarn db-studio` - Open Prisma Studio
- `psql "postgresql://postgres:@localhost:5432/rondevu"` - Connect to local PostgreSQL database

## App Store Commands

- `yarn create-app` - Create new app store integration
- `yarn edit-app` - Edit existing app
- `yarn delete-app` - Delete app
- `yarn app-store:build` - Build app store
- `yarn app-store:watch` - Watch app store for changes

## Useful Development Patterns

### Targeted Verification & Build Workflow

```bash
# 1. Regenerate Prisma types (if schema changed) and build tRPC (if routers changed)
yarn prisma generate
yarn workspace @rondevu/trpc run build

# 2. Targeted lint and format fix on changed files
yarn biome check --write packages/lib/some-file.ts

# 3. Full CI type-check before running tests
yarn type-check:ci --force

# 4. Unit test specific file (always use TZ=UTC)
TZ=UTC yarn vitest run packages/lib/some-file.test.ts

# Integration test specific file
TZ=UTC VITEST_MODE=integration yarn test routing-form-response-denormalized.integration-test.ts

# E2E test specific file
yarn e2e tests/booking-flow.e2e.ts

# Run specific test by name
yarn e2e tests/booking-flow.e2e.ts --grep "should create booking"
```

### Environment Setup

- Copy `.env.example` to `.env` and configure
- Copy `.env.appStore.example` to `.env.appStore` for app store development
- Run `yarn dx` for initial development setup with database
