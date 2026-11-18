# Spec-First Development — rOndevu

This folder contains design and implementation documents for **rOndevu** features in development. Agents read these alongside `memory-bank/` to understand what to build, maintain architectural consistency, and track progress.

## How It Works

1. **Before implementing a feature**, create a spec folder from `specs/_templates`
2. **Read the design and `memory-bank/` context** before writing any code
3. **Track progress** in `implementation.md` for session continuity
4. **Record architectural decisions** in `decisions.md`
5. **Document operational or UI flows** in `docs/` when the feature is complete

## Starting a New Feature

```bash
cp -r specs/_templates specs/{feature-name}
```

Then fill in `specs/{feature-name}/design.md` with the problem statement, architectural boundaries, and verification plan.

## File Structure

Each feature spec contains:

| File/Folder | Purpose |
|-------------|---------|
| `AGENTS.md` / `CLAUDE.md` | Agent instructions when working on this feature |
| `design.md` | Source of truth — what to build and how |
| `implementation.md` | Progress tracking — done, in progress, blocked |
| `decisions.md` | Architecture Decision Records (ADRs) |
| `prompts.md` | Reusable prompts for common tasks |
| `future-work.md` | Deferred ideas and enhancements |
| `docs/` | Internal feature documentation and operational runbooks |
| `docs/screenshots/` | Screenshots captured during verification |

## Session Continuity

When resuming work on a feature:
- Read `specs/{feature}/design.md` and `specs/{feature}/implementation.md`
- Cross-check system-wide patterns in `memory-bank/systemPatterns.md` and `memory-bank/techContext.md`

## Documentation

When a feature requires operational or technical documentation:
1. Capture key UI states in `specs/{feature}/docs/screenshots/` if applicable
2. Update `specs/{feature}/docs/README.md` or add a runbook under `docs/` (e.g., `docs/n8n-whatsapp-platform.md`)

## Change Discipline

Keep changes focused and verifiable:
- Align with rOndevu's **De-Rondevu'ification** and modular Venture Studio architecture
- Avoid introducing unused `app-store` or enterprise bloat
- Validate with `yarn biome check`, `Vitest`, and TypeScript checks before marking complete
