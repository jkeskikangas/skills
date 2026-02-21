# Portability guidance (Codex + Claude Code/Desktop + OpenCode)

## Write in capability language

Prefer:
- “Search the repo for …”
- “Read the config file …”
- “Edit file …”
- “Run the test command …”

Avoid:
- Product-specific tool names as mandatory steps.

## If you mention product-specific tools

Add a 1-line adapter:
- “If that tool is unavailable, use shell commands (`rg`, `find`) to achieve the same result.”

## Network usage

Never assume web access. If web browsing materially changes output quality:
- make it explicit
- provide an offline fallback

