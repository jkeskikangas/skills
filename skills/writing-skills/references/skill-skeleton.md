# Skill skeleton (SKILL.md)

Use this as the default structure for new skills. Delete any section that is not relevant.

## Frontmatter (required)

- `name`: hyphen-case, matches folder name
- `description`: third person; includes **what + when to use**

## Body (recommended)

1. **Objective** (1–3 bullets)
2. **Safety / Constraints** (non-negotiable; secrets; destructive ops; network)
3. **Inputs / Outputs** (artifacts, file types, formats)
4. **Workflow** (numbered steps; decision-complete; includes validation loops)
5. **Edge cases** (common failure modes + what to do)
6. **Resources** (what’s in `scripts/`, `references/`, `assets/` and when to use them)
7. **Output rules** (format constraints; limits; do/don’t)

## Style requirements

- Bullets over paragraphs.
- Prefer directives (“Do X. Never do Y.”) over descriptions.
- Calibrate degrees of freedom:
  - fragile steps: exact commands/templates
  - heuristic steps: allow judgment, but include acceptance criteria

