# Resource patterns

Only add resources when they reduce failures or token cost.

## Use `scripts/` when

- The same logic will be repeated across runs.
- Correctness is fragile (parsing, formatting, validation).
- You want deterministic output and clear error messages.

Rules:
- Provide a stable CLI (`--help`, exit codes, actionable errors).
- Keep scripts stdlib-only unless dependency is unavoidable and explicitly documented.

## Use `references/` when

- The knowledge is large and only needed in specific cases (schemas, long examples).
- You need canonical templates, rubrics, or checklists that would bloat SKILL.md.

Rules:
- Avoid reference chaining. If SKILL.md expects a file to be read, link to it directly.
- Put only “load-on-demand” materials here; keep SKILL.md the navigation hub.

## Use `assets/` when

- The skill needs boilerplate/templates to copy into outputs (starter projects, doc templates).
- The files are not meant to be read into context verbatim.

