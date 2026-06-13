# Changelog — reviewing-skills

## 2.3 (2026-06-13) — rubric 2.3, verdict schema 2.3

Reproducibility, coverage, and anti-gaming pass. Targets the gaps that let two reviewers diverge or let a polished-but-bad skill pass.

**Scoring reproducibility**
- **Uniform verdict-level definitions** for PASS / PARTIAL / FAIL / N-A — PARTIAL now requires a *named* gap and may not be used as a hedge for uncertainty (the largest source of inter-rater drift).
- **No-halo rule:** each dimension is scored only on its own evidence; one dimension's verdict may not color another's.
- **Band-edge uncertainty:** `score.py compute` flags a weighted score within 0.05 of any grade-band boundary; a `meets_bar` claim that is band-uncertain at the 4.5 gate (`[4.5, 4.55)`) now requires ensemble mode (`validate`-enforced).

**Coverage of what matters**
- **Critical checks + dimension caps:** a FAIL on a *(critical)* check (Dimension 2 c1 strong positive trigger, Dimension 5 c4 no-bypass/data-not-instructions, Dimension 6 c2 success-verifiable) caps that dimension's final at 3.0. New optional `cap` field per dimension; the scorer enforces `final = min(cap, base + adjustment)` and exempts caps from the ±0.15 net-adjustment limit.
- **Routing cap:** a measured trigger battery now caps Dimension 2 by accuracy (≥18/20 → 5.0, 14–17 → 3.0, <14 → 2.0) instead of only informing findings.
- **Domain correctness:** added as Dimension 3 advisory check 7 and a gate rule — a skill encoding domain claims cannot pass on structure alone; `meets_bar` requires the probe to judge outcome correctness, and `probe_skip_reason` may not skip correctness. New report field; form-only grades are flagged in `maintenance_notes`.
- **Default probe:** a full review now runs at least the lightweight workflow probe by default (mental-only simulation is a stated fallback), and the probe judges result correctness, not just flow.

**Evidence integrity**
- New `score.py verify-evidence <verdict.json> <dir>` mechanically re-grounds findings: cited file exists, line range in range, quoted `Replace …` snippet present verbatim — closing the fabrication loop the way `compute` closed the arithmetic loop.

**Calibration**
- Calibration set expanded to **seven** vignettes covering all four archetypes: added Vignette 5 (`naming-react-components`, reference) and Vignette 6 (`shipping-release-notes`, orchestrator), plus Vignette 7 (`optimizing-workflows`, adversarial / rubric-gaming) exercising the critical-check caps and filler-as-bloat scoring.
- Canonical scores are now documented as `score.py compute` output over authored per-check verdicts (provenance), and the regression protocol cold-scores all seven and reproduces caps and band-uncertain flags.

## 2.2 (2026-06-13) — rubric 2.2, verdict schema 2.2

**Validity fixes**
- Calibration split into `references/calibration-vignettes.md` (fact sheets + protocol) and `references/calibration-answers.md` (canonical scores + regression protocol) so cold-scoring is actually blind; vignettes renumbered 1–4 to stop grade-letter leakage; added Vignette 2 (`converting-media-files`) — the first non-workflow (tool-wrapper) anchor and the first B-grade anchor.
- `score.py compute` enforces the rubric's per-dimension check counts; `validate` recomputes every dimension score from its embedded checks and the weighted score from the archetype weights. The verdict now embeds per-check verdicts, so generator↔critic automation sees *which* checks failed.
- The quality bar is non-compensatory: every dimension final must be ≥ 3.5; gates additionally require the behavioral probe or a recorded `probe_skip_reason`. Canonical bar definition consolidated in the rubric's Scoring rules.

**Scoring changes**
- Net holistic-adjustment cap: |Σ weight × adj| / 100 ≤ 0.15, scorer-enforced — adjustments can no longer move a grade band on their own. Each non-zero adjustment carries an `adjustment_note`.
- Base rounding switched from half-up to half-even at exact midpoints (removes systematic upward bias). No canonical vignette score changes; regression protocol re-run against all four vignettes.
- Advisory checks are excluded from the compute input entirely (previously ambiguously recorded as N-A).

**Scope & robustness**
- Invocation-model classification (dispatched / user-invoked / both); Dimension 2 re-scopes to invocation ergonomics for `disable-model-invocation: true` skills.
- Dimension 6 check 3 gained a quality bar for eval material (concrete inputs, third-party-verifiable expected outputs, exercised by the workflow); decorative evals fail and count as Dimension 4 filler.
- Injection scan broadened beyond reviewer-addressed imperatives (conditional injections, "the assistant"-addressed instructions, payloads in comments/strings); new quarantine option for untrusted sources.
- Verdict-stability rule: an unchanged artifact reproduces its verdict; disputes re-examine the contested check's evidence, never the holistic adjustment.
- No-subagent fallback with a new `independence` verdict field.
- New **incremental** review depth for generator↔critic loops: diff-scoped re-scoring against `base_verdict_commit`; gates still require a fresh full review.
- Trigger battery: 10+10 forced-choice prompts for gates (5+5 short battery retained for non-gate runs).
- Token metrics now include token estimates (words × 1.33) and the hot-path context footprint.
- New verdict fields: `invocation_model`, `independence`, `probe_skip_reason`, `base_verdict_commit`, `reviewer_models` (ensemble jury), `maintenance_notes`; `blockers` are structured objects (`registry_item` + `finding_id`). New `validate-fleet` subcommand; informative JSON Schema at `references/verdict.schema.json` (score.py remains canonical).
- New edge cases: target skill loaded in the current session / self-review (fresh-context delegation + asymmetric evidence), nested/plugin-namespaced skills, post-compaction recalibration.
- Report budget (~350 lines excluding the verdict) and structured dry-run traces (clean / stall / guess / misroute per step).
- `reviewed_commit` gains a `-dirty` marker for uncommitted working trees; incremental depth requires a clean `base_verdict_commit` (found by the post-bump fresh-context self-review smoke test, which scored the 2.2 stack A 4.93 with no blockers).

## 2.1

Baseline: archetype weight profiles, blocker registry, calibration vignettes (single file), triage depth, behavioral probe, ensemble/batch/comparative modes, `score.py compute`/`validate`.
