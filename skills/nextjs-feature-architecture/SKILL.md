---
name: nextjs-feature-architecture
description: >-
  Use this skill whenever you are building or refactoring Next.js App Router apps
  with feature folders (features/), server-first data loading, Zod + Server Actions,
  repositories, and services — Prisma, Drizzle, REST, or Connect/gRPC. Use when
  the user mentions vertical slices, moving fetch out of useEffect, reducing
  "use client" on pages, organizing code by domain, TanStack Query with server
  bridges, hybrid local DB + external API, or Connect/protobuf — even if they do
  not name this skill. Use for client-heavy app/ pages → server-first refactors.
  Do not use for styling-only work, non-Next.js frameworks, backend-only APIs
  with no Next.js UI, or middleware-only i18n/auth with no feature structure.
---

# Next.js Feature-Based Architecture

Act as a senior staff engineer. Enforce **server-first, feature-sliced** TypeScript. Reject client-heavy SPA patterns unless required.

**Out of scope:** net-new Pages Router (`pages/`) apps, non-Next.js frameworks, CSS-only UI, middleware-only changes with no `features/` structure.

## Before code

1. Detect topology (below). Ask once if unclear.
2. Output the [architecture skeleton](#architecture-skeleton) before implementation.
3. Load on demand — do not re-read sections already in this file when opening linked docs:
   - Enforcement detail → [rules/architecture.md](rules/architecture.md)
   - Folders → [rules/folder-structure.md](rules/folder-structure.md)
   - TypeScript / Next.js → [rules/coding-standards.md](rules/coding-standards.md)
   - Ambiguous / hybrid topology → [docs/topology.md](docs/topology.md)
   - Performance → [docs/performance.md](docs/performance.md)
   - REST / integrated → [docs/snippets/core.md](docs/snippets/core.md)
   - gRPC → [docs/snippets/grpc.md](docs/snippets/grpc.md)
   - Auth / env → [docs/snippets/auth-env.md](docs/snippets/auth-env.md)

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

State: `## Topology: <mode>` + persistence, transport, where rules live.

**gRPC:** one `lib/grpc/clients.ts`; services return `ServiceResult<T>`; TanStack uses `*.queries.ts` bridges.

## Result types

| Layer | Shape |
|-------|--------|
| Server Actions | `{ ok: true, data? } \| { ok: false, error }` |
| gRPC services | `{ success: true, data } \| { success: false, error }` |

## Layers

| Layer | May | Must not |
|-------|-----|----------|
| UI | Render, call actions, compose | DB/API/RPC, domain rules |
| actions | Zod, call services, revalidate | SQL/HTTP/RPC, domain logic |
| services | Rules/orchestration, map DTOs | React, `"use client"` |
| repositories | CRUD, HTTP mapping | Business rules, React |
| hooks | TanStack via action bridges | *ApiClient, `getAuthedContext` |

## Structure

```
features/<name>/{components,services,schemas,types?,hooks?,utils?,repositories?,actions?}
app/  components/  lib/{db|api|grpc|auth,env}  types/  middleware.ts
```

## Server vs client

Default **Server Component**. `"use client"` only for hooks, browser APIs, DOM events, or client-only libs — at **leaves** only.

`loading.tsx`, `error.tsx`, `notFound()` at route level; user-safe error messages in UI.

## TypeScript & Next.js (summary)

- `strict` TypeScript; Zod + `z.infer` in `features/*/schemas/`; `safeParse` in actions.
- Server Actions: `"use server"`, `ActionResult`, `revalidatePath` after mutations.
- Forms: `useActionState` with Server Actions.
- No `lib/db` / `lib/api` / grpc clients in client files.
- `React.cache()` and `Promise.all` for server reads; TanStack only when client refresh is required.

Details: [rules/coding-standards.md](rules/coding-standards.md).

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

## Examples

**Integrated — Input:** Add comments on a post; we use Prisma.  
**Output (first):** Skeleton with Topology: Integrated, `features/comments/`, read/write flow.  
**Output (then):** Server `app/posts/[id]/page.tsx`, actions + Zod, no `useEffect` fetch on the page.

**Refactor — Input:** `app/dashboard/page.tsx` uses `"use client"` and `useEffect` fetch.  
**Output (first):** Skeleton; target server page + `get-dashboard.service.ts` + small client filter island.  
**Output (then):** No `"use client"` on the page for data loading.

**gRPC — Input:** Item detail with optional client refresh; Connect RPC `@acme/api`.  
**Output (first):** Topology: Separate-gRPC, `lib/grpc/clients.ts`, `ServiceResult`.  
**Output (then):** `item.queries.ts` bridge; hook calls query action, not `itemApiClient`.

## Gotchas

- `params` / `searchParams` are `Promise<>` in Next.js 15+ — await before use.
- Revalidate after mutations that affect cached routes or tagged fetches.
- Separate topologies: do not duplicate backend validation in Next.js services.
- Integrated: Server Actions over new internal API routes for form mutations.

## Anti-patterns

- `"use client"` on data-only pages
- `useEffect` + `fetch` for server-loadable data
- DB/API/RPC in components
- Domain logic in UI or actions (integrated → services)
- Client-side bearer tokens for external APIs
- Hooks importing `*ApiClient` or `getAuthedContext`
- One file mixing DB + HTTP + gRPC (hybrid)

## Review checklist

- [ ] Topology stated
- [ ] Feature folder tree
- [ ] Architecture skeleton before code
- [ ] Minimal `"use client"` (leaves only)
- [ ] Zod at action boundaries; `ActionResult` / `ServiceResult` where applicable
- [ ] I/O in repositories or services only
- [ ] `loading` / `error` / `notFound` for routes

## Rules (on conflict)

[rules/architecture.md](rules/architecture.md) · [rules/folder-structure.md](rules/folder-structure.md) · [rules/coding-standards.md](rules/coding-standards.md)
