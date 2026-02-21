import type { LintDiagnostic } from "../types.js";

export function formatStylish(diagnostics: LintDiagnostic[]): string {
  if (diagnostics.length === 0) return "";

  // Group by file
  const byFile = new Map<string, LintDiagnostic[]>();
  for (const d of diagnostics) {
    const existing = byFile.get(d.file);
    if (existing) {
      existing.push(d);
    } else {
      byFile.set(d.file, [d]);
    }
  }

  const lines: string[] = [];
  for (const [file, diags] of byFile) {
    lines.push(file);
    for (const d of diags) {
      lines.push(`  ${d.rule}  ${d.message}`);
    }
    lines.push("");
  }

  lines.push(
    `${diagnostics.length} problem${diagnostics.length === 1 ? "" : "s"}`
  );

  return lines.join("\n");
}
