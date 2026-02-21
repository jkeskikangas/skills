import type { RubricContext, LintDiagnostic, MarkdownText } from "../types.js";

const CANONICAL_GRADE_BANDS: Record<string, string> = {
  A: "4.5–5.0",
  B: "3.5–4.49",
  C: "2.5–3.49",
  D: "1.5–2.49",
  F: "< 1.5",
};

export function hasRange(text: MarkdownText, rangeText: string): boolean {
  if (rangeText.startsWith("<")) {
    return /<\s*1\.5\b/.test(text);
  }
  const [lo, hi] = rangeText.split("–").map((s) => s.trim());
  const pattern = new RegExp(
    lo.replace(/\./g, "\\.") + "\\s*[-–]\\s*" + hi.replace(/\./g, "\\.")
  );
  return pattern.test(text);
}

export function checkGradeBands(text: MarkdownText): boolean {
  return Object.values(CANONICAL_GRADE_BANDS).every((rng) =>
    hasRange(text, rng)
  );
}

export function fixGradeBands(text: MarkdownText): MarkdownText {
  let fixed: string = text;
  fixed = fixed.replace(
    /\|\s*B\s*\|\s*3\.5\s*–\s*4\.4\s*\|/g,
    "| B | 3.5 – 4.49 |"
  );
  fixed = fixed.replace(
    /\|\s*C\s*\|\s*2\.5\s*–\s*3\.4\s*\|/g,
    "| C | 2.5 – 3.49 |"
  );
  fixed = fixed.replace(
    /\|\s*D\s*\|\s*1\.5\s*–\s*2\.4\s*\|/g,
    "| D | 1.5 – 2.49 |"
  );
  return fixed as MarkdownText;
}

export function rubricGradeBands(ctx: RubricContext): LintDiagnostic[] {
  if (checkGradeBands(ctx.text)) return [];

  const diagnostic: LintDiagnostic = {
    rule: "rubric-grade-bands",
    message: "Grade bands do not match canonical ranges.",
    file: ctx.file,
  };

  if (ctx.writeFile) {
    diagnostic.fix = () => {
      const fixed = fixGradeBands(ctx.text);
      if (fixed !== ctx.text) {
        ctx.writeFile!(fixed);
      }
    };
  }

  return [diagnostic];
}
