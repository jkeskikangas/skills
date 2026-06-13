# Held-out probe protocol (critic-owned)

The generator can see this rubric, its checks/caps, and the calibration vignettes, so a
generator↔critic loop can converge on artifacts that pass the checklist yet serve users worse
(Goodhart). The held-out probe is the one signal the generator must **not** be able to optimize
against.

**Publishing this *method* is safe; publishing concrete probes is not.** The defense comes from
fresh per-review synthesis, rotation, and a redacted return — not from hiding this file.

## Rules

- **Critic-owned:** only the reviewer (a fresh-context subagent) synthesizes and runs the probes.
  The generator requests a gate; it never authors, reads, selects, or is shown the probes.
- **Never committed:** do not write synthesized probes (or their expected outputs) into the repo,
  the verdict, or any generator-visible message. Generate, run, discard.
- **Rotate every review:** synthesize new probes each run — including across loop iterations of the
  same skill — so there is no fixed hidden target to converge on.
- **Not derived from the rubric/vignettes:** derive probes from the skill's *declared domain and
  description*, never from this rubric's checks or the calibration vignettes.

## Synthesize (per gate: ≥3 probes; ≥1 for a non-gate spot-check)

Cover at least these dimensions; vary wording from the skill's own examples:

1. **In-scope, unfamiliar phrasing** — a real task the skill should handle, worded unlike its own
   examples/eval block.
2. **Realistic messy input** — an edge/error/ambiguous input a real user would actually send.
3. **Adjacent out-of-scope near-miss** — a plausible request the skill should route *away* (it names
   a sibling). Pass = it declines/redirects; fail = it complies anyway.

## Run & judge

- Run each probe via a **fresh-context subagent** given only the reviewed skill and the probe (probe
  freshness). Use a different model than the scorer when more than one is available.
- Judge **outcome correctness**, not merely an unblocked workflow. Ground the judgment in an external
  oracle (a test, a reference result, a citation) whenever one exists; if none exists, say so and
  treat the judgment as form-only (rubric Scoring rules).

## Return contract (redaction)

Return to the generator / loop only:

- `result`: `pass` | `fail`
- `symptom`: ≤1 line — the failure *category* and a fix *direction* (e.g. "produces an unverifiable
  success criterion on multi-file inputs"), **never** the probe text or its expected output.

A held-out **FAIL is recorded as a P1 finding** in the verdict, so it blocks `meets_bar` through the
existing gate (no P1 findings) — weighting the failure above the weighted score, with no schema
change. The generator fixes the **skill** against the symptom; it cannot fix "the probe" because it
never sees one.
