# Skill Review (Example)

## Overall Grade: B (4.1/5.0)

## Dimension Scores

| Dimension | Weight | Score | Notes |
|---|---:|---:|---|
| Spec compliance & metadata correctness | 20% | 4.5/5 | Frontmatter valid; minor placeholder wording. |
| Description/trigger precision | 15% | 3.5/5 | “When to use” is broad; add file-type triggers. |
| Workflow quality & degrees of freedom | 20% | 4.0/5 | Solid steps; missing stop condition for loops. |
| Progressive disclosure & token efficiency | 15% | 4.0/5 | Slightly verbose; move long examples to references. |
| Safety & guardrails | 15% | 4.5/5 | Good secret policy; add explicit “no destructive ops”. |
| Robustness (validation, scripts) | 10% | 3.5/5 | Needs a validation checklist for outputs. |
| Portability & composability | 5% | 4.5/5 | Mostly capability-based; one vendor tool mention. |

## Spec Violations (Blockers)

- None found.

## Strengths

- Clear, structured workflow with numbered steps.
- Good separation between overview and execution.
- Explicit “when to use” examples (needs tightening).

## Findings (prioritized)

### P1 — Add a stop condition for the iteration loop
- **Impact:** Infinite refinement loops waste tokens and time.
- **Current state:** “Iterate until it’s good.”
- **Recommendation:** Add max loops + score threshold.
- **Patch text (copy/paste):**
  ```md
  # file: SKILL.md
  Replace:
  Iterate until it’s good.
  With:
  Iterate up to 3 times; stop early when score ≥4.5/5 and no P1 findings.
  ```
