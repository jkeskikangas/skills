# Skill Review

## Overall Grade: [A/B/C/D/F] ([weighted score]/5.0)

- **Skill:** `[path]`
- **Archetype:** [Workflow / Reference / Tool-wrapper / Orchestrator] — [1 line justifying the classification; if classification was uncertain, name the runner-up profile and whether the grade flips under it]
- **Review mode:** [single / batch / comparative / forensic / ensemble / behavioral-probe]
- **Conflict of interest:** [none / "authored or edited earlier in this conversation — fresh-context review recommended"]

## Dimension Scores

Weights come from the archetype profile in the rubric — copy them; do not invent weights. Derive each score from its check results (next section) via the rubric formula; note any holistic adjustment in the Note column.

| Dimension | Weight | Score | Weight × Score | Note |
|---|---:|---:|---:|---|
| Spec compliance & metadata correctness | [w]% | X/5 | [w×s] | [1 line] |
| Description/trigger precision | [w]% | X/5 | [w×s] | [1 line] |
| Workflow quality & degrees of freedom | [w]% | X/5 | [w×s] | [1 line] |
| Progressive disclosure & token efficiency | [w]% | X/5 | [w×s] | [1 line] |
| Safety & guardrails | [w]% | X/5 | [w×s] | [1 line] |
| Robustness & evaluability | [w]% | X/5 | [w×s] | [1 line] |
| Portability & composability | [w]% | X/5 | [w×s] | [1 line] |
| **Weighted score** | 100% | | **[sum, rounded to 2 decimals]** | [grade band] |

## Check Results by Dimension

Per dimension: grade every rubric check PASS/PARTIAL/FAIL/N-A. Group clean PASSes into one line with one representative evidence cite; list every PARTIAL/FAIL/N-A individually with evidence (`file:line — "short quote"`, or the absence you looked for). Close each dimension with `base → final` and a one-line justification for any holistic adjustment. A verdict without evidence is invalid.

- **Spec compliance:** [check verdicts + evidence; base → final]
- **Trigger precision:** [check verdicts + evidence; base → final]
- **Workflow quality:** [check verdicts + evidence; base → final]
- **Token efficiency:** [check verdicts + evidence; base → final]
- **Safety:** [check verdicts + evidence; base → final]
- **Robustness & evaluability:** [check verdicts + evidence; base → final]
- **Portability:** [check verdicts + evidence; base → final]

## Verification Results

| Check | Result | Detail |
|---|---|---|
| Skill directory resolved | [PASS/FAIL] | [path + how resolved] |
| Calibration self-check | [PASS/FAIL/SKIP] | [vignette scored + max dimension delta, or "calibrated earlier this session"] |
| Linter executed | [PASS/SKIP] | [exact command + version, or why skipped + manual fallback] |
| Linter diagnostics | [PASS/FAIL/SKIP] | [zero diagnostics, or the list] |
| Frontmatter sane | [PASS/FAIL/SKIP] | [name matches dir; required keys; unrecognized keys noted] |
| No TODO/TBD placeholders | [PASS/FAIL/SKIP] | [what you searched for] |
| Referenced local files exist | [PASS/FAIL/SKIP] | [broken links or "none"] |
| No deep reference chains | [PASS/FAIL/SKIP] | [what you checked] |
| `agents/openai.yaml` sanity (if present) | [PASS/FAIL/SKIP] | [required keys present] |
| Token metrics measured | [PASS/SKIP] | [description chars; SKILL.md body lines; file count] |
| Injection scan | [PASS/FAIL] | [reviewed content does not instruct its own reviewer] |
| Security: symlinks/escapes | [PASS/FAIL/SKIP] | [command used; what was found] |
| Security: executables/binaries | [PASS/FAIL/SKIP] | [unexpected executables or blobs, or "none"] |
| Security: dangerous commands | [PASS/FAIL/SKIP] | [pipe-to-shell / unpinned installs found, or "none"] |
| Security: allowed-tools least privilege | [PASS/FAIL/SKIP] | [requested vs needed, or "not declared"] |

## Spec Violations (Blockers)

- [List hard violations — every blocker also appears as a P1 finding below and fails the bar regardless of score. If none: "None found".]

## Strengths

- [3–6 bullets with specific references to sections/files]

## Findings (prioritized)

Number findings `P1-1`, `P2-1`, `P3-1`, … — the JSON verdict reuses these ids.

### [P1-1] — [Title]
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

## Behavioral Probe (opt-in mode only)

- **Workflow probe:** [task given to the fresh-context subagent; where it flowed, stalled, guessed, or misrouted; scripts not executed unless the user opted in]
- **Trigger battery:** [5 in-scope + 5 out-of-scope prompts; routing accuracy N/10; misroutes cross-referenced to findings]

## Diff Analysis (forensic mode, optional)

Include only if the user requests a diff-centric review (or if a finding is primarily driven by recent changes).

- **Base branch used:** `[main/master/<other>]` (state how you chose)
- **Scope:** `<skill>/` (use `git diff --stat` first to scope; `git log --follow` for renamed files)

For each meaningful hunk:
- Quote context using `+/-` prefixed lines.
- Classify: improvement / regression / neutral.
- Note spec/anti-pattern implications (if any).

## Token Efficiency

- **Measured:** [description chars; SKILL.md body lines — from the verification metrics]
- **Bloat:** [what to delete or move — include rubric-satisficing filler]
- **Densify:** [where to replace prose with bullets/tables]
- **Progressive disclosure:** [what belongs in references/scripts]

## Rewritten Sections (conditional)

Include only when weighted score < 4.5, any P1 exists, or the author requests a rewrite. Rewrite the smallest section(s) needed to clear P1/P2 findings; preserve the author's voice and format.

### [file → section]
```md
[full replacement text]
```

## Suggested Next Iteration (if the bar is not met)

- [Top 3 actions to reach the bar (weighted score ≥ 4.5, no P1s, no blockers); omit this section if the bar is already met]

## Machine-Readable Verdict

Always end the report with this fenced JSON block (consumed by generator↔critic automation):

```json
{
  "verdict_schema_version": "2.0",
  "rubric_version": "2.0",
  "skill": "[path]",
  "archetype": "workflow|reference|tool-wrapper|orchestrator",
  "review_mode": "single|batch|comparative|forensic|ensemble",
  "weighted_score": null,
  "grade": "A|B|C|D|F",
  "dimensions": {
    "spec_compliance": null,
    "trigger_precision": null,
    "workflow_quality": null,
    "token_efficiency": null,
    "safety": null,
    "robustness_evaluability": null,
    "portability": null
  },
  "metrics": {
    "description_chars": null,
    "skill_md_body_lines": null,
    "file_count": null
  },
  "blockers": [],
  "findings": [
    {
      "id": "P1-1",
      "priority": "P1",
      "title": "",
      "file": "",
      "lines": "",
      "summary": "",
      "patch": "",
      "confidence": "High|Medium|Low"
    }
  ],
  "p1_count": 0,
  "p2_count": 0,
  "p3_count": 0,
  "meets_bar": false
}
```

- Scores use the rubric scale 1.0–5.0; the `null` values above are placeholders to fill, never valid output.
- `findings` embeds every reported finding (`patch` may be empty for P3s; `lines` is a string like "41" or "55-96"); the `p*_count` fields are derived from it.
- `meets_bar` is true only when `weighted_score >= 4.5`, `p1_count == 0`, **and** `blockers` is empty.
