# Skills Rubric (single source of truth)

Use this rubric to evaluate a skill directory (at minimum: `SKILL.md`; optionally: `agents/openai.yaml`, `scripts/`, `references/`, `assets/`).

## Scoring rules

- Scale: **1.0–5.0** (half points allowed).
- Each dimension has a weight; compute a weighted average over 5.0.
- Grade bands:
  - **A:** 4.5–5.0
  - **B:** 3.5–4.49
  - **C:** 2.5–3.49
  - **D:** 1.5–2.49
  - **F:** < 1.5
- Findings priority:
  - **P1 (Critical):** likely to cause broken workflows, unsafe actions, or repeated failure loops.
  - **P2 (Important):** likely to waste tokens/time, reduce output quality, or cause repeated clarification.
  - **P3 (Nice):** polish and future-proofing.

## Verification (Evidence-Backed)

Prefer reporting verification outcomes as **PASS/FAIL/SKIP**. Use SKIP when verification is not possible or would require executing code or accessing secrets.

When reviewing a skill, verification typically covers:
- Skill directory resolved (path + how resolved).
- Frontmatter sane: `name` matches directory name; required keys present; description constraints met.
- No TODO/TBD placeholders.
- Referenced local files exist (links in `SKILL.md`).
- No deep reference chains (SKILL.md → reference → reference).
- `agents/openai.yaml` sanity (if present): required keys present.
- Optional validation run: `npx skillcheck <skill>` and/or `npx agnix <skill>` (SKIP if not available or user did not request execution).

Rule: do not claim FAIL without evidence (file path + what you checked).

## Dimension 1 — Spec compliance & metadata correctness (Weight: 20%)

**Key checks**
- `SKILL.md` starts with valid YAML frontmatter delimited by `---`.
- Frontmatter `name`:
  - hyphen-case: `^[a-z0-9-]+$`
  - ≤64 chars
  - no leading/trailing `-`, no `--`
  - matches directory name
- Frontmatter `description`:
  - non-empty, ≤1024 chars
  - **third person**
  - describes **what it does** and **when to use**
  - no angle brackets (`<` or `>`)
- No unresolved placeholders: `TODO`, `TBD`, bracket placeholders.
- No time-sensitive claims that will go stale (“latest”, “current pricing”, etc.) unless the skill explicitly requires web browsing and says so.

**Score anchors**
- **5:** fully compliant; metadata is accurate, specific, and discovery-friendly.
- **3:** mostly compliant, minor issues (e.g., description vague or missing “when”).
- **1:** missing/invalid frontmatter or name/dir mismatch.

## Dimension 2 — Description/trigger precision (Weight: 15%)

**Key checks**
- Description includes strong trigger terms: artifact types, file patterns, scenarios.
- Clear negative triggers: when not to use.
- Avoids generic discovery terms (“helper”, “utils”) without specifics.

**Score anchors**
- **5:** deterministic triggering; minimal false positives/negatives.
- **3:** somewhat specific but could trigger incorrectly among many skills.
- **1:** generic; does not constrain when to use.

## Dimension 3 — Workflow quality & degrees of freedom (Weight: 20%)

**Key checks**
- Workflow is sequential, decision-complete, and testable.
- Critical steps are low-freedom (exact) when fragile; high-freedom when heuristic.
- “Stop conditions” exist for iterative loops.
- Explicitly separates: discovery → plan → execution → validation.

**Score anchors**
- **5:** an implementer can follow without extra decisions; calibrated freedom.
- **3:** workable but has missing steps, unclear decisions, or weak stop conditions.
- **1:** mostly prose with no executable process.

## Dimension 4 — Progressive disclosure & token efficiency (Weight: 15%)

**Key checks**
- `SKILL.md` body stays lean (target <500 lines; much smaller preferred).
- Heavy materials are moved to `references/` or deterministic logic to `scripts/`.
- References are **one level deep**: SKILL.md links directly to every resource; referenced files do not require reading more files.
- Avoids duplicating the same facts across sections.

**Score anchors**
- **5:** very high density; clear navigation; minimal duplication.
- **3:** acceptable but has bloat or repeated content.
- **1:** sprawling SKILL.md; deep reference chains; lots of filler.

## Dimension 5 — Safety & guardrails (Weight: 15%)

**Key checks**
- Explicitly forbids destructive operations unless user confirms.
- Secret handling rules exist: never read `.env`, credentials, keys; safe redaction.
- Clear constraints on network usage (web browsing) and external systems.

**Score anchors**
- **5:** strong guardrails; safe by default.
- **3:** some guardrails but gaps for likely dangerous operations.
- **1:** encourages unsafe actions or omits safety where needed.

## Dimension 6 — Robustness (error handling, validation loops) (Weight: 10%)

**Key checks**
- Includes validation steps/checklists for fragile outputs.
- If scripts exist: CLI is stable; error messages actionable; deterministic behavior.
- Avoids “punt to LLM”: uses scripts/templates where determinism matters.

**Score anchors**
- **5:** resilient workflows; self-checks catch common failure modes.
- **3:** some validation but weak diagnostics.
- **1:** brittle; no validation; failures likely repeat.

## Dimension 7 — Portability & composability (Weight: 5%)

**Key checks**
- Works across major agents (Codex, Claude Code/Desktop, OpenCode) by using capability language.
- Avoids assuming product-specific tool names; includes adapters only when helpful.
- Composes cleanly with companion skills (e.g., write↔review loop).

**Score anchors**
- **5:** platform-agnostic and modular.
- **3:** mostly portable but contains some platform lock-in.
- **1:** tightly bound to one product/tool with no alternative.
