# Maintainer guide — NextArch

**Repository:** https://github.com/sameer2006-s/NextArch

## Layout

```
NextArch/
├── package.json              # npm run skill:check
├── scripts/skill-check.mjs   # deterministic validators
├── .github/workflows/        # skill-check CI
└── skills/nextarch/
    ├── SKILL.md              # name: nextarch
    ├── skill.json            # version in CHANGELOG
    ├── rules/
    ├── docs/
    └── evals/                # behavioral + trigger evals
```

## Every PR

```bash
npm run skill:check
```

CI runs the same checks via [.github/workflows/skill-check.yml](.github/workflows/skill-check.yml).

Manual checklist (still required):

- [ ] `name: nextarch` in `SKILL.md` frontmatter matches `skill.json` (also enforced by `skill:check`)
- [ ] No `skills/nextjs-feature-architecture/` folder
- [ ] `.agents/` and `skills-lock.json` not committed

## Every release (v1.8.0+)

### 1. Deterministic gates

```bash
npm run skill:check
```

### 2. Agent benchmark (manual)

```bash
npm run skill:workspace   # creates nextarch-workspace/iteration-1/
```

1. Enable **nextarch** in your agent.
2. Run all 4 prompts from [skills/nextarch/evals/evals.json](skills/nextarch/evals/evals.json).
3. Save responses to `nextarch-workspace/iteration-N/eval-*/with_skill/outputs/response.md`.
4. Grade against `expectations` (target: 100% pass on every eval).
5. Update `nextarch-workspace/history.json` with `expectation_pass_rate`.

See [skills/nextarch/evals/README.md](skills/nextarch/evals/README.md) for skill-creator integration (`run_eval.py`, `aggregate_benchmark.py`, `generate_review.py`).

### 3. Trigger evals (if `description` changed)

Re-run [trigger-eval.json](skills/nextarch/evals/trigger-eval.json) via skill-creator description tooling before merging description edits.

### 4. Version bump and tag

- [ ] `skills/nextarch/skill.json` version matches top `CHANGELOG.md` entry
- [ ] `repository` URL is `https://github.com/sameer2006-s/NextArch`
- [ ] README install uses `npx skills add sameer2006-s/NextArch --skill nextarch`

```bash
git tag -a v1.8.0 -m "NextArch 1.8.0: eval regression harness + CI"
git push origin v1.8.0
```

Install for users:

```bash
npx skills add sameer2006-s/NextArch --skill nextarch -y
```

## Smoke test

```bash
npx skills add . --list
# → nextarch

npx skills add . --skill nextarch
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
