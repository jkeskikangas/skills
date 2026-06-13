# Example Review

Review of the Next.js + Prisma AGENTS.md example from `references/example-output.md`. This demonstrates the **rubric-pass** output format (from `references/review-prompt.md`); in the full Quality Gate a rubric-free **blind pass** (`references/independent-critic.md`) also runs first, and any uncovered risk it finds is escalated into the fix list.

The weighted total below is recomputed from the dimension scores using the rubric formula — `(D1*0.25)+(D2*0.20)+(D3*0.15)+(D4*0.15)+(D5*0.10)+(D6*0.10)+(D7*0.05)` = `1.25+0.90+0.75+0.75+0.45+0.45+0.25` = **4.80**.

```markdown
# AGENTS.md Review

## Overall Grade: A (4.8/5.0)

## Dimension Scores

| Dimension | Score | Notes |
|-----------|-------|-------|
| Critical Rules & Guardrails | 5/5 | MUST/NEVER/ON FAIL complete; named danger guards for migrate reset + local deploy |
| Codebase Context & Domain | 4.5/5 | Clear goal, type, terms, stack; architecture style (monolith) not stated explicitly |
| Structure & Navigation | 5/5 | All dirs annotated; generated dirs (`src/generated/prisma/`, `.next/`) marked |
| Commands & Workflows | 5/5 | Full command set, copy-pasteable, per-command non-destructive ON FAIL |
| Code Conventions & Patterns | 4.5/5 | Module/Async/Naming + framework patterns with locations |
| Git & CI/CD Workflow | 4.5/5 | Branch, commit format w/ example, hooks, CI section; no PR template/code-owners path |
| Clarity & Maintainability | 5/5 | Scannable, 135 lines (under budget), internally consistent, schema tag present |

## Verification Results

| Check | Result | Detail |
|-------|--------|--------|
| Commands traceable | SKIP | No project files available (example-only review) |
| Structure paths exist | SKIP | No project files available |
| Patterns match source | SKIP | No project files available |
| Env versions accurate | SKIP | No project files available |
| CRITICAL constraints grounded | PASS | `pnpm` mandate consistent with lock-file assumption; generated path in NEVER; migrate-reset and local-deploy guards name the exact commands |
| Domain terms in codebase | SKIP | No project files available |
| Security paths in .gitignore | SKIP | No project files available |

## Strengths

- **Complete CRITICAL section** — package-manager mandate, competing-manager NEVER, force-push, hook bypass, secret access, and generated-file edits all covered with both MUST and NEVER rules.
- **Named danger guards** — destructive tools are guarded by the exact command: `NEVER: run pnpm prisma migrate reset outside local dev` and `NEVER: deploy from local (vercel --prod)`. No destructive command appears as an ON FAIL recovery.
- **Per-command ON FAIL recovery** — every non-trivial command has a concrete, non-destructive recovery step.
- **Generated code routed correctly** — `prisma generate` output is marked generated in Structure, mapped in Data & State, and protected in CRITICAL.
- **Domain terms with disambiguation** — `Workspace` and `Metric` are defined with project-specific meanings that prevent agent misinterpretation.

## Findings

### P3 — Architecture style not stated explicitly
- **Impact:** Minor. Agent infers a single Next.js app but the file never says monolith vs. multi-service, which can matter when adding cross-cutting code.
- **Current state:** `Type: Application` is present; no explicit architecture style.
- **Recommendation:** Add to Domain & Context: `- Architecture: monolith (single Next.js app)`.

### P3 — PR conventions lack a template/owners path
- **Impact:** Minor. Agent opening a PR doesn't know about a template or required reviewers for sensitive areas.
- **Current state:** `PR: Require passing CI + 1 approval` — no template path or reviewer conventions.
- **Recommendation:** If the repo has them, add `- PR template: .github/PULL_REQUEST_TEMPLATE.md` and `- Reviews: DB migrations require DBA review`.

## Token Efficiency

- **Line count:** 135 lines (under the 150-line single-package budget).
- **Redundancies:** None — migration/seed commands live only in Commands; Data & State references them by path.
- **Trimmable:** `Execution Context > Prefix: N/A` adds little for Host-only projects; remove if reclaiming lines.
- **Densifiable:** Already dense. No prose sections to compress.
```
