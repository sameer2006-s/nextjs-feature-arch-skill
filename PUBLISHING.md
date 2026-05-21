# Publishing checklist

For maintainers before making the repository public or tagging a release.

## Repository

- [ ] GitHub repository is public: `sameer2006-s/nextjs-feature-arch-skill`
- [ ] Default branch (`main` or `master`) has at least one release commit
- [ ] `SKILL.md` at repo root with valid YAML frontmatter (`name`, `description`)
- [ ] Frontmatter `name` matches `skill.json` → `nextjs-feature-architecture`
- [ ] `skill.json` declares `"entry": "SKILL.md"`
- [ ] Relative links in `SKILL.md` resolve (`rules/`, `docs/`, `prompts/`, etc.)
- [ ] `LICENSE` (MIT) at repo root
- [ ] No secrets, tokens, or machine-specific paths in tracked files

## Skills CLI verification

```bash
git clone https://github.com/sameer2006-s/nextjs-feature-arch-skill.git
cd nextjs-feature-arch-skill

npx skills add . --list
# Expected: nextjs-feature-architecture

npx skills add . -y
# CLI selects installed agents interactively, or uses defaults with -y

# Optional: target one agent
# npx skills add . -a <agent> -y
```

Confirm the installed skill directory contains `SKILL.md`, `rules/`, `docs/`, and `templates/`. Exact install path depends on the agent (e.g. `.cursor/skills/`, `.claude/skills/`, `.agents/skills/`).

## Post-publish

- [ ] Repository description and topics include `nextjs`, `agent-skills`, `skills`
- [ ] Optional: list on [skills.sh](https://skills.sh)

## Versioning

Bump `skill.json` → `version` using semantic versioning:

- **Patch** — typos, clarifications, non-behavioral doc edits
- **Minor** — new rules, templates, or guidance
- **Major** — breaking architectural requirements
