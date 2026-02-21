import { describe, it, expect, vi } from "vitest";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";
import type { RubricContext, MarkdownText } from "../types.js";
import { rubricGradeBands, hasRange, fixGradeBands } from "./rubric-grade-bands.js";
import { rubricPriorities, fixPriorities } from "./rubric-priorities.js";
import { rubricEvidence } from "./rubric-evidence.js";

const FIXTURES = resolve(import.meta.dirname, "../../fixtures");

function makeCtx(file: string, fix = false, writeFile?: (content: MarkdownText) => void): RubricContext {
  return {
    file: resolve(file),
    text: readFileSync(file, "utf-8") as MarkdownText,
    fix,
    writeFile,
  };
}

describe("rubric-grade-bands", () => {
  it("passes with canonical grade bands", () => {
    const ctx = makeCtx(
      resolve(FIXTURES, "valid-rubric/references/test-rubric.md")
    );
    expect(rubricGradeBands(ctx)).toEqual([]);
  });

  it("fails with non-canonical grade bands", () => {
    const ctx = makeCtx(
      resolve(FIXTURES, "invalid-rubric/references/bad-rubric.md")
    );
    const d = rubricGradeBands(ctx);
    expect(d).toHaveLength(1);
    expect(d[0].rule).toBe("rubric-grade-bands");
  });

  it("attaches fix when ctx.fix is true", () => {
    const ctx = makeCtx(
      resolve(FIXTURES, "invalid-rubric/references/bad-rubric.md"),
      true,
      vi.fn()
    );
    const d = rubricGradeBands(ctx);
    expect(d).toHaveLength(1);
    expect(d[0].fix).toBeDefined();
  });
});

describe("hasRange", () => {
  it("matches a standard range", () => {
    expect(hasRange("| A | 4.5–5.0 |" as MarkdownText, "4.5–5.0")).toBe(true);
  });

  it("matches range with hyphen instead of en-dash", () => {
    expect(hasRange("| B | 3.5-4.49 |" as MarkdownText, "3.5–4.49")).toBe(true);
  });

  it("matches F range with <", () => {
    expect(hasRange("| F | < 1.5 |" as MarkdownText, "< 1.5")).toBe(true);
  });

  it("returns false when range missing", () => {
    expect(hasRange("no ranges here" as MarkdownText, "4.5–5.0")).toBe(false);
  });
});

describe("fixGradeBands", () => {
  it("fixes truncated B band", () => {
    const input = "| B | 3.5 – 4.4 |" as MarkdownText;
    expect(fixGradeBands(input)).toBe("| B | 3.5 – 4.49 |");
  });

  it("fixes truncated C band", () => {
    const input = "| C | 2.5 – 3.4 |" as MarkdownText;
    expect(fixGradeBands(input)).toBe("| C | 2.5 – 3.49 |");
  });

  it("fixes truncated D band", () => {
    const input = "| D | 1.5 – 2.4 |" as MarkdownText;
    expect(fixGradeBands(input)).toBe("| D | 1.5 – 2.49 |");
  });

  it("returns unchanged text when already correct", () => {
    const input = "| B | 3.5 – 4.49 |" as MarkdownText;
    expect(fixGradeBands(input)).toBe(input);
  });
});

describe("rubric-priorities", () => {
  it("passes with canonical priorities", () => {
    const ctx = makeCtx(
      resolve(FIXTURES, "valid-rubric/references/test-rubric.md")
    );
    expect(rubricPriorities(ctx)).toEqual([]);
  });

  it("fails with missing priorities", () => {
    const ctx = makeCtx(
      resolve(FIXTURES, "invalid-rubric/references/bad-rubric.md")
    );
    const d = rubricPriorities(ctx);
    expect(d).toHaveLength(1);
    expect(d[0].rule).toBe("rubric-priorities");
  });

  it("attaches fix when ctx.fix is true", () => {
    const ctx = makeCtx(
      resolve(FIXTURES, "invalid-rubric/references/bad-rubric.md"),
      true,
      vi.fn()
    );
    const d = rubricPriorities(ctx);
    expect(d).toHaveLength(1);
    expect(d[0].fix).toBeDefined();
  });
});

describe("fixPriorities", () => {
  it("replaces priority section", () => {
    const input = `## Findings Priority

- wrong priorities here

## Next Section` as MarkdownText;
    const result = fixPriorities(input);
    expect(result).toContain("P1 (Critical)");
    expect(result).toContain("P2 (Important)");
    expect(result).toContain("P3 (Nice)");
  });

  it("returns unchanged text when no priority section found", () => {
    const input = "No priority section." as MarkdownText;
    expect(fixPriorities(input)).toBe(input);
  });
});

describe("rubric-evidence", () => {
  it("passes with PASS/FAIL/SKIP", () => {
    const ctx = makeCtx(
      resolve(FIXTURES, "valid-rubric/references/test-rubric.md")
    );
    expect(rubricEvidence(ctx)).toEqual([]);
  });

  it("fails without evidence section", () => {
    const ctx = makeCtx(
      resolve(FIXTURES, "invalid-rubric/references/bad-rubric.md")
    );
    const d = rubricEvidence(ctx);
    expect(d).toHaveLength(1);
    expect(d[0].rule).toBe("rubric-evidence");
  });
});
