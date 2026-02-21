# Skill Review

## Overall Grade: [A/B/C/D/F] ([weighted score]/5.0)

## Dimension Scores

| Dimension | Weight | Score | Notes |
|---|---:|---:|---|
| Spec compliance & metadata correctness | 20% | X/5 | [1 line] |
| Description/trigger precision | 15% | X/5 | [1 line] |
| Workflow quality & degrees of freedom | 20% | X/5 | [1 line] |
| Progressive disclosure & token efficiency | 15% | X/5 | [1 line] |
| Safety & guardrails | 15% | X/5 | [1 line] |
| Robustness (validation, scripts) | 10% | X/5 | [1 line] |
| Portability & composability | 5% | X/5 | [1 line] |

## Verification Results

| Check | Result | Detail |
|---|---|---|
| Skill directory resolved | [PASS/FAIL] | [path + how resolved] |
| Frontmatter sane | [PASS/FAIL/SKIP] | [name matches dir; required keys present] |
| No TODO/TBD placeholders | [PASS/FAIL/SKIP] | [what you searched for] |
| Referenced local files exist | [PASS/FAIL/SKIP] | [broken links or "none"] |
| No deep reference chains | [PASS/FAIL/SKIP] | [what you checked] |
| `agents/openai.yaml` sanity (if present) | [PASS/FAIL/SKIP] | [required keys present] |
| Optional validation script run | [PASS/FAIL/SKIP] | [command used or why skipped] |

## Spec Violations (Blockers)

- [List hard violations. If none: "None found".]

## Strengths

- [3–6 bullets with specific references to sections/files]

## Findings (prioritized)

### [P1/P2/P3] — [Title]
- **Impact:** [what breaks / token waste / safety risk]
- **Current state:** [what the skill says/does now]
- **Recommendation:** [specific change]
- **Patch text (copy/paste):**
  ```md
  # file: <relative/path/to/file>
  Replace:
  <exact snippet>
  With:
  <exact replacement>
  ```

[Repeat; max ~15 findings total]

## Diff Analysis (forensic mode, optional)

Include only if the user requests a diff-centric review (or if a finding is primarily driven by recent changes).

- **Base branch used:** `[main/master/<other>]` (state how you chose)
- **Scope:** `<skill>/`

For each meaningful hunk:
- Quote context using `+/-` prefixed lines.
- Classify: improvement / regression / neutral.
- Note spec/anti-pattern implications (if any).

## Token Efficiency

- **Bloat:** [what to delete or move]
- **Densify:** [where to replace prose with bullets/tables]
- **Progressive disclosure:** [what belongs in references/scripts]

## Suggested Next Iteration (if not A-)

- [Top 3 actions to reach ≥4.5/5; omit if already meets bar]
