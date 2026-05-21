# Architecture rules

See [SKILL.md](../SKILL.md) for topology, layers, task scope, and checklist. This file adds enforcement detail only.

## Brownfield

- Read [docs/brownfield.md](../docs/brownfield.md) before restructuring.
- No big-bang `features/` rewrite unless the user requests migration.
- Alternate stacks: [docs/escape-hatches.md](../docs/escape-hatches.md).

## Topology-first

1. State topology in the response when data boundaries are involved.
2. Never mix DB, HTTP, and gRPC in one repository or service file.
3. Hybrid: one transport chain per feature — [docs/topology.md](../docs/topology.md).

## When layers are optional

| Situation | Layers |
|-----------|--------|
| Single read in one `page.tsx`, no reuse | Colocated server fetch OK; service optional |
| Same DB/API access in 3+ places | Add `repository/` (and `service/` if rules apply) |
| Mutation or TanStack + server auth | `actions/` (+ `*.queries.ts` for gRPC) |

## Logic ownership

| Concern | Integrated | Separate |
|---------|------------|----------|
| Domain invariants | Next.js services | External backend only |
| Form validation | At action boundary (Zod default) | At action boundary |
| Auth on outbound calls | `lib/auth` → repos | Bearer in API/gRPC services |

## Route Handlers (limited)

Webhooks, OAuth, public API, streaming, BFF when Server Actions cannot carry payload. Default internal mutations: Server Action → service → repository/RPC.

## Errors, loading, not-found

- Colocate `loading.tsx` and `error.tsx` with streaming routes.
- `notFound()` when service returns null (REST 404 → null).
- User-safe messages in UI — never raw stacks or API bodies.

## Cross-feature

- Do not import `features/a` internals from `features/b`.
- Share via `types/` or shared modules — not via feature component imports.

## Anti-patterns (auto-reject)

- Client pages fetching server-loadable data
- Secrets in client-side fetch/RPC
- Duplicating backend validation (separate topologies)
- `"use client"` on `app/**/page.tsx` for data loading
- Full architecture skeleton on Patch-scope tasks
- Hooks importing `*ApiClient` or `getAuthedContext` (use `*.queries.ts`)
