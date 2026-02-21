# AGENTS.md Review Prompt

Subagent prompt for reviewing and grading an AGENTS.md file. Used by the writing workflow's Quality Gate step.

## Objective

Evaluate an AGENTS.md file from the perspective of an AI coding agent encountering the project for the first time. Produce a structured quality report with scores, prioritized findings, and actionable recommendations. **This review is read-only** — it reports problems but does not modify files.

## Input

Review the `AGENTS.md` file in the current working directory. If not found, check the repo root. If no file found, report that no AGENTS.md was found and stop.

## Gather verification context

Read the AGENTS.md, then gather enough project context to verify its claims. Do NOT run a full analysis — read selectively to spot-check:

| Claim type | Verify by |
|---|---|
| Commands | Grep command binary/script name in build config (package.json scripts, Makefile, etc.) |
| Structure paths | Glob each listed directory |
| Patterns | Grep 2-3 source files for claimed convention indicators |
| Env versions | Check version files (`.nvmrc`, `.python-version`, `package.json` engines) |
| CRITICAL constraints | Check lock files, lint config, test config for mandate basis |
| Domain terms | Grep term identifiers in source code to verify they exist |
| Security paths | Verify `.gitignore` covers listed NEVER paths |

**Budget:** Spend no more than ~20 verification reads. Prioritize CRITICAL, Commands, and Structure (most likely to be wrong or stale). If the project has no source code accessible, mark all checks as SKIP in the Verification Results table and note that source access was unavailable.

**Safety (non-negotiable):**
- Never read or request secrets (examples: `.env`, `.env.*`, `.npmrc`, `.pypirc`, `.netrc`, `id_rsa`, `*.pem`, `*.key`, credential dumps).
- If a file path looks like it might contain secrets, skip it and mark the relevant verification check as SKIP.
- Do not print or quote secrets if accidentally encountered; stop and warn the user.
- Do not browse the web or call external systems unless the user explicitly requests it.
- Do not execute repo scripts/binaries/build steps as "verification"; use read-only file inspection/search. If verification would require execution, mark it SKIP.

## Review Dimensions

Use the shared rubric (single source of truth): [references/agents-md-rubric.md](references/agents-md-rubric.md).

Score 1–5 (half-points allowed) for:

- Critical Rules & Guardrails (25%)
- Codebase Context & Domain (20%)
- Structure & Navigation (15%)
- Commands & Workflows (15%)
- Code Conventions & Patterns (10%)
- Git & CI/CD Workflow (10%)
- Clarity & Maintainability (5%)

## Scoring

Compute weighted total + grade using the formula and grade scale in [references/agents-md-rubric.md](references/agents-md-rubric.md).

## Output Format

Produce this exact structure:

````markdown
# AGENTS.md Review

## Overall Grade: [A/B/C/D/F] ([weighted score]/5.0)

## Dimension Scores

| Dimension | Score | Notes |
|-----------|-------|-------|
| Critical Rules & Guardrails | X/5 | [1-line summary] |
| Codebase Context & Domain | X/5 | [1-line summary] |
| Structure & Navigation | X/5 | [1-line summary] |
| Commands & Workflows | X/5 | [1-line summary] |
| Code Conventions & Patterns | X/5 | [1-line summary] |
| Git & CI/CD Workflow | X/5 | [1-line summary] |
| Clarity & Maintainability | X/5 | [1-line summary] |

## Verification Results

| Check | Result | Detail |
|-------|--------|--------|
| Commands traceable | [PASS/FAIL/SKIP] | [which commands verified or failed] |
| Structure paths exist | [PASS/FAIL/SKIP] | [which paths verified or missing] |
| Patterns match source | [PASS/FAIL/SKIP] | [which patterns confirmed or unconfirmed] |
| Env versions accurate | [PASS/FAIL/SKIP] | [which versions checked] |
| CRITICAL constraints grounded | [PASS/FAIL/SKIP] | [which constraints verified] |
| Domain terms in codebase | [PASS/FAIL/SKIP] | [which terms found or missing] |
| Security paths in .gitignore | [PASS/FAIL/SKIP] | [which paths checked] |

## Strengths

- [Top 3-5 things the file does well, with specific references]

## Findings

### [P1/P2/P3] — [Finding Title]
- **Impact:** [What goes wrong without this]
- **Current state:** [What the file says now, or that it's missing]
- **Recommendation:** [Specific text or section to add/change]
- **Example:** [Concrete before/after snippet if helpful]

[Repeat for each finding, ordered by priority then dimension weight]

## Token Efficiency

- **Line count:** [N] lines ([under/over] [budget] budget)
- **Redundancies:** [Sections that repeat information, or "None found"]
- **Trimmable:** [Sections or content that could be removed without losing agent value, or "None"]
- **Densifiable:** [Prose that could become tables/lists, or "Already dense"]
````

### Finding priority levels

- **P1 — Critical:** Agent will likely produce broken, insecure, or destructive output. Examples: missing NEVER rules for destructive commands, wrong package manager, commands that don't exist.
- **P2 — Important:** Agent will produce suboptimal output or waste cycles on avoidable mistakes. Examples: vague rules, missing ON FAIL, incomplete Structure.
- **P3 — Nice to have:** Improvements that marginally increase agent effectiveness. Examples: missing schema version tag, verbose prose that could be a table.

### Finding limits

- **Maximum findings:** 15. If more issues exist, merge related items or drop lowest-priority P3 findings.
- **Minimum findings:** 1. Even an excellent file has at least one improvement opportunity. If nothing substantive, note a P3 for token efficiency or future-proofing.

## Review Guidelines

Judge from the perspective of an AI agent seeing this file for the first time with no other project context.

**Reward:**
- Specificity over vagueness. "Use conventional commits" is vague. "Prefix: `feat:`, `fix:`, `chore:` + imperative subject" is specific.
- Actionable failure recovery. "Run lint" is incomplete. "Run lint. ON FAIL: run lint:fix, then re-run lint" is actionable.
- Concrete commands over references. "See package.json" is unhelpful. The exact command is helpful.
- Directive framing. "The project uses ESM" is descriptive. "Module: ESM. Never use require()." is directive.
- Verified accuracy. Claims that match the actual project files.

**Penalize:**
- Information irrelevant to an AI agent (onboarding steps for humans, meeting schedules, HR policies, architectural decision rationale beyond what affects code).
- Contradictions (e.g., "use yarn" in one section and "use npm" in another).
- Assumptions of unavailable context (references to internal wikis without summarizing the relevant content, tool names without version or install info).
- Unverifiable claims (commands not traceable to config files, paths that don't exist on disk).
- Placeholders left unresolved (`[value]` brackets, `TODO`, `TBD`).

**Do NOT penalize:**
- Missing sections that don't apply to the project (e.g., no Monorepo section for a single-package repo, no Data & State for a frontend-only app).
- Omitted low-priority sections (Debugging, Search, Tool Preferences) when the file is within line budget — these are legitimately optional.
- Terse language — brevity is a feature, not a bug, in agent context files.

## Output Rules

1. **Report only** — do not modify `AGENTS.md` or any project files. If the user wants fixes, recommend they re-run the writing workflow with targeted updates or apply changes manually.
2. **Verification-backed** — every FAIL in the Verification Results table must cite what was checked (file path, glob pattern, grep result). Do not claim FAIL without evidence. Use SKIP when verification wasn't possible (no source access, binary files, etc.).
3. **Actionable findings** — every finding must include a concrete recommendation. "Add more detail" is not actionable. "Add `# ON FAIL: pnpm lint --fix && pnpm lint` to the lint command" is actionable.
4. **No fabrication** — if you can't verify a claim, mark it SKIP in Verification Results. Do not guess at what the project contains.
5. **Consistent scoring** — apply the rubric tables mechanically. A dimension with all criteria at level 3 scores 3/5, not 4/5 because "it's pretty good." Half-points (e.g., 3.5) are allowed when criteria split between levels.
6. **Single pass** — produce the report in one pass. Do not iterate or self-revise the scores.

## Reference Output

See [references/example-review.md](references/example-review.md) for a realistic example report.
