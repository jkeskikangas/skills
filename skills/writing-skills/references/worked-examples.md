# Worked examples

Concrete models of what “good” looks like. Load on demand when writing a description or a first skill.

## Description: weak → strong

**Weak** (generic, no triggers, no boundary):
> Helps with database stuff and makes queries better.

Why it fails: no artifact types, no “when”, generic verb (“helps”), no negative trigger — a dispatcher cannot route it.

**Strong** (what + when + when-not):
> Optimizes slow SQL queries: rewrites N+1 patterns, adds indexes, and explains query plans for Postgres/MySQL. Use when a user shares a slow query, an EXPLAIN plan, or asks why a query is slow. Not for schema design (use designing-schemas) or ORM configuration.

Why it works: concrete artifacts (SQL, EXPLAIN plan), explicit scenarios, and a named negative trigger pointing at the sibling skill.

## Golden mini-skill (shape + eval material)

A minimal but complete `SKILL.md`. Note the explicit triggers, the read-only safety classification, determinism delegated to a script, and the **Eval block with a checkable expected output that the workflow actually exercises**.

```
---
name: checking-json-schemas
description: >
  Validates a JSON document against a JSON Schema and reports the first failing
  path with a fix. Use when a user shares a JSON file plus a schema, or asks
  "does this match the schema?". Not for writing schemas (use writing-json-schemas).
---

# Checking JSON Schemas

## Objective
Report whether a JSON document satisfies a schema, and the minimal fix if not.

## Safety
Read-only: never edit the input files. No network. No secrets read.

## Workflow
1. Resolve the document path and the schema path; if either is missing, ask.
2. Validate with `scripts/validate.py <doc> <schema>` (stdlib only; exit 0 = valid, 1 = invalid).
3. On failure, report the first failing JSON path, the constraint violated, and a one-line fix.
4. Validation check: re-run step 2 after the fix is applied; expect exit 0.

## Eval
- Input: `{"age": "30"}` against `{ "properties": { "age": {"type": "integer"} } }`
- Expected output: fails at `/age` — "expected integer, got string"; fix: `30` (unquoted).
```

Why it would pass the rubric: triggerable (artifacts + scenarios + negative trigger), verifiable success (the Eval block’s checkable expected output, exercised by step 4), risk-proportional safety (read-only, no filler), determinism delegated to a script.
