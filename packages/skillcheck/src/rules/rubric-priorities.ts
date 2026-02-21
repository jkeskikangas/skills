import type { RubricContext, LintDiagnostic, MarkdownText } from "../types.js";

const CANONICAL_PRIORITIES: Record<string, string> = {
  P1: "P1 (Critical): likely to cause broken workflows, unsafe actions, or repeated failure loops.",
  P2: "P2 (Important): likely to waste tokens/time, reduce output quality, or cause repeated clarification.",
  P3: "P3 (Nice): polish and future-proofing.",
};

const PRIORITY_PATTERNS = [
  /P1\s*\(Critical\).*broken workflows.*unsafe actions.*repeated failure loops/is,
  /P2\s*\(Important\).*waste tokens\/time.*reduce output quality.*repeated clarification/is,
  /P3\s*\(Nice\).*polish.*future-proofing/is,
];

export function checkPriorities(text: MarkdownText): boolean {
  return PRIORITY_PATTERNS.every((p) => p.test(text));
}

export function fixPriorities(text: MarkdownText): MarkdownText {
  const m = text.match(
    /^(##\s+Findings Priority\s*\n\n)([\s\S]*?)(?=\n^##\s+|\Z)/m
  );
  if (!m) return text;

  const replacement =
    `## Findings Priority\n\n` +
    `- **${CANONICAL_PRIORITIES["P1"]}**\n` +
    `- **${CANONICAL_PRIORITIES["P2"]}**\n` +
    `- **${CANONICAL_PRIORITIES["P3"]}**\n`;

  return (text.slice(0, m.index!) + replacement + text.slice(m.index! + m[0].length)) as MarkdownText;
}

export function rubricPriorities(ctx: RubricContext): LintDiagnostic[] {
  if (checkPriorities(ctx.text)) return [];

  const diagnostic: LintDiagnostic = {
    rule: "rubric-priorities",
    message: "P1/P2/P3 definitions do not match canonical wording.",
    file: ctx.file,
  };

  if (ctx.writeFile) {
    diagnostic.fix = () => {
      const fixed = fixPriorities(ctx.text);
      if (fixed !== ctx.text) {
        ctx.writeFile!(fixed);
      }
    };
  }

  return [diagnostic];
}
