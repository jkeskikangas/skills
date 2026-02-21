import type { SkillContext, LintDiagnostic } from "../types.js";
import { basename, join } from "node:path";

export function nameMatchesDir(ctx: SkillContext): LintDiagnostic[] {
  if (!ctx.frontmatter) return [];

  const dirName = basename(ctx.dir);
  if (ctx.frontmatter.name !== dirName) {
    return [
      {
        rule: "name-matches-dir",
        message: `Frontmatter name '${ctx.frontmatter.name}' must match directory name '${dirName}'.`,
        file: join(ctx.dir, "SKILL.md"),
      },
    ];
  }
  return [];
}
