import type { LintDiagnostic } from "../types.js";

export function formatJson(diagnostics: LintDiagnostic[]): string {
  const output = diagnostics.map((d) => ({
    rule: d.rule,
    message: d.message,
    file: d.file,
  }));
  return JSON.stringify(output, null, 2);
}
