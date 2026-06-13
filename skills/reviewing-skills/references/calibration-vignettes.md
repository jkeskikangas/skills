# Calibration Vignettes (frozen)

Seven fictional skills spanning the grade scale and all four archetypes, serving two purposes: contrastive anchors and a reviewer self-calibration check. Canonical scores live in the sibling `calibration-answers.md` (linked from SKILL.md) — **do not open that file until you have written your cold scores down**; the protocol depends on scoring blind, which is why this file contains no scores and the vignettes carry neutral numbers instead of grade-hinting names.

**Coverage:** vignettes 1, 3, 7 are *workflow*; 2 is *tool-wrapper*; 5 is *reference/knowledge*; 6 is *orchestrator* — so every archetype weight profile is exercised. Vignette 7 is *adversarial*: a skill engineered to pass surface checks while being low-quality (rubric-gaming), used to train satisficing detection and the critical-check caps.

**Provenance of the canonical scores:** each vignette's fact sheet was authored to a target grade, then its per-check verdicts were scored with `scripts/score.py compute` so the canonical weighted score, grade, and any caps are the *script's* output, not a hand-estimate. That is why a persistent mismatch is a rubric/scorer bug to report (the arithmetic is mechanical), not a judgement call. The fact sheets are the ground truth for *check verdicts*; the script derives the rest.

**Protocol (canonical — other files point here):** before your first review in a session, and before reading any target file content, pick one vignette and cold-score all seven dimensions from its fact sheet. Write the scores into your draft, then open `calibration-answers.md` and compare: if any dimension diverges by more than 0.5, re-read the rubric's scoring rules and re-score before reviewing a real target. If the session was compacted or summarized since you last calibrated, re-calibrate using a vignette whose canonical scores you have not seen this session; if none remain, state in the report that calibration is stale and proceed with caution. These vignettes are frozen — never edit them to match drifting scores; a persistent mismatch is a rubric bug to report, not a calibration failure.

## Vignette 1 — `formatting-changelogs` (workflow archetype)

Fact sheet:
- Frontmatter: `name` matches the directory; description 240 chars, third person: "Formats commit history into Keep-a-Changelog Markdown. ... Use when asked to draft, update, or lint CHANGELOG.md. Not for generating release artifacts (use packaging-releases)."
- Body 96 lines; 4-step workflow (discover commits → group by type → write entries → validate against a 6-point checklist); the loop is bounded: "at most 2 validation passes, then report residual issues instead of looping."
- Exact conventions table inline; the long worked example lives in references/example-changelog.md; references are one level deep; no duplicated content.
- Write surface is exactly one file, gated: "show the diff and ask before saving CHANGELOG.md." No other risk surface; no safety boilerplate beyond that.
- Capability language throughout; no embedded installs or shell commands; no scripts; no platform declaration needed.
- Ships 3 eval scenarios with expected outputs in references/evals.md, exercised by the validation checklist.
- One implicit decision: how to treat merge commits is never stated.

## Vignette 2 — `converting-media-files` (tool-wrapper archetype)

Fact sheet:
- Frontmatter: `name` matches the directory; description 210 chars, third person, names audio/video files and target formats: "Use when asked to convert, transcode, or compress media files." No "when not to use" clause anywhere. A sibling `editing-videos` skill is visible; its description covers cutting/joining, not conversion — no overlap.
- Body 140 lines wrapping a bundled `scripts/convert.sh` around ffmpeg; claims to "support all modern codecs including the latest AV2 builds" with no web access declared.
- 4-step workflow (probe input with ffprobe → pick preset → run script → verify output codec/duration against the request): ordered, exact command templates where fragile, discovery → plan → execution → validation separated. Preset choice when the user names no target format is only partially specified (a table covers common cases; silence on the rest). The error path says "retry the conversion until it succeeds" with no bound.
- A 30-line flag/preset matrix sits inline in SKILL.md though only the script consumes it; references are one level deep; no duplicated content; no filler.
- Risk surface: writes output media files and runs ffmpeg via the script. The script's `--in-place` mode overwrites the source file without confirmation. No `allowed-tools` declared. Flag templates are exact and vetted; ffmpeg itself is assumed present with no version constraint, but the skill never instructs installing anything.
- Output verified with an ffprobe checklist (codec, duration, container) after each run — but no statement of what end-to-end success looks like beyond "the file plays", and no eval material ships. The script exits nonzero with actionable messages and is deterministic, but does not validate its inputs. Mechanical steps are fully delegated to the script.
- Capability language throughout except one step: "open the result in QuickTime to spot-check" with no fallback. No declared platform scope; no adapters; composes with a downstream publishing skill.

## Vignette 3 — `syncing-locale-files` (workflow archetype)

Fact sheet:
- Frontmatter: `name` matches the directory; description 150 chars, third person, names `locales/*.json` as the artifact — but the when-clause is one vague, redundantly phrased sentence ("Use when working with translations."), and the body claims to "support the latest i18n format" with no web access declared.
- A sibling `translating-content` skill is visible in the same repo and its description also claims translation-file work; the overlap is real.
- Body 240 lines, mostly prose. Steps are ordered and discovery → plan → execution → validation are separated, but conflict resolution between locale files is left to judgment, "ensure keys are consistent" has no observable completion state, and the cleanup loop says "repeat until clean" with no bound.
- Key-naming rules are stated twice (sections 2 and 5); a long format guide lives inline instead of in `references/`; links are one level deep.
- Risk surface: writes to `locales/*.json` and calls a machine-translation API, but only the writes are acknowledged; bulk deletes are gated, in-place rewrites are not.
- Validates only that files still parse as JSON after each write; no statement of what end-to-end success looks like; no eval material; mechanical key-sorting is delegated to an exact, repeatable rule.
- Steps invoke `i18next-parser` and a named editor command with no capability fallback; no declared platform scope; no adapters; composes with the translation skill.

## Vignette 4 — `data-helper` (workflow archetype)

Fact sheet:
- Frontmatter: `name` is `data-helper` (generic; not gerund form); description 38 chars: "Helps with data tasks in any project." — no artifact types, no file patterns, no "when not to use".
- Body 210 lines of prose with no numbered steps; contains a literal "TODO: add examples" placeholder; directives like "clean the data as appropriate using best practices."
- Instructs the agent to run an unpinned `pip install pandas` and to overwrite input files in place without confirmation.
- No validation steps, no success criteria, no references; a "tips" paragraph is repeated three times nearly verbatim.
- Tool mentions are product-specific with no fallback and no declared platform scope.

## Vignette 5 — `naming-react-components` (reference/knowledge archetype)

Fact sheet:
- Frontmatter: `name` matches the directory; description 280 chars, third person, names the artifact and when: "Conventions for naming React components, hooks, and files. Use when choosing or reviewing component/hook names. Not for file-system scaffolding (use generating-components)." Proportional length; only `name`/`description` keys; no placeholders; no time-sensitive claims.
- A curated reference, not a process: ~70-line body holding a naming-rules table and a complete decision table (PascalCase components, `use`-prefixed hooks, colocation rules), consulted by the agent while it does other work. There is a short "how to apply these rules" lead-in (two ordered steps, decision-complete for the cases the table covers); the skill has no fragile output to test, no degrees-of-freedom calls, no iterative loop, and no discovery→execution phases — those workflow checks genuinely do not apply.
- Heavy material (an exhaustive worked naming catalogue) lives in `references/`; references are one level deep; no duplicated rules; no filler.
- Read-only: it produces names/advice, never edits files. No `allowed-tools`; no embedded commands; no destructive surface, and no safety boilerplate pretending otherwise.
- Ships a short `references/examples.md` of `input → correct name` pairs that the lead-in tells the agent to check against — concrete and third-party-verifiable. The body states a self-check ("every name matches exactly one rule") but never spells out what a fully-named component tree should look like end to end.
- Capability language throughout except one line naming a specific framework CLI with no fallback; no declared platform scope; composes with a component-generator skill.

## Vignette 6 — `shipping-release-notes` (orchestrator archetype)

Fact sheet:
- Frontmatter: `name` matches the directory; description 300 chars, third person, names the trigger and the sub-skills it drives: "Orchestrates drafting and reviewing release notes by composing writing-changelogs and reviewing-prose. Use when cutting a release. Not for versioning or tagging." A sibling `publishing-releases` skill is visible; whether their triggers collide was not checked.
- Body 150 lines: an ordered pipeline (collect merged PRs → invoke `writing-changelogs` → invoke `reviewing-prose` → revise → publish-draft), discovery→plan→execution→validation separated, exact hand-off payloads where fragile. One hand-off is underspecified: when the reviewer returns mixed verdicts, whether to re-draft or ship-with-caveats is left to judgment. The draft↔review loop says "iterate until the notes read well" with no bound.
- Heavy templates live in `references/`; references one level deep; the sub-skill invocation contract is restated once in a way that partly duplicates `writing-changelogs`' own description.
- Read-only orchestration plus one gated write (the draft file, shown before saving); no other risk surface; no irrelevant boilerplate.
- Validates that each sub-skill returned the expected shape between iterations; states partial end-to-end success criteria ("notes cover every user-facing PR") but ships an `evals` section that is vague scenarios with no expected outputs and is never exercised by the workflow. No scripts. Mechanical PR-grouping is delegated to an exact rule.
- Capability language throughout; no declared platform scope; composes by construction, though the tight coupling to the two named sub-skills is only partially abstracted.

## Vignette 7 — `optimizing-workflows` (workflow archetype — adversarial / rubric-gaming)

Fact sheet — a skill visibly engineered to *look* complete and pass surface checks while delivering little:
- Frontmatter: `name` matches the directory; description 360 chars that names what ("optimize and improve any workflow or process") but pads the when-clause with three near-synonym scenarios and a tacked-on "Not for unrelated tasks." negative clause that names no real boundary. Valid keys; no placeholders; no time-sensitive claims. The positive trigger is so generic it matches almost any request — there is no artifact type, file pattern, or concrete scenario.
- Body has many numbered steps, but the pivotal one is "optimize as appropriate using industry best practices" — not decision-complete; a stop line exists ("repeat up to 3 times"); discovery/plan/execution/validation are nominally separated.
- A "Tips" block is repeated nearly verbatim in two sections; the body is padded; it carries a destructive-operations safety subsection and a permissions warning although the skill only reads and advises (read-only) — boilerplate with no matching risk surface.
- Ships an "Evaluation" section that lists vague scenarios with no expected outputs and is never referenced by the workflow; a validation checklist exists but there is no statement of what a successfully optimized workflow looks like, and no verifiable expected output anywhere.
- Capability language is mixed; no declared platform scope; no visible siblings; composes with nothing in particular.
