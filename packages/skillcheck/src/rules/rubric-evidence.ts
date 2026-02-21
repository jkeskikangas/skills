import type { RubricContext, LintDiagnostic } from "../types.js";

function hasEvidenceSection(text: string): boolean {
  return /(?:^|\n)##\s+Verification\b/i.test(text) || text.includes("PASS/FAIL/SKIP");
}

export function rubricEvidence(ctx: RubricContext): LintDiagnostic[] {
  if (hasEvidenceSection(ctx.text)) return [];

  return [
    {
      rule: "rubric-evidence",
      message:
        "Missing evidence-backed verification guidance (PASS/FAIL/SKIP).",
      file: ctx.file,
    },
  ];
}
