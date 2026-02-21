import { readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

export interface DiscoverResult {
  skillDirs: string[];
  rubricFiles: string[];
}

export function discover(basePath: string): DiscoverResult {
  const abs = resolve(basePath);
  const skillDirs: string[] = [];
  const rubricFiles: string[] = [];

  if (existsSync(join(abs, "SKILL.md"))) {
    skillDirs.push(abs);
    collectRubrics(abs, rubricFiles);
  } else {
    let entries: string[];
    try { entries = readdirSync(abs); } catch { return { skillDirs, rubricFiles }; }

    for (const entry of entries.sort()) {
      const child = join(abs, entry);
      try { if (!statSync(child).isDirectory()) continue; } catch { continue; }
      if (existsSync(join(child, "SKILL.md"))) skillDirs.push(child);
      collectRubrics(child, rubricFiles);
    }
  }

  return { skillDirs, rubricFiles: rubricFiles.sort() };
}

function collectRubrics(dir: string, out: string[]): void {
  const refsDir = join(dir, "references");
  if (!existsSync(refsDir)) return;

  let entries: string[];
  try { entries = readdirSync(refsDir); } catch { return; }

  for (const entry of entries) {
    if (entry.includes("rubric") && entry.endsWith(".md")) {
      out.push(join(refsDir, entry));
    }
  }
}
