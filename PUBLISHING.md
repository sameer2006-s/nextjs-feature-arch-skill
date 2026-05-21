# Maintainer guide

Checklist before publishing or tagging a release.

## Pre-flight

- [ ] Repository is public: `github.com/sameer2006-s/nextjs-feature-arch-skill`
- [ ] `SKILL.md` at repo root with valid `name` and `description` frontmatter
- [ ] `name` is `nextjs-feature-architecture` (matches `skill.json`)
- [ ] Description uses “Use this skill when…” and stays under 1024 characters
- [ ] All links in `SKILL.md` resolve
- [ ] `LICENSE` present; no secrets in tracked files

## Verify install

```bash
git clone https://github.com/sameer2006-s/nextjs-feature-arch-skill.git
cd nextjs-feature-arch-skill

npx skills add . --list
# → nextjs-feature-architecture

npx skills add . -y
# → SKILL.md, rules/, docs/, templates/ in agent skills directory
```

## Release

1. Bump `version` in `skill.json` (semver).
2. Update `README.md` if install or layout changed.
3. Tag on GitHub (optional): `v1.1.1`.
4. Optional: list on [skills.sh](https://skills.sh).

## Versioning

| Bump | When |
|------|------|
| Patch | Typos, docs, description tuning |
| Minor | New rules, templates, snippets |
| Major | Breaking architectural requirements |
