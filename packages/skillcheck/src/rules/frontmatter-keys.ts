import type { SkillContext, LintDiagnostic } from "../types.js";
import { join } from "node:path";

const ALLOWED_FRONTMATTER_KEYS = new Set([
  "name",
  "description",
  "license",
  "compatibility",
  "metadata",
  "allowed-tools",
]);

export function frontmatterKeys(ctx: SkillContext): LintDiagnostic[] {
  if (!ctx.frontmatter) return [];

  const unexpected = [...ctx.frontmatter.keys]
    .filter((k) => !ALLOWED_FRONTMATTER_KEYS.has(k))
    .sort();

  if (unexpected.length === 0) return [];

  const allowed = [...ALLOWED_FRONTMATTER_KEYS].sort().join(", ");
  return [
    {
      rule: "frontmatter-keys",
      message: `Unexpected frontmatter key(s): ${unexpected.join(", ")}. Allowed: ${allowed}`,
      file: join(ctx.dir, "SKILL.md"),
    },
  ];
}
