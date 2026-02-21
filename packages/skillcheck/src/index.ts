import { readFileSync, existsSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve, extname } from "node:path";
import { discover } from "./discover.js";
import { readFrontmatterBlock, parseFrontmatter } from "./frontmatter.js";
import { skillRules, rubricRules } from "./rules/index.js";
import type {
  LintOptions,
  LintResult,
  LintDiagnostic,
  SkillContext,
  RubricContext,
  Frontmatter,
  MarkdownText,
} from "./types.js";

export type { LintOptions, LintResult, LintDiagnostic, Frontmatter };
export { readFrontmatterBlock, parseFrontmatter } from "./frontmatter.js";
export { discover } from "./discover.js";

const DEFAULT_MAX_LINES = 500;

function collectFiles(
  dir: string,
  files: Set<string>,
  markdownFiles: Map<string, MarkdownText>
): void {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(fullPath, files, markdownFiles);
    } else if (entry.isFile()) {
      files.add(fullPath);
      const ext = extname(entry.name).toLowerCase();
      if (ext === ".md" || ext === ".markdown") {
        try {
          markdownFiles.set(fullPath, readFileSync(fullPath, "utf-8") as MarkdownText);
        } catch {
          // skip unreadable files
        }
      }
    }
  }
}

export function applyFixes(diagnostics: LintDiagnostic[]): number {
  let count = 0;
  for (const d of diagnostics) {
    if (d.fix) {
      d.fix();
      count++;
    }
  }
  return count;
}

function buildSkillContext(dir: string, maxLines: number): SkillContext {
  const resolvedDir = resolve(dir);
  const skillMdPath = join(resolvedDir, "SKILL.md");
  let text = "" as MarkdownText;
  let frontmatter: Frontmatter | undefined;

  if (existsSync(skillMdPath)) {
    text = readFileSync(skillMdPath, "utf-8") as MarkdownText;
    try {
      const block = readFrontmatterBlock(text);
      frontmatter = parseFrontmatter(block);
    } catch {
      // frontmatter stays undefined — frontmatter-valid rule will flag it
    }
  }

  let openaiYaml: string | undefined;
  try {
    openaiYaml = readFileSync(join(resolvedDir, "agents", "openai.yaml"), "utf-8");
  } catch {
    // undefined if absent
  }

  const files = new Set<string>();
  const markdownFiles = new Map<string, MarkdownText>();
  collectFiles(resolvedDir, files, markdownFiles);

  return { dir: resolvedDir, text, frontmatter, maxLines, openaiYaml, files, markdownFiles };
}

function buildRubricContext(file: string, fix: boolean): RubricContext {
  const resolvedFile = resolve(file);
  const text = readFileSync(resolvedFile, "utf-8") as MarkdownText;
  const writeFile = fix ? (content: MarkdownText) => writeFileSync(resolvedFile, content, "utf-8") : undefined;
  return { file: resolvedFile, text, fix, writeFile };
}

export function lint(
  paths: string[],
  options: LintOptions = {}
): LintResult {
  const maxLines = options.maxLines ?? DEFAULT_MAX_LINES;
  const fix = options.fix ?? false;
  const diagnostics: LintDiagnostic[] = [];
  let skillCount = 0;
  let rubricCount = 0;

  for (const p of paths) {
    const { skillDirs, rubricFiles } = discover(p);

    if (!options.rubricsOnly) {
      for (const dir of skillDirs) {
        skillCount++;
        const ctx = buildSkillContext(dir, maxLines);
        for (const rule of skillRules) diagnostics.push(...rule(ctx));
      }
    }

    if (!options.skillsOnly) {
      for (const file of rubricFiles) {
        rubricCount++;
        const ctx = buildRubricContext(file, fix);
        for (const rule of rubricRules) diagnostics.push(...rule(ctx));
      }
    }
  }

  if (fix) applyFixes(diagnostics);

  return { diagnostics, skillCount, rubricCount };
}
