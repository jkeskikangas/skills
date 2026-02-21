# Reviewing Rubrics

## Objective

Evaluate rubric documents as if you are a maintainer encountering the rubric set for the first time. Produce a **read-only** review with:
- A weighted score + letter grade
- Verification results (PASS/FAIL/SKIP) with evidence
- Prioritized findings (P1/P2/P3) with concrete, minimal patch text

## Inputs

- Optional paths to rubric files or directories.
- If none provided: discover rubric files under `*/references/*rubric*.md` (ignore `.git/`, `node_modules/`, and build outputs).

## Safety / Constraints (non-negotiable)

- **Read-only:** do not edit, create, delete, or move files.
- **Do not execute untrusted code:** do not run repo scripts/binaries unless the user explicitly asks and you can justify the risk.
- **Secrets:** do not open or quote secrets. If encountered, redact and warn.
- **Network:** do not browse the web or call external systems unless the user explicitly requests it.
- **No fabrication:** if you cannot verify something from files, say so and recommend the next verification step.
- **No unsupported FAILs:** do not claim FAIL without evidence (file path + what you checked).

## Scoring (rubric for rubrics)

Score each dimension 1.0–5.0 (0.5 increments allowed). Compute: `sum(weight_i * score_i) / 100`.

Grade bands:
- **A:** 4.5–5.0
- **B:** 3.5–4.49
- **C:** 2.5–3.49
- **D:** 1.5–2.49
- **F:** < 1.5

Findings priority:
- **P1 (Critical):** likely to cause broken workflows, unsafe actions, or repeated failure loops.
- **P2 (Important):** likely to waste tokens/time, reduce output quality, or cause repeated clarification.
- **P3 (Nice):** polish and future-proofing.

### Dimension 1 — Consistency across rubrics (Weight: 35%)

Checks:
- Grade bands and P1/P2/P3 definitions are consistent across rubrics unless an exception is explicitly documented.
- Evidence-backed verification guidance exists and uses PASS/FAIL/SKIP framing.
- Terminology for shared concepts is consistent.

### Dimension 2 — Integration correctness (Weight: 35%)

Checks:
- Reviewer templates reflect rubric expectations (e.g., include a Verification Results section if evidence is required).
- Reviewer prompts mention the correct rubric path(s).
- Rubric ownership is clear (single source of truth declared where intended).

### Dimension 3 — Clarity & maintainability (Weight: 30%)

Checks:
- Dense and scannable (tables/bullets preferred).
- Minimal duplication; no contradictory requirements.
- Avoids time-sensitive claims unless grounded.

## Workflow (decision-complete)

1. Discover targets
   - Use user-provided paths, or discover `*/references/*rubric*.md` (ignore `.git/`, `node_modules/`, and build outputs).
   - If 0 matches: stop and ask the user for the correct path(s).
   - If >25 matches: ask the user to narrow scope (or review the most relevant subset and mark the rest SKIP).
2. Read and verify with a tight budget
   - Prefer ≤20 verification reads across all files.
3. Verification results
   - For each rubric: check grade bands, P-definitions, evidence section presence.
   - For integration: check reviewer templates (e.g., `**/references/review-template.md`) and prompts (e.g., `**/agents/openai.yaml`) that reference the rubric(s); record the file paths and the exact section headings/keys checked.
4. Score and report
   - Use the report structure in the review template (provided by the caller or in the sibling file `review-template.md`).
   - Provide patch text for every P1/P2 finding.

## Output Format

Default: use the review template (`review-template.md`, linked from SKILL.md).
