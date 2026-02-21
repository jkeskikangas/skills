# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly.

**Email:** [jkeskikangas@gmail.com](mailto:jkeskikangas@gmail.com)

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact

**Expected response time:** within 7 days.

Do not open a public GitHub issue for security vulnerabilities.

## Security Design

All skills enforce safety constraints:
- Skills never read, request, or output secrets (`.env`, API keys, tokens, private keys)
- Validation scripts use Python stdlib only (no third-party dependencies)
- Review skills are read-only by default
- Writing skills require explicit user approval before writing files
