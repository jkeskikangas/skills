import type { SkillContext, LintDiagnostic, MarkdownText, RelativeLink, ChainDescription } from "../types.js";
import { join, resolve, relative, extname, dirname } from "node:path";
import { extractLocalMarkdownLinks } from "./links-resolve.js";

function isProbablyMarkdown(filePath: string): boolean {
  const ext = extname(filePath).toLowerCase();
  return ext === ".md" || ext === ".markdown";
}

export function findDeepChains(
  dir: string,
  links: Set<RelativeLink>,
  readFile: (path: string) => MarkdownText | null
): ChainDescription[] {
  const results: ChainDescription[] = [];

  for (const link of [...links].sort()) {
    const resolved = resolve(dir, link);
    if (!resolved.startsWith(dir) || !isProbablyMarkdown(resolved)) continue;

    const content = readFile(resolved);
    if (content === null) continue;

    const refLinks = extractLocalMarkdownLinks(content);
    for (const rl of [...refLinks].sort()) {
      const candidate = resolve(dirname(resolved), rl);
      const candidateContent = readFile(candidate);
      if (candidateContent !== null && isProbablyMarkdown(candidate)) {
        results.push(
          `${relative(dir, resolved)} links to ${rl}` as ChainDescription
        );
        break;
      }
    }
  }

  return results;
}

export function noDeepChaining(ctx: SkillContext): LintDiagnostic[] {
  if (!ctx.text) return [];

  const readFile = (path: string): MarkdownText | null => ctx.markdownFiles.get(path) ?? null;
  const links = extractLocalMarkdownLinks(ctx.text);
  const chains = findDeepChains(ctx.dir, links, readFile);

  return chains.map((chain) => ({
    rule: "no-deep-chaining",
    message: `Deep reference chain: ${chain}. List all required references directly in SKILL.md instead.`,
    file: join(ctx.dir, "SKILL.md"),
  }));
}
