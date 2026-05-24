# Changelog

Version in `skills/nextarch/skill.json`.

## [1.8.0] - 2026-05-25

### Added

- **Eval regression harness** — `npm run skill:check` (validate package, lazyDocs sync, version sync, trigger-eval lint)
- [`scripts/skill-check.mjs`](scripts/skill-check.mjs) (single file) and `npm run skill:workspace` to scaffold `nextarch-workspace/`
- [`.github/workflows/skill-check.yml`](.github/workflows/skill-check.yml) CI on push/PR
- [`skills/nextarch/evals/README.md`](skills/nextarch/evals/README.md) — agent benchmark workflow and release gates
- `benchmark.example.json` and `history.example.json` for skill-creator alignment

### Changed

- [PUBLISHING.md](PUBLISHING.md) — PR vs release eval gates

## [1.7.0] - 2026-05-22

### Breaking

- **Repository** renamed to [sameer2006-s/NextArch](https://github.com/sameer2006-s/NextArch) (was `nextjs-feature-arch-skill`)
- **Skill id** is `nextarch` (was `nextjs-feature-architecture`)
- Install: `npx skills add sameer2006-s/NextArch --skill nextarch`
- Prompts: `Using nextarch` or `Using NextArch`

### Added

- **Task scope** triage: Patch / Feature / Greenfield (no full skeleton on tiny tasks)
- **Anti-goals** — realtime, canvas UIs, tRPC/GraphQL-primary, unrequested migrations
- [`docs/brownfield.md`](skills/nextarch/docs/brownfield.md) — extend in place, layer adoption ladder
- [`docs/escape-hatches.md`](skills/nextarch/docs/escape-hatches.md) — tRPC, GraphQL, colocated fetch
- Eval id 4 (brownfield badge); expanded `trigger-eval.json` near-misses

### Changed

- Softer positioning: default server-first, extend existing repo patterns
- `features/` clarified as domain vertical slices (not FSD)
- Description: do not trigger on one-line copy/CSS-only fixes
- Rules: match repo first; optional layers; route colocation when repo already does it

## [1.6.0] - 2026-05-22

### Added

- Pushier skill `description` for better triggering (useEffect refactors, feature folders, hybrid, gRPC)
- Narrative **Examples** section in `SKILL.md` (integrated, refactor, gRPC)
- `evals/evals.json` — 3 behavioral evals with expectations
- `evals/trigger-eval.json` — 20 trigger queries for description tuning

### Changed

- Clarified out-of-scope: server-first `app/` refactors, not net-new `pages/` apps
- Deduplicated `rules/architecture.md` and `docs/topology.md` (SKILL.md is canonical summary)
- `docs/README.md` links maintainer evals

### Maintainer

- Eval workspace: `nextjs-feature-architecture-workspace/iteration-1/` (benchmark + sample runs)

## [1.5.0] - 2026-05-22

### Changed

- Multi-skill repo layout: skill under `skills/nextarch/`
- Install with `--skill nextarch`

## [1.4.1] - 2026-05-21

### Changed

- Restored `rules/` and `docs/` folders; removed monolithic `reference.md`
- Same TypeScript/Next.js best practices; progressive disclosure via separate files

## [1.4.0] - 2026-05-21

### Removed

- `rules/`, `docs/`, `prompts/`, `examples/` — single lazy doc `reference.md` at repo root

### Changed

- Restored TypeScript & Next.js best practices
- `SKILL.md` stays the entry; detail in `reference.md`

## [1.3.0] - 2026-05-21

### Removed

- `templates/` directory

### Changed

- Layer boundaries over strict TypeScript-only conventions

## [1.2.0] - 2026-05-21

### Added

- Templates, auth-env snippet, examples, trigger eval sample

## [1.1.1] - 2026-05-21

- Optimized description for Agent Skills triggering

## [1.1.0] - 2026-05-21

- Flat single-skill repo layout; progressive disclosure via snippets

## [1.0.0] - 2026-05-21

- Initial public skill package
