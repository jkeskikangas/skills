import { describe, it, expect } from "vitest";
import { resolve, join } from "node:path";
import { findDeepChains } from "./no-deep-chaining.js";
import type { MarkdownText, RelativeLink } from "../types.js";

const BASE = resolve(process.cwd(), "test-skill-fixture");

describe("findDeepChains", () => {
  it("returns empty when no chains exist", () => {
    const readFile = (path: string): MarkdownText | null => {
      if (path.endsWith("ref.md")) return "No links here." as MarkdownText;
      return null;
    };
    const links = new Set(["ref.md" as RelativeLink]);
    expect(findDeepChains(BASE, links, readFile)).toEqual([]);
  });

  it("detects a chain", () => {
    const readFile = (path: string): MarkdownText | null => {
      if (path === join(BASE, "ref.md")) return "See [other](other.md)." as MarkdownText;
      if (path === join(BASE, "other.md")) return "Final content." as MarkdownText;
      return null;
    };
    const links = new Set(["ref.md" as RelativeLink]);
    const result = findDeepChains(BASE, links, readFile);
    expect(result).toHaveLength(1);
    expect(result[0] as string).toContain("ref.md links to other.md");
  });

  it("ignores links outside skill dir", () => {
    const readFile = (): MarkdownText | null => "content" as MarkdownText;
    const links = new Set(["../escape.md" as RelativeLink]);
    expect(findDeepChains(BASE, links, readFile)).toEqual([]);
  });

  it("ignores non-markdown files", () => {
    const readFile = (): MarkdownText | null => "content" as MarkdownText;
    const links = new Set(["data.json" as RelativeLink]);
    expect(findDeepChains(BASE, links, readFile)).toEqual([]);
  });

  it("ignores unreadable files", () => {
    const readFile = (): MarkdownText | null => null;
    const links = new Set(["missing.md" as RelativeLink]);
    expect(findDeepChains(BASE, links, readFile)).toEqual([]);
  });

  it("ignores chains to non-markdown targets", () => {
    const readFile = (path: string): MarkdownText | null => {
      if (path === join(BASE, "ref.md")) return "See [data](data.json)." as MarkdownText;
      return null;
    };
    const links = new Set(["ref.md" as RelativeLink]);
    expect(findDeepChains(BASE, links, readFile)).toEqual([]);
  });
});
