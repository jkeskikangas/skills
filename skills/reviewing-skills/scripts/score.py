#!/usr/bin/env python3
"""Deterministic scorer and verdict validator for reviewing-skills (stdlib only, no deps).

Subcommands:
  compute  <checks.json>   Derive dimension scores, weighted score, and grade from
                           per-check verdicts. List non-advisory checks only.
  validate <verdict.json>  Validate a final machine-readable verdict block.

compute input format:
  {
    "archetype": "workflow",
    "dimensions": {
      "spec_compliance":        {"checks": ["PASS","PARTIAL","FAIL","N-A", ...]},
      "trigger_precision":      {"checks": [...], "adjustment": 0.5, "justification": "..."},
      "workflow_quality":       {"checks": [...]},
      "token_efficiency":       {"checks": [...]},
      "safety":                 {"checks": [...]},
      "robustness_evaluability":{"checks": [...]},
      "portability":            {"checks": [...]}
    }
  }

Exit codes: 0 = OK (warnings go to stderr), 1 = validation failure, 2 = usage or input error.
"""

import json
import re
import sys
from decimal import Decimal, ROUND_HALF_UP

DIMENSIONS = [
    "spec_compliance",
    "trigger_precision",
    "workflow_quality",
    "token_efficiency",
    "safety",
    "robustness_evaluability",
    "portability",
]

WEIGHTS = {
    "workflow":     [20, 15, 20, 15, 15, 10, 5],
    "reference":    [20, 20, 5, 25, 10, 10, 10],
    "tool-wrapper": [15, 15, 15, 10, 20, 20, 5],
    "orchestrator": [15, 15, 25, 10, 15, 10, 10],
}

VERDICTS = {"PASS", "PARTIAL", "FAIL", "N-A"}
REVIEW_MODES = {"single", "batch", "comparative", "forensic", "ensemble"}
CONFIDENCES = {"High", "Medium", "Low"}
SCHEMA_VERSION = "2.1"


def half_step(x):
    """Round to the nearest 0.5, half up."""
    return float((Decimal(str(x)) * 2).quantize(Decimal("1"), rounding=ROUND_HALF_UP) / 2)


def two_dec(x):
    """Round to two decimals, half up."""
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

    warnings = []
    out_dims = {}
    weighted_raw = Decimal("0")
    for key, weight in zip(DIMENSIONS, WEIGHTS[archetype]):
        spec = dims[key]
        checks = [str(c).upper().replace("NA", "N-A") if str(c).upper() == "NA" else str(c).upper()
                  for c in spec.get("checks", [])]
        bad = [c for c in checks if c not in VERDICTS]
        if bad:
            fail(f"{key}: invalid check verdicts {bad} (use PASS/PARTIAL/FAIL/N-A; exclude advisory checks)")
        na = checks.count("N-A")
        applicable = len(checks) - na
        if applicable == 0:
            fail(f"{key}: all checks are N-A — at least one applicable check is required to score a dimension")
        passes = checks.count("PASS")
        partials = checks.count("PARTIAL")
        base = half_step(1 + 4 * (passes + 0.5 * partials) / applicable)
        adj = spec.get("adjustment", 0)
        if not isinstance(adj, (int, float)) or abs(adj) > 0.5:
            fail(f"{key}: adjustment must be a number within [-0.5, 0.5]")
        if adj and not str(spec.get("justification", "")).strip():
            fail(f"{key}: a non-zero adjustment requires a one-line justification")
        final = min(5.0, max(1.0, base + adj))
        if na > len(checks) / 2:
            warnings.append(f"{key}: {na}/{len(checks)} checks are N-A — flag this dimension as low-signal in the report")
        out_dims[key] = {
            "weight": weight,
            "base": base,
            "final": final,
            "applicable": applicable,
            "na": na,
            "contribution": two_dec(weight * final / 100),
        }
        weighted_raw += Decimal(str(weight)) * Decimal(str(final))

    weighted = two_dec(weighted_raw / 100)
    result = {
        "archetype": archetype,
        "dimensions": out_dims,
        "weighted_score": weighted,
        "grade": band(weighted),
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
    need("rubric_version", str)
    need("skill", str)
    if need("archetype", str) not in WEIGHTS:
        errors.append(f"archetype must be one of {sorted(WEIGHTS)}")
    if need("review_mode", str) not in REVIEW_MODES:
        errors.append(f"review_mode must be one of {sorted(REVIEW_MODES)}")
    depth = need("review_depth", str)
    if depth not in {"full", "triage"}:
        errors.append('review_depth must be "full" or "triage"')
    need("probe_run", bool)
    need("reviewed_commit", str, allow_none=True)
    need("reviewer_model", str, allow_none=True)

    dims = need("dimensions", dict) or {}
    extra = set(dims) - set(DIMENSIONS)
    missing = set(DIMENSIONS) - set(dims)
    if extra:
        errors.append(f"unknown dimension keys: {sorted(extra)}")
    if missing:
        errors.append(f"missing dimension keys: {sorted(missing)}")

    metrics = need("metrics", dict) or {}
    for mkey in ("description_chars", "skill_md_body_lines", "skill_md_body_words", "file_count"):
        if mkey not in metrics:
            errors.append(f"metrics.{mkey} is missing")
        elif metrics[mkey] is not None and not isinstance(metrics[mkey], int):
            errors.append(f"metrics.{mkey} must be an integer or null")

    blockers = need("blockers", list)
    findings = need("findings", list) or []
    counts = {"P1": 0, "P2": 0, "P3": 0}
    seen_ids = set()
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
        if sup is not None and (not isinstance(sup, int) or sup < 1):
            errors.append(f"findings[{i}].support must be a positive integer or null")

    for prio, key in (("P1", "p1_count"), ("P2", "p2_count"), ("P3", "p3_count")):
        if v.get(key) != counts[prio]:
            errors.append(f"{key}={v.get(key)!r} does not match {counts[prio]} {prio} findings")
    if blockers and counts["P1"] == 0:
        errors.append("blockers are present but p1_count is 0 — every blocker must also be a P1 finding")

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
    elif depth == "full":
        if not isinstance(ws, (int, float)) or not 1.0 <= ws <= 5.0:
            errors.append("weighted_score must be a number in [1.0, 5.0]")
        elif two_dec(ws) != ws:
            errors.append(f"weighted_score {ws} must be rounded to two decimals")
        elif grade != band(ws):
            errors.append(f"grade {grade!r} does not match weighted_score {ws} (expected {band(ws)!r})")
        for d in DIMENSIONS:
            s = dims.get(d)
            if d in dims and (not isinstance(s, (int, float)) or not 1.0 <= s <= 5.0):
                errors.append(f"dimensions.{d} must be a number in [1.0, 5.0]")
        if isinstance(ws, (int, float)) and isinstance(meets, bool):
            expected = ws >= 4.5 and counts["P1"] == 0 and not blockers
            if meets != expected:
                errors.append(f"meets_bar={meets} is inconsistent (weighted_score {ws}, "
                              f"p1_count {counts['P1']}, blockers {len(blockers or [])} → expected {expected})")

    if errors:
        for e in errors:
            print(f"invalid: {e}", file=sys.stderr)
        sys.exit(1)
    print("verdict OK")


def main():
    if len(sys.argv) != 3 or sys.argv[1] not in {"compute", "validate"}:
        print(__doc__.strip(), file=sys.stderr)
        sys.exit(2)
    (compute if sys.argv[1] == "compute" else validate)(sys.argv[2])


if __name__ == "__main__":
    main()
