# @jkeskikangas/skillcheck

Linter for agent skill directories.

## Install

```bash
npm install -g @jkeskikangas/skillcheck
# or run without installing
npx @jkeskikangas/skillcheck skills/
```

## Usage

```bash
skillcheck skills/                    # lint all skills
skillcheck skills/<skill-name>        # lint a single skill
skillcheck --fix skills/              # auto-fix rubric drift
skillcheck --format json skills/      # machine-readable output
skillcheck --skills-only skills/      # skip rubric checks
skillcheck --rubrics-only skills/     # skip skill checks
skillcheck --max-lines 500 skills/    # max allowed SKILL.md lines
```

## What it checks

- **Frontmatter** — required fields, valid types, schema conformance
- **Links** — referenced files exist (agents/, references/)
- **Rubric** — grade bands, P1/P2/P3 priorities, scoring dimensions present
- **openai.yaml** — tool definitions, token budget, safety constraints

## Example output

When diagnostics are found, `skillcheck` exits non-zero and prints a one-line summary to stdout, with details on stderr:

```
[FAIL] 4 diagnostics in 1 skill.
P1 frontmatter-invalid  skills/writing-skills/SKILL.md  Missing required field: name
P2 link-missing         skills/writing-skills/SKILL.md  references/portability.md not found
```

When everything is valid:

```
[OK] 4 skills and 2 rubrics valid.
```

## Exit codes

- `0` — no diagnostics found
- `1` — diagnostics found
- `2` — CLI usage / argument error

## JSON output

Use `--format json` for tooling and CI integrations:

```bash
skillcheck --format json skills/ > skillcheck.json
```

The JSON shape matches the schema in this repo: `schemas/lint-output.schema.json`.

## CI (GitHub Actions)

Typical usage in a monorepo:

```yaml
- name: Install
  run: cd packages/skillcheck && npm ci

- name: Build
  run: cd packages/skillcheck && npm run build

- name: Lint skills (repo-local)
  run: node packages/skillcheck/bin/skillcheck.js skills/
```

For consumers who just want to lint skills in their own repo:

```yaml
- name: Lint skills
  run: npx @jkeskikangas/skillcheck skills/
```

## Development

```bash
cd packages/skillcheck && npm ci
cd packages/skillcheck && npm run build
cd packages/skillcheck && npm test
```

## License

Apache-2.0
