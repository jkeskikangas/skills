import { describe, it, expect } from "vitest";
import { formatJson } from "./json.js";

describe("formatJson", () => {
  it("returns empty array for no diagnostics", () => {
    expect(JSON.parse(formatJson([]))).toEqual([]);
  });

  it("maps diagnostics correctly", () => {
    const result = JSON.parse(
      formatJson([
        { rule: "r1", message: "m1", file: "/f1" },
        { rule: "r2", message: "m2", file: "/f2", fix: () => {} },
      ])
    );
    expect(result).toEqual([
      { rule: "r1", message: "m1", file: "/f1" },
      { rule: "r2", message: "m2", file: "/f2" },
    ]);
  });

  it("excludes fix functions from output", () => {
    const output = formatJson([
      { rule: "r", message: "m", file: "/f", fix: () => {} },
    ]);
    expect(output).not.toContain("fix");
  });
});
