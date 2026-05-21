---
name: nextarch
description: >-
  NextArch skill — use when building or refactoring Next.js App Router apps with
  features/, server-first loading, Zod, Server Actions, repositories, and services
  (Prisma, Drizzle, REST, Connect/gRPC). Also when user says NextArch or asks for
  feature-sliced App Router architecture. Use for useEffect fetch refactors,
  vertical slices, TanStack server bridges, hybrid DB+API. Not for one-line
  copy/CSS-only fixes, styling-only, non-Next.js, backend-only APIs, or
  middleware-only tasks with no feature structure change.
---

# NextArch

Server-first Next.js App Router architecture (feature slices, layered data boundaries).

Default to **server-first, feature-sliced** TypeScript for full-stack App Router work. **Extend** existing repo patterns when they conflict — see [docs/brownfield.md](docs/brownfield.md). Reject client-heavy SPA data loading unless the product requires it.

**`features/`** = vertical slice **by domain** (comments, billing) — not Feature-Sliced Design layer folders. Do not add `features/shared/ui` unless the repo already does.

**Out of scope:** net-new Pages Router (`pages/`) apps, non-Next.js frameworks, CSS-only UI, middleware-only changes with no data-boundary or folder impact.

## Before code

1. Classify [task scope](#task-scope). Ask once if unclear.
2. Detect topology (below). Ask once if repo is ambiguous.
3. Output planning artifact per scope (not always full skeleton).
4. Load on demand — do not re-read SKILL sections in linked files:
   - Brownfield / existing layout → [docs/brownfield.md](docs/brownfield.md)
   - tRPC, GraphQL, colocated fetch → [docs/escape-hatches.md](docs/escape-hatches.md)
   - Enforcement → [rules/architecture.md](rules/architecture.md)
   - Folders → [rules/folder-structure.md](rules/folder-structure.md)
   - TypeScript / Next.js → [rules/coding-standards.md](rules/coding-standards.md)
   - Hybrid topology → [docs/topology.md](docs/topology.md)
   - Performance → [docs/performance.md](docs/performance.md)
   - REST / integrated → [docs/snippets/core.md](docs/snippets/core.md)
   - gRPC → [docs/snippets/grpc.md](docs/snippets/grpc.md)
   - Auth / env → [docs/snippets/auth-env.md](docs/snippets/auth-env.md)

## Task scope

| Scope | When | Required output |
|-------|------|-----------------|
| **Patch** | Single file, bugfix, copy, one field; no new data boundaries | 2–4 bullet plan; **no** full skeleton |
| **Feature** | New slice or refactor one area (default) | Short plan: Topology, Architecture tree, data flow |
| **Greenfield** | Multi-feature, hybrid split, new app area | Full [architecture skeleton](#architecture-skeleton) |

Default **Feature**. Upgrade to Greenfield if multi-feature; downgrade to Patch if user scope is explicitly tiny. If repo is **tRPC/GraphQL-first**, read [escape-hatches](docs/escape-hatches.md) — apply boundaries, not full repository layer.

## Anti-goals (not optimized for)

- Realtime / WebSockets-first UIs
- Client-heavy editors, maps, canvas apps
- tRPC or GraphQL as the **primary** API (unless extending server/client boundaries only)
- Net-new `pages/` Router products
- Big-bang rewrites of an existing stack without user request

## Topology

| Signal | Mode |
|--------|------|
| `lib/db`, Prisma/Drizzle, ORM | **Integrated** |
| `API_URL`, external `fetch`, no ORM | **Separate-REST** |
| `@connectrpc/connect`, `grpc/clients`, `*_pb` | **Separate-gRPC** |
| Mixed | **Hybrid** (per feature) |

| Mode | Flow | Domain rules |
|------|------|--------------|
| Integrated | UI → actions → services → repositories → DB | Next.js services |
| Separate-REST | UI → actions → services → repositories → HTTP | External backend |
| Separate-gRPC | UI → actions → services → *ApiClient → backend | External backend |

**gRPC:** one `lib/grpc/clients.ts`; `ServiceResult<T>`; TanStack via `*.queries.ts` bridges.

## Result types

| Layer | Shape (default if repo silent) |
|-------|--------------------------------|
| Server Actions | `{ ok: true, data? } \| { ok: false, error }` |
| gRPC services | `{ success: true, data } \| { success: false, error }` |

## Layers

| Layer | May | Must not |
|-------|-----|----------|
| UI | Render, call actions, compose | DB/API/RPC, domain rules |
| actions | Validate, call services, revalidate | SQL/HTTP/RPC, domain logic |
| services | Rules/orchestration, map DTOs | React, `"use client"` |
| repositories | CRUD, HTTP mapping | Business rules, React |
| hooks | TanStack via action bridges | *ApiClient, `getAuthedContext` |

Single read in one page with no shared logic → service/repository **optional**. See [rules/architecture.md](rules/architecture.md).

## Structure

```
features/<name>/{components,services,schemas,types?,hooks?,utils?,repositories?,actions?}
app/  components/  lib/{db|api|grpc|auth,env}  types/  middleware.ts
```

## Server vs client

Default **Server Component**. `"use client"` at **leaves** only. `loading.tsx`, `error.tsx`, `notFound()` where routes need them.

## TypeScript & Next.js (summary)

Match repo conventions first — [rules/coding-standards.md](rules/coding-standards.md). Defaults: strict TS, Zod at actions, `useActionState`, no server-only imports in client files, `React.cache()` / `Promise.all` for server reads.

## Architecture skeleton (Greenfield / large Feature)

```markdown
## Topology
## Architecture
## Layer responsibilities
## Rendering strategy
## Data flow
## Server vs client
## Performance
```

## Examples

**Integrated:** Comments + Prisma → Feature scope: Topology, `features/comments/`, then server page + actions (no page `useEffect` fetch).

**Refactor:** Client dashboard page → Feature scope: server page + service; filters in client island only.

**gRPC:** Item detail + refresh → Separate-gRPC, `item.queries.ts` bridge; hook never imports `itemApiClient`.

## Gotchas

- `params` / `searchParams` are `Promise<>` in Next.js 15+ — await before use.
- Revalidate after mutations affecting cached routes or tagged fetches.
- Separate topologies: do not duplicate backend validation in Next.js.
- Integrated: Server Actions over new internal API routes for form mutations.

## Anti-patterns

- Full skeleton on a one-line Patch task
- `"use client"` on data-only pages
- `useEffect` + fetch for server-loadable data
- DB/API/RPC in components
- Big-bang `features/` rewrite on brownfield repos
- Hooks importing `*ApiClient` or `getAuthedContext`
- One file mixing DB + HTTP + gRPC (hybrid)

## Review checklist

- [ ] Task scope stated (Patch / Feature / Greenfield)
- [ ] Topology stated when data boundaries involved
- [ ] Planning artifact matches scope (not over-documented)
- [ ] Minimal `"use client"` (leaves only)
- [ ] I/O in repositories or services (when layers used)
- [ ] `loading` / `error` / `notFound` for new routes

## Rules (on conflict)

[rules/architecture.md](rules/architecture.md) · [rules/folder-structure.md](rules/folder-structure.md) · [rules/coding-standards.md](rules/coding-standards.md)
