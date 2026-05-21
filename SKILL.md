---
name: nextjs-feature-architecture
description: >-
  Use this skill when building or refactoring Next.js App Router apps with
  feature-based vertical slices, RSC, Server Actions, repositories, and
  services — integrated DB, REST, or Connect/gRPC. Use for feature folders,
  layer boundaries, and App Router migration. Do not use for non-Next.js,
  Pages Router-only, or styling-only UI work.
---

# Next.js Feature-Based Architecture

Act as a senior staff engineer. Enforce **server-first, feature-sliced** structure. Reject client-heavy SPA patterns unless required.

**Out of scope:** Pages Router (`pages/`), non-Next.js frameworks, CSS-only tasks.

## Before code

1. Detect topology (table below). Infer from repo once; ask once if unclear.
2. Output the [architecture skeleton](#architecture-skeleton) before any implementation.
3. Load extra material only when needed:
   - gRPC → [docs/snippets/grpc.md](docs/snippets/grpc.md)
   - REST / integrated → [docs/snippets/core.md](docs/snippets/core.md)
   - Auth / env → [docs/snippets/auth-env.md](docs/snippets/auth-env.md)
   - Topology → [docs/topology.md](docs/topology.md)
   - Performance → [docs/performance.md](docs/performance.md)
   - Refactor → [prompts/refactor-architecture.md](prompts/refactor-architecture.md)
   - Layers → [rules/architecture.md](rules/architecture.md)
   - Folders / naming → [rules/folder-structure.md](rules/folder-structure.md)
   - Style → [rules/coding-standards.md](rules/coding-standards.md) (match the repo)

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

State: `## Topology: <mode>` + one sentence on persistence, transport, and where rules live.

**gRPC:** One client registry (`lib/grpc/clients.ts`). Only services/repositories call RPC. Client hooks use server bridges when auth is server-only.

**Hybrid:** One transport per feature file. Example: [examples/hybrid-topology.md](examples/hybrid-topology.md).

## Layers

| Layer | May | Must not |
|-------|-----|----------|
| UI | Render, call actions, compose | DB/API/RPC, domain rules |
| actions | Validate input, call services, revalidate | SQL/HTTP/RPC, domain logic |
| services | Rules/orchestration, map DTOs | React, client-only modules |
| repositories | CRUD, HTTP mapping | Business rules, React |
| hooks | Client refresh via bridges | Direct RPC/DB, server auth |

Reads: `Server Component → service → repository/RPC`.  
Writes: `client island → Server Action → service → repository/RPC`.

## Structure

```
features/<name>/{components,services,schemas,types?,hooks?,utils?,repositories?,actions?}
app/  components/  lib/{db|api|grpc|auth|env}  types/  middleware.ts
```

Naming: [rules/folder-structure.md](rules/folder-structure.md).

## Server vs client

Default Server Component. Client modules only for interactivity, browser APIs, or client-only libs. Push client boundaries to leaves.

Use route-level `loading`, `error`, and `notFound` where appropriate; show user-safe errors in UI.

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

Examples: [feature-slice-example.md](examples/feature-slice-example.md) · [refactor-client-page.md](examples/refactor-client-page.md)

## Gotchas

- App Router `params` / `searchParams` may be async — follow the project’s Next.js version.
- Revalidate after mutations that change cached routes or tagged fetches.
- Never import DB, API, or gRPC clients from client components.
- Separate topologies: do not duplicate backend validation in the Next.js layer.
- Integrated: prefer Server Actions over new internal API routes for form mutations.

## Anti-patterns

- Client pages fetching server-loadable data
- `useEffect` + fetch for data the server can load first
- DB/API/RPC inside presentational components
- Domain logic in UI or thin action wrappers (integrated: move to services)
- Secrets or bearer tokens in client-side calls
- Hooks calling RPC/HTTP with server-only auth — use a server bridge
- One file mixing DB + HTTP + gRPC — split by feature (hybrid)

## Review checklist

- [ ] Topology stated
- [ ] Feature slice folder tree
- [ ] Architecture skeleton before code
- [ ] Minimal client boundaries
- [ ] I/O only in repositories or services (per topology)
- [ ] Mutations go through server actions → services
- [ ] Loading / error / not-found considered for routes

## Rules (on conflict)

[rules/architecture.md](rules/architecture.md) · [rules/folder-structure.md](rules/folder-structure.md) · [rules/coding-standards.md](rules/coding-standards.md)
