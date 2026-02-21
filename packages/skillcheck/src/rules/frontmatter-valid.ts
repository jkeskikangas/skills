import type { SkillContext, LintDiagnostic } from "../types.js";
import { join } from "node:path";

export function frontmatterValid(ctx: SkillContext): LintDiagnostic[] {
  if (!ctx.text) return [];
  if (ctx.frontmatter) return [];

  // If frontmatter is undefined but text exists, parsing must have failed.
  // The error message is set by the caller during context construction.
  return [
    {
      rule: "frontmatter-valid",
      message: "Frontmatter parsing failed",
      file: join(ctx.dir, "SKILL.md"),
    },
  ];
}
