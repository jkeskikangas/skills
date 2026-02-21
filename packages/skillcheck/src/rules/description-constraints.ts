import type { SkillContext, LintDiagnostic } from "../types.js";
import { join } from "node:path";

export function descriptionConstraints(ctx: SkillContext): LintDiagnostic[] {
  if (!ctx.frontmatter) return [];

  const desc = ctx.frontmatter.description;
  const file = join(ctx.dir, "SKILL.md");

  if (!desc.trim()) {
    return [{ rule: "description-constraints", message: "Frontmatter description is empty.", file }];
  }
  if (desc.length > 1024) {
    return [
      {
        rule: "description-constraints",
        message: `Frontmatter description too long (${desc.length} > 1024).`,
        file,
      },
    ];
  }
  if (desc.includes("<") || desc.includes(">")) {
    return [
      {
        rule: "description-constraints",
        message: "Frontmatter description cannot contain '<' or '>'.",
        file,
      },
    ];
  }
  return [];
}
