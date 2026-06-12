# Skill Review (Example)

A worked example for a fictional `cleaning-csv-exports` skill. Every section required by the template is present; the P1 finding triggers the Rewritten Sections block.

## Overall Grade: B (4.08/5.0)

- **Skill:** `./cleaning-csv-exports/`
- **Archetype:** Workflow — a sequential clean/validate/report process; default profile applies.
- **Conflict of interest:** none (skill not authored in this conversation).

## Dimension Scores

| Dimension | Weight | Score | Weight × Score | Note |
|---|---:|---:|---:|---|
| Spec compliance & metadata correctness | 20% | 4.5/5 | 0.90 | Frontmatter valid; description slightly verbose. |
| Description/trigger precision | 15% | 3.5/5 | 0.525 | No negative triggers; "data files" too broad. |
| Workflow quality & degrees of freedom | 20% | 4.0/5 | 0.80 | Solid steps; iteration loop has no stop condition. |
| Progressive disclosure & token efficiency | 15% | 4.0/5 | 0.60 | Lean body; long example block belongs in references. |
| Safety & guardrails | 15% | 4.5/5 | 0.675 | Writes gated on confirmation; matches risk surface. |
| Robustness & evaluability | 10% | 3.5/5 | 0.35 | Validates output schema; no acceptance checklist. |
| Portability & composability | 5% | 4.5/5 | 0.225 | Capability language; one vendor tool mention. |
| **Weighted score** | 100% | | **4.08** | B (3.5–4.49) |

## Evidence by Dimension

- **Spec compliance:** SKILL.md:2-6 — name `cleaning-csv-exports` matches directory; description 310 chars, third person, states what + when.
- **Trigger precision:** SKILL.md:4 — "Use when the user has data files to clean" — no file-pattern trigger (`*.csv`), no "not for" clause.
- **Workflow quality:** SKILL.md:41 — "Iterate until the output looks good." — loop with no stop condition (drives the P1 below).
- **Token efficiency:** SKILL.md:55-96 — 41-line inline example duplicates `references/example-output.md`.
- **Safety:** SKILL.md:18 — "Never overwrite the source file; write to `<name>.cleaned.csv` and ask before replacing." — proportional to its write surface.
- **Robustness & evaluability:** SKILL.md:47 — schema validation step present; no statement of what a successful run looks like end-to-end.
- **Portability:** SKILL.md:29 — "use your file editing capability" (good); SKILL.md:62 mentions `pandas` without an availability check.

## Verification Results

| Check | Result | Detail |
|---|---|---|
| Skill directory resolved | PASS | `./cleaning-csv-exports/` given by user; contains SKILL.md |
| Linter run (deterministic checks) | PASS | `npx @jkeskikangas/skillcheck --format json ./cleaning-csv-exports/` — 0 errors |
| Frontmatter sane | PASS | name matches dir; only `name`/`description` keys |
| No TODO/TBD placeholders | PASS | searched `TODO`, `TBD`, bracket placeholders |
| Referenced local files exist | PASS | both `references/` links resolve |
| No deep reference chains | PASS | neither reference links onward |
| `agents/openai.yaml` sanity (if present) | SKIP | file not present |
| Injection scan | PASS | no reviewer-directed instructions found |

## Spec Violations (Blockers)

- None found.

## Strengths

- Clear, numbered workflow with explicit discovery → plan → execution → validation phases (SKILL.md:24-50).
- Safety is risk-proportional: write operations gated, source files protected (SKILL.md:18).
- Output schema validation step prevents silent corruption (SKILL.md:47).

## Findings (prioritized)

### P1 — Add a stop condition for the iteration loop
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

### P2 — Add negative triggers to the description
- **Impact:** "data files" overlaps with sibling import/export skills; dispatcher may misroute.
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

### P3 — Move the inline example to references
- **Impact:** 41 lines of always-loaded tokens duplicating `references/example-output.md`.
- **Current state:** SKILL.md:55-96 inline example block.
- **Recommendation:** Delete the inline block; keep the existing link to the reference.
- **Confidence:** High

## Dry-Run Simulation

- "Clean this exported `users.csv`" — flows cleanly through steps 1-5; validation step is unambiguous.
- "My CSV has duplicate rows and broken encodings" — encoding repair is mentioned (SKILL.md:33) but no decision rule for unrecoverable rows: agent must guess drop-vs-flag (surfaced in P1's loop ambiguity).
- "Clean up my data" (vague) — description would trigger here despite no CSV in sight; confirmed the P2 trigger-precision finding.

## Token Efficiency

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

## Suggested Next Iteration (if weighted score < 4.5)

- Fix the P1 stop condition (patch above).
- Tighten triggers with CSV-specific positive and negative clauses (P2).
- State an end-to-end success criterion ("a successful run produces X") to lift robustness & evaluability.

## Machine-Readable Verdict

```json
{
  "skill": "./cleaning-csv-exports/",
  "archetype": "workflow",
  "weighted_score": 4.08,
  "grade": "B",
  "dimensions": {
    "spec_compliance": 4.5,
    "trigger_precision": 3.5,
    "workflow_quality": 4.0,
    "token_efficiency": 4.0,
    "safety": 4.5,
    "robustness_evaluability": 3.5,
    "portability": 4.5
  },
  "blockers": [],
  "p1_count": 1,
  "p2_count": 1,
  "p3_count": 1,
  "meets_bar": false
}
```
