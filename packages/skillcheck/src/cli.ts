import { parseArgs } from "node:util";
import { lint } from "./index.js";
import { formatStylish } from "./formatters/stylish.js";
import { formatJson } from "./formatters/json.js";
import type { LintResult, OutputFormat } from "./types.js";

type ParseSuccess = {
  paths: string[];
  options: {
    format: OutputFormat;
    maxLines: number;
    fix: boolean;
    skillsOnly: boolean;
    rubricsOnly: boolean;
  };
};

type ParseResult =
  | ParseSuccess
  | { error: string }
  | { help: true };

export function parseCliArgs(argv: string[]): ParseResult {
  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      allowPositionals: true,
      options: {
        format: { type: "string", default: "stylish" },
        "max-lines": { type: "string", default: "500" },
        fix: { type: "boolean", default: false },
        "skills-only": { type: "boolean", default: false },
        "rubrics-only": { type: "boolean", default: false },
        help: { type: "boolean", short: "h", default: false },
      },
    });
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : String(e) };
  }

  if (parsed.values.help) return { help: true };

  if (parsed.positionals.length === 0) {
    return { error: "at least one path is required." };
  }

  const format = parsed.values.format as string;
  if (format !== "stylish" && format !== "json") {
    return { error: `unknown format '${format}'. Use 'stylish' or 'json'.` };
  }

  const maxLines = parseInt(parsed.values["max-lines"] as string, 10);
  if (isNaN(maxLines) || maxLines <= 0) {
    return { error: "--max-lines must be a positive integer." };
  }

  return {
    paths: parsed.positionals,
    options: {
      format: format as OutputFormat,
      maxLines,
      fix: parsed.values.fix as boolean,
      skillsOnly: parsed.values["skills-only"] as boolean,
      rubricsOnly: parsed.values["rubrics-only"] as boolean,
    },
  };
}

export function formatLintOutput(
  result: LintResult,
  format: OutputFormat,
  fix: boolean
): string {
  if (result.diagnostics.length === 0) {
    const parts: string[] = [];
    if (result.skillCount > 0) parts.push(`${result.skillCount} skill${result.skillCount === 1 ? "" : "s"}`);
    if (result.rubricCount > 0) parts.push(`${result.rubricCount} rubric${result.rubricCount === 1 ? "" : "s"}`);
    return `[OK] ${parts.join(" and ")} valid.`;
  }

  const output =
    format === "json"
      ? formatJson(result.diagnostics)
      : formatStylish(result.diagnostics);

  const lines = [output];
  const fixable = result.diagnostics.filter((d) => d.fix);
  if (fixable.length > 0) {
    lines.push(
      fix
        ? `Applied ${fixable.length} fix${fixable.length === 1 ? "" : "es"}.`
        : "Tip: re-run with --fix to apply automated fixes."
    );
  }
  return lines.join("\n");
}

const USAGE = `Usage: skillcheck [options] <path...>

Options:
  --format <stylish|json>  Output format (default: stylish)
  --max-lines <n>          Max allowed SKILL.md lines (default: 500)
  --fix                    Auto-fix rubric drift
  --skills-only            Skip rubric checks
  --rubrics-only           Skip skill checks
  -h, --help               Show this help
`;

export function run(argv: string[] = process.argv.slice(2)): number {
  const parsed = parseCliArgs(argv);
  if ("error" in parsed) {
    process.stderr.write(`Error: ${parsed.error}\n`);
    process.stderr.write(USAGE);
    return 2;
  }
  if ("help" in parsed) {
    process.stderr.write(USAGE);
    return 0;
  }

  const result = lint(parsed.paths, parsed.options);
  const output = formatLintOutput(result, parsed.options.format, parsed.options.fix);

  if (result.diagnostics.length === 0) {
    process.stdout.write(output + "\n");
    return 0;
  }

  process.stdout.write(output.split("\n")[0] + "\n");
  const extra = output.split("\n").slice(1).filter(Boolean);
  for (const line of extra) process.stderr.write(line + "\n");
  return 1;
}
