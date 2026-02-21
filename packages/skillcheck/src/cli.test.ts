import { describe, it, expect, vi } from "vitest";
import { resolve } from "node:path";
import { parseCliArgs, formatLintOutput, run } from "./cli.js";
import type { LintResult } from "./types.js";

const FIXTURES = resolve(import.meta.dirname, "../fixtures");

describe("parseCliArgs", () => {
  it("parses valid args", () => {
    const result = parseCliArgs(["skills/"]);
    expect(result).toEqual({
      paths: ["skills/"],
      options: {
        format: "stylish",
        maxLines: 500,
        fix: false,
        skillsOnly: false,
        rubricsOnly: false,
      },
    });
  });

  it("returns error for missing paths", () => {
    const result = parseCliArgs([]);
    expect(result).toEqual({ error: "at least one path is required." });
  });

  it("returns error for unknown format", () => {
    const result = parseCliArgs(["--format", "xml", "skills/"]);
    expect(result).toEqual({
      error: "unknown format 'xml'. Use 'stylish' or 'json'.",
    });
  });

  it("returns help", () => {
    const result = parseCliArgs(["--help"]);
    expect(result).toEqual({ help: true });
  });

  it("returns help with -h", () => {
    const result = parseCliArgs(["-h"]);
    expect(result).toEqual({ help: true });
  });

  it("parses --fix", () => {
    const result = parseCliArgs(["--fix", "skills/"]);
    expect("options" in result && result.options.fix).toBe(true);
  });

  it("parses --max-lines", () => {
    const result = parseCliArgs(["--max-lines", "100", "skills/"]);
    expect("options" in result && result.options.maxLines).toBe(100);
  });

  it("returns error for invalid --max-lines", () => {
    const result = parseCliArgs(["--max-lines", "abc", "skills/"]);
    expect(result).toEqual({ error: "--max-lines must be a positive integer." });
  });

  it("returns error for zero --max-lines", () => {
    const result = parseCliArgs(["--max-lines", "0", "skills/"]);
    expect(result).toEqual({ error: "--max-lines must be a positive integer." });
  });

  it("parses --rubrics-only", () => {
    const result = parseCliArgs(["--rubrics-only", "skills/"]);
    expect("options" in result && result.options.rubricsOnly).toBe(true);
  });

  it("parses --skills-only", () => {
    const result = parseCliArgs(["--skills-only", "skills/"]);
    expect("options" in result && result.options.skillsOnly).toBe(true);
  });

  it("parses json format", () => {
    const result = parseCliArgs(["--format", "json", "skills/"]);
    expect("options" in result && result.options.format).toBe("json");
  });

  it("returns error for unknown option", () => {
    const result = parseCliArgs(["--unknown", "skills/"]);
    expect("error" in result).toBe(true);
  });

  it("handles multiple paths", () => {
    const result = parseCliArgs(["a/", "b/"]);
    expect("paths" in result && result.paths).toEqual(["a/", "b/"]);
  });
});

describe("formatLintOutput", () => {
  it("formats OK message when no diagnostics", () => {
    const result: LintResult = { diagnostics: [], skillCount: 2, rubricCount: 1 };
    expect(formatLintOutput(result, "stylish", false)).toBe(
      "[OK] 2 skills and 1 rubric valid."
    );
  });

  it("formats singular counts", () => {
    const result: LintResult = { diagnostics: [], skillCount: 1, rubricCount: 0 };
    expect(formatLintOutput(result, "stylish", false)).toBe(
      "[OK] 1 skill valid."
    );
  });

  it("formats stylish output with diagnostics", () => {
    const result: LintResult = {
      diagnostics: [
        { rule: "test-rule", message: "bad stuff", file: "/foo/SKILL.md" },
      ],
      skillCount: 1,
      rubricCount: 0,
    };
    const output = formatLintOutput(result, "stylish", false);
    expect(output).toContain("/foo/SKILL.md");
    expect(output).toContain("test-rule");
    expect(output).toContain("1 problem");
  });

  it("formats json output", () => {
    const result: LintResult = {
      diagnostics: [
        { rule: "r", message: "m", file: "/f" },
      ],
      skillCount: 1,
      rubricCount: 0,
    };
    const output = formatLintOutput(result, "json", false);
    // The JSON output is the first "section" before any tip/fix lines
    // formatJson produces pretty-printed JSON; extract it by finding the closing ]
    const jsonEnd = output.lastIndexOf("]");
    const parsed = JSON.parse(output.slice(0, jsonEnd + 1));
    expect(parsed).toEqual([{ rule: "r", message: "m", file: "/f" }]);
  });

  it("includes fix tip when not fixing", () => {
    const result: LintResult = {
      diagnostics: [
        { rule: "r", message: "m", file: "/f", fix: () => {} },
      ],
      skillCount: 1,
      rubricCount: 0,
    };
    const output = formatLintOutput(result, "stylish", false);
    expect(output).toContain("re-run with --fix");
  });

  it("includes fix summary when fixing", () => {
    const result: LintResult = {
      diagnostics: [
        { rule: "r", message: "m", file: "/f", fix: () => {} },
      ],
      skillCount: 1,
      rubricCount: 0,
    };
    const output = formatLintOutput(result, "stylish", true);
    expect(output).toContain("Applied 1 fix.");
  });

  it("pluralizes fix count", () => {
    const result: LintResult = {
      diagnostics: [
        { rule: "r", message: "m", file: "/f", fix: () => {} },
        { rule: "r2", message: "m2", file: "/f", fix: () => {} },
      ],
      skillCount: 1,
      rubricCount: 0,
    };
    const output = formatLintOutput(result, "stylish", true);
    expect(output).toContain("Applied 2 fixes.");
  });

  it("no fixable diagnostics omits tip", () => {
    const result: LintResult = {
      diagnostics: [
        { rule: "r", message: "m", file: "/f" },
      ],
      skillCount: 1,
      rubricCount: 0,
    };
    const output = formatLintOutput(result, "stylish", false);
    expect(output).not.toContain("fix");
  });
});

describe("run", () => {
  it("returns 0 for valid skill", () => {
    const stderrSpy = vi.spyOn(process.stderr, "write").mockImplementation(() => true);
    const stdoutSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    try {
      const code = run([resolve(FIXTURES, "valid-skill")]);
      expect(code).toBe(0);
    } finally {
      stderrSpy.mockRestore();
      stdoutSpy.mockRestore();
    }
  });

  it("returns 1 for invalid skill", () => {
    const stderrSpy = vi.spyOn(process.stderr, "write").mockImplementation(() => true);
    const stdoutSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    try {
      const code = run([resolve(FIXTURES, "invalid-skill")]);
      expect(code).toBe(1);
    } finally {
      stderrSpy.mockRestore();
      stdoutSpy.mockRestore();
    }
  });

  it("returns 2 for missing paths", () => {
    const stderrSpy = vi.spyOn(process.stderr, "write").mockImplementation(() => true);
    try {
      const code = run([]);
      expect(code).toBe(2);
    } finally {
      stderrSpy.mockRestore();
    }
  });

  it("returns 0 for help", () => {
    const stderrSpy = vi.spyOn(process.stderr, "write").mockImplementation(() => true);
    try {
      const code = run(["--help"]);
      expect(code).toBe(0);
    } finally {
      stderrSpy.mockRestore();
    }
  });
});
