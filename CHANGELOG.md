# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [0.2.1] - 2026-02-21

### Changed

- Release workflow now uses npm Trusted Publishing (OIDC) instead of `npm adduser`/tokens.

## [0.2.3] - 2026-02-22

### Changed

- Root README now emphasizes practical failure modes and production-quality review (including rationale for the two-phase critic gate).
- Root README title and language tightened for a more professional, repo-native tone.
- `@jkeskikangas/skillcheck` README expanded with motivation, positioning vs. `agnix`, and core design principles.

## [0.2.2] - 2026-02-21

### Changed

- Release workflow: ensure `repository.url` is present for provenance verification and run tests before publish.

## [0.2.0] - 2026-02-21

### Changed

- Root README revamped for faster onboarding (quickstart, verification, troubleshooting, and clearer positioning).
- `@jkeskikangas/skillcheck` README expanded with examples, exit codes, JSON output notes, and CI snippets.
- CI validation now runs on Linux, macOS, and Windows across Node 18/20/22.

## [0.1.0] - 2025-02-20

### Added

- Initial release with 4 skills:
  - `writing-agents-md` — generate or update AGENTS.md context files
  - `writing-skills` — create or update agent skill directories
  - `reviewing-skills` — review and grade agent skills
  - `writing-rubrics` — create or update rubric documents
- Validation scripts (`validate_skill.py`, `check_rubrics.py`, `init_skill.py`, `write_openai_yaml.py`)
- OpenAI Codex agent configurations for all skills
- Project documentation (README, CONTRIBUTING, SECURITY, CHANGELOG)
- CI workflow for automated validation
