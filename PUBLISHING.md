# Maintainer guide

## Pre-flight

- [ ] Repo public: `github.com/sameer2006-s/nextjs-feature-arch-skill`
- [ ] `SKILL.md` at root — valid `name` + `description` (< 1024 chars)
- [ ] `name` matches `skill.json` → `nextjs-feature-architecture`
- [ ] All links in `SKILL.md` resolve (see smoke test below)
- [ ] `LICENSE` present; no secrets; `.agents/` and `skills-lock.json` not committed

## Smoke test

```bash
npx skills add . --list
# → nextjs-feature-architecture

npx skills add . -y
# → SKILL.md, rules/, docs/, examples/ (no templates/)
```

## Link check (manual)

From repo root, confirm these exist:

- `docs/snippets/auth-env.md`
- `docs/eval/trigger-queries.example.json`
- `examples/hybrid-topology.md`
- `examples/refactor-client-page.md`

## Release

1. Update [CHANGELOG.md](CHANGELOG.md) and `skill.json` version (semver).
2. Tag on GitHub: `v1.3.0`.
3. [skills.sh](https://skills.sh) listing follows installs/indexing — no separate upload.

## Versioning

| Bump | When |
|------|------|
| Patch | Typos, description tuning |
| Minor | New snippets, examples, rules |
| Major | Breaking architecture skeleton or required layers |
