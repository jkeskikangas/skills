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
skillcheck --fix skills/              # auto-fix fixable issues
skillcheck --format json skills/      # machine-readable output
skillcheck --skills-only skills/      # skip rubric checks
```

## What it checks

- **Frontmatter** — required fields, valid types, schema conformance
- **Links** — referenced files exist (agents/, references/)
- **Rubric** — grade bands, P1/P2/P3 priorities, scoring dimensions present
- **openai.yaml** — tool definitions, token budget, safety constraints

## License

Apache-2.0
