#!/usr/bin/env python3
"""Deterministic scorer and verdict validator for reviewing-skills (stdlib only, no deps).

Subcommands:
  compute        <checks.json>            Derive dimension scores, weighted score, and grade
                                          from per-check verdicts. List non-advisory checks
                                          only, in rubric order; per-dimension check counts are
                                          enforced. Flags band-edge uncertainty.
  validate       <verdict.json>           Validate a final machine-readable verdict block
                                          (schema 2.3). Recomputes every dimension score from
                                          its embedded checks (and optional cap) and the
                                          weighted score from the archetype weights.
  validate-fleet <fleet.json>             Validate a batch-mode fleet summary (fleet schema 1.0).
  verify-evidence <verdict.json> <dir>    Re-ground each finding against the reviewed skill at
                                          <dir>: cited file exists, line range is in range, and
                                          any quoted "Replace ..." snippet appears verbatim.

compute input format:
  {
    "archetype": "workflow",
    "dimensions": {
      "spec_compliance":        {"checks": ["PASS", ...]},               # 8 verdicts
      "trigger_precision":      {"checks": [...],                        # 4 verdicts
                                 "adjustment": 0.5, "adjustment_note": "...",
                                 "cap": 3.0},                            # optional dimension cap
      "workflow_quality":       {"checks": [...]},                       # 6 verdicts
      "token_efficiency":       {"checks": [...]},                       # 5 verdicts
      "safety":                 {"checks": [...]},                       # 6 verdicts
      "robustness_evaluability":{"checks": [...]},                       # 5 verdicts
      "portability":            {"checks": [...]}                        # 4 verdicts
    }
  }

A dimension's optional "cap" (1.0-5.0) bounds its final score: a FAIL on a rubric *(critical)*
check caps the dimension at 3.0, and a measured trigger battery caps Dimension 2 (rubric
Dimension 2). final = min(cap, base + adjustment). A cap is not a holistic adjustment and is
exempt from the net-adjustment limit.

compute output includes a paste-ready "dimensions" object for the verdict block.

Exit codes: 0 = OK (warnings go to stderr), 1 = validation failure, 2 = usage or input error.
"""

import json
import os
import re
import sys
from decimal import Decimal, ROUND_HALF_EVEN, ROUND_HALF_UP

DIMENSIONS = [
    "spec_compliance",
    "trigger_precision",
    "workflow_quality",
    "token_efficiency",
    "safety",
    "robustness_evaluability",
    "portability",
]

# Non-advisory checks per dimension, per rubric 2.3. Advisory checks are excluded.
EXPECTED_CHECKS = {
    "spec_compliance": 8,
    "trigger_precision": 4,
    "workflow_quality": 6,
    "token_efficiency": 5,
    "safety": 6,
    "robustness_evaluability": 5,
    "portability": 4,
}

WEIGHTS = {
    "workflow":     [20, 15, 20, 15, 15, 10, 5],
    "reference":    [20, 20, 5, 25, 10, 10, 10],
    "tool-wrapper": [15, 15, 15, 10, 20, 20, 5],
    "orchestrator": [15, 15, 25, 10, 15, 10, 10],
}

VERDICTS = {"PASS", "PARTIAL", "FAIL", "N-A"}
REVIEW_MODES = {"single", "batch", "comparative", "forensic", "ensemble"}
REVIEW_DEPTHS = {"full", "triage", "incremental"}
INVOCATION_MODELS = {"dispatched", "user-invoked", "both"}
INDEPENDENCE = {"fresh-context", "inline"}
CONFIDENCES = {"High", "Medium", "Low"}
GRADES = {"A", "B", "C", "D", "F"}
METRIC_KEYS = (
    "description_chars",
    "skill_md_body_lines",
    "skill_md_body_words",
    "skill_md_tokens_est",
    "hot_path_tokens_est",
    "file_count",
)
SCHEMA_VERSION = "2.3"
RUBRIC_VERSIONS = {"2.3"}
FLEET_SCHEMA_VERSION = "1.0"
NET_ADJUSTMENT_CAP = 0.15   # |sum(weight_i * adj_i)| / 100 must not exceed this
DIMENSION_FLOOR = 3.5       # meets_bar requires every dimension final >= this
BAND_EDGES = (1.5, 2.5, 3.5, 4.5)   # grade-band boundaries
BAND_EDGE_TOL = 0.05        # within this of a boundary => band-uncertain
GATE_EDGE_HI = 4.55         # meets_bar in [4.5, 4.55) is band-uncertain at the gate


def half_step(x):
    """Round to the nearest 0.5; exact midpoints round half to even (no systematic bias)."""
    return float((Decimal(str(x)) * 2).quantize(Decimal("1"), rounding=ROUND_HALF_EVEN) / 2)


def two_dec(x):
    """Round to two decimals, half up (band edges documented in the rubric)."""
    return float(Decimal(str(x)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))


def band(weighted):
    if weighted >= 4.5:
        return "A"
    if weighted >= 3.5:
        return "B"
    if weighted >= 2.5:
        return "C"
    if weighted >= 1.5:
        return "D"
    return "F"


def band_uncertain(weighted):
    """True when the weighted score sits within BAND_EDGE_TOL of any grade-band boundary."""
    return any(abs(weighted - e) <= BAND_EDGE_TOL + 1e-9 for e in BAND_EDGES)


def is_num(x):
    return isinstance(x, (int, float)) and not isinstance(x, bool)


def norm_check(c):
    s = str(c).strip().upper()
    return "N-A" if s in {"NA", "N-A", "N/A"} else s


def fail(msg, code=2):
    print(f"error: {msg}", file=sys.stderr)
    sys.exit(code)


def load(path):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except OSError as e:
        fail(f"cannot read {path}: {e}")
    except json.JSONDecodeError as e:
        fail(f"{path} is not valid JSON: {e}")


def dimension_base(key, raw_checks, errors):
    """Normalize checks, enforce the rubric count, and return (checks, base, applicable, na).

    Appends to errors and returns None on failure."""
    if not isinstance(raw_checks, list):
        errors.append(f"{key}: checks must be a list")
        return None
    checks = [norm_check(c) for c in raw_checks]
    bad = [c for c in checks if c not in VERDICTS]
    if bad:
        errors.append(f"{key}: invalid check verdicts {bad} (use PASS/PARTIAL/FAIL/N-A; exclude advisory checks)")
        return None
    expected = EXPECTED_CHECKS[key]
    if len(checks) != expected:
        errors.append(f"{key}: expected {expected} non-advisory check verdicts in rubric order, got {len(checks)} "
                      f"(advisory checks are excluded; never drop or merge scored checks)")
        return None
    na = checks.count("N-A")
    applicable = len(checks) - na
    if applicable == 0:
        errors.append(f"{key}: all checks are N-A — at least one applicable check is required to score a dimension")
        return None
    base = half_step(1 + 4 * (checks.count("PASS") + 0.5 * checks.count("PARTIAL")) / applicable)
    return checks, base, applicable, na


def read_adjustment(key, spec, errors):
    """Return (adjustment, note) or None on failure. Accepts legacy "justification" as the note key."""
    adj = spec.get("adjustment", 0)
    if not is_num(adj) or abs(adj) > 0.5:
        errors.append(f"{key}: adjustment must be a number within [-0.5, 0.5]")
        return None
    note = spec.get("adjustment_note", spec.get("justification"))
    if adj and not (isinstance(note, str) and note.strip()):
        errors.append(f"{key}: a non-zero adjustment requires a one-line adjustment_note")
        return None
    return adj, (note if isinstance(note, str) and note.strip() else None)


def read_cap(key, spec, errors):
    """Return (ok, cap): cap is None when absent, else a number in [1.0, 5.0]."""
    cap = spec.get("cap")
    if cap is None:
        return True, None
    if not is_num(cap) or not (1.0 <= cap <= 5.0):
        errors.append(f"{key}: cap must be a number in [1.0, 5.0] or null")
        return False, None
    return True, cap


def compute(path):
    data = load(path)
    archetype = data.get("archetype")
    if archetype not in WEIGHTS:
        fail(f"archetype must be one of {sorted(WEIGHTS)}, got {archetype!r}")
    dims = data.get("dimensions")
    if not isinstance(dims, dict):
        fail('missing "dimensions" object')
    missing = [d for d in DIMENSIONS if d not in dims]
    if missing:
        fail(f"missing dimensions: {', '.join(missing)}")

    errors, warnings = [], []
    verdict_dims, detail = {}, {}
    weighted_raw = net_adj_raw = Decimal("0")
    for key, weight in zip(DIMENSIONS, WEIGHTS[archetype]):
        spec = dims[key]
        if not isinstance(spec, dict):
            errors.append(f"{key}: must be an object with a checks list")
            continue
        based = dimension_base(key, spec.get("checks"), errors)
        adjusted = read_adjustment(key, spec, errors)
        ok_cap, cap = read_cap(key, spec, errors)
        if based is None or adjusted is None or not ok_cap:
            continue
        checks, base, applicable, na = based
        adj, note = adjusted
        final = min(5.0, max(1.0, base + adj))
        if cap is not None:
            final = min(final, cap)
        if na > len(checks) / 2:
            warnings.append(f"{key}: {na}/{len(checks)} checks are N-A — flag this dimension as low-signal in the report")
        verdict_dims[key] = {"score": final, "checks": checks, "adjustment": adj,
                             "adjustment_note": note, "cap": cap}
        detail[key] = {
            "weight": weight,
            "base": base,
            "cap": cap,
            "final": final,
            "applicable": applicable,
            "na": na,
            "contribution": two_dec(weight * final / 100),
        }
        weighted_raw += Decimal(str(weight)) * Decimal(str(final))
        net_adj_raw += Decimal(str(weight)) * Decimal(str(adj))
    if errors:
        for e in errors:
            print(f"error: {e}", file=sys.stderr)
        sys.exit(2)

    net_adj = float(net_adj_raw / 100)
    if abs(net_adj) > NET_ADJUSTMENT_CAP + 1e-9:
        fail(f"net weighted adjustment {net_adj:+.3f} exceeds the ±{NET_ADJUSTMENT_CAP} cap "
             "(adjustments must not be able to move the grade band on their own)")

    weighted = two_dec(weighted_raw / 100)
    uncertain = band_uncertain(weighted)
    if uncertain:
        warnings.append(f"weighted score {weighted} is within {BAND_EDGE_TOL} of a grade-band edge — "
                        "band-uncertain; a meets_bar claim this close to the 4.5 gate requires ensemble mode")
    result = {
        "archetype": archetype,
        "dimensions": verdict_dims,   # paste-ready for the verdict block
        "detail": detail,
        "net_weighted_adjustment": net_adj,
        "min_dimension_score": min(d["final"] for d in detail.values()),
        "weighted_score": weighted,
        "grade": band(weighted),
        "band_uncertain": uncertain,
        "warnings": warnings,
    }
    for w in warnings:
        print(f"warning: {w}", file=sys.stderr)
    print(json.dumps(result, indent=2))


def validate(path):
    v = load(path)
    errors = []

    def need(key, types, allow_none=False):
        if key not in v:
            errors.append(f"missing required field: {key}")
            return None
        val = v[key]
        if val is None:
            if not allow_none:
                errors.append(f"{key} must not be null")
            return None
        if not isinstance(val, types):
            errors.append(f"{key} has wrong type: {type(val).__name__}")
            return None
        return val

    if v.get("verdict_schema_version") != SCHEMA_VERSION:
        errors.append(f'verdict_schema_version must be "{SCHEMA_VERSION}" (this validator supports {SCHEMA_VERSION} only)')
    if need("rubric_version", str) not in RUBRIC_VERSIONS:
        errors.append(f"rubric_version must be one of {sorted(RUBRIC_VERSIONS)}")
    need("skill", str)
    archetype = need("archetype", str)
    if archetype is not None and archetype not in WEIGHTS:
        errors.append(f"archetype must be one of {sorted(WEIGHTS)}")
    if need("invocation_model", str) not in INVOCATION_MODELS:
        errors.append(f"invocation_model must be one of {sorted(INVOCATION_MODELS)}")
    mode = need("review_mode", str)
    if mode not in REVIEW_MODES:
        errors.append(f"review_mode must be one of {sorted(REVIEW_MODES)}")
    depth = need("review_depth", str)
    if depth not in REVIEW_DEPTHS:
        errors.append(f"review_depth must be one of {sorted(REVIEW_DEPTHS)}")
    if need("independence", str) not in INDEPENDENCE:
        errors.append(f"independence must be one of {sorted(INDEPENDENCE)}")
    probe_run = need("probe_run", bool)
    skip_reason = need("probe_skip_reason", str, allow_none=True)
    reviewed_commit = need("reviewed_commit", str, allow_none=True)
    base_commit = need("base_verdict_commit", str, allow_none=True)
    need("reviewer_model", str, allow_none=True)
    reviewer_models = need("reviewer_models", list, allow_none=True)
    if mode == "ensemble":
        if not (isinstance(reviewer_models, list) and len(reviewer_models) >= 3
                and all(isinstance(m, str) and m.strip() for m in reviewer_models)):
            errors.append("ensemble verdicts require reviewer_models: a list of >= 3 model identifiers")
    elif reviewer_models is not None:
        errors.append("reviewer_models must be null outside ensemble mode")
    if depth == "incremental":
        if not (isinstance(base_commit, str) and base_commit.strip()):
            errors.append("incremental verdicts require base_verdict_commit (the prior full review's commit)")
        if not (isinstance(reviewed_commit, str) and reviewed_commit.strip()):
            errors.append("incremental verdicts require reviewed_commit")
    elif base_commit is not None:
        errors.append("base_verdict_commit must be null outside incremental depth")

    dims = need("dimensions", dict) or {}
    extra = set(dims) - set(DIMENSIONS)
    missing = set(DIMENSIONS) - set(dims)
    if extra:
        errors.append(f"unknown dimension keys: {sorted(extra)}")
    if missing:
        errors.append(f"missing dimension keys: {sorted(missing)}")

    metrics = need("metrics", dict) or {}
    for mkey in METRIC_KEYS:
        if mkey not in metrics:
            errors.append(f"metrics.{mkey} is missing")
        elif metrics[mkey] is not None and not isinstance(metrics[mkey], int):
            errors.append(f"metrics.{mkey} must be an integer or null")

    notes = need("maintenance_notes", list)
    if isinstance(notes, list) and not all(isinstance(n, str) and n.strip() for n in notes):
        errors.append("maintenance_notes must contain non-empty strings")

    findings = need("findings", list) or []
    counts = {"P1": 0, "P2": 0, "P3": 0}
    p1_ids, seen_ids = set(), set()
    for i, f in enumerate(findings):
        if not isinstance(f, dict):
            errors.append(f"findings[{i}] must be an object")
            continue
        fid, prio = f.get("id", ""), f.get("priority", "")
        if not re.fullmatch(r"P[123]-\d+", str(fid)):
            errors.append(f"findings[{i}].id {fid!r} must match P<1|2|3>-<n>")
        elif not str(fid).startswith(prio + "-"):
            errors.append(f"findings[{i}]: id {fid!r} does not match priority {prio!r}")
        if fid in seen_ids:
            errors.append(f"duplicate finding id {fid!r}")
        seen_ids.add(fid)
        if prio in counts:
            counts[prio] += 1
            if prio == "P1":
                p1_ids.add(fid)
        else:
            errors.append(f"findings[{i}].priority {prio!r} must be P1/P2/P3")
        if f.get("confidence") not in CONFIDENCES:
            errors.append(f"findings[{i}].confidence must be one of {sorted(CONFIDENCES)}")
        if not str(f.get("title", "")).strip():
            errors.append(f"findings[{i}].title must be non-empty")
        if prio in {"P1", "P2"} and not str(f.get("patch", "")).strip():
            errors.append(f"findings[{i}] ({fid}): P1/P2 findings require non-empty patch text")
        dim = f.get("dimension")
        if dim is not None and dim not in DIMENSIONS:
            errors.append(f"findings[{i}].dimension {dim!r} must be a rubric dimension key or null")
        sup = f.get("support")
        if sup is not None and (not isinstance(sup, int) or isinstance(sup, bool) or sup < 1):
            errors.append(f"findings[{i}].support must be a positive integer or null")
        if mode != "ensemble" and sup is not None:
            errors.append(f"findings[{i}].support must be null outside ensemble mode")

    blockers = need("blockers", list)
    for i, b in enumerate(blockers or []):
        if not isinstance(b, dict):
            errors.append(f"blockers[{i}] must be an object with registry_item, summary, and finding_id")
            continue
        ri = b.get("registry_item")
        if not isinstance(ri, int) or isinstance(ri, bool) or not 1 <= ri <= 7:
            errors.append(f"blockers[{i}].registry_item must be an integer 1-7 (the rubric's blocker registry)")
        if not str(b.get("summary", "")).strip():
            errors.append(f"blockers[{i}].summary must be non-empty")
        if b.get("finding_id") not in p1_ids:
            errors.append(f"blockers[{i}].finding_id {b.get('finding_id')!r} must reference an existing P1 finding")

    for prio, key in (("P1", "p1_count"), ("P2", "p2_count"), ("P3", "p3_count")):
        if v.get(key) != counts[prio]:
            errors.append(f"{key}={v.get(key)!r} does not match {counts[prio]} {prio} findings")

    ws, grade = v.get("weighted_score"), v.get("grade")
    meets = v.get("meets_bar")
    if not isinstance(meets, bool):
        errors.append("meets_bar must be a boolean")

    if depth == "triage":
        if ws is not None or grade is not None:
            errors.append("triage verdicts must have null weighted_score and grade")
        if any(dims.get(d) is not None for d in DIMENSIONS if d in dims):
            errors.append("triage verdicts must have null dimension scores")
        if meets is True:
            errors.append("triage verdicts can never set meets_bar true")
    else:  # full or incremental: recompute everything from the embedded checks
        scores = {}
        weighted_raw = net_adj_raw = Decimal("0")
        weights = WEIGHTS.get(archetype)
        for key, weight in zip(DIMENSIONS, weights or [0] * 7):
            spec = dims.get(key)
            if key in missing:
                continue
            if not isinstance(spec, dict):
                errors.append(f"dimensions.{key} must be an object with score/checks/adjustment in {depth} depth")
                continue
            based = dimension_base(key, spec.get("checks"), errors)
            adjusted = read_adjustment(key, spec, errors)
            ok_cap, cap = read_cap(key, spec, errors)
            if based is None or adjusted is None or not ok_cap:
                continue
            _, base, _, _ = based
            adj, _ = adjusted
            expected_final = min(5.0, max(1.0, base + adj))
            if cap is not None:
                expected_final = min(expected_final, cap)
            score = spec.get("score")
            if not is_num(score):
                errors.append(f"dimensions.{key}.score must be a number")
            elif abs(score - expected_final) > 1e-9:
                errors.append(f"dimensions.{key}.score {score} does not match its checks: "
                              f"base {base} with adjustment {adj:+g} -> {expected_final}")
            else:
                scores[key] = score
                if weights:
                    weighted_raw += Decimal(str(weight)) * Decimal(str(score))
                    net_adj_raw += Decimal(str(weight)) * Decimal(str(adj))
        if weights and len(scores) == len(DIMENSIONS):
            net_adj = float(net_adj_raw / 100)
            if abs(net_adj) > NET_ADJUSTMENT_CAP + 1e-9:
                errors.append(f"net weighted adjustment {net_adj:+.3f} exceeds the ±{NET_ADJUSTMENT_CAP} cap")
            expected_ws = two_dec(weighted_raw / 100)
            if not is_num(ws):
                errors.append("weighted_score must be a number in [1.0, 5.0]")
            elif abs(ws - expected_ws) > 1e-9:
                errors.append(f"weighted_score {ws} does not match the dimension scores under the "
                              f"{archetype} profile (expected {expected_ws})")
            elif grade != band(ws):
                errors.append(f"grade {grade!r} does not match weighted_score {ws} (expected {band(ws)!r})")
            if depth == "incremental" and meets is True:
                errors.append("incremental verdicts can never set meets_bar true — gates require a fresh full review")
            if depth == "full" and is_num(ws) and isinstance(meets, bool):
                probe_ok = bool(probe_run) or bool(skip_reason and str(skip_reason).strip())
                expected = (ws >= 4.5 and counts["P1"] == 0 and not blockers
                            and min(scores.values()) >= DIMENSION_FLOOR and probe_ok)
                if expected and 4.5 <= ws < GATE_EDGE_HI and mode != "ensemble":
                    errors.append(
                        f"meets_bar at a band-uncertain weighted_score ({ws} is within {BAND_EDGE_TOL} above the "
                        "4.5 gate) requires ensemble mode (3 independent reviews); run an ensemble or do not claim the bar")
                    expected = False
                if meets != expected:
                    errors.append(
                        f"meets_bar={meets} is inconsistent (weighted_score {ws}, p1_count {counts['P1']}, "
                        f"blockers {len(blockers or [])}, min dimension {min(scores.values())} vs floor "
                        f"{DIMENSION_FLOOR}, probe_run {probe_run} / skip_reason "
                        f"{'set' if skip_reason else 'null'} -> expected {expected})")

    if errors:
        for e in errors:
            print(f"invalid: {e}", file=sys.stderr)
        sys.exit(1)
    print("verdict OK")


def validate_fleet(path):
    v = load(path)
    errors = []
    if v.get("fleet_schema_version") != FLEET_SCHEMA_VERSION:
        errors.append(f'fleet_schema_version must be "{FLEET_SCHEMA_VERSION}"')
    skills = v.get("skills")
    if not isinstance(skills, list) or not skills:
        errors.append("skills must be a non-empty list")
        skills = []
    for i, s in enumerate(skills):
        if not isinstance(s, dict):
            errors.append(f"skills[{i}] must be an object")
            continue
        if not str(s.get("skill", "")).strip():
            errors.append(f"skills[{i}].skill must be a non-empty path")
        ws, grade = s.get("weighted_score"), s.get("grade")
        if not is_num(ws) or not 1.0 <= ws <= 5.0:
            errors.append(f"skills[{i}].weighted_score must be a number in [1.0, 5.0]")
        elif grade != band(ws):
            errors.append(f"skills[{i}].grade {grade!r} does not match weighted_score {ws} (expected {band(ws)!r})")
        p1 = s.get("p1_count")
        if not isinstance(p1, int) or isinstance(p1, bool) or p1 < 0:
            errors.append(f"skills[{i}].p1_count must be a non-negative integer")
        meets = s.get("meets_bar")
        if not isinstance(meets, bool):
            errors.append(f"skills[{i}].meets_bar must be a boolean")
        elif meets and is_num(ws) and isinstance(p1, int) and (ws < 4.5 or p1 > 0):
            errors.append(f"skills[{i}].meets_bar=true contradicts weighted_score {ws} / p1_count {p1}")
    for key in ("trigger_collisions", "shared_boilerplate"):
        if not isinstance(v.get(key), list):
            errors.append(f"{key} must be a list")
    if errors:
        for e in errors:
            print(f"invalid: {e}", file=sys.stderr)
        sys.exit(1)
    print("fleet OK")


def extract_replace_snippet(patch):
    """Pull the quoted snippet from a 'Replace <X> with <Y>' finding patch, if present."""
    if not isinstance(patch, str):
        return None
    m = re.search(r"[Rr]eplace[:\s]+['\"](.+?)['\"]\s+[Ww]ith", patch, re.S)
    if m:
        return m.group(1).strip()
    # Structured form: "Replace:\n<snippet>\nWith:\n..."
    m = re.search(r"[Rr]eplace:\s*\n(.+?)\n\s*[Ww]ith:", patch, re.S)
    return m.group(1).strip() if m else None


def verify_evidence(verdict_path, skill_dir):
    """Re-ground a verdict's findings against the reviewed skill on disk."""
    v = load(verdict_path)
    if not os.path.isdir(skill_dir):
        fail(f"not a directory: {skill_dir}")
    findings = v.get("findings")
    if not isinstance(findings, list):
        fail('verdict has no "findings" array')
    problems, checked = [], 0
    for f in findings if isinstance(findings, list) else []:
        if not isinstance(f, dict):
            continue
        fid = f.get("id", "?")
        rel = str(f.get("file", "")).strip()
        lr = str(f.get("lines", "")).strip()
        if not rel:
            continue
        path = os.path.join(skill_dir, rel)
        if not os.path.isfile(path):
            # A finding that recommends creating a new file has no cited lines — not an error.
            if lr:
                problems.append(f"{fid}: cited file {rel!r} not found under {skill_dir}")
            continue
        checked += 1
        with open(path, encoding="utf-8", errors="replace") as fh:
            text = fh.read()
        lines = text.splitlines()
        m = re.fullmatch(r"(\d+)(?:-(\d+))?", lr)
        if m:
            lo, hi = int(m.group(1)), int(m.group(2) or m.group(1))
            if lo < 1 or hi < lo or hi > len(lines):
                problems.append(f"{fid}: cited lines {lr} out of range ({rel} has {len(lines)} lines)")
        snip = extract_replace_snippet(f.get("patch", ""))
        if snip and snip not in text:
            problems.append(f"{fid}: patch 'Replace' snippet not found verbatim in {rel}: {snip[:60]!r}")
    if problems:
        for p in problems:
            print(f"unverified: {p}", file=sys.stderr)
        sys.exit(1)
    print(f"evidence OK ({checked} finding(s) grounded against {skill_dir})")


def main():
    one_arg = {"compute": compute, "validate": validate, "validate-fleet": validate_fleet}
    argv = sys.argv[1:]
    if argv and argv[0] in one_arg and len(argv) == 2:
        one_arg[argv[0]](argv[1])
    elif argv and argv[0] == "verify-evidence" and len(argv) == 3:
        verify_evidence(argv[1], argv[2])
    else:
        print(__doc__.strip(), file=sys.stderr)
        sys.exit(2)


if __name__ == "__main__":
    main()
