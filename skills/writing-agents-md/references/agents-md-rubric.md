# AGENTS.md Rubric (Shared)

This rubric defines what “good” looks like for an `AGENTS.md` file that guides an AI coding agent working in a repository.

NOTE: Single source of truth for the AGENTS.md rubric. Used by the review prompt and the writing workflow.

Intended use:
- **Writing**: self-check a newly generated `AGENTS.md` before writing/updating it.
- **Reviewing**: grade an existing `AGENTS.md` with consistent, evidence-backed scoring.

Constraints:
- Prefer **specific, copy-pasteable commands** and **verifiable paths** over prose.
- Avoid vendor/tool lock-in unless the repo mandates it.
- Never include or quote secrets.
- Avoid time-sensitive claims that will go stale (e.g., “latest”, “current pricing”, hardcoded versions) unless verified by repo files and clearly grounded.

## Dimension Rubric (1–5)

Score each dimension from **1 (missing/broken)** to **5 (excellent)**. Half-point increments are allowed.

### 1) Critical Rules & Guardrails (Weight: 25%)

Score based on:

| Criterion | 1 (missing) | 3 (partial) | 5 (excellent) |
|---|---|---|---|
| Destructive actions forbidden | No NEVER rules | Some NEVERs but gaps | Explicit NEVER for force-push, hook bypass, secret access, generated file edits |
| Pre-commit checks defined | No MUST rules | MUST rules exist but vague | MUST with exact commands for lint, test, package manager |
| Tool/command preferences | Not stated | Mentioned but no alternatives | PREFER with specific preferred + avoided tools |
| Failure recovery | No ON FAIL rules | Generic ON FAIL | Per-command ON FAIL with concrete recovery steps |
| “Never do” completeness | No forbidden actions | Partial list | Covers: competing package managers, hook bypass, secret access, generated file edits, force push |

### 2) Codebase Context & Domain (Weight: 20%)

| Criterion | 1 | 3 | 5 |
|---|---|---|---|
| Project purpose | Missing | Stated but vague | 1-sentence Goal with clear scope |
| Domain terms | Missing | Listed but undefined | Terms defined to prevent misinterpretation |
| Tech stack | Not stated | Partially stated | Language, framework, database, deploy target explicit |
| Architecture type | Missing | Implied | Explicit (monolith, monorepo, serverless, etc.) |
| Project type | Missing | Implied | Explicit (Library, Application, CLI/Tool, Both) |

### 3) Structure & Navigation (Weight: 15%)

| Criterion | 1 | 3 | 5 |
|---|---|---|---|
| Directory layout | Missing | Listed without annotations | Every dir annotated with 2–4 word purpose |
| Generated dirs marked | Not marked | Some marked | All codegen/build output dirs marked “(generated — do not edit)” |
| Accuracy | Paths don't exist | Most paths exist | All paths verified on disk |
| Test/config locatable | Can't find tests from file | Partial hints | Tests/configs/migrations/entry points all locatable |

### 4) Commands & Workflows (Weight: 15%)

| Criterion | 1 | 3 | 5 |
|---|---|---|---|
| Essential commands | Missing | Some present | install, lint, test, build + project-specific (migrate, seed, codegen) |
| Copy-pasteable | Pseudocode/incomplete | Mostly exact | Exact syntax, correct working directory, no placeholders |
| Recovery steps | No ON FAIL | Generic ON FAIL | Per-command ON FAIL with actual fix/retry mechanism |
| Prerequisites | Not stated | Runtime version mentioned | Runtime version, env vars, local setup steps present |
| Traceability | Commands untraceable | Some traceable | Every command traces to a config/script/tool convention |

### 5) Code Conventions & Patterns (Weight: 10%)

| Criterion | 1 | 3 | 5 |
|---|---|---|---|
| Module system | Not stated | Mentioned | Explicit (ESM/CJS/dual) with directive for new code |
| Async pattern | Not stated | Mentioned | Dominant pattern stated with “use X for new code” |
| Naming conventions | Not stated | Partially stated | File/component/function naming documented |
| Framework patterns | Not stated | Listed without location | Each pattern states where it applies + indicators |
| Legacy vs current | Mixed undifferentiated | Some labeled | Clear “use X for new code; Y is legacy” directives |

### 6) Git & CI/CD Workflow (Weight: 10%)

| Criterion | 1 | 3 | 5 |
|---|---|---|---|
| Branch strategy | Missing | Named | Pattern with prefix examples (`feat/`, `fix/`) |
| Commit format | Missing | Named | Format with project-specific examples |
| CI checks | Missing | Listed | Jobs, required checks, artifacts described |
| PR requirements | Missing | Basic | Template path, reviewer conventions, required checks |
| Hooks | Missing | Named | Tool, what it runs, pre-commit behavior |

### 7) Clarity & Maintainability (Weight: 5%)

| Criterion | 1 | 3 | 5 |
|---|---|---|---|
| Scannable | Wall of text | Some headings | Clear headings/tables/bullets |
| Concise | Extreme bloat | Within budget but redundant | Within budget, minimal redundancy |
| No contradictions | Multiple contradictions | Minor inconsistencies | Internally consistent |
| No over-specification | Irrelevant content | Some unnecessary detail | Every item is agent-actionable |
| Schema version | Missing | Present but outdated | Current `agents-md-version` tag |

## Scoring

Compute weighted score:

```
total = (D1 * 0.25) + (D2 * 0.20) + (D3 * 0.15) + (D4 * 0.15) + (D5 * 0.10) + (D6 * 0.10) + (D7 * 0.05)
```

Grade scale:

| Grade | Range |
|---|---|
| A | 4.5 – 5.0 |
| B | 3.5 – 4.49 |
| C | 2.5 – 3.49 |
| D | 1.5 – 2.49 |
| F | < 1.5 |

## Findings Priority

- **P1 (Critical):** likely to cause broken workflows, unsafe actions, or repeated failure loops.
- **P2 (Important):** likely to waste tokens/time, reduce output quality, or cause repeated clarification.
- **P3 (Nice):** polish and future-proofing.

## Verification (Evidence-Backed)

When grading, prefer **PASS/FAIL/SKIP** checks for:
- Commands traceable to build config/scripts
- Structure paths exist on disk
- Patterns match representative source files
- Env versions accurate (version files / config)
- CRITICAL constraints grounded (lock files / configs)
- Domain terms exist in codebase (identifiers / docs)
- Security paths covered in `.gitignore`

Rule: do not claim FAIL without evidence (file path, glob, or grep result). Use SKIP if verification would require running code or accessing secrets.
