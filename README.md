# skills

[![Validate Skills](https://github.com/jkeskikangas/skills/actions/workflows/validate.yml/badge.svg)](https://github.com/jkeskikangas/skills/actions/workflows/validate.yml)
[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/%40jkeskikangas%2Fskillcheck)](https://www.npmjs.com/package/@jkeskikangas/skillcheck)

AI coding agents produce better results with well-structured skills. **skills** gives you rubric-graded writing + review workflows that turn rough prompts into professional-grade skill definitions — with validation, iterative critic feedback, and cross-platform portability (Claude Code, OpenAI Codex CLI, Cursor, Windsurf, …).

## What you get

**You prompt:** “Review my skill and tell me if it’s good.”

**You get** (via [`skills/reviewing-skills/SKILL.md`](skills/reviewing-skills/SKILL.md)):

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

Apply the fixes, re-run — score jumps to **4.6 / 5.0 (Grade A, PASS)**.

## Quickstart (recommended)

Install the skills into your agent using the `skills` installer CLI:

```bash
npx skills add jkeskikangas/skills@latest
```

For reproducible installs, pin to a version tag:

```bash
npx skills add jkeskikangas/skills@v0.2.1
```

See [CHANGELOG.md](CHANGELOG.md) for release notes. Each release also creates a corresponding git tag.

### Non-interactive install

- `--all`: install all skills to all detected agents
- `-s <skill>`: select a single skill
- `-a <agent>`: select a single agent

```bash
npx skills add jkeskikangas/skills@latest --all
npx skills add jkeskikangas/skills@latest -s writing-skills -a claude-code
```

### Verify install

After running `skills add`, you should see skill directories in your agent’s skills folder (exact path depends on the agent). Common locations:

- `~/.claude/skills/` (Claude Code)
- `~/.codex/skills/` (OpenAI Codex CLI)

Quick success check:

```bash
ls ~/.claude/skills/writing-skills/SKILL.md
# or
ls ~/.codex/skills/writing-skills/SKILL.md
```

Windows PowerShell equivalent:

```powershell
Test-Path "$HOME\.claude\skills\writing-skills\SKILL.md"
```

Then invoke one of the installed skills in your agent (example: `$reviewing-skills`).

### Manual install

Clone the repo and copy skill directories into your agent’s skills path:

```bash
git clone https://github.com/jkeskikangas/skills.git
cp -r skills/writing-skills ~/.claude/skills/writing-skills
```

## Included skills

| Skill | What it does |
|---|---|
| [`writing-agents-md`](skills/writing-agents-md/SKILL.md) | Generate or update `AGENTS.md` context files for AI coding agents |
| [`writing-skills`](skills/writing-skills/SKILL.md) | Create or update agent skill directories with validation + generator-critic workflow |
| [`reviewing-skills`](skills/reviewing-skills/SKILL.md) | Review and grade agent skills for spec compliance, clarity, and portability |
| [`writing-rubrics`](skills/writing-rubrics/SKILL.md) | Create or update rubric documents with consistent grade bands and evidence-backed rules |

### Which skill should I run?

- You’re starting from scratch → `writing-skills`
- You already have a skill and want it to pass spec + portability checks → `reviewing-skills`
- Your repo needs reliable agent context → `writing-agents-md`
- You want a new grading rubric or to refine one → `writing-rubrics`

## How it works

Each writing skill follows a **generator → validate → two-phase quality gate** loop:

1. **Write** — generate the artifact (SKILL.md, AGENTS.md, rubric)
2. **Validate** — run linters (`skillcheck`, `agnix`)
3. **Quality gate** — self-critic review, then a fresh-context subagent re-grade
4. **Fix + repeat** — apply P1/P2 findings and re-validate (≤ 3 loops; stop when score ≥ 4.5 and no P1s)

## Validate locally (CI-equivalent)

From the repo root:

```bash
npx @jkeskikangas/skillcheck skills/
npx agnix skills/
```

## Scope and non-goals

In scope:
- Writing + reviewing agent skill definitions (SKILL.md + supporting resources)
- Writing + reviewing rubrics used by those skills
- Writing + reviewing `AGENTS.md` project context files
- Validation scripts for structural correctness

Non-goals:
- Agent runtime or execution framework
- Prompt library / prompt template collection
- IDE plugin or editor extension
- Package manager / dependency management for skills

## Supported platforms

- Works on **macOS, Linux, and Windows** (requires Node.js 18+).
- No native dependencies; intended to run anywhere Node runs.
- CI validates on Ubuntu/macOS/Windows across Node 18/20/22.

## Versioning

This project uses [semantic versioning](https://semver.org/). Skill schema changes are tracked in [`skills/writing-agents-md/references/schema-changelog.md`](skills/writing-agents-md/references/schema-changelog.md).

- **Major**: breaking changes to skill schema or validation scripts
- **Minor**: new skills, new validation checks, new rubric dimensions
- **Patch**: documentation fixes, rubric wording, non-breaking script fixes

## Schemas

- [`schemas/skill-frontmatter.schema.json`](schemas/skill-frontmatter.schema.json) — SKILL.md YAML frontmatter
- [`schemas/lint-output.schema.json`](schemas/lint-output.schema.json) — `skillcheck --format json` output

## Troubleshooting

- **I installed but don’t see the skill.** Re-run with explicit selection (skill + agent), then verify the target agent’s skills folder:
  - `npx skills add jkeskikangas/skills@latest -s writing-skills -a claude-code`
- **My agent doesn’t pick up the skill.** Confirm the skill’s `SKILL.md` is in the agent’s configured skills path and restart the agent/extension.
- **I want to contribute.** Start with [CONTRIBUTING.md](CONTRIBUTING.md). Security issues: see [SECURITY.md](SECURITY.md).

## Alternatives

- [promptfoo](https://github.com/promptfoo/promptfoo) — great for prompt/agent/RAG evaluation + regression testing; **skills** focuses on portable, rubric-graded skill authoring + structural validation.
- [LangSmith](https://www.langchain.com/langsmith) — full LLMOps platform (tracing, evals, prompt iteration); **skills** stays lightweight and repo-native without a backend.
- [Awesome ChatGPT Prompts](https://github.com/f/awesome-chatgpt-prompts) — large community prompt library; typically unscored/unvalidated; **skills** adds schemas, linters, and rubrics for repeatable quality.

## License

Apache-2.0 — see [LICENSE](LICENSE) for details.
