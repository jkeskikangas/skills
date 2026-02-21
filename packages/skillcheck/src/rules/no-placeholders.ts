import type { SkillContext, LintDiagnostic } from "../types.js";
import { join } from "node:path";

const PLACEHOLDER_PATTERNS = [
  /\[TODO[^\]]*\]/,
  /\[TBD[^\]]*\]/,
  /(?:^|\n)\s*(TODO|TBD)\s*:/,
];

export function noPlaceholders(ctx: SkillContext): LintDiagnostic[] {
  if (!ctx.text) return [];

  if (PLACEHOLDER_PATTERNS.some((p) => p.test(ctx.text))) {
    return [
      {
        rule: "no-placeholders",
        message: "SKILL.md contains TODO/TBD placeholders (e.g., [TODO] or TODO:).",
        file: join(ctx.dir, "SKILL.md"),
      },
    ];
  }
  return [];
}
