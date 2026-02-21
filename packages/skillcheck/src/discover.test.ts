import { describe, it, expect } from "vitest";
import { resolve } from "node:path";
import { discover } from "./discover.js";

const FIXTURES = resolve(import.meta.dirname, "../fixtures");

describe("discover", () => {
  it("finds a single skill dir", () => {
    const result = discover(resolve(FIXTURES, "valid-skill"));
    expect(result.skillDirs).toEqual([resolve(FIXTURES, "valid-skill")]);
  });

  it("finds children skill dirs from parent", () => {
    const result = discover(FIXTURES);
    expect(result.skillDirs.length).toBeGreaterThanOrEqual(2);
    expect(result.skillDirs).toContain(resolve(FIXTURES, "valid-skill"));
    expect(result.skillDirs).toContain(resolve(FIXTURES, "invalid-skill"));
  });

  it("collects rubric files", () => {
    const result = discover(resolve(FIXTURES, "valid-rubric"));
    expect(result.rubricFiles.length).toBe(1);
    expect(result.rubricFiles[0]).toContain("test-rubric.md");
  });

  it("returns empty for nonexistent path", () => {
    const result = discover("/nonexistent/path/that/does/not/exist");
    expect(result.skillDirs).toEqual([]);
    expect(result.rubricFiles).toEqual([]);
  });

  it("collects rubrics from parent scan", () => {
    const result = discover(FIXTURES);
    expect(result.rubricFiles.length).toBeGreaterThanOrEqual(1);
  });
});
