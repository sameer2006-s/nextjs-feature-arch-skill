---
name: nextjs-feature-architecture
description: >-
  Enforces server-first Next.js App Router architecture with feature-based
  vertical slices, RSC, Zod, Server Actions, repositories, and services.
  Supports integrated DB, separate REST, and Connect/gRPC backends. Use when
  building or refactoring Next.js apps, feature folders, Server Actions,
  Connect RPC, protobuf, or TanStack Query with server bridges.
---

# Next.js Feature-Based Architecture

Act as a senior staff engineer. Enforce server-first, feature-sliced code. Reject client-heavy SPA patterns unless required.

## Before code

1. Detect topology (table below). Infer from repo once; ask once if unclear.
2. Output the [architecture skeleton](#architecture-skeleton) before any implementation.
3. Load extra material only when needed (do not read everything up front):
   - gRPC work → [docs/snippets/grpc.md](docs/snippets/grpc.md)
   - REST/integrated templates → [docs/snippets/core.md](docs/snippets/core.md)
   - Topology detail → [docs/topology.md](docs/topology.md)
   - App performance → [docs/performance.md](docs/performance.md)
   - Refactors → [prompts/refactor-architecture.md](prompts/refactor-architecture.md)

## Topology

| Signal | Mode |
|--------|------|
| `lib/db`, Prisma/Drizzle, ORM | **Integrated** |
| `API_URL`, OpenAPI, external `fetch`, no ORM | **Separate-REST** |
| `@connectrpc/connect`, `grpc/clients`, `*_pb` | **Separate-gRPC** |
| Mixed | **Hybrid** (per feature) |

| Mode | Flow | Domain rules |
|------|------|--------------|
| Integrated | UI → actions → services → repositories → DB | Next.js services |
| Separate-REST | UI → actions → services → repositories → HTTP API | External backend |
| Separate-gRPC | UI → actions → services → *ApiClient → backend | External backend |

State in every response: `## Topology: <mode>` + one sentence on persistence, transport, and where rules live.

**gRPC:** One `lib/grpc/clients.ts`. Only services/repositories import `*ApiClient`. Return `{ success: true, data } | { success: false, error }`. Hooks use Server Action bridges — never server auth or grpc in `"use client"`.

**Hybrid:** One transport per feature file. Never mix DB + HTTP + gRPC in the same repository/service.

## Layers

| Layer | May | Must not |
|-------|-----|----------|
| UI | Render, call actions, compose | DB/API/RPC, domain rules |
| actions | Zod, call services, revalidate | SQL/HTTP/RPC, domain logic |
| services | Rules/orchestration, map DTOs | React, `"use client"` |
| repositories | CRUD, HTTP mapping | Business rules, React |
| hooks | TanStack via action bridges | *ApiClient, getAuthedContext |

Reads: `Server Component → service → repository/RPC`.  
Writes: `client island → Server Action → service → repository/RPC`.

## Structure

```
features/<name>/{components,services,schemas,types?,hooks?,utils?,repositories?,actions?}
app/  components/  lib/{db|api|grpc}  types/  middleware.ts
```

Naming: see [rules/folder-structure.md](rules/folder-structure.md). Stubs: [templates/](templates/).

## Server vs client

Default Server Component. `"use client"` only for hooks, browser APIs, DOM events, or client-only libs. Push to leaves; pages/layouts stay server.

## Architecture skeleton

```markdown
## Topology
## Architecture
## Layer responsibilities
## Rendering strategy
## Data flow
## Server vs client
## Performance
```

Then implement. Example walkthrough: [examples/feature-slice-example.md](examples/feature-slice-example.md).

## Implementation (enforce)

- Strict TS; Zod in `features/<name>/schemas/`; validate in actions; `z.infer` for types.
- Mutations: `"use server"` actions → services only; `{ ok: true, data } | { ok: false, error }`.
- No `lib/db` / `lib/api` / grpc clients in UI. No TanStack without server bridge when auth is server-only.
- Pages async server; `Suspense`/`loading.tsx` for slow subtrees; serializable props to clients.
- TanStack only for refetch/polling/optimistic UI; server fetch first.
- Separate: no duplicated backend rules; env secrets server-only.

## Anti-patterns

`"use client"` pages with fetch · useEffect for server data · I/O in components · domain logic in UI/actions · client tokens · hooks importing grpc/auth · hand-written protos · monolithic lib · API routes instead of actions (integrated) · mixed transports in one file

## Review checklist

Topology stated · feature slice layout · minimal `"use client"` · I/O only in repos/services · gRPC single clients.ts · server bridge for TanStack · actions+Zod mutations · architecture before code

## Rules (on conflict)

[rules/architecture.md](rules/architecture.md) · [rules/folder-structure.md](rules/folder-structure.md) · [rules/coding-standards.md](rules/coding-standards.md)
