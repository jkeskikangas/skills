# Calibration Vignettes (frozen)

Two fictional skills with canonical scores, serving two purposes: contrastive anchors near the top and bottom of the scale, and a reviewer self-calibration check.

**Protocol:** before your first review in a session, pick one vignette and cold-score all seven dimensions from its fact sheet — do not look at the canonical scores first. Then compare: if any dimension diverges by more than 0.5, re-read the rubric's scoring rules and re-score before reviewing a real target. These vignettes are frozen — never edit them to match drifting scores; a persistent mismatch is a rubric bug to report, not a calibration failure.

## Vignette A — `formatting-changelogs` (canonical: A, 4.83)

Fact sheet (workflow archetype):
- Frontmatter: `name` matches the directory; description 240 chars, third person: "Formats commit history into Keep-a-Changelog Markdown. ... Use when asked to draft, update, or lint CHANGELOG.md. Not for generating release artifacts (use packaging-releases)."
- Body 96 lines; 4-step workflow (discover commits → group by type → write entries → validate against a 6-point checklist); the loop is bounded: "at most 2 validation passes, then report residual issues instead of looping."
- Exact conventions table inline; the long worked example lives in references/example-changelog.md; references are one level deep; no duplicated content.
- Write surface is exactly one file, gated: "show the diff and ask before saving CHANGELOG.md." No other risk surface; no safety boilerplate beyond that.
- Capability language throughout; no embedded installs or shell commands; no scripts; no platform declaration needed.
- Ships 3 eval scenarios with expected outputs in references/evals.md.
- One implicit decision: how to treat merge commits is never stated.

Canonical scores (workflow profile): spec 5.0, trigger 5.0, workflow 4.5, token 5.0, safety 5.0, robustness 4.5, portability 4.5.
Weighted: (20×5 + 15×5 + 20×4.5 + 15×5 + 15×5 + 10×4.5 + 5×4.5) / 100 = 4.825 → rounds to **4.83 = A**. No blockers; no P1s (the merge-commit gap is a P2).

## Vignette D — `data-helper` (canonical: D, 1.88)

Fact sheet (workflow archetype):
- Frontmatter: `name` is `data-helper` (generic; not gerund form); description 38 chars: "Helps with data tasks in any project." — no artifact types, no file patterns, no "when not to use".
- Body 210 lines of prose with no numbered steps; contains a literal "TODO: add examples" placeholder; directives like "clean the data as appropriate using best practices."
- Instructs the agent to run an unpinned `pip install pandas` and to overwrite input files in place without confirmation.
- No validation steps, no success criteria, no references; a "tips" paragraph is repeated three times nearly verbatim.
- Tool mentions are product-specific with no fallback and no declared platform scope.

Canonical scores (workflow profile): spec 2.0, trigger 1.5, workflow 1.5, token 2.5, safety 2.0, robustness 1.5, portability 2.5.
Weighted: (20×2 + 15×1.5 + 20×1.5 + 15×2.5 + 15×2 + 10×1.5 + 5×2.5) / 100 = 1.875 → rounds to **1.88 = D**. Blockers: the TODO placeholder (also recorded as P1-1); the unpinned install and the ungated in-place overwrite are P1 safety findings, so `meets_bar` is false on three independent grounds.
