# Maintainer guide

## Pre-flight

- [ ] `SKILL.md` at root; `rules/` (3 files) and `docs/` present
- [ ] No `reference.md`, `prompts/`, `examples/`, or `templates/`
- [ ] Valid `name` + `description` in frontmatter (< 1024 chars)
- [ ] `LICENSE` present; `.agents/` and `skills-lock.json` not committed

## Smoke test

```bash
npx skills add . --list
npx skills add . -y
# → SKILL.md, rules/, docs/
```

## Release

1. Bump [CHANGELOG.md](CHANGELOG.md) and `skill.json` version.
2. Tag on GitHub.
3. [skills.sh](https://skills.sh) indexes after public installs.
