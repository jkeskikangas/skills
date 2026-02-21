export interface LintDiagnostic {
  rule: string;
  message: string;
  file: string;
  fix?: () => void;
}

export interface Frontmatter {
  keys: Set<string>;
  name: string;
  description: string;
}

export interface SkillContext {
  /** Absolute path to the skill directory */
  dir: string;
  /** Contents of SKILL.md */
  text: MarkdownText;
  /** Parsed frontmatter (undefined if parsing failed) */
  frontmatter?: Frontmatter;
  /** Max allowed line count */
  maxLines: number;
  /** Pre-read agents/openai.yaml content (undefined if absent) */
  openaiYaml?: string;
  /** Absolute paths of every file in the skill dir */
  files: Set<string>;
  /** Pre-read .md/.markdown file contents keyed by absolute path */
  markdownFiles: Map<string, MarkdownText>;
}

export interface RubricContext {
  /** Absolute path to the rubric file */
  file: string;
  /** Contents of the rubric markdown */
  text: MarkdownText;
  /** Whether --fix was requested */
  fix: boolean;
  /** Injected writer; only set when --fix is active */
  writeFile?: (content: MarkdownText) => void;
}

export type SkillRule = (ctx: SkillContext) => LintDiagnostic[];
export type RubricRule = (ctx: RubricContext) => LintDiagnostic[];

export type FrontmatterBlock = string & { readonly _brand: "FrontmatterBlock" };
export type MarkdownText     = string & { readonly _brand: "MarkdownText" };
export type RelativeLink     = string & { readonly _brand: "RelativeLink" };
export type MissingYamlKey   = string & { readonly _brand: "MissingYamlKey" };
export type ChainDescription = string & { readonly _brand: "ChainDescription" };
export type OutputFormat     = "stylish" | "json";

export interface LintOptions {
  maxLines?: number;
  format?: OutputFormat;
  fix?: boolean;
  skillsOnly?: boolean;
  rubricsOnly?: boolean;
}

export interface LintResult {
  diagnostics: LintDiagnostic[];
  skillCount: number;
  rubricCount: number;
}
