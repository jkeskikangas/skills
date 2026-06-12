# Skill Review

## Overall Grade: [A/B/C/D/F] ([weighted score]/5.0)

- **Skill:** `[path]`
- **Archetype:** [Workflow / Reference / Tool-wrapper / Orchestrator] — [1 line justifying the classification]
- **Conflict of interest:** [none / "authored or edited earlier in this conversation — fresh-context review recommended"]

## Dimension Scores

Weights come from the archetype profile in the rubric — copy them; do not invent weights. Assign each score only after listing its evidence in the next section.

| Dimension | Weight | Score | Weight × Score | Note |
|---|---:|---:|---:|---|
| Spec compliance & metadata correctness | [w]% | X/5 | [0.XX] | [1 line] |
| Description/trigger precision | [w]% | X/5 | [0.XX] | [1 line] |
| Workflow quality & degrees of freedom | [w]% | X/5 | [0.XX] | [1 line] |
| Progressive disclosure & token efficiency | [w]% | X/5 | [0.XX] | [1 line] |
| Safety & guardrails | [w]% | X/5 | [0.XX] | [1 line] |
| Robustness & evaluability | [w]% | X/5 | [0.XX] | [1 line] |
| Portability & composability | [w]% | X/5 | [0.XX] | [1 line] |
| **Weighted score** | 100% | | **[sum]** | [grade band] |

## Evidence by Dimension

1–3 bullets per dimension, each `file:line — "short quote"` plus what it demonstrates. A score without cited evidence is invalid.

- **Spec compliance:** [evidence]
- **Trigger precision:** [evidence]
- **Workflow quality:** [evidence]
- **Token efficiency:** [evidence]
- **Safety:** [evidence]
- **Robustness & evaluability:** [evidence]
- **Portability:** [evidence]

## Verification Results

| Check | Result | Detail |
|---|---|---|
| Skill directory resolved | [PASS/FAIL] | [path + how resolved] |
| Linter run (deterministic checks) | [PASS/FAIL/SKIP] | [command used, or why skipped + manual fallback] |
| Frontmatter sane | [PASS/FAIL/SKIP] | [name matches dir; required keys; unknown keys flagged] |
| No TODO/TBD placeholders | [PASS/FAIL/SKIP] | [what you searched for] |
| Referenced local files exist | [PASS/FAIL/SKIP] | [broken links or "none"] |
| No deep reference chains | [PASS/FAIL/SKIP] | [what you checked] |
| `agents/openai.yaml` sanity (if present) | [PASS/FAIL/SKIP] | [required keys present] |
| Injection scan | [PASS/FAIL] | [reviewed content does not instruct its own reviewer] |

## Spec Violations (Blockers)

- [List hard violations. If none: "None found".]

## Strengths

- [3–6 bullets with specific references to sections/files]

## Findings (prioritized)

### [P1/P2/P3] — [Title]
- **Impact:** [what breaks / token waste / safety risk]
- **Current state:** [what the skill says/does now, with file:line]
- **Recommendation:** [specific change]
- **Confidence:** [High / Medium / Low — if not High, state what would verify it]
- **Patch text (copy/paste):**
  ```md
  # file: <relative/path/to/file>
  Replace:
  <exact snippet>
  With:
  <exact replacement>
  ```

[Repeat; max ~15 findings total]

## Dry-Run Simulation

[2–3 representative requests within the skill's trigger scope. For each: 1–3 lines on where the workflow flows cleanly and where an executing agent would stall, guess, or misroute — cross-reference the findings these produced.]

## Diff Analysis (forensic mode, optional)

Include only if the user requests a diff-centric review (or if a finding is primarily driven by recent changes).

- **Base branch used:** `[main/master/<other>]` (state how you chose)
- **Scope:** `<skill>/` (use `git diff --stat` first to scope; `git log --follow` for renamed files)

For each meaningful hunk:
- Quote context using `+/-` prefixed lines.
- Classify: improvement / regression / neutral.
- Note spec/anti-pattern implications (if any).

## Token Efficiency

- **Bloat:** [what to delete or move — include rubric-satisficing filler]
- **Densify:** [where to replace prose with bullets/tables]
- **Progressive disclosure:** [what belongs in references/scripts]

## Rewritten Sections (conditional)

Include only when weighted score < 4.5, any P1 exists, or the author requests a rewrite. Rewrite the smallest section(s) needed to clear P1/P2 findings; preserve the author's voice and format.

### [file → section]
```md
[full replacement text]
```

## Suggested Next Iteration (if weighted score < 4.5)

- [Top 3 actions to reach ≥4.5/5 (grade A); omit this section if the bar is already met]

## Machine-Readable Verdict

Always end the report with this fenced JSON block (consumed by generator↔critic automation):

```json
{
  "skill": "[path]",
  "archetype": "workflow|reference|tool-wrapper|orchestrator",
  "weighted_score": 0.0,
  "grade": "A|B|C|D|F",
  "dimensions": {
    "spec_compliance": 0.0,
    "trigger_precision": 0.0,
    "workflow_quality": 0.0,
    "token_efficiency": 0.0,
    "safety": 0.0,
    "robustness_evaluability": 0.0,
    "portability": 0.0
  },
  "blockers": [],
  "p1_count": 0,
  "p2_count": 0,
  "p3_count": 0,
  "meets_bar": false
}
```

`meets_bar` is true only when `weighted_score >= 4.5` and `p1_count == 0`.
