# AGENTS.md
<!-- agents-md-version: 1 -->

## CRITICAL

- MUST: `cd packages/skillcheck && npm ci` to install dependencies
- MUST: `cd packages/skillcheck && npm run build` before running linter locally
- MUST: Run both linters before commit: `node packages/skillcheck/bin/skillcheck.js skills/` and `npx agnix skills/`
- MUST: `cd packages/skillcheck && npm test` before PR
- MUST: Use `npm install <pkg>` to change deps (DO NOT edit package.json manually)
- NEVER: Force push (`git push --force`, `git push -f`) to shared branches
- NEVER: Skip pre-commit hooks (`--no-verify`)
- NEVER: Edit files in `packages/skillcheck/dist/` (generated)
- NEVER: Commit `.env` files, API keys, tokens, or credentials
- NEVER: Read or include secrets in skill definitions
- PREFER: Built-in tools (file reader, editor, glob, grep) over shell equivalents (`cat`, `sed`, `find`, `grep`)
- ON FAIL: Read full error output before retry
- ON FAIL (lint): Run `node packages/skillcheck/bin/skillcheck.js --fix skills/` for auto-fixable issues, then re-run
- ON FAIL (test): Run single test file: `cd packages/skillcheck && npx vitest run src/<file>.test.ts`

## Domain & Context

- Goal: Rubric-graded writing and review workflows that turn rough prompts into professional-grade agent skill definitions
- Type: CLI/Tool
- License: Apache-2.0
- Key Terms:
  - `Skill`: Structured directory (SKILL.md + agents/ + references/) defining an AI coding agent capability
  - `skillcheck`: Internal Node.js linter validating skill structure, frontmatter, and rubric consistency
  - `agnix`: External linter validating specification rules (token limits, safety, cross-platform)
  - `Rubric`: Markdown document with grade bands (A-F), P1/P2/P3 priorities, and scoring dimensions
  - `Generator-critic loop`: Write -> Validate -> Review -> Fix cycle until quality bar met (score >= 4.5, no P1s)

## Commands

```bash
# install
cd packages/skillcheck && npm ci                            # ON FAIL: rm -rf node_modules && npm ci
# build
cd packages/skillcheck && npm run build                     # ON FAIL: check output for TypeScript errors
# test
cd packages/skillcheck && npm test                          # ON FAIL: npx vitest run src/<file>.test.ts
# lint:internal (binary name: skillcheck; use file path from repo root)
node packages/skillcheck/bin/skillcheck.js skills/               # ON FAIL: node packages/skillcheck/bin/skillcheck.js --fix skills/
# lint:external
npx agnix skills/                                     # ON FAIL: check output for spec violations
# lint:single
node packages/skillcheck/bin/skillcheck.js skills/<skill-name>   # ON FAIL: node packages/skillcheck/bin/skillcheck.js --fix skills/<skill-name>
# lint:json
node packages/skillcheck/bin/skillcheck.js --format json skills/  # ON FAIL: check stderr for parse errors
```

## Structure

```
skills/                 # Skill definitions (one directory per skill)
skills/*/SKILL.md       # Skill entry point with YAML frontmatter
skills/*/agents/        # Agent configs (openai.yaml)
skills/*/references/    # Supporting docs (contents vary per skill)
packages/skillcheck/          # skillcheck linter (Node.js/TypeScript)
packages/skillcheck/src/      # Linter source code
packages/skillcheck/dist/     # Compiled output (generated -- do not edit)
packages/skillcheck/bin/      # CLI entry point
packages/skillcheck/fixtures/ # Test fixtures (valid/invalid skills and rubrics)
schemas/                # JSON schemas (skill frontmatter, lint output)
.github/workflows/      # CI (validate + release)
```

## Patterns

- **Module:** ESM (`"type": "module"`, `.mjs` CLI entry)
- **Async:** Synchronous (`readFileSync`, no async/await in linter)
- **Naming:** kebab-case files, PascalCase types/interfaces, camelCase functions
- **Linter rules:** Pure functions `(ctx: SkillContext) => LintDiagnostic[]` -- stateless, no side effects
- **Skill layout:** `SKILL.md` + `agents/openai.yaml` + `references/` + optional `scripts/`
- **Imports:** Explicit `.js` extensions in TypeScript imports (Node16 module resolution)

## Testing Strategy

- Runner: Vitest
- Tests: Co-located with source (`src/**/*.test.ts`)
- Fixtures: `packages/skillcheck/fixtures/` (valid/invalid skill and rubric samples)
- Coverage: No threshold configured
- Conventions: `describe`/`it` blocks, pure-function unit tests

## Security

- NEVER read/write: `.env`, `*credentials*`, `*secret*`, `*.pem`, `*.key`
- NEVER log/commit: API keys, tokens, private keys
- Secrets via: GitHub Actions secrets (`NPM_TOKEN` for publish)
- Skills enforce read-only safety; writing requires explicit user approval

## Env

- Node.js: >=18 (specified in `engines`)

```bash
# No local env vars required
# CI-only
NPM_TOKEN=<npm publish token, CI only>
```

## Git

- Branch: `main`
- Commit: Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`)
- PR: Both linters must pass; one skill or concern per PR

## CI

- Runs: validate (push/PR to main, Node 18/20/22/24 matrix), release (tag `v*`, default Node 24)
- Required checks: build linter, run tests, skillcheck, agnix
- Artifacts: npm package + SHA-256 checksums on GitHub release

## Tool Preferences

| Task | Prefer | Avoid |
|------|--------|-------|
| Read files | Built-in file reader (Read) | `cat`, `head`, `tail` |
| Search content | Built-in grep (Grep) | `grep`, `rg` |
| Find files | Built-in glob (Glob) | `find`, `ls` |
| Edit files | Built-in editor (Edit) | `sed`, `awk` |
