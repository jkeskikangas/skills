import type { Frontmatter, FrontmatterBlock, MarkdownText } from "./types.js";

export function readFrontmatterBlock(text: MarkdownText): FrontmatterBlock {
  if (!text.startsWith("---\n")) {
    throw new Error("SKILL.md must start with YAML frontmatter (---).");
  }
  const end = text.indexOf("\n---\n", 4);
  if (end === -1) {
    throw new Error("SKILL.md frontmatter is missing closing --- delimiter.");
  }
  return text.slice(4, end) as FrontmatterBlock;
}

export function parseFrontmatter(frontmatterText: FrontmatterBlock): Frontmatter {
  const keys = new Set<string>();
  let name: string | undefined;
  let description: string | undefined;

  const lines = frontmatterText.split("\n");
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim() || line.trimStart().startsWith("#")) {
      index++;
      continue;
    }

    const match = line.match(/^([A-Za-z0-9_-]+):(?:\s*(.*))?$/);
    if (!match) {
      throw new Error(`Invalid frontmatter line: ${JSON.stringify(line)}`);
    }

    const key = match[1];
    const rest = (match[2] ?? "").trimEnd();
    keys.add(key);

    // Block scalars for description: `description: >` or `description: |`
    if (key === "description" && [">", "|", ">-", "|-"].includes(rest.trim())) {
      const indicator = rest.trim();
      index++;
      const blockLines: string[] = [];
      let indent: number | undefined;

      while (index < lines.length) {
        const raw = lines[index];
        if (raw.trim() === "") {
          blockLines.push("");
          index++;
          continue;
        }
        const leading = raw.length - raw.trimStart().length;
        if (indent === undefined) {
          indent = leading;
        }
        if (leading < (indent ?? 0)) {
          break;
        }
        blockLines.push(raw.slice(indent ?? 0));
        index++;
      }

      if (indicator.startsWith(">")) {
        // Fold: join lines with spaces; preserve blank lines as newlines.
        const folded: string[] = [];
        let paragraph: string[] = [];
        for (const bl of blockLines) {
          if (bl === "") {
            if (paragraph.length) {
              folded.push(paragraph.join(" ").trim());
              paragraph = [];
            }
            folded.push("");
          } else {
            paragraph.push(bl.trimEnd());
          }
        }
        if (paragraph.length) {
          folded.push(paragraph.join(" ").trim());
        }
        description = folded.join("\n").trim();
      } else {
        description = blockLines.join("\n").trim();
      }
      continue;
    }

    // Inline scalar
    if (key === "name") {
      let value = rest.trim();
      value = value.replace(/^["']|["']$/g, "").trim();
      if (value) {
        name = value;
      }
    } else if (key === "description") {
      let value = rest.trim();
      value = value.replace(/^["']|["']$/g, "").trim();
      if (value) {
        description = value;
      }
    }

    // Mapping key with no scalar (e.g., `metadata:`), skip nested lines.
    if (rest.trim() === "") {
      index++;
      continue;
    }

    index++;
  }

  if (name === undefined) {
    throw new Error("Missing required frontmatter key: name");
  }
  if (description === undefined) {
    throw new Error("Missing required frontmatter key: description");
  }

  return { keys, name: name.trim(), description: description.trim() };
}
