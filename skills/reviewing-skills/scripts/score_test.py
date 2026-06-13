#!/usr/bin/env python3
"""Tests for score.py (stdlib unittest, no deps). Run: python3 scripts/score_test.py

Covers the canonical calibration vignettes, the band-edge / banding rules, the enforced
critical-check caps (rubric 2.4), band-stability / gate-fragility, the non-compensatory
floor, the net-adjustment cap, triage/incremental null constraints, and a round-trip of the
shipped worked example. This is the automated regression net the rubric's manual cold-score
protocol previously stood in for."""

import importlib.util
import json
import os
import subprocess
import sys
import tempfile
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
SCORE = os.path.join(HERE, "score.py")
SKILL_DIR = os.path.dirname(HERE)
EXAMPLE = os.path.join(SKILL_DIR, "references", "example-review.md")

spec = importlib.util.spec_from_file_location("score", SCORE)
score = importlib.util.module_from_spec(spec)
spec.loader.exec_module(score)

LEN = dict(zip(score.DIMENSIONS, (8, 4, 6, 5, 6, 5, 4)))
METRICS = {k: 1 for k in score.METRIC_KEYS}


def run(cmd, payload):
    """Run a score.py subcommand on a JSON payload; return (rc, stdout, stderr)."""
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as f:
        json.dump(payload, f)
        path = f.name
    try:
        r = subprocess.run([sys.executable, SCORE, cmd, path], capture_output=True, text=True)
    finally:
        os.unlink(path)
    return r.returncode, r.stdout, r.stderr


def compute(archetype, checks_by_dim, extra=None):
    dims = {k: {"checks": checks_by_dim[k]} for k in score.DIMENSIONS}
    for k, ov in (extra or {}).items():
        dims[k].update(ov)
    rc, out, err = run("compute", {"archetype": archetype, "dimensions": dims})
    assert rc == 0, f"compute failed: {err}"
    return json.loads(out)


def allpass():
    return {k: ["PASS"] * LEN[k] for k in score.DIMENSIONS}


def verdict_from(comp, *, archetype="workflow", mode="single", depth="full",
                 meets=False, probe_run=True, **over):
    v = {
        "verdict_schema_version": score.SCHEMA_VERSION,
        "rubric_version": sorted(score.RUBRIC_VERSIONS)[-1],
        "skill": "./x/", "archetype": archetype, "invocation_model": "dispatched",
        "review_mode": mode, "review_depth": depth, "independence": "inline",
        "probe_run": probe_run, "probe_skip_reason": None,
        "reviewed_commit": "abc", "base_verdict_commit": None,
        "reviewer_model": "m", "reviewer_models": (["a", "b", "c"] if mode == "ensemble" else None),
        "weighted_score": comp["weighted_score"], "grade": comp["grade"],
        "dimensions": comp["dimensions"], "metrics": dict(METRICS),
        "blockers": [], "findings": [], "maintenance_notes": [],
        "p1_count": 0, "p2_count": 0, "p3_count": 0, "meets_bar": meets,
    }
    v.update(over)
    return v


# --- Canonical calibration data (calibration-answers.md) ---------------------------------
VIGNETTE_SCORES = {
    "V1": ("workflow", [5.0, 5.0, 4.5, 5.0, 5.0, 4.5, 4.5], 4.83, "A"),
    "V2": ("tool-wrapper", [4.5, 4.0, 4.0, 4.5, 4.0, 3.0, 4.5], 3.95, "B"),
    "V3": ("workflow", [4.0, 3.0, 3.5, 3.0, 3.5, 2.5, 3.5], 3.35, "C"),
    "V4": ("workflow", [2.0, 1.5, 1.5, 2.5, 2.0, 1.5, 2.5], 1.88, "D"),
    "V5": ("reference", [5.0, 5.0, 5.0, 5.0, 5.0, 4.5, 4.5], 4.90, "A"),
    "V6": ("orchestrator", [5.0, 4.5, 4.0, 4.5, 5.0, 3.5, 4.5], 4.43, "B"),
    "V7": ("workflow", [4.5, 3.0, 4.0, 3.0, 3.5, 2.5, 3.5], 3.55, "B"),
}

# Full per-check reconstructions whose compute() output must equal canonical (caps included).
VIGNETTE_CHECKS = {
    "V2": ("tool-wrapper", {
        "spec_compliance": ["PASS"] * 7 + ["FAIL"],
        "trigger_precision": ["PASS", "FAIL", "PASS", "PASS"],
        "workflow_quality": ["PASS", "PASS", "PASS", "PASS", "FAIL", "PARTIAL"],
        "token_efficiency": ["PASS", "PASS", "PASS", "PASS", "PARTIAL"],
        "safety": ["PASS", "PASS", "PASS", "PARTIAL", "FAIL", "N-A"],
        "robustness_evaluability": ["PASS", "FAIL", "FAIL", "PARTIAL", "PASS"],
        "portability": ["PARTIAL", "N-A", "PASS", "PASS"]}, 3.95, "B"),
    "V5": ("reference", {
        "spec_compliance": ["PASS"] * 8,
        "trigger_precision": ["PASS", "PASS", "PASS", "N-A"],
        "workflow_quality": ["PASS", "PASS", "N-A", "N-A", "N-A", "N-A"],
        "token_efficiency": ["PASS"] * 5,
        "safety": ["PASS", "PASS", "PASS", "PASS", "N-A", "N-A"],
        "robustness_evaluability": ["PASS", "PARTIAL", "PASS", "N-A", "PASS"],
        "portability": ["PARTIAL", "N-A", "PASS", "PASS"]}, 4.90, "A"),
    "V7": ("workflow", {  # adversarial: trigger c1 critical FAIL, robustness c2 critical FAIL
        "spec_compliance": ["PASS"] * 7 + ["FAIL"],
        "trigger_precision": ["FAIL", "PASS", "PASS", "N-A"],
        "workflow_quality": ["PASS", "FAIL", "PARTIAL", "PASS", "PASS", "PASS"],
        "token_efficiency": ["PARTIAL", "PASS", "PASS", "FAIL", "FAIL"],
        "safety": ["PASS", "PARTIAL", "FAIL", "PASS", "N-A", "N-A"],
        "robustness_evaluability": ["PASS", "FAIL", "FAIL", "N-A", "PARTIAL"],
        "portability": ["PARTIAL", "N-A", "PASS", "PARTIAL"]}, 3.55, "B"),
}


class TestBandingAndArithmetic(unittest.TestCase):
    def test_grade_bands(self):
        self.assertEqual(score.band(4.50), "A")
        self.assertEqual(score.band(4.49), "B")
        self.assertEqual(score.band(3.50), "B")
        self.assertEqual(score.band(1.49), "F")

    def test_half_even_rounding(self):
        self.assertEqual(score.half_step(4.25), 4.0)   # midpoint -> even
        self.assertEqual(score.half_step(4.75), 5.0)   # midpoint -> even (5.0)
        self.assertEqual(score.half_step(4.30), 4.5)

    def test_vignette_weighted_arithmetic(self):
        for name, (arch, scores, ws, grade) in VIGNETTE_SCORES.items():
            got = score.two_dec(sum(w * s for w, s in zip(score.WEIGHTS[arch], scores)) / 100)
            self.assertEqual(got, ws, f"{name} weighted")
            self.assertEqual(score.band(got), grade, f"{name} grade")


class TestVignetteFullCompute(unittest.TestCase):
    def test_full_reproduction_with_caps(self):
        for name, (arch, checks, ws, grade) in VIGNETTE_CHECKS.items():
            comp = compute(arch, checks)
            self.assertEqual(comp["weighted_score"], ws, f"{name} weighted")
            self.assertEqual(comp["grade"], grade, f"{name} grade")
        # V7's critical FAILs must produce auto-caps of 3.0 on both dimensions.
        comp = compute("workflow", VIGNETTE_CHECKS["V7"][1])
        self.assertEqual(comp["dimensions"]["trigger_precision"]["cap"], 3.0)
        self.assertEqual(comp["dimensions"]["robustness_evaluability"]["cap"], 3.0)
        self.assertEqual(comp["detail"]["trigger_precision"]["final"], 3.0)


class TestCriticalCaps(unittest.TestCase):
    def test_each_critical_index_caps_at_3(self):
        cases = {
            "trigger_precision": ["FAIL", "PASS", "PASS", "PASS"],
            "safety": ["PASS", "PASS", "PASS", "FAIL", "PASS", "PASS"],
            "robustness_evaluability": ["PASS", "FAIL", "PASS", "PASS", "PASS"],
        }
        for dim, checks in cases.items():
            cb = allpass()
            cb[dim] = checks
            comp = compute("workflow", cb)
            self.assertEqual(comp["detail"][dim]["final"], 3.0, f"{dim} not capped")
            self.assertEqual(comp["dimensions"][dim]["cap"], 3.0, f"{dim} cap not recorded")

    def test_partial_on_critical_does_not_cap(self):
        cb = allpass()
        cb["trigger_precision"] = ["PARTIAL", "PASS", "PASS", "PASS"]
        comp = compute("workflow", cb)
        self.assertIsNone(comp["dimensions"]["trigger_precision"]["cap"])

    def test_validate_rejects_critical_fail_without_cap(self):
        # Hand-author a verdict with trigger c1 FAIL but cap omitted (the old bypass).
        comp = compute("workflow", allpass())  # start from a valid all-PASS verdict
        comp["dimensions"]["trigger_precision"] = {
            "score": 4.0, "checks": ["FAIL", "PASS", "PASS", "PASS"],
            "adjustment": 0, "adjustment_note": None, "cap": None}
        v = verdict_from(comp, meets=False)
        # recompute weighted_score by hand for this tampered verdict is unnecessary; validate
        # should reject the missing cap regardless of the score mismatch.
        rc, out, err = run("validate", v)
        self.assertEqual(rc, 1)
        self.assertIn("critical", err.lower())

    def test_validate_accepts_critical_fail_with_cap(self):
        cb = allpass()
        cb["trigger_precision"] = ["FAIL", "PASS", "PASS", "PASS"]
        comp = compute("workflow", cb)  # compute now sets cap 3.0, score 3.0
        v = verdict_from(comp, meets=False)
        rc, out, err = run("validate", v)
        self.assertEqual(rc, 0, err)

    def test_no_usable_trigger_cannot_meet_bar(self):
        # trigger c1 FAIL -> dim 3.0 < floor 3.5 -> meets_bar must be false even if weighted >= 4.5
        cb = allpass()
        cb["trigger_precision"] = ["FAIL", "PASS", "PASS", "PASS"]
        comp = compute("workflow", cb)
        self.assertLess(comp["detail"]["trigger_precision"]["final"], score.DIMENSION_FLOOR)
        v = verdict_from(comp, meets=True)
        rc, out, err = run("validate", v)
        self.assertEqual(rc, 1, "a skill with no usable trigger must not validate as meets_bar")


class TestBandStability(unittest.TestCase):
    def test_allpass_is_stable(self):
        comp = compute("workflow", allpass())
        self.assertTrue(comp["band_stability"]["band_stable"])
        self.assertFalse(comp["band_stability"]["gate_fragile"])

    def test_455_is_gate_fragile(self):
        cb = {"spec_compliance": ["PASS"] * 5 + ["FAIL"] * 3,
              "trigger_precision": ["PASS", "PASS", "PASS", "FAIL"],
              "workflow_quality": ["PASS"] * 6, "token_efficiency": ["PASS"] * 5,
              "safety": ["PASS"] * 6, "robustness_evaluability": ["PASS"] * 5,
              "portability": ["PASS"] * 4}
        comp = compute("workflow", cb)
        self.assertEqual(comp["weighted_score"], 4.55)
        self.assertTrue(comp["band_stability"]["gate_fragile"])

    def test_gate_fragile_requires_ensemble(self):
        cb = {"spec_compliance": ["PASS"] * 5 + ["FAIL"] * 3,
              "trigger_precision": ["PASS", "PASS", "PASS", "FAIL"],
              "workflow_quality": ["PASS"] * 6, "token_efficiency": ["PASS"] * 5,
              "safety": ["PASS"] * 6, "robustness_evaluability": ["PASS"] * 5,
              "portability": ["PASS"] * 4}
        comp = compute("workflow", cb)  # weighted 4.55, gate-fragile
        rc_single, _, err = run("validate", verdict_from(comp, mode="single", meets=True))
        self.assertEqual(rc_single, 1, "gate-fragile single-mode meets_bar must be rejected")
        self.assertIn("ensemble", err.lower())
        rc_ens, _, err2 = run("validate", verdict_from(comp, mode="ensemble", meets=True))
        self.assertEqual(rc_ens, 0, err2)


class TestGateRules(unittest.TestCase):
    def test_allpass_meets_bar(self):
        v = verdict_from(compute("workflow", allpass()), meets=True)
        rc, _, err = run("validate", v)
        self.assertEqual(rc, 0, err)

    def test_floor_blocks_meets_bar(self):
        cb = allpass()
        cb["robustness_evaluability"] = ["PASS", "PASS", "FAIL", "FAIL", "N-A"]  # base 3.0
        comp = compute("workflow", cb)
        self.assertEqual(comp["detail"]["robustness_evaluability"]["final"], 3.0)
        rc, _, err = run("validate", verdict_from(comp, meets=True))
        self.assertEqual(rc, 1)
        self.assertIn("floor", err.lower())

    def test_net_adjustment_cap(self):
        dims = {k: {"checks": ["PASS"] * LEN[k]} for k in score.DIMENSIONS}
        dims["spec_compliance"].update(adjustment=-0.5, adjustment_note="x")
        dims["workflow_quality"].update(adjustment=-0.5, adjustment_note="x")
        rc, _, err = run("compute", {"archetype": "workflow", "dimensions": dims})
        self.assertEqual(rc, 2)
        self.assertIn("net weighted adjustment", err)


class TestDepthConstraints(unittest.TestCase):
    def test_triage_requires_nulls(self):
        v = verdict_from(compute("workflow", allpass()), depth="triage", meets=False)
        v["weighted_score"] = None
        v["grade"] = None
        for k in score.DIMENSIONS:
            v["dimensions"][k] = None
        rc, _, err = run("validate", v)
        self.assertEqual(rc, 0, err)

    def test_triage_nonnull_scores_rejected(self):
        v = verdict_from(compute("workflow", allpass()), depth="triage", meets=False)
        rc, _, err = run("validate", v)
        self.assertEqual(rc, 1)

    def test_incremental_never_meets_bar(self):
        v = verdict_from(compute("workflow", allpass()), depth="incremental", meets=True,
                         base_verdict_commit="deadbee")
        rc, _, err = run("validate", v)
        self.assertEqual(rc, 1)


class TestShippedExample(unittest.TestCase):
    def _example_verdict(self):
        with open(EXAMPLE, encoding="utf-8") as fh:
            text = fh.read()
        block = text.rsplit("```json", 1)[1].split("```", 1)[0]
        return json.loads(block)

    def test_example_validates(self):
        v = self._example_verdict()
        with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as f:
            json.dump(v, f)
            path = f.name
        try:
            r = subprocess.run([sys.executable, SCORE, "validate", path],
                               capture_output=True, text=True)
        finally:
            os.unlink(path)
        self.assertEqual(r.returncode, 0, r.stderr)

    def test_example_recomputes(self):
        v = self._example_verdict()
        cb = {k: v["dimensions"][k]["checks"] for k in score.DIMENSIONS}
        extra = {k: {"adjustment": v["dimensions"][k]["adjustment"],
                     "adjustment_note": v["dimensions"][k]["adjustment_note"]}
                 for k in score.DIMENSIONS if v["dimensions"][k]["adjustment"]}
        comp = compute(v["archetype"], cb, extra)
        self.assertEqual(comp["weighted_score"], v["weighted_score"])
        self.assertEqual(comp["grade"], v["grade"])


if __name__ == "__main__":
    unittest.main(verbosity=2)
