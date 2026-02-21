import type { SkillContext, LintDiagnostic } from "../types.js";
import { join } from "node:path";

export function nameConstraints(ctx: SkillContext): LintDiagnostic[] {
  if (!ctx.frontmatter) return [];

  const name = ctx.frontmatter.name;
  const file = join(ctx.dir, "SKILL.md");

  if (!name) {
    return [{ rule: "name-constraints", message: "Frontmatter name is empty.", file }];
  }
  if (name.length > 64) {
    return [
      {
        rule: "name-constraints",
        message: `Frontmatter name too long (${name.length} > 64).`,
        file,
      },
    ];
  }
  if (!/^[a-z0-9-]+$/.test(name)) {
    return [
      {
        rule: "name-constraints",
        message: "Frontmatter name must match ^[a-z0-9-]+$.",
        file,
      },
    ];
  }
  if (name.startsWith("-") || name.endsWith("-") || name.includes("--")) {
    return [
      {
        rule: "name-constraints",
        message: "Frontmatter name cannot start/end with '-' or contain '--'.",
        file,
      },
    ];
  }
  return [];
}
