# Contributing

Contributions are welcome. This guide covers the basics for getting started.

## Prerequisites

- Node.js 18+ (for validation)
- Git

## Running Validation

Before submitting a PR, validate all skills with **both** linters:

```bash
# skillcheck — project rules (rubrics, openai.yaml, structure)
npx skillcheck skills/

# agnix — specification rules (token limits, safety, cross-platform)
npx agnix skills/

# Validate a single skill
npx skillcheck skills/<skill-name>
npx agnix skills/<skill-name>

# JSON output (skillcheck)
npx skillcheck --format json skills/

# Auto-fix rubric drift (skillcheck)
npx skillcheck --fix skills/
```

Or run skillcheck locally from the repo:

```bash
cd packages/skillcheck && npm ci && npm run build
node packages/skillcheck/bin/skillcheck.js skills/
```

Both linters must pass before a PR can be merged.

## What Makes a Good PR

- **One skill or concern per PR.** Don't mix unrelated changes.
- **All validations pass.** CI runs `skillcheck` on every skill and rubric.
- **No secrets.** Never commit `.env` files, API keys, tokens, or credentials.
- **Minimal diffs.** When updating an existing skill, change only what's needed.

## Skill Structure

New skills must follow the standard layout:

```
skills/<skill-name>/
  SKILL.md              # Required: skill definition with frontmatter
  agents/openai.yaml    # Required: OpenAI Codex agent configuration
  references/           # Optional: rubrics, examples, schema notes
  scripts/              # Optional: validation/scaffolding scripts
```

## Scope

This repo covers:
- Agent skill definitions (SKILL.md + supporting resources)
- Rubrics used by review skills
- AGENTS.md context file workflows
- Structural validation scripts

Out of scope: agent runtimes, IDE plugins, prompt template libraries. See [README.md](README.md#scope-and-non-goals) for details.

## Code of Conduct

Be respectful and constructive. We follow the [Contributor Covenant](CODE_OF_CONDUCT.md).

## Governance

**Maintainer:** Janne Keskikangas ([@pyykkis](https://github.com/pyykkis))

- **Decision-making:** The maintainer has final say on merges and releases. Substantial design changes are discussed in GitHub Issues or PR threads before implementation.
- **Breaking changes:** Announced at least one minor release in advance via the changelog. Existing skills must continue to validate unless a migration path is documented.
- **Triage SLA:** New issues and PRs are triaged within 7 days. This is a best-effort target, not a guarantee.
