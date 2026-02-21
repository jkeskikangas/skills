import { describe, it, expect } from "vitest";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";
import { validateOpenaiYamlContent, openaiYamlSanity } from "./openai-yaml-sanity.js";
import type { SkillContext, MarkdownText } from "../types.js";

const FIXTURES = resolve(import.meta.dirname, "../../fixtures");

describe("validateOpenaiYamlContent", () => {
  it("returns empty array when all keys present", () => {
    const content = `interface: chat
display_name: Test
short_description: A test.
default_prompt: Hello.
`;
    expect(validateOpenaiYamlContent(content)).toEqual([]);
  });

  it("returns missing keys", () => {
    const content = `interface: chat
display_name: Test
`;
    const missing = validateOpenaiYamlContent(content);
    expect(missing).toContain("short_description:");
    expect(missing).toContain("default_prompt:");
    expect(missing).not.toContain("interface:");
    expect(missing).not.toContain("display_name:");
  });

  it("returns all keys for empty content", () => {
    expect(validateOpenaiYamlContent("")).toHaveLength(4);
  });
});

describe("openaiYamlSanity", () => {
  it("passes for valid-skill fixture", () => {
    const ctx: SkillContext = {
      dir: resolve(FIXTURES, "valid-skill"),
      text: "" as MarkdownText,
      maxLines: 500,
      openaiYaml: readFileSync(resolve(FIXTURES, "valid-skill/agents/openai.yaml"), "utf-8"),
      files: new Set<string>(),
      markdownFiles: new Map(),
    };
    expect(openaiYamlSanity(ctx)).toEqual([]);
  });

  it("returns empty if no openai.yaml exists", () => {
    const ctx: SkillContext = {
      dir: resolve(FIXTURES, "invalid-skill"),
      text: "" as MarkdownText,
      maxLines: 500,
      openaiYaml: undefined,
      files: new Set<string>(),
      markdownFiles: new Map(),
    };
    expect(openaiYamlSanity(ctx)).toEqual([]);
  });

  it("detects missing keys", () => {
    const ctx: SkillContext = {
      dir: resolve(FIXTURES, "valid-skill"),
      text: "" as MarkdownText,
      maxLines: 500,
      openaiYaml: "interface: chat\n",
      files: new Set<string>(),
      markdownFiles: new Map(),
    };
    const d = openaiYamlSanity(ctx);
    expect(d).toHaveLength(1);
    expect(d[0].message).toContain("display_name:");
  });
});
