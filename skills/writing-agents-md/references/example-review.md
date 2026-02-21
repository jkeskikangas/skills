# Example Review

Review of the Next.js + Prisma AGENTS.md example from `references/example-output.md`. This demonstrates the review output format with realistic scores and findings.

```markdown
# AGENTS.md Review

## Overall Grade: B (4.0/5.0)

## Dimension Scores

| Dimension | Score | Notes |
|-----------|-------|-------|
| Critical Rules & Guardrails | 4.5/5 | Strong MUST/NEVER/ON FAIL coverage; minor gap in force-push rule |
| Codebase Context & Domain | 4.5/5 | Clear goal, type, terms; missing architecture note |
| Structure & Navigation | 4/5 | All dirs annotated; no generated dir markers |
| Commands & Workflows | 4.5/5 | Full command set with ON FAIL; all copy-pasteable |
| Code Conventions & Patterns | 4/5 | Module/Async/Naming present; framework patterns well documented |
| Git & CI/CD Workflow | 3/5 | Branch + hooks present; commit format vague, no CI section |
| Clarity & Maintainability | 4/5 | Clean structure, within budget; schema version present |

## Verification Results

| Check | Result | Detail |
|-------|--------|--------|
| Commands traceable | SKIP | No project files available (example-only review) |
| Structure paths exist | SKIP | No project files available |
| Patterns match source | SKIP | No project files available |
| Env versions accurate | SKIP | No project files available |
| CRITICAL constraints grounded | PASS | `pnpm` mandate consistent with lock file assumption; Prisma generated path in NEVER |
| Domain terms in codebase | SKIP | No project files available |
| Security paths in .gitignore | SKIP | No project files available |

## Strengths

- **Comprehensive CRITICAL section** — covers package manager mandate, lint/test gates, generated file protection, and tool preferences with both MUST and NEVER rules.
- **Per-command ON FAIL recovery** — every non-trivial command has a concrete recovery step, including the destructive-action warning on `prisma migrate reset`.
- **Domain terms with disambiguation** — `Workspace` and `Metric` are defined with project-specific meanings that prevent agent misinterpretation.
- **Convention sub-items in Patterns** — Module, Async, and Naming explicitly stated before framework-specific patterns.
- **Data & State section** — cleanly separates schema source of truth, ORM, and migration paths.

## Findings

### P2 — Commit format is vague
- **Impact:** Agent uses generic conventional commit format without project-specific prefixes or scope conventions.
- **Current state:** `Commit: Conventional Commits` — no examples or project-specific rules.
- **Recommendation:** Add format with examples.
- **Example:**
  ```
  # Before
  - Commit: Conventional Commits

  # After
  - Commit: `<type>(<scope>): <subject>` — types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`. Scope: component or module name (e.g., `feat(auth): add SSO login`).
  ```

### P2 — No CI section
- **Impact:** Agent doesn't know what checks run on push/PR, may submit code that fails CI.
- **Current state:** CI section is absent. PR requirements mention "passing CI" without defining what CI runs.
- **Recommendation:** Add CI section with jobs and required checks.
- **Example:**
  ```markdown
  ## CI

  - Runs: lint, test:unit, test:e2e, build, type-check
  - Required checks: All must pass for merge
  - Artifacts: Playwright report in CI artifacts
  ```

### P2 — Missing force-push NEVER rule
- **Impact:** Agent could force-push to shared branches, destroying team history.
- **Current state:** CRITICAL has no force-push prohibition.
- **Recommendation:** Add `- NEVER: Force push (git push --force, git push -f) to shared branches` to CRITICAL.

### P2 — Generated directories not marked in Structure
- **Impact:** Agent may edit generated Prisma client files or build output.
- **Current state:** Structure lists `prisma/` but doesn't distinguish generated output. CRITICAL has NEVER rule for `src/generated/prisma/` but this path doesn't appear in Structure.
- **Recommendation:** Add generated dirs to Structure.
- **Example:**
  ```
  src/generated/prisma/ # Prisma client (generated -- do not edit)
  .next/                # Build output (generated -- do not edit)
  ```

### P3 — No ON FAIL for lint in CRITICAL
- **Impact:** Minor — Commands section has lint ON FAIL, but CRITICAL's ON FAIL (lint) line is absent. Agent may miss recovery when following CRITICAL rules directly.
- **Current state:** CRITICAL has generic ON FAIL and test-specific ON FAIL, but no lint-specific ON FAIL.
- **Recommendation:** Add `- ON FAIL (lint): pnpm lint --fix && pnpm lint. Fix remaining errors manually.`

### P3 — Security section missing CI secrets mechanism
- **Impact:** Agent writing CI config doesn't know how secrets are provided.
- **Current state:** `Secrets via: environment variables (Vercel)` — covers deployment but not CI.
- **Recommendation:** Add `- CI secrets: GitHub Actions secrets` (or whatever the project uses).

### P3 — No Debugging section
- **Impact:** Agent has no guidance on log access, REPL, or debugger attachment. Minor for most tasks.
- **Current state:** Section absent.
- **Recommendation:** Optional addition if within line budget:
  ```markdown
  ## Debugging

  - Logs: `pnpm dev` console output; browser DevTools for client
  - REPL: `node --experimental-repl-await`
  - Debugger: VS Code "Next.js: debug" launch config
  ```

## Token Efficiency

- **Line count:** 126 lines (slightly over 120-line single-package budget)
- **Redundancies:** Migration commands appear in both Data & State and Commands. Data & State could reference Commands instead of duplicating.
- **Trimmable:** Execution Context `Prefix: N/A` line adds no value for Host-only projects. Remove if reclaiming lines.
- **Densifiable:** Already dense. No prose sections to compress.
```
