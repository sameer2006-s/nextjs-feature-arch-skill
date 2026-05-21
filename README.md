# nextjs-feature-architecture

[![Agent Skills](https://img.shields.io/badge/Agent_Skills-compatible-5b21b6)](https://agentskills.io)
[![Skills CLI](https://img.shields.io/badge/Install-npx_skills-000)](https://github.com/vercel-labs/skills)

**Server-first Next.js architecture for AI coding agents** — feature slices, React Server Components, Zod, Server Actions, repositories, and services. Works with integrated databases, external REST APIs, and Connect/gRPC backends.

---

## Quick start

**1. Install** (from the project where you build Next.js apps):

```bash
npx skills add sameer2006-s/nextjs-feature-arch-skill -y
```

**2. Enable the skill** in your agent (name: `nextjs-feature-architecture`).

**3. Prompt** — mention the skill and your task:

```text
Using nextjs-feature-architecture, add a comments feature with Prisma.
```

The agent will detect your backend topology, outline the architecture, then implement under `features/<name>/`.

---

## What you get

| Capability | Detail |
|------------|--------|
| **Topology detection** | Integrated (Prisma/Drizzle), Separate-REST, Separate-gRPC, or Hybrid |
| **Layered structure** | UI → actions → services → repositories / RPC |
| **Server-first defaults** | Minimal `"use client"`; interactive leaves only |
| **Architecture-first** | Topology and folder plan before code |
| **Copy-paste prompts** | `prompts/generate-feature.md`, `prompts/refactor-architecture.md` |
| **Templates** | Page, service, repository, schema stubs |

Compatible with any agent that supports [Agent Skills](https://agentskills.io), installed via the [Skills CLI](https://github.com/vercel-labs/skills) (Cursor, Claude Code, Codex, Windsurf, and [50+ others](https://github.com/vercel-labs/skills#supported-agents)).

---

## Install options

| Goal | Command |
|------|---------|
| **This project** (team default) | `npx skills add sameer2006-s/nextjs-feature-arch-skill -y` |
| **All projects** (your machine) | `npx skills add sameer2006-s/nextjs-feature-arch-skill -g -y` |
| **Preview only** | `npx skills add sameer2006-s/nextjs-feature-arch-skill --list` |
| **One agent** | `npx skills add sameer2006-s/nextjs-feature-arch-skill -a <agent> -y` |

**Requirements:** Node.js 18+ and a skills-capable agent.

On first install, the CLI detects which agents you have and installs to the right folder (for example `.agents/skills/`, `.cursor/skills/`, or `.claude/skills/`). Use `-a <agent>` only when you want a single target — see the [supported agents list](https://github.com/vercel-labs/skills#supported-agents).

**Local development** (this repo):

```bash
git clone https://github.com/sameer2006-s/nextjs-feature-arch-skill.git
cd nextjs-feature-arch-skill
npx skills add . -y
```

---

## Example prompts

<details>
<summary><strong>New feature</strong> (integrated backend)</summary>

```text
Using nextjs-feature-architecture, add a comments feature: list and create
comments on a post. We use Prisma in this repo.
```

</details>

<details>
<summary><strong>New feature</strong> (Connect/gRPC)</summary>

```text
Using nextjs-feature-architecture, add an item detail page with optional
client refresh. Backend is Connect RPC; proto package @acme/api.
```

</details>

<details>
<summary><strong>Refactor</strong> (client-heavy page)</summary>

```text
Using nextjs-feature-architecture, refactor app/dashboard/page.tsx — it uses
"use client" and useEffect fetch. Move to a server-first feature slice.
```

</details>

---

## Repository layout

```
SKILL.md                 # Agent entry point (start here)
skill.json               # Package manifest
rules/                   # Architecture, folders, TypeScript standards
prompts/                 # Feature generation & refactor prompts
templates/               # page, service, repository, schema stubs
examples/                # End-to-end walkthrough
docs/
  topology.md            # Extended topology guide
  performance.md         # RSC, caching, bundles
  snippets/              # Code templates (loaded on demand)
```

The agent reads `SKILL.md` first and opens `docs/snippets/` only when the task needs REST, gRPC, or extra detail — keeping context small.

---

## How it works

1. **Discovery** — The agent reads `name` and `description` from `SKILL.md`.
2. **Activation** — Your prompt matches the skill (Next.js features, refactors, Server Actions, gRPC, etc.).
3. **Execution** — The agent follows layered rules, outputs an architecture plan, then implements with the right topology.

---

## Contributing & license

Contributions welcome. Keep `SKILL.md` under ~150 lines; add long content under `docs/snippets/`.

| Resource | Link |
|----------|------|
| Maintainer checklist | [PUBLISHING.md](PUBLISHING.md) |
| License | [MIT](LICENSE) |
