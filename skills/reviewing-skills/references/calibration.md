# Calibration Vignettes (frozen)

Three fictional skills with canonical scores, serving two purposes: contrastive anchors near the top, middle, and bottom of the scale, and a reviewer self-calibration check.

**Protocol (canonical — other files point here):** before your first review in a session, and before reading any target file content, pick one vignette and cold-score all seven dimensions from its fact sheet — do not look at the canonical scores first. Then compare: if any dimension diverges by more than 0.5, re-read the rubric's scoring rules and re-score before reviewing a real target. These vignettes are frozen — never edit them to match drifting scores; a persistent mismatch is a rubric bug to report, not a calibration failure.

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

## Vignette C — `syncing-locale-files` (canonical: C, 3.35)

Fact sheet (workflow archetype):
- Frontmatter: `name` matches the directory; description 150 chars, third person, names `locales/*.json` as the artifact — but the when-clause is one vague, redundantly phrased sentence ("Use when working with translations."), and the body claims to "support the latest i18n format" with no web access declared.
- A sibling `translating-content` skill is visible in the same repo and its description also claims translation-file work; the overlap is real.
- Body 240 lines, mostly prose. Steps are ordered and discovery → plan → execution → validation are separated, but conflict resolution between locale files is left to judgment, "ensure keys are consistent" has no observable completion state, and the cleanup loop says "repeat until clean" with no bound.
- Key-naming rules are stated twice (sections 2 and 5); a long format guide lives inline instead of in `references/`; links are one level deep.
- Risk surface: writes to `locales/*.json` and calls a machine-translation API, but only the writes are acknowledged; bulk deletes are gated, in-place rewrites are not.
- Validates only that files still parse as JSON after each write; no statement of what end-to-end success looks like; no eval material; mechanical key-sorting is delegated to an exact, repeatable rule.
- Steps invoke `i18next-parser` and a named editor command with no capability fallback; no declared platform scope; no adapters; composes with the translation skill.

Canonical scores (workflow profile): spec 4.0, trigger 3.0, workflow 3.5, token 3.0, safety 3.5, robustness 2.5, portability 3.5.
Weighted: (20×4 + 15×3 + 20×3.5 + 15×3 + 15×3.5 + 10×2.5 + 5×3.5) / 100 = 3.35 → **C**. No blockers; the ungated in-place rewrite is a P1 safety finding — a P1 *without* blocker status (see the rubric's blocker registry) — so `meets_bar` is false on both score and P1 grounds.

## Vignette D — `data-helper` (canonical: D, 1.88)

Fact sheet (workflow archetype):
- Frontmatter: `name` is `data-helper` (generic; not gerund form); description 38 chars: "Helps with data tasks in any project." — no artifact types, no file patterns, no "when not to use".
- Body 210 lines of prose with no numbered steps; contains a literal "TODO: add examples" placeholder; directives like "clean the data as appropriate using best practices."
- Instructs the agent to run an unpinned `pip install pandas` and to overwrite input files in place without confirmation.
- No validation steps, no success criteria, no references; a "tips" paragraph is repeated three times nearly verbatim.
- Tool mentions are product-specific with no fallback and no declared platform scope.

Canonical scores (workflow profile): spec 2.0, trigger 1.5, workflow 1.5, token 2.5, safety 2.0, robustness 1.5, portability 2.5.
Weighted: (20×2 + 15×1.5 + 20×1.5 + 15×2.5 + 15×2 + 10×1.5 + 5×2.5) / 100 = 1.875 → rounds to **1.88 = D**. Blockers per the registry: the TODO placeholder (recorded as P1-1) and the instruction to run an unpinned `pip install` (dangerous embedded command, P1-2). The ungated in-place overwrite is a further P1 safety finding — a P1 without blocker status. `meets_bar` is false on score, P1s, and blockers alike.

## Reviewer regression protocol

After any rubric, template, or reviewer-model change, cold-score **all** vignettes (not just one) and compare: every dimension within ±0.5 of canonical and every grade letter exact. A miss means the change altered scoring behavior — fix the rubric or document the intentional recalibration before reviewing real targets. Routine sessions still calibrate against a single vignette.
