import type { SkillContext, LintDiagnostic } from "../types.js";
import { join } from "node:path";

export function lineCount(ctx: SkillContext): LintDiagnostic[] {
  if (!ctx.text) return [];

  const count = ctx.text.split("\n").length;
  if (count > ctx.maxLines) {
    return [
      {
        rule: "line-count",
        message: `SKILL.md too long: ${count} lines (max ${ctx.maxLines}).`,
        file: join(ctx.dir, "SKILL.md"),
      },
    ];
  }
  return [];
}
