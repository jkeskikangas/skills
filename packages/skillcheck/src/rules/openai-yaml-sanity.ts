import type { SkillContext, LintDiagnostic, MissingYamlKey } from "../types.js";
import { join } from "node:path";

const REQUIRED_KEYS = [
  "interface:",
  "display_name:",
  "short_description:",
  "default_prompt:",
];

export function validateOpenaiYamlContent(content: string): MissingYamlKey[] {
  return REQUIRED_KEYS.filter((k) => !content.includes(k)) as MissingYamlKey[];
}

export function openaiYamlSanity(ctx: SkillContext): LintDiagnostic[] {
  if (ctx.openaiYaml === undefined) return [];

  const missing = validateOpenaiYamlContent(ctx.openaiYaml);
  if (missing.length === 0) return [];

  return [{
    rule: "openai-yaml-sanity",
    message: `agents/openai.yaml missing required keys: ${missing.join(", ")}`,
    file: join(ctx.dir, "agents", "openai.yaml"),
  }];
}
