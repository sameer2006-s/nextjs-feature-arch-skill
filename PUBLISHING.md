# Maintainer guide

## Layout

Multi-skill repo — each skill lives under `skills/<name>/`:

```
skills/nextjs-feature-architecture/
  SKILL.md
  skill.json
  rules/
  docs/
  evals/              # evals.json, trigger-eval.json
```

## Pre-flight

- [ ] No `SKILL.md` at repo root (only under `skills/`)
- [ ] Valid frontmatter in `skills/nextjs-feature-architecture/SKILL.md` (< 1024 chars)
- [ ] `LICENSE` at repo root; `.agents/` and `skills-lock.json` not committed

## Smoke test

```bash
npx skills add . --list
# → nextjs-feature-architecture

npx skills add . --skill nextjs-feature-architecture -y
```

## Behavioral evals (skill-creator)

```bash
# Requires Python 3 + skill-creator on PATH
cd nextjs-feature-architecture-workspace
# Grade sample runs (or spawn subagents per skill-creator SKILL.md)
python grade_iteration.py

python -m scripts.aggregate_benchmark iteration-1 --skill-name nextjs-feature-architecture
# from skill-creator repo root

python eval-viewer/generate_review.py iteration-1 --skill-name nextjs-feature-architecture --benchmark iteration-1/benchmark.json --static iteration-1/review.html
```

## Description optimization

```bash
python -m scripts.run_loop \
  --eval-set skills/nextjs-feature-architecture/evals/trigger-eval.json \
  --skill-path skills/nextjs-feature-architecture \
  --model <your-model> \
  --max-iterations 5
```

Apply `best_description` to `SKILL.md` frontmatter and `skill.json`.

## Release

1. Bump `skill.json` and [CHANGELOG.md](CHANGELOG.md).
2. Tag on GitHub (`v1.6.0`).
3. [skills.sh](https://skills.sh) indexes after public installs.
