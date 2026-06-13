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
- NEVER: Force push (`git push --force`, `git push -f`) to shared branches
- NEVER: Skip pre-commit hooks (--no-verify)
- NEVER: Commit or read secrets (`.env.local`, `DATABASE_URL`, `NEXTAUTH_SECRET`)
- NEVER: Edit generated files in `src/generated/prisma/`
- NEVER: run `pnpm prisma migrate reset` outside local dev (drops all data)
- NEVER: deploy from local (`vercel --prod`) -- deploy via Git push to Vercel only
- PREFER: Built-in tools (file reader, editor, glob, grep) over shell equivalents
- ON FAIL: Read full error output before retry. Check Env for missing deps.
- ON FAIL (lint): `pnpm lint --fix && pnpm lint`. Fix remaining errors manually.
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
- Migrations: `prisma/migrations/` (commands in Commands)
- Seeding: `prisma/seed.ts` (commands in Commands)
- Codegen: `pnpm prisma generate` -> `src/generated/prisma/` (generated -- do not edit)

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
# test
pnpm test                      # ON FAIL: pnpm vitest run src/path/to/failing.test.ts
# test:e2e
pnpm playwright test           # ON FAIL: pnpm playwright test --ui for debugging
# lint
pnpm lint                      # ON FAIL: pnpm lint --fix && pnpm lint
# format
pnpm prettier --write .        # ON FAIL: check prettier config for parser errors
# db:migrate
pnpm prisma migrate dev        # ON FAIL: inspect the failed migration; resolve drift with `pnpm prisma migrate resolve`
# db:seed
pnpm prisma db seed            # ON FAIL: check prisma/seed.ts for errors
# build
pnpm build                     # ON FAIL: check output for type errors
```

## Structure

```
src/app/              # Next.js app router pages
src/components/       # React UI components
src/lib/              # Shared utilities and config
src/server/           # Server-side logic and API
src/generated/prisma/ # Prisma client (generated -- do not edit)
prisma/               # Schema and migrations
tests/                # Playwright E2E tests
.next/                # Build output (generated -- do not edit)
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
- CI secrets: GitHub Actions secrets

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
- Commit: `<type>(<scope>): <subject>` -- types: `feat`, `fix`, `chore`, `docs` (e.g., `feat(auth): add SSO`)
- Hooks: lint-staged (ESLint + Prettier) via Husky
- PR: Require passing CI + 1 approval

## CI

- Runs: lint, test:unit, test:e2e, build, type-check
- Required checks: all green for merge
- Artifacts: Playwright report
```
