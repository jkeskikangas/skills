# Independent Critic (Rubric-Free Blind Pass)

First-principles review of an `AGENTS.md`, run **before and independently of** the rubric. Purpose: surface risks the shared rubric does not encode. The generator already optimizes toward that rubric, and a critic graded on the same rubric shares its blind spots — this pass exists to break that loop.

## Hard rule

Do **not** read, reference, or reconstruct `references/agents-md-rubric.md`, its seven dimensions, its weights, or its grade bands during this pass. Do not assign a numeric score. Judge only as an AI coding agent that is about to do real work in this repo with **no other context than this file**.

This review is **read-only**: report risks, do not modify files. Apply the same safety rules as the review prompt (never read or quote secrets; never execute repo scripts as "verification" — use read-only inspection; mark a check skipped rather than touching a secret-bearing path).

## The only question

> If I follow this file literally to do real work, **what breaks, misleads, or endangers me — and how likely is it?**

Answer it by working through the lenses below. For each risk you find, judge it on two axes and nothing else:

- **Likelihood** — how often a competent agent following this file hits it (rare / occasional / frequent).
- **Damage** — what it costs when hit (annoyance / wasted cycles / broken workflow / data loss or security incident).

Rank by `likelihood × damage`. A frequent-and-destructive risk outranks everything.

## Lenses

1. **Execute it in your head.** Walk the commands top to bottom as if running them. Does any command not exist, point at an empty/undefined script, need a missing env var, or run from the wrong directory? Would any of them — or any `# ON FAIL:` recovery — **destroy data, deploy, publish, or force-push**? A destructive step presented as routine or as a recovery is a top-rank finding.

2. **Two-readers test.** Find any instruction two competent engineers would carry out differently. Ambiguity in a MUST/NEVER is more dangerous than a missing rule, because the agent acts on it confidently.

3. **What do I still not know?** After reading, list what you'd have to **guess** to start working: the package manager, where code lives, how to run one test, how secrets are provided, what's safe to edit. Each forced guess is a risk the file was supposed to remove.

4. **Trust trap.** Find claims the file states confidently that may be **false or stale** — a path that may not exist, a version that may have moved, a command that may have been renamed. A confidently-wrong file is worse than no file, because the agent stops checking.

5. **Contradiction sweep.** Find any two lines that disagree (a tool mandated in one section and forbidden in another; a path in Structure that other sections contradict; CRITICAL vs. Commands mismatch).

6. **Danger named?** For every destructive capability you can infer the repo has (database/migrations, deploy, publish, infra/IaC), is there a guard that **names the specific command** and forbids the unsafe use? "Be careful" is not a guard. A missing or vague guard for a real destructive tool is a top-rank finding.

7. **Single most likely failure.** Name the one way an agent is **most likely** to act wrongly because of — or despite — this file. This is the headline finding.

## Output

```markdown
# Independent Critic — Blind Pass

## Headline risk
[The single most likely way an agent acts wrongly here, 1-2 sentences.]

## Risks (ranked by likelihood x damage)
1. **[title]** — likelihood: [rare/occasional/frequent] · damage: [annoyance/wasted cycles/broken workflow/data loss or security] · evidence: [line or quote] · fix: [concrete change]
2. ...

## Forced guesses
- [Each thing an agent must guess because the file does not say it.]

## Nothing-found note
[If a lens surfaced nothing, say so explicitly — do not pad.]
```

## Reconciliation (done by the caller, not this pass)

The writing workflow takes these risks and the rubric-pass findings and reconciles them: **every blind-pass risk the rubric pass did not already cover is escalated into the fix list at its blind-pass severity.** An uncovered risk is evidence that the rubric has a gap — not proof that the risk is minor.
