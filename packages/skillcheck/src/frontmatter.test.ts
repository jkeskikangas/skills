import { describe, it, expect } from "vitest";
import { readFrontmatterBlock, parseFrontmatter } from "./frontmatter.js";
import type { MarkdownText, FrontmatterBlock } from "./types.js";

describe("readFrontmatterBlock", () => {
  it("extracts frontmatter between --- delimiters", () => {
    const text = "---\nname: foo\n---\n\n# Body" as MarkdownText;
    expect(readFrontmatterBlock(text)).toBe("name: foo");
  });

  it("throws if no opening ---", () => {
    expect(() => readFrontmatterBlock("name: foo\n---\n" as MarkdownText)).toThrow(
      "must start with YAML frontmatter"
    );
  });

  it("throws if no closing ---", () => {
    expect(() => readFrontmatterBlock("---\nname: foo\n" as MarkdownText)).toThrow(
      "missing closing --- delimiter"
    );
  });
});

describe("parseFrontmatter", () => {
  it("parses inline name and description", () => {
    const fm = parseFrontmatter("name: my-skill\ndescription: A test skill." as FrontmatterBlock);
    expect(fm.name).toBe("my-skill");
    expect(fm.description).toBe("A test skill.");
    expect(fm.keys).toEqual(new Set(["name", "description"]));
  });

  it("parses block scalar description (folded >)", () => {
    const fm = parseFrontmatter(
      "name: my-skill\ndescription: >\n  Line one\n  line two." as FrontmatterBlock
    );
    expect(fm.name).toBe("my-skill");
    expect(fm.description).toBe("Line one line two.");
  });

  it("parses block scalar description (literal |)", () => {
    const fm = parseFrontmatter(
      "name: my-skill\ndescription: |\n  Line one\n  line two." as FrontmatterBlock
    );
    expect(fm.name).toBe("my-skill");
    expect(fm.description).toBe("Line one\nline two.");
  });

  it("strips quotes from inline values", () => {
    const fm = parseFrontmatter(
      'name: "my-skill"\ndescription: \'A test.\'' as FrontmatterBlock
    );
    expect(fm.name).toBe("my-skill");
    expect(fm.description).toBe("A test.");
  });

  it("throws on missing name", () => {
    expect(() => parseFrontmatter("description: foo" as FrontmatterBlock)).toThrow(
      "Missing required frontmatter key: name"
    );
  });

  it("throws on missing description", () => {
    expect(() => parseFrontmatter("name: foo" as FrontmatterBlock)).toThrow(
      "Missing required frontmatter key: description"
    );
  });

  it("throws on invalid line", () => {
    expect(() =>
      parseFrontmatter("name: foo\n  bad indent\ndescription: bar" as FrontmatterBlock)
    ).toThrow("Invalid frontmatter line");
  });

  it("collects all keys", () => {
    const fm = parseFrontmatter(
      "name: foo\ndescription: bar\nlicense: MIT" as FrontmatterBlock
    );
    expect(fm.keys).toEqual(new Set(["name", "description", "license"]));
  });

  it("skips empty lines and comments", () => {
    const fm = parseFrontmatter(
      "name: foo\n\n# comment\ndescription: bar" as FrontmatterBlock
    );
    expect(fm.name).toBe("foo");
    expect(fm.description).toBe("bar");
  });
});
