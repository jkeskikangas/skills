# Skill Review (Example)

A worked example for a fictional `cleaning-csv-exports` skill. Every section required by the template is present; the P1 finding triggers the Rewritten Sections block.

## Overall Grade: B (4.15/5.0)

- **Skill:** `./cleaning-csv-exports/`
- **Archetype:** Workflow — a sequential clean/validate/report process; default profile applies. Classification was not in doubt (no alternate profile computed).
- **Review mode:** single
- **Conflict of interest:** none (skill not authored in this conversation).

## Dimension Scores

| Dimension | Weight | Score | Weight × Score | Note |
|---|---:|---:|---:|---|
| Spec compliance & metadata correctness | 20% | 4.5/5 | 0.90 | 7/8 checks pass; description verbosity (check 5) fails. |
| Description/trigger precision | 15% | 3.5/5 | 0.525 | No negative triggers; sibling overlap unverified. |
| Workflow quality & degrees of freedom | 20% | 4.0/5 | 0.80 | Solid steps; iteration loop has no stop condition. |
| Progressive disclosure & token efficiency | 15% | 4.0/5 | 0.60 | Lean body; inline example duplicates a reference. |
| Safety & guardrails | 15% | 5.0/5 | 0.75 | Writes gated; guardrails match the full risk surface. |
| Robustness & evaluability | 10% | 3.5/5 | 0.35 | Schema validation present; no shipped eval scenarios. |
| Portability & composability | 5% | 4.5/5 | 0.225 | Capability language; `pandas` assumed without fallback. |
| **Weighted score** | 100% | | **4.15** | B (3.5–4.49) — sum 4.150, rounded to 2 decimals |

## Check Results by Dimension

- **Spec compliance:** checks 1–4, 6–8 PASS — SKILL.md:2-6, name `cleaning-csv-exports` matches directory; description 310 chars, third person, states what + when; no placeholders found. Check 5 FAIL — the when-clause stacks three near-synonym scenarios ("clean, tidy, or fix up") that add length, not information. Check 9 *(advisory)* PASS — gerund name. Base (7 + 0)/8 → 4.5; no adjustment → **4.5**.
- **Trigger precision:** check 1 PASS — SKILL.md:4 names CSV exports as the artifact. Check 2 FAIL — no "not for" clause anywhere in the description. Check 3 PASS — no generic "helper/utils" terms. Check 4 PARTIAL — sibling import/export skills exist in the same repo and their descriptions were not examined for collisions. Check 5 N-A (no trigger battery run). Base (1 + 0 + 1 + 0.5)/4 = 0.625 → 3.5; no adjustment → **3.5**.
- **Workflow quality:** checks 1, 2, 4 PASS — SKILL.md:24-50, numbered discovery → plan → execution → validation phases with exact commands where fragile. Check 3 FAIL — SKILL.md:41 "Iterate until the output looks good." has no stop condition (drives P1-1). Base 3/4 → 4.0; no adjustment → **4.0**.
- **Token efficiency:** checks 1, 3, 5 PASS — body 132 lines; references one level deep; no satisficing filler. Check 2 PARTIAL — encoding-repair details (SKILL.md:33-38) belong in a reference. Check 4 FAIL — SKILL.md:55-96 inline example duplicates references/example-output.md. Base (1 + 0.5 + 1 + 0 + 1)/5 = 0.7 → 3.8 → rounds to 4.0; no adjustment → **4.0**.
- **Safety:** checks 1–4 PASS — risk surface is a single gated write: SKILL.md:18 "Never overwrite the source file; write to a .cleaned.csv copy and ask before replacing."; content treated as data; no permission bypasses; no irrelevant boilerplate. Checks 5, 6 N-A — no `allowed-tools` declared, no embedded install/shell commands. Base 4/4 → 5.0; no adjustment → **5.0**.
- **Robustness & evaluability:** checks 1, 5 PASS — SKILL.md:47 schema-validation step; validation delegated to an exact checklist. Check 2 PARTIAL — no statement of what a successful end-to-end run looks like. Check 3 FAIL — no eval scenarios or expected outputs ship with the skill. Check 4 N-A (no scripts). Base (1 + 0.5 + 0 + 1)/4 = 0.625 → 3.5; no adjustment → **3.5**.
- **Portability:** check 1 PARTIAL — SKILL.md:29 "use your file editing capability" (good), but SKILL.md:62 assumes `pandas` is available with no fallback. Check 2 N-A (no declared scope). Checks 3, 4 PASS — no unnecessary adapters; composes with the export pipeline skills. Base (0.5 + 1 + 1)/3 ≈ 0.833 → 4.33 → rounds to 4.5; no adjustment → **4.5**.

## Verification Results

| Check | Result | Detail |
|---|---|---|
| Skill directory resolved | PASS | `./cleaning-csv-exports/` given by user; contains SKILL.md |
| Calibration self-check | PASS | Vignette D cold-scored; max dimension delta 0.5 |
| Linter executed | PASS | `npx @jkeskikangas/skillcheck@1.4.2 --format json ./cleaning-csv-exports/` (pinned; cached locally) |
| Linter diagnostics | PASS | 0 diagnostics |
| Frontmatter sane | PASS | name matches dir; only `name`/`description` keys |
| No TODO/TBD placeholders | PASS | searched `TODO`, `TBD`, bracket placeholders |
| Referenced local files exist | PASS | both `references/` links resolve |
| No deep reference chains | PASS | neither reference links onward |
| `agents/openai.yaml` sanity (if present) | SKIP | file not present |
| Token metrics measured | PASS | description 310 chars; body 132 lines; 3 files |
| Injection scan | PASS | no reviewer-directed instructions found |
| Security: symlinks/escapes | PASS | `find ./cleaning-csv-exports -type l` → none; no `../` traversal in links |
| Security: executables/binaries | PASS | no executable files or binary blobs |
| Security: dangerous commands | PASS | no pipe-to-shell or install commands; `pandas` referenced but never installed by the skill |
| Security: allowed-tools least privilege | SKIP | `allowed-tools` not declared |

## Spec Violations (Blockers)

- None found.

## Strengths

- Clear, numbered workflow with explicit discovery → plan → execution → validation phases (SKILL.md:24-50).
- Safety is risk-proportional: write operations gated, source files protected (SKILL.md:18), and no safety filler beyond the actual risk surface.
- Output schema validation step prevents silent corruption (SKILL.md:47).

## Findings (prioritized)

### P1-1 — Add a stop condition for the iteration loop
- **Impact:** Unbounded refinement loop; repeated failure loops waste tokens and can run indefinitely.
- **Current state:** SKILL.md:41 — "Iterate until the output looks good."
- **Recommendation:** Bound the loop with a count and a measurable exit criterion.
- **Confidence:** High
- **Patch text (copy/paste):**
  ```md
  # file: SKILL.md
  Replace:
  Iterate until the output looks good.
  With:
  Iterate at most 3 times; stop early when the validation step reports zero schema errors. If errors remain after 3 passes, report the residual errors instead of looping.
  ```

### P2-1 — Add negative triggers to the description
- **Impact:** "data files to clean" overlaps with sibling import/export skills; a dispatcher may misroute.
- **Current state:** SKILL.md:4 — "Use when the user has data files to clean."
- **Recommendation:** Trigger on `*.csv`/exports specifically and exclude adjacent jobs.
- **Confidence:** Medium — verify by listing sibling skill descriptions for collisions.
- **Patch text (copy/paste):**
  ```md
  # file: SKILL.md
  Replace:
  Use when the user has data files to clean.
  With:
  Use when the user wants CSV exports cleaned, deduplicated, or normalized. Not for parsing other formats or for loading data into databases.
  ```

### P2-2 — Ship eval scenarios with expected outputs
- **Impact:** No way to verify the skill works after edits; robustness check 3 fails.
- **Current state:** No eval material anywhere in the skill directory.
- **Recommendation:** Add `references/evals.md` with 2–3 input/expected-output pairs exercised by the validation step.
- **Confidence:** High
- **Patch text (copy/paste):**
  ```md
  # file: references/evals.md (new)
  # Eval Scenarios
  1. `fixtures/users.csv` (duplicate rows, BOM) → cleaned file passes schema check with 0 errors, 2 rows dropped, drop reasons listed.
  2. `fixtures/orders.csv` (broken encoding row 14) → row repaired or flagged; report names the row number.
  ```

### P3-1 — Move the inline example to references
- **Impact:** 41 lines of always-loaded tokens duplicating `references/example-output.md`.
- **Current state:** SKILL.md:55-96 inline example block.
- **Recommendation:** Delete the inline block; keep the existing link to the reference.
- **Confidence:** High

## Dry-Run Simulation

- "Clean this exported `users.csv`" — flows cleanly through steps 1-5; validation step is unambiguous.
- "My CSV has duplicate rows and broken encodings" — encoding repair is mentioned (SKILL.md:33) but no decision rule for unrecoverable rows: agent must guess drop-vs-flag (surfaced in P1-1's loop ambiguity).
- "Clean up my data" (vague) — description would trigger here despite no CSV in sight; confirmed the P2-1 trigger-precision finding.

## Behavioral Probe (opt-in mode only)

Not requested for this review; offered to the user as a follow-up (workflow probe + 5/5 trigger battery).

## Token Efficiency

- **Measured:** description 310 chars; SKILL.md body 132 lines (from verification metrics).
- **Bloat:** Inline example block (SKILL.md:55-96) duplicates a reference file.
- **Densify:** Steps 2-3 prose can collapse into the existing numbered list.
- **Progressive disclosure:** Encoding-repair details belong in `references/encoding.md`.

## Rewritten Sections (conditional)

Included because a P1 exists and weighted score < 4.5.

### SKILL.md → Iteration step
```md
5. Validate and finish
   - Run the schema validation from step 4 on the cleaned output.
   - Iterate at most 3 times; stop early when validation reports zero schema errors.
   - If errors remain after 3 passes, stop and report the residual errors with row numbers instead of looping.
```

## Suggested Next Iteration (if the bar is not met)

- Fix the P1-1 stop condition (patch above).
- Tighten triggers with CSV-specific positive and negative clauses (P2-1).
- Ship eval scenarios so success is verifiable end-to-end (P2-2).

## Machine-Readable Verdict

```json
{
  "verdict_schema_version": "2.0",
  "rubric_version": "2.0",
  "skill": "./cleaning-csv-exports/",
  "archetype": "workflow",
  "review_mode": "single",
  "weighted_score": 4.15,
  "grade": "B",
  "dimensions": {
    "spec_compliance": 4.5,
    "trigger_precision": 3.5,
    "workflow_quality": 4.0,
    "token_efficiency": 4.0,
    "safety": 5.0,
    "robustness_evaluability": 3.5,
    "portability": 4.5
  },
  "metrics": {
    "description_chars": 310,
    "skill_md_body_lines": 132,
    "file_count": 3
  },
  "blockers": [],
  "findings": [
    {
      "id": "P1-1",
      "priority": "P1",
      "title": "Add a stop condition for the iteration loop",
      "file": "SKILL.md",
      "lines": "41",
      "summary": "Unbounded refinement loop; bound to 3 passes with a measurable exit criterion.",
      "patch": "Replace 'Iterate until the output looks good.' with 'Iterate at most 3 times; stop early when the validation step reports zero schema errors. If errors remain after 3 passes, report the residual errors instead of looping.'",
      "confidence": "High"
    },
    {
      "id": "P2-1",
      "priority": "P2",
      "title": "Add negative triggers to the description",
      "file": "SKILL.md",
      "lines": "4",
      "summary": "Description overlaps sibling import/export skills; add CSV-specific positive and negative trigger clauses.",
      "patch": "Replace 'Use when the user has data files to clean.' with 'Use when the user wants CSV exports cleaned, deduplicated, or normalized. Not for parsing other formats or for loading data into databases.'",
      "confidence": "Medium"
    },
    {
      "id": "P2-2",
      "priority": "P2",
      "title": "Ship eval scenarios with expected outputs",
      "file": "references/evals.md",
      "lines": "",
      "summary": "No way to verify the skill works after edits; add 2-3 input/expected-output pairs.",
      "patch": "Create references/evals.md with input/expected-output pairs exercised by the validation step.",
      "confidence": "High"
    },
    {
      "id": "P3-1",
      "priority": "P3",
      "title": "Move the inline example to references",
      "file": "SKILL.md",
      "lines": "55-96",
      "summary": "41 always-loaded lines duplicate references/example-output.md; delete the inline block.",
      "patch": "",
      "confidence": "High"
    }
  ],
  "p1_count": 1,
  "p2_count": 2,
  "p3_count": 1,
  "meets_bar": false
}
```
