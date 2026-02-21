import { describe, it, expect } from "vitest";
import { formatStylish } from "./stylish.js";

describe("formatStylish", () => {
  it("returns empty string for no diagnostics", () => {
    expect(formatStylish([])).toBe("");
  });

  it("groups diagnostics by file", () => {
    const output = formatStylish([
      { rule: "r1", message: "m1", file: "/a/SKILL.md" },
      { rule: "r2", message: "m2", file: "/b/SKILL.md" },
      { rule: "r3", message: "m3", file: "/a/SKILL.md" },
    ]);
    const lines = output.split("\n");
    expect(lines[0]).toBe("/a/SKILL.md");
    expect(lines[1]).toBe("  r1  m1");
    expect(lines[2]).toBe("  r3  m3");
    expect(lines[4]).toBe("/b/SKILL.md");
    expect(lines[5]).toBe("  r2  m2");
  });

  it("shows singular 'problem' for 1 diagnostic", () => {
    const output = formatStylish([
      { rule: "r", message: "m", file: "/f" },
    ]);
    expect(output).toContain("1 problem");
    expect(output).not.toContain("problems");
  });

  it("shows plural 'problems' for multiple diagnostics", () => {
    const output = formatStylish([
      { rule: "r1", message: "m1", file: "/f" },
      { rule: "r2", message: "m2", file: "/f" },
    ]);
    expect(output).toContain("2 problems");
  });
});
