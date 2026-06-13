---
name: writing-skills
description: >
  Creates or updates professional-grade agent skills (SKILL.md + optional scripts/references/assets) with
  strict validation and an iterative generator↔critic workflow. Use when: you want a new skill,
  want to refactor an existing skill for clarity/token-efficiency, or want to reach an A-grade rubric score.
  Not for reviewing or grading an existing skill (use reviewing-skills).
---

# Writing Skills

## Objective

Produce **professional-grade** skills: high-signal, safe, portable, and reliably triggerable. This skill:
- Writes or updates a skill directory (`SKILL.md` + optional `scripts/`, `references/`, `assets/`)
- Generates `agents/openai.yaml` UI metadata
- Runs validation (`skillcheck`)
- Runs a critic review using `$reviewing-skills` and iterates until the bar is met

## When to use / When not to use

Use when:
- The user asks to create a new skill (`SKILL.md` + optional `scripts/`, `references/`, `assets/`).
- The user asks to refactor, tighten, or “upgrade” an existing skill for trigger precision and token efficiency.

Do not use when:
- The user only wants a rubric-based review/grade of an existing skill (use `$reviewing-skills`).
- The request is not about a skill directory containing `SKILL.md`.

## Quality Bar (default)

Target the rubric's canonical `meets_bar`. **`reviewing-skills/references/skills-rubric.md` owns it and is authoritative — read it; do not maintain a simplified copy here** (a stale local subset is exactly how authors end up targeting the wrong, easier bar).

Headline gates (so you author toward them from the start — not the full definition):
- **No spec violations / no open blockers**, and
- **Weighted score ≥ 4.5/5.0** (grade A), and
- **No P1 findings**, and
- **Every dimension ≥ 3.5** — the bar is non-compensatory; one weak dimension fails it, and
- **Behavioral probe run** (or a one-line skip reason recorded); for a skill encoding domain claims, the probe must check **outcome correctness**, not merely that the workflow was unblocked.

## Safety / Constraints (non-negotiable)

- Never read, request, or paste secrets (`.env`, API keys, tokens, private keys, credentials).
- Only write inside the **user-specified skill directory**. If the target path is unclear, ask.
- Do not run commands that modify the repo unless the user explicitly asked for those changes.
- Do not browse the web or call external systems unless the user explicitly requests it.
- Do not execute untrusted code in the target repo (scripts/binaries/tests) unless the user explicitly asks and you can justify the risk.
- Third-party tools that download and execute code (e.g., `agnix`) run only with **explicit user opt-in** and a **pinned version**.
- If the skill being written can perform destructive actions, add explicit confirmation gates and “never do” rules, and declare the narrowest `allowed-tools` the workflow actually uses (unused write/exec tools are a P1 safety blocker).

## Portability Requirement (Codex + Claude Code/Desktop + OpenCode)

Write skill instructions in **capability language** (search/read/edit/run commands) and avoid hard-coding one vendor’s tool names.
If mentioning a product-specific tool, provide a short adapter note (“if unavailable, use shell + rg/sed”).
For portability guidance, use [references/portability.md](references/portability.md).

## Workflow (decision-complete)

### Update mode (keep diffs small)

If the user asked to update an existing skill (not create a new one):
- Change only the requested parts; do not rewrite unrelated sections for style.
- Preserve existing behavior unless it is a spec violation or causes mis-triggering.
- Prioritize: trigger precision (description “when to use”), safety/guardrails, validation loop, then token efficiency.

### 1) Intake (ask only what matters)

Collect:
- **Skill name** — hyphen-case; prefer gerund form (`writing-x`, `reviewing-y`) per naming guidance.
- **What it does** (1 sentence)
- **When to use** (concrete triggers: file types, paths, scenarios) — and when **not** to (name the sibling skill instead).
- **Inputs/outputs** (artifacts produced)
- **Safety constraints** (read-only? destructive ops? secrets? web browsing?)
- **Resources needed**: `scripts/` vs `references/` vs `assets/`

### 2) Skill Split Proposal (prevent mega-skills)

Before writing anything, produce a short proposal:
- Should this be **one skill** or **multiple**?
- Recommend companion skills when appropriate, e.g.:
  - reviewer/critic skill (grading, audits)
  - installer skill (wiring tools or repo integration)
  - domain-reference skill (big schemas or policies)

Rule of thumb:
- If the request spans **multiple disjoint workflows**, split.
- If the skill needs deterministic, repeatable logic, add a `scripts/` helper.

### 3) Design to the rubric (author toward the score)

Classify before writing, then spend the SKILL.md budget where the weights and *critical* checks are. The rubric grades by **archetype-weighted dimensions** — pick the archetype and write to its profile (`reviewing-skills/references/skills-rubric.md`, “Archetype profiles”):
- **Workflow** (default) — process skills; workflow quality + spec compliance dominate.
- **Reference/Knowledge** — curated facts/patterns; token efficiency dominates (≈25%).
- **Tool-wrapper** — wraps scripts/CLIs; safety + evaluability dominate (≈40% combined).
- **Orchestrator** — composes skills/agents; loop quality + hand-offs dominate.

Two checks are **critical** — a FAIL caps that dimension at 3.0 no matter how tidy the prose, so satisfy them first:
- **Triggerable** — a strong positive trigger exists (Dimension 2). You will self-test it in Step 5.
- **Verifiable success** — a stated way to tell the skill worked: eval scenario, acceptance check, or expected output (Dimension 6).

Also classify the **invocation model** — `dispatched` (default), `user-invoked` (`disable-model-invocation: true`), or `both` — it re-scopes how triggering is judged.

### 4) Scaffold the skill directory

Create the skill directory under the user-specified path:
- `<skill-name>/SKILL.md` — use [references/skill-skeleton.md](references/skill-skeleton.md) as the template
- `<skill-name>/agents/openai.yaml` — include `interface.display_name`, `short_description` (25–64 chars), and `default_prompt` (must mention `$<skill-name>`)
- Resource subdirs (`scripts/`, `references/`, `assets/`) — only create the ones you will use
- If the skill acts (writes/runs/network), declare the narrowest `allowed-tools` it needs — no unused write/exec tools.

Prefer **minimal resources**. Validation is expected to fail until you fill in the TODOs in Step 5.

### 5) Write `SKILL.md` (core)

Use [references/skill-skeleton.md](references/skill-skeleton.md) as the canonical outline.

Hard requirements:
- Frontmatter `description` covers **what + when to use**, and stays proportional to its information content — it loads into every session as a permanent token cost.
- Include **guardrails** and explicit “do not do” rules when relevant.
- Include **validation loops** (what to check after writing/running).
- Ship **eval material**: at least one concrete input + a checkable expected output, exercised by a workflow validation step. Decorative scenarios (no expected output, never referenced) fail the rubric and count as bloat — make it real or omit it.
- **Calibrate degrees of freedom:** exact commands/templates for fragile steps; judgment plus acceptance criteria for heuristic steps.
- Keep SKILL.md lean: body under ~500 lines (far fewer preferred — it is measured); move bulk examples/specs to `references/`.

**Engineer the description for routing** (highest-leverage element — a *critical* check, stress-tested by a trigger battery):
- Lead with strong **positive triggers**: artifact types, file patterns, concrete scenarios.
- Add **negative triggers** — when NOT to use, naming the sibling skill to use instead.
- Avoid generic discovery terms ("helper", "utils") without specifics.
- **Scan for collisions:** compare against visible sibling skills' descriptions; if a dispatcher could misroute between them, sharpen the boundary in both descriptions.
- **Self-test:** draft ~5 in-scope and ~5 adjacent out-of-scope prompts and confirm each routes to (or away from) this skill. Fix the description for every misroute.

See [references/worked-examples.md](references/worked-examples.md) for a strong-vs-weak description and a golden mini-skill.

**Do not write** (rubric auto-penalties):
- Vague directives: "as appropriate", "best practices", "use standard approach".
- Time-sensitive claims ("latest", "current pricing") unless the skill browses the web and says so.
- Windows-style paths; assumed package installs; many options with no default.
- Self-praise as evidence ("battle-tested", "production-grade").

### 6) Add resources (only if they buy reliability)

Use [references/resource-patterns.md](references/resource-patterns.md):
- Put deterministic logic in `scripts/` with a stable CLI.
- Put large but needed knowledge in `references/` (loaded on demand).
- Put templates/boilerplate in `assets/`.

### 7) Validate (hard gate)

**skillcheck** (project rules — first-party linter):
- Inside this repo with `packages/skillcheck/dist/` present: `node packages/skillcheck/bin/skillcheck.js <skill-dir>`
- Inside this repo without `dist/`: `cd packages/skillcheck && npm install && npm run build`, then run the above.
- Outside this repo: `npx @jkeskikangas/skillcheck@0.2.4 <skill-dir>` (pinned). There is no unscoped `skillcheck` package — **do not run `npx skillcheck`** (it resolves to an unrelated package). If unavailable, run the deterministic checks manually and note the fallback.

**agnix** (specification rules — third-party linter that downloads and executes code):
- Run only with **explicit user opt-in**, pinned (`npx agnix@<pinned-version> <skill-dir>`); disclose the external execution in the deliverable. If the user declines, skip it and note the gap.

Fix all reported errors before proceeding. Each linter collects every violation in a single run.

### 8) Quality Gate

Two-phase review after validation. Target: the rubric's `meets_bar` (Quality Bar above).

#### Phase 1: Self-critic (cheap catch-pass — cannot claim the bar)

You are author-contaminated, so this pass only catches obvious holes: a *fail* here is actionable, a *pass* proves nothing. Re-read `SKILL.md` and check for:
- Vague or missing "when to use" triggers; trigger collisions with siblings.
- Missing guardrails for destructive/network actions; over-broad `allowed-tools`.
- Missing eval material / no stated way to verify success.
- Bloated prose that should be bullets or moved to `references/`.
- Workflow steps that leave key decisions ambiguous.

Fix what is fixable inline; flag what needs re-analysis or user input. Then go to Phase 2 — only a fresh context can claim the bar.

#### Phase 2: Fresh-context critic (claims the bar)

Run `$reviewing-skills` in a **fresh context** (its scores are blind only without your authoring context):
- If your environment supports subagents, **spawn a fresh-context subagent** and give it the skill path.
- Otherwise, invoke `$reviewing-skills` directly and provide the path.
- If `$reviewing-skills` is not available, self-review against the 7 rubric dimensions and note the gap in the deliverable.
- If the skill is git-tracked and you changed it, require the critic to cite the relevant diff hunk or commit short-hash for any change-driven P1/P2 findings.

Drive the loop with the critic's machine-readable verdict — do not re-review from scratch each pass:
1. First iteration: **full** review → consume the JSON `findings` array; apply fixes by id, **P1 then P2** (P3 last).
2. Between iterations: re-run `$reviewing-skills` in **triage** depth (blockers/P1 only — cheap) or **incremental** depth (diff-scoped scores against the prior `reviewed_commit`).
3. Re-run validation after each fix round.
4. Finish with a **full** review to confirm `meets_bar` — triage/incremental can never claim the gate.

Repeat up to **3 loops**; stop early when the bar is met or two consecutive iterations show no score improvement (plateau).

### 9) Finalize

Deliver:
- The final skill folder path(s)
- Any suggested follow-on skills (from the split proposal)
- A short note explaining why the skill will trigger correctly (tie to description “when to use”), including the Step 5 self-test routing result

## Edge Cases

- **User provides no skill name or path:** ask before proceeding; do not guess.
- **Target directory already has a SKILL.md:** enter update mode; do not overwrite without confirmation.
- **Linters not available (no Node.js / npx):** warn the user; skip validation but note it was skipped in the deliverable.
- **`$reviewing-skills` not available:** self-review against the 7 dimensions and state in the deliverable that no fresh-context critic ran.

## Output Rules

- No placeholders (`TODO`, `TBD`) in the final skill.
- Avoid deep reference chains: SKILL.md links directly to every resource it expects to be read.
- Prefer minimal, directive prose over explanations of common concepts.
