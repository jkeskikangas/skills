import type { SkillContext, LintDiagnostic } from "../types.js";
import { join } from "node:path";

export function skillMdExists(ctx: SkillContext): LintDiagnostic[] {
  if (!ctx.text) {
    return [
      {
        rule: "skill-md-exists",
        message: "Missing SKILL.md",
        file: join(ctx.dir, "SKILL.md"),
      },
    ];
  }
  return [];
}
