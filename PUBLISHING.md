# Maintainer guide — NextArch

**Repository:** https://github.com/sameer2006-s/NextArch

## Layout

```
skills/nextarch/
  SKILL.md          # name: nextarch
  skill.json        # version 1.7.0
  rules/
  docs/
  evals/
```

## Pre-flight (v1.7.0 release)

- [ ] `name: nextarch` in `SKILL.md` frontmatter matches `skill.json`
- [ ] `repository` URL is `https://github.com/sameer2006-s/NextArch`
- [ ] README install uses `npx skills add sameer2006-s/NextArch --skill nextarch -y`
- [ ] No `skills/nextjs-feature-architecture/` folder
- [ ] `.agents/` and `skills-lock.json` not committed

## Smoke test

```bash
npx skills add . --list
# → nextarch

npx skills add . --skill nextarch -y
```

## Tag release

```bash
git tag -a v1.7.0 -m "NextArch 1.7.0: nextarch skill id, task scope, brownfield docs"
git push origin v1.7.0
```

Install for users:

```bash
npx skills add sameer2006-s/NextArch --skill nextarch -y
```

## Breaking changes in 1.7.0

| Before | After |
|--------|--------|
| Repo `nextjs-feature-arch-skill` | **`NextArch`** |
| Skill id `nextjs-feature-architecture` | **`nextarch`** |
| Install | `npx skills add sameer2006-s/NextArch --skill nextarch -y` |

GitHub redirects from the old repo name should still work for a transition period.

## skills.sh

Listing updates after public installs against [sameer2006-s/NextArch](https://github.com/sameer2006-s/NextArch). No separate upload step.
