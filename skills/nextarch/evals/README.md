# NextArch evals

Regression assets for the `nextarch` skill. Deterministic checks run in CI via `npm run skill:check` at the repo root. Agent benchmarks run locally in a gitignored workspace.

## Files

| File | Purpose |
|------|---------|
| [evals.json](evals.json) | 4 behavioral evals with verifiable expectations |
| [trigger-eval.json](trigger-eval.json) | 25 trigger queries (`should_trigger` true/false) for description tuning |
| [benchmark.example.json](benchmark.example.json) | Shape reference for aggregated benchmark output |

## Deterministic checks (every PR)

```bash
npm run skill:check
```

Validates package layout, lazyDocs sync, version alignment with CHANGELOG, and trigger-eval schema.

## Agent benchmark workspace

Scaffold directories:

```bash
npm run skill:workspace
```

Layout at repo root (gitignored):

```
nextarch-workspace/
  iteration-1/
    eval-0/ ... eval-3/
      with_skill/outputs/    # agent response with skill enabled
      old_skill/outputs/     # optional baseline (skill snapshot)
    benchmark.json
    feedback.json
  history.json               # version progression (skill-creator schema)
```

### Run behavioral evals (release gate)

1. Enable the **nextarch** skill in your agent.
2. For each eval in `evals.json` (ids 1–4), run the `prompt` and save the full response to:
   - `nextarch-workspace/iteration-N/eval-<id>/with_skill/outputs/response.md`
3. Grade each response against `expectations` (manual or skill-creator grader).
4. Target: **all expectations pass** for every eval before tagging a release.

### Trigger evals (when `description` changes)

Use [trigger-eval.json](trigger-eval.json) with skill-creator’s description tooling (`improve_description.py` / comparator). Re-run before merging any edit to the `description` field in `SKILL.md`.

### skill-creator integration

If [skill-creator](https://github.com/anthropics/skills) is installed locally:

```bash
# Run evals (paths vary by skill-creator install)
python <skill-creator>/scripts/run_eval.py skills/nextarch

# Aggregate results
python <skill-creator>/scripts/aggregate_benchmark.py nextarch-workspace/iteration-1 --skill-name nextarch

# Review outputs in browser
python <skill-creator>/eval-viewer/generate_review.py nextarch-workspace/iteration-1 --skill-name nextarch
```

For iteration 2+, pass `--previous-workspace nextarch-workspace/iteration-1`.

### history.json

Track iterations at `nextarch-workspace/history.json`. See skill-creator `references/schemas.md` for the full schema. Example baseline is committed at [history.example.json](history.example.json).

## Release criteria (v1.8.0+)

- `npm run skill:check` green
- Iteration benchmark: 4/4 evals pass all expectations
- If `description` changed: trigger-eval review completed
