import type { SkillRule, RubricRule } from "../types.js";

import { skillMdExists } from "./skill-md-exists.js";
import { frontmatterValid } from "./frontmatter-valid.js";
import { frontmatterKeys } from "./frontmatter-keys.js";
import { nameConstraints } from "./name-constraints.js";
import { nameMatchesDir } from "./name-matches-dir.js";
import { descriptionConstraints } from "./description-constraints.js";
import { lineCount } from "./line-count.js";
import { noPlaceholders } from "./no-placeholders.js";
import { linksResolve } from "./links-resolve.js";
import { noDeepChaining } from "./no-deep-chaining.js";
import { openaiYamlSanity } from "./openai-yaml-sanity.js";

import { rubricGradeBands } from "./rubric-grade-bands.js";
import { rubricPriorities } from "./rubric-priorities.js";
import { rubricEvidence } from "./rubric-evidence.js";

export const skillRules: SkillRule[] = [
  skillMdExists,
  frontmatterValid,
  frontmatterKeys,
  nameConstraints,
  nameMatchesDir,
  descriptionConstraints,
  lineCount,
  noPlaceholders,
  linksResolve,
  noDeepChaining,
  openaiYamlSanity,
];

export const rubricRules: RubricRule[] = [
  rubricGradeBands,
  rubricPriorities,
  rubricEvidence,
];
