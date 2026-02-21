import { describe, it, expect, vi } from "vitest";
import { resolve } from "node:path";
import { lint, applyFixes } from "./index.js";

const FIXTURES = resolve(import.meta.dirname, "../fixtures");

describe("lint", () => {
  it("returns 0 diagnostics for valid-skill", () => {
    const result = lint([resolve(FIXTURES, "valid-skill")]);
    expect(result.diagnostics).toEqual([]);
    expect(result.skillCount).toBe(1);
  });

  it("returns diagnostics for invalid-skill", () => {
    const result = lint([resolve(FIXTURES, "invalid-skill")]);
    expect(result.diagnostics.length).toBeGreaterThan(0);
    expect(result.skillCount).toBe(1);
  });

  it("discovers skills from parent dir", () => {
    const result = lint([FIXTURES], { skillsOnly: true });
    expect(result.skillCount).toBeGreaterThanOrEqual(2);
  });

  it("skips skills with rubricsOnly", () => {
    const result = lint([FIXTURES], { rubricsOnly: true });
    expect(result.skillCount).toBe(0);
  });

  it("skips rubrics with skillsOnly", () => {
    const result = lint([resolve(FIXTURES, "valid-rubric")], { skillsOnly: true });
    expect(result.rubricCount).toBe(0);
  });

  it("counts rubrics", () => {
    const result = lint([resolve(FIXTURES, "valid-rubric")], { rubricsOnly: true });
    expect(result.rubricCount).toBe(1);
  });
});

describe("applyFixes", () => {
  it("calls fix functions and returns count", () => {
    const fix1 = vi.fn();
    const fix2 = vi.fn();
    const diagnostics = [
      { rule: "r1", message: "m1", file: "/f1", fix: fix1 },
      { rule: "r2", message: "m2", file: "/f2" },
      { rule: "r3", message: "m3", file: "/f3", fix: fix2 },
    ];
    expect(applyFixes(diagnostics)).toBe(2);
    expect(fix1).toHaveBeenCalledOnce();
    expect(fix2).toHaveBeenCalledOnce();
  });

  it("returns 0 for no fixable diagnostics", () => {
    expect(applyFixes([{ rule: "r", message: "m", file: "/f" }])).toBe(0);
  });

  it("returns 0 for empty list", () => {
    expect(applyFixes([])).toBe(0);
  });
});
