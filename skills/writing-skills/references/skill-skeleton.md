# Skill skeleton (SKILL.md)

Use this as the default structure for new skills. Delete any section that is not relevant.

## Frontmatter (required)

- `name`: hyphen-case, matches folder name; prefer gerund form (`writing-x`, `reviewing-y`)
- `description`: third person; includes **what + when to use** (positive triggers) and **when not to** (negative trigger naming the sibling skill)

## Body (recommended)

1. **Objective** (1–3 bullets)
2. **Safety / Constraints** (non-negotiable; secrets; destructive ops; network; least-privilege `allowed-tools`)
3. **Inputs / Outputs** (artifacts, file types, formats)
4. **Workflow** (numbered steps; decision-complete; includes validation loops)
5. **Examples / Eval** (concrete input + checkable expected output, exercised by a workflow validation step)
6. **Edge cases** (common failure modes + what to do)
7. **Resources** (what’s in `scripts/`, `references/`, `assets/` and when to use them)
8. **Output rules** (format constraints; limits; do/don’t)

## Style requirements

- Bullets over paragraphs.
- Prefer directives (“Do X. Never do Y.”) over descriptions.
- Calibrate degrees of freedom:
  - fragile (a small wording change breaks the output, or correctness can't be eyeballed — parsing, formatting, exact CLI flags, version pins): exact commands/templates
  - heuristic (a competent agent can pick among acceptable options): allow judgment, but include acceptance criteria

