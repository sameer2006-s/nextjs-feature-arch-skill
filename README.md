# nextjs-feature-architecture

[![Agent Skills](https://img.shields.io/badge/Agent_Skills-compatible-5b21b6)](https://agentskills.io)

An [Agent Skills](https://agentskills.io) package for **server-first Next.js App Router** development: feature vertical slices, React Server Components, Zod validation, Server Actions, repositories, and services. Supports **integrated** (in-repo database), **separate REST**, **Connect/gRPC**, and **hybrid** backends.

Works with any agent that supports the open skills ecosystem ([Skills CLI](https://github.com/vercel-labs/skills) — Cursor, Claude Code, Codex, Windsurf, and [50+ others](https://github.com/vercel-labs/skills#supported-agents)).

## Requirements

- [Node.js](https://nodejs.org/) 18+ (for `npx`)
- A compatible coding agent with skills support

## Install

**Project scope** (recommended for teams — committed via your agent’s skills directory):

```bash
npx skills add sameer2006-s/nextjs-feature-arch-skill -y
```

**Global scope** (available in all projects on your machine):

```bash
npx skills add sameer2006-s/nextjs-feature-arch-skill -g -y
```

On first run, the CLI detects which agents you have installed and prompts for install targets (unless you pass `-y`, which accepts defaults). To install for a **specific agent** only:

```bash
npx skills add sameer2006-s/nextjs-feature-arch-skill -a <agent> -y
```

Examples: `-a cursor`, `-a claude-code`, `-a codex`. See the [supported agents list](https://github.com/vercel-labs/skills#supported-agents).

**Preview** without installing:

```bash
npx skills add sameer2006-s/nextjs-feature-arch-skill --list
```

This repository is a **single skill** — entry point is `SKILL.md` at the repo root. No `--skill` flag is required.

## Usage

Attach or invoke the skill **`nextjs-feature-architecture`** in your agent, then describe the feature or refactor you want. The skill instructs the agent to detect backend topology, document architecture before code, and follow the layered layout in `rules/`.

### Example prompts

**Integrated backend:**

> Using nextjs-feature-architecture, add a comments feature: list and create comments on a post. We use Prisma.

**Connect/gRPC backend:**

> Using nextjs-feature-architecture, add an item detail page with optional client refresh. Connect RPC; proto package `@acme/api`.

**Refactor:**

> Using nextjs-feature-architecture, refactor `app/dashboard/page.tsx` — it uses `"use client"` and `useEffect` fetch. Move to a server-first feature slice.

## Package layout

| Path | Purpose |
|------|---------|
| `SKILL.md` | Entry instructions (~107 lines) |
| `skill.json` | Package manifest |
| `rules/` | Architecture, folder structure, coding standards |
| `prompts/` | Reusable generation and refactor prompts |
| `templates/` | Page, service, repository, schema stubs |
| `examples/` | End-to-end input → output walkthrough |
| `docs/snippets/` | Topology-specific code templates (loaded on demand) |
| `docs/performance.md` | RSC, caching, and bundle guidance |

The agent is guided to load **SKILL.md** first and open snippet docs only when needed, keeping context small.

## Contributing

Issues and pull requests are welcome. Keep `SKILL.md` under ~150 lines; add detailed templates under `docs/snippets/`.

Maintainers: see [PUBLISHING.md](PUBLISHING.md) before releases.

## License

MIT — see [LICENSE](LICENSE).
