# Maintainer guide

## Layout

Multi-skill repo — each skill lives under `skills/<name>/`:

```
skills/nextjs-feature-architecture/
  SKILL.md
  skill.json
  rules/
  docs/
```

## Pre-flight

- [ ] No `SKILL.md` at repo root (only under `skills/`)
- [ ] Valid frontmatter in `skills/nextjs-feature-architecture/SKILL.md`
- [ ] `LICENSE` at repo root; `.agents/` and `skills-lock.json` not committed

## Smoke test

```bash
npx skills add . --list
# → nextjs-feature-architecture

npx skills add . --skill nextjs-feature-architecture -y
# → installs rules/, docs/, SKILL.md
```

## Release

1. Bump `skills/nextjs-feature-architecture/skill.json` and [CHANGELOG.md](CHANGELOG.md).
2. Tag on GitHub.
3. [skills.sh](https://skills.sh) indexes after public installs.
