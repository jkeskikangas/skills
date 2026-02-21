import type { SkillContext, LintDiagnostic, MarkdownText, RelativeLink } from "../types.js";
import { join, resolve } from "node:path";

export function extractLocalMarkdownLinks(text: MarkdownText): Set<RelativeLink> {
  const links = new Set<RelativeLink>();
  const re = /\]\(([^)]+)\)/g;
  let match;

  while ((match = re.exec(text)) !== null) {
    let target = match[1].trim();
    if (!target) continue;
    if (target.includes("://") || target.startsWith("mailto:")) continue;
    target = target.split("#", 1)[0].trim();
    if (!target || target.startsWith("/")) continue;
    links.add(target as RelativeLink);
  }

  return links;
}

export function linksResolve(ctx: SkillContext): LintDiagnostic[] {
  if (!ctx.text) return [];

  const diagnostics: LintDiagnostic[] = [];
  const links = extractLocalMarkdownLinks(ctx.text);
  const file = join(ctx.dir, "SKILL.md");

  for (const link of [...links].sort()) {
    const resolved = resolve(ctx.dir, link);

    if (!resolved.startsWith(ctx.dir)) {
      diagnostics.push({
        rule: "links-resolve",
        message: `SKILL.md links outside skill dir: ${link}`,
        file,
      });
      continue;
    }

    if (!ctx.files.has(resolved)) {
      diagnostics.push({
        rule: "links-resolve",
        message: `Broken link target in SKILL.md: ${link}`,
        file,
      });
    }
  }

  return diagnostics;
}
