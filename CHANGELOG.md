# Changelog

All notable changes to this skill package. Version in [skill.json](skill.json).

## [1.3.0] - 2026-05-21

### Removed

- `templates/` directory — lighter install; patterns live in `docs/snippets/` and `examples/` only

### Changed

- `SKILL.md` and `rules/coding-standards.md` — layer boundaries over strict TypeScript/Zod conventions
- Descriptions de-emphasize Zod; agents should match repo style
- Examples use flow descriptions instead of copy-paste TS stubs

## [1.2.0] - 2026-05-21

### Added

- Templates: `action.ts`, `queries.action.ts`, `use-query.ts`
- `docs/snippets/auth-env.md` for auth and environment patterns
- Drizzle repository example in `docs/snippets/core.md`
- Examples: `hybrid-topology.md`, `refactor-client-page.md`
- Expanded `feature-slice-example.md` with schema and action
- `docs/eval/trigger-queries.example.json` for description tuning
- Gotchas, result-type table, checkbox review list in `SKILL.md`
- Error/loading/not-found guidance in `rules/architecture.md`

### Changed

- Improved `description` frontmatter for triggering (App Router, Prisma, Drizzle, migration)
- Progressive disclosure: when to load each rule file
- Anti-patterns as scannable bullets

## [1.1.1] - 2026-05-21

- Optimized description for Agent Skills triggering
- Professional README and generic agent install

## [1.1.0] - 2026-05-21

- Flat single-skill repo layout
- Progressive disclosure via `docs/snippets/`
- Lean `SKILL.md` entry (~107 lines)

## [1.0.0] - 2026-05-21

- Initial public skill package
