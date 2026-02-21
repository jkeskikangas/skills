# Example Output

Reference example of a completed AGENTS.md for a Next.js + Prisma application.

```markdown
# AGENTS.md
<!-- agents-md-version: 1 -->

## CRITICAL

- MUST: `pnpm` for all package operations
- MUST: `pnpm lint` before commit
- MUST: `pnpm test` before PR
- MUST: Use `pnpm add`/`pnpm remove` to change deps (DO NOT edit package.json manually)
- NEVER: `npm`, `yarn`, `bun`
- NEVER: Skip pre-commit hooks (--no-verify)
- NEVER: Edit generated files in `src/generated/prisma/`
- PREFER: Built-in tools (file reader, editor, glob, grep) over shell equivalents
- ON FAIL: Read full error output before retry. Check Env for missing deps.
- ON FAIL (test): Run single test file first: `pnpm vitest run src/path/to/file.test.ts`

## Domain & Context

- Goal: SaaS dashboard for team analytics
- Type: Application
- License: MIT
- Key Terms:
  - `Workspace`: Top-level tenant, owns projects and members
  - `Metric`: Time-series data point collected from integrations

## Data & State

- Source of Truth: `prisma/schema.prisma`
- Database: PostgreSQL
- ORM/Driver: Prisma
- Migrations: `pnpm prisma migrate dev`
- Seeding: `pnpm prisma db seed`

## Execution Context

- Run on: Host
- Prefix: N/A
- Deploys to: Vercel

## Commands

```bash
# install
pnpm install                   # ON FAIL: rm -rf node_modules && pnpm install
# dev
pnpm dev
# test:unit
pnpm vitest run                # ON FAIL: pnpm vitest run src/path/to/failing.test.ts
# test:e2e
pnpm playwright test           # ON FAIL: pnpm playwright test --ui for debugging
# lint
pnpm lint                      # ON FAIL: pnpm lint --fix && pnpm lint
# format
pnpm prettier --write .        # ON FAIL: check prettier config for parser errors
# db:migrate
pnpm prisma migrate dev        # ON FAIL: pnpm prisma migrate reset (WARNING: drops data)
# db:seed
pnpm prisma db seed            # ON FAIL: check prisma/seed.ts for errors
# build
pnpm build                     # ON FAIL: check output for type errors
```

## Structure

```
src/app/         # Next.js app router pages
src/components/  # React UI components
src/lib/         # Shared utilities and config
src/server/      # Server-side logic and API
prisma/          # Schema and migrations
tests/           # Playwright E2E tests
```

## Patterns

- **Module:** ESM (`import`/`export`)
- **Async:** async/await
- **Naming:** kebab-case files, PascalCase components, camelCase functions
- App Router: `src/app/` with nested layouts and `page.tsx` / `layout.tsx`
- Server Components: default; `'use client'` only for interactive UI
- Server Actions: `'use server'` functions for mutations
- Data fetching: Prisma queries in server components / API routes
- Validation: Zod schemas shared between client and server

## Testing Strategy

- Runner: Vitest (unit), Playwright (E2E)
- Fixtures: `tests/fixtures/` + Prisma factories
- Separation: Unit in `**/*.test.ts`, E2E in `tests/`
- Coverage: 80% (Vitest)
- Conventions: Arrange-Act-Assert, mock external APIs with msw

## Security

- NEVER read/write: `.env`, `.env.local`, `*.pem`
- NEVER log/commit: `DATABASE_URL`, `NEXTAUTH_SECRET`, API keys
- Secrets via: environment variables (Vercel)

## Env

- Node: 20 (`.nvmrc`)
- pnpm: 9.x (`packageManager` in `package.json`)

```bash
# Required vars
DATABASE_URL=<PostgreSQL connection string>
NEXTAUTH_SECRET=<from secrets manager>
NEXTAUTH_URL=http://localhost:3000
# Local setup
cp .env.example .env.local
pnpm install
pnpm prisma migrate dev
```

## Git

- Branch: `feat/`, `fix/`, `chore/`
- Commit: Conventional Commits
- Hooks: lint-staged (ESLint + Prettier) via Husky
- PR: Require passing CI + 1 approval
```
