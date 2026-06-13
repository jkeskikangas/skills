# Calibration Answer Key (frozen)

Open only **after** cold-scoring per the protocol in `calibration-vignettes.md` (linked from SKILL.md). Like the vignettes, these canonical scores are frozen — a persistent mismatch is a rubric bug to report, not a calibration failure.

## Vignette 1 — `formatting-changelogs` (canonical: A, 4.83)

Canonical scores (workflow profile): spec 5.0, trigger 5.0, workflow 4.5, token 5.0, safety 5.0, robustness 4.5, portability 4.5.
Weighted: (20×5 + 15×5 + 20×4.5 + 15×5 + 15×5 + 10×4.5 + 5×4.5) / 100 = 4.825 → rounds to **4.83 = A**. No blockers; no P1s (the merge-commit gap is a P2). All dimensions clear the 3.5 floor.

## Vignette 2 — `converting-media-files` (canonical: B, 3.95)

Canonical scores (tool-wrapper profile): spec 4.5, trigger 4.0, workflow 4.0, token 4.5, safety 4.0, robustness 3.0, portability 4.5.
Weighted: (15×4.5 + 15×4 + 15×4 + 10×4.5 + 20×4 + 20×3 + 5×4.5) / 100 = 3.95 → **B**. No blockers; the ungated `--in-place` overwrite is a P1 safety finding *without* blocker status. `meets_bar` is false three ways: score < 4.5, an open P1, and the robustness floor (3.0 < 3.5).
Key derivations: spec 7/8 PASS (the time-sensitive codec claim fails check 8) → 4.5; trigger 3/4 (no negative triggers) → 4.0; workflow 4 PASS + 1 PARTIAL (preset decision underspecified) + 1 FAIL (unbounded retry) → 4.0; token 4 PASS + 1 PARTIAL (inline flag matrix) → 4.6 → 4.5; safety 3 PASS + 1 PARTIAL (ffmpeg version unconstrained) + 1 FAIL (ungated overwrite), `allowed-tools` N-A → 3.8 → 4.0; robustness PASS/FAIL/FAIL/PARTIAL/PASS → 3.0; portability PARTIAL/N-A/PASS/PASS → 4.33 → 4.5.

## Vignette 3 — `syncing-locale-files` (canonical: C, 3.35)

Canonical scores (workflow profile): spec 4.0, trigger 3.0, workflow 3.5, token 3.0, safety 3.5, robustness 2.5, portability 3.5.
Weighted: (20×4 + 15×3 + 20×3.5 + 15×3 + 15×3.5 + 10×2.5 + 5×3.5) / 100 = 3.35 → **C**. No blockers; the ungated in-place rewrite is a P1 safety finding — a P1 *without* blocker status (see the rubric's blocker registry) — so `meets_bar` is false on score and P1 grounds, and on the dimension floor as well (trigger 3.0, token 3.0, robustness 2.5 all sit below 3.5).

## Vignette 4 — `data-helper` (canonical: D, 1.88)

Canonical scores (workflow profile): spec 2.0, trigger 1.5, workflow 1.5, token 2.5, safety 2.0, robustness 1.5, portability 2.5.
Weighted: (20×2 + 15×1.5 + 20×1.5 + 15×2.5 + 15×2 + 10×1.5 + 5×2.5) / 100 = 1.875 → rounds to **1.88 = D**. Blockers per the registry: the TODO placeholder (registry item 4, recorded as P1-1) and the instruction to run an unpinned `pip install` (dangerous embedded command, registry item 7, P1-2). The ungated in-place overwrite is a further P1 safety finding — a P1 without blocker status. `meets_bar` is false on score, floors, P1s, and blockers alike.

## Vignette 5 — `naming-react-components` (canonical: A, 4.90)

Canonical scores (reference profile): spec 5.0, trigger 5.0, workflow 5.0, token 5.0, safety 5.0, robustness 4.5, portability 4.5.
Weighted: (20×5 + 20×5 + 5×5 + 25×5 + 10×5 + 10×4.5 + 10×4.5) / 100 = 4.90 → **A**. No blockers; no P1s.
Key derivations: workflow scores from only its two applicable checks (c1, c2 PASS; c3–c6 **N-A** — a reference skill has no fragile output to test, no freedom calls, no loops, no discovery→execution phases) → 5.0, but 4/6 N-A trips the scorer's low-signal warning: report this dimension as low-signal, do not treat the 5.0 as strong evidence. robustness c2 PARTIAL (states a self-check but no end-to-end success picture) → 4.5; the decorative-eval trap does **not** apply — its `input → correct name` pairs are concrete and exercised (c3 PASS). portability c1 PARTIAL (one framework-CLI line without a fallback) → 4.5. The CLI line is a P3 and the missing end-to-end success statement a P2; `meets_bar` would still require a probe. *Lesson: N-A is correct, not evasive, for workflow checks on a pure reference skill — and a mostly-N-A dimension is low-signal even at 5.0.*

## Vignette 6 — `shipping-release-notes` (canonical: B, 4.43)

Canonical scores (orchestrator profile): spec 5.0, trigger 4.5, workflow 4.0, token 4.5, safety 5.0, robustness 3.5, portability 4.5.
Weighted: (15×5 + 15×4.5 + 25×4 + 10×4.5 + 15×5 + 10×3.5 + 10×4.5) / 100 = 4.425 → rounds to **4.43 = B**. No blockers.
Key derivations: trigger c4 PARTIAL (sibling `publishing-releases` collision unchecked) → 4.5; workflow 4 PASS + 1 PARTIAL (mixed-verdict hand-off underspecified) + 1 FAIL (the draft↔review loop has no stop condition, c5) → 4.0 — the unbounded loop is a **P1** (orchestrator failure loop), without blocker status; token c4 PARTIAL (sub-skill contract partly duplicated) → 4.5; robustness c1 PASS, c2 PARTIAL, c3 FAIL (the `evals` section is decorative — vague, no expected outputs, never exercised → counts as Dimension 4 filler too), c4 N-A, c5 PASS → 3.5 (at the floor, not below). `meets_bar` is false on the open P1 and on score (4.43 < 4.5). *Lesson: for an orchestrator, Dimension 3 carries the heaviest weight (25) — a single unbounded hand-off loop is both a P1 and the largest drag on the grade.*

## Vignette 7 — `optimizing-workflows` (canonical: B, 3.55 — adversarial / rubric-gaming)

Canonical scores (workflow profile): spec 4.5, trigger **3.0 (capped)**, workflow 4.0, token 3.0, safety 3.5, robustness **2.5 (cap enforced, non-biting)**, portability 3.5.
Weighted: (20×4.5 + 15×3.0 + 20×4.0 + 15×3.0 + 15×3.5 + 10×2.5 + 5×3.5) / 100 = 3.55 → **B**. No blockers (frontmatter valid, no placeholder, no dangerous command).
Key derivations and the gaming lesson:
- **trigger** c1 *(critical)* FAIL — the generic "optimize anything" trigger matches everything, so there is no usable positive trigger — even though the skill games c2 (a hollow "Not for unrelated tasks." negative clause) and c3 (avoids the literal word "helper") to PASS; c4 is **N-A** (no visible siblings, per Dimension 2). Uncapped base is 3.5; the **critical cap of 3.0 bites** → 3.0. (Rubric 2.4: the scorer applies this cap from the c1 FAIL automatically.)
- **token** c4 FAIL (duplicated "Tips") + c5 FAIL (the hollow "Evaluation" section and the irrelevant destructive-op safety subsection are rubric-satisficing filler — scored as bloat here, never as compliance in safety or robustness) + c1 PARTIAL → 3.0.
- **safety** c3 FAIL (destructive-operation boilerplate on a read-only skill = filler), c4 *(critical)* PASS so no safety cap → 3.5.
- **robustness** c2 *(critical, success verifiable)* FAIL and c3 FAIL (decorative evals); base is already 2.5, so the enforced `cap` of 3.0 does **not** bite — a cap is a ceiling, not a floor.
- **workflow** c2 (decision-complete) FAIL, but c2 is **not** critical in Dimension 3, so the dimension still posts 4.0 — a gamed skill can show a respectable workflow number.
Without the critical caps the trigger dimension would read 3.5 and the weighted score 3.63 (still B); the caps and the filler-as-bloat rule are what keep the grade honest. Note the canonical 3.55 is **band-uncertain** (within 0.05 of the 3.5 B/C edge), though not gate-relevant here. `meets_bar` is false many ways. *Lesson: surface polish cannot rescue a skill that cannot be triggered or verified — critical-check caps and Dimension 4 filler scoring are the rubric's anti-gaming teeth.*

## Reviewer regression protocol

After any rubric, template, scorer, or reviewer-model change, cold-score **all seven** vignettes (not just one) and compare: every dimension within ±0.5 of canonical, every grade letter exact, and every enforced cap, band-uncertain flag, and `band_stability` / gate-fragility result reproduced (Vignette 7's trigger cap must bite to 3.0 — now applied automatically from the c1 FAIL; its robustness cap must be recorded but non-biting; and 3.55 must flag band-uncertain). Also run `python3 scripts/score_test.py` — it pins these as automated assertions. A miss means the change altered scoring behavior — fix the rubric or document the intentional recalibration in the CHANGELOG before reviewing real targets. Additionally, run a fresh-context self-review of this skill: it must still meet the quality bar. Treat that result asymmetrically — a failure is actionable regression signal; a pass confirms self-consistency, never rubric validity. Routine sessions still calibrate against a single vignette (rotate the archetype so reference and orchestrator profiles get exercised too).
