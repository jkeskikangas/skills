# skills

AI coding agents produce better results with well-structured skills. **skills** gives developers rubric-graded writing and review workflows that turn rough prompts into professional-grade skill definitions — with validation scripts, iterative critic feedback, and cross-platform portability (Claude Code, OpenAI Codex, OpenCode, Cursor, Windsurf).

## Install

```bash
npx skills add jkeskikangas/skills@v0.1.0
```

> Pin to a specific version tag for reproducible installs. See [CHANGELOG.md](CHANGELOG.md) for the latest version. Each release creates a corresponding git tag.

The CLI auto-detects your installed agents (Claude Code, Cursor, Windsurf, etc.) and installs the selected skills. Use flags for non-interactive install:

```bash
npx skills add jkeskikangas/skills@v0.1.0 --all        # install all skills to all agents
npx skills add jkeskikangas/skills@v0.1.0 -s writing-skills -a claude-code
```

### Manual install

Clone the repo and copy skill directories into your agent's skills path:

```bash
git clone https://github.com/jkeskikangas/skills.git
cp -r skills/skills/writing-skills ~/.claude/skills/writing-skills
```

## Quick Example

**You prompt:** "Review my skill and tell me if it's good."

**What you actually get** (via `reviewing-skills`):

```
Grade: C (2.8 / 5.0) — ITERATE

  Dimension              Score  Weight
  ─────────────────────  ─────  ──────
  Spec compliance        3.0    30%
  Clarity & structure    2.5    25%
  Robustness             3.0    20%
  Token efficiency       2.5    15%
  Portability            3.5    10%

P1  missing-validation  SKILL.md references scripts/validate.sh but file
    does not exist.
    Fix: create scripts/validate.sh or remove the reference.

P2  vague-trigger       "Use this skill when appropriate" — does not help
    the agent decide when to activate.
    Fix: replace with concrete trigger conditions.
```

Apply the two fixes, re-run — score jumps to **4.6 / 5.0 (Grade A, PASS)**.

## Skills

| Skill | Description |
|-------|-------------|
| `writing-agents-md` | Generate or update `AGENTS.md` context files for AI coding agents |
| `writing-skills` | Create or update agent skill directories with validation and generator-critic workflow |
| `reviewing-skills` | Review and grade agent skills for specification compliance, clarity, and portability |
| `writing-rubrics` | Create or update rubric documents with consistent grade bands and evidence-backed rules |

## How It Works

Each writing skill follows a **generator → validate → two-phase quality gate** workflow:

1. **Write** — generates the artifact (SKILL.md, AGENTS.md, rubric) following a structured template
2. **Validate** — runs linters (`skillcheck`, `agnix`) to check structure, frontmatter, and spec compliance
3. **Quality Gate — Phase 1: Self-critic review** — grades the output against the rubric (1.0–5.0 weighted score), fixes obvious gaps inline
4. **Quality Gate — Phase 2: Fresh-context subagent review** — a companion reviewing skill re-grades in a clean context; apply P1/P2 findings, re-validate, repeat up to 3 loops until the bar is met (score >= 4.5, no P1s)

```
  Write ──> Validate ──> Self-review ──> Subagent review ──> Pass? ──> Done
    ^                        │                   │
    └────────────────────────┘                   │
    ^                                            │
    └─────── Fix P1/P2 findings (≤ 3 loops) ─────┘
```

## Differentiation

| | skills | Hand-written prompts | Generic prompt libraries |
|---|---|---|---|
| **Structure** | Enforced schema (SKILL.md frontmatter, sections, validation) | Freeform | Varies |
| **Quality feedback** | Rubric-graded reviews with scored dimensions and concrete patches | None | None or subjective |
| **Cross-platform** | Portable across major agents | Platform-locked | Usually platform-locked |
| **Validation** | Automated scripts (broken links, deep chains, placeholders, name constraints) | Manual review | None |
| **Iteration** | Two-phase quality gate (self-review + subagent critic loop) with stop conditions | Ad-hoc | Ad-hoc |

## Structure

Each skill directory follows a standard layout:

```
skills/<skill-name>/
  SKILL.md              # Skill definition and workflow
  agents/openai.yaml    # OpenAI Codex agent configuration
  references/           # Rubrics, examples, schema notes
  scripts/              # Scaffolding scripts
```

## Scope and Non-goals

**In scope:**
- Writing and reviewing agent skill definitions (SKILL.md + supporting resources)
- Writing and reviewing rubrics used by those skills
- Writing and reviewing AGENTS.md project context files
- Validation scripts for structural correctness

**Non-goals:**
- Agent runtime or execution framework
- Prompt library or prompt template collection
- IDE plugin or editor extension
- Package manager or dependency management for skills

## Prerequisites

- **Node.js 18+** (for validation via `npx skillcheck`)
- **Git** (for cloning and CI)
- An AI coding agent (see intro for supported list)

## Versioning

This project uses [semantic versioning](https://semver.org/). Skill schema changes are tracked in `skills/writing-agents-md/references/schema-changelog.md`.

- **Major**: breaking changes to skill schema or validation scripts
- **Minor**: new skills, new validation checks, new rubric dimensions
- **Patch**: documentation fixes, rubric wording, non-breaking script fixes

See [CHANGELOG.md](CHANGELOG.md) for release history.

## Schemas

Machine-readable JSON schemas for integration and validation:

- [`schemas/skill-frontmatter.schema.json`](schemas/skill-frontmatter.schema.json) — SKILL.md YAML frontmatter format
- [`schemas/lint-output.schema.json`](schemas/lint-output.schema.json) — `skillcheck --format json` output format

## License

Apache-2.0 — see [LICENSE](LICENSE) for details.
