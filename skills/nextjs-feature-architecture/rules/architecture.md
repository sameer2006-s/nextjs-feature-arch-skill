# Architecture rules

See [SKILL.md](../SKILL.md) for topology table, layer summary, and checklist. This file adds enforcement detail only.

## Topology-first

1. Detect: Integrated, Separate-REST, Separate-gRPC, or Hybrid (state in response).
2. Never mix DB, HTTP, and gRPC in one repository or service file.
3. Hybrid: one transport chain per feature — see [docs/topology.md](../docs/topology.md).

## Logic ownership

| Concern | Integrated | Separate |
|---------|------------|----------|
| Domain invariants | Next.js services | External backend only |
| Form validation | Zod in actions | Zod in actions |
| Auth on outbound calls | `lib/auth` → repos | Bearer in API/gRPC services |

## Route Handlers (limited)

Webhooks, OAuth, public API, streaming, BFF when Server Actions cannot carry payload. Default mutations: Server Action → service → repository/RPC.

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
- Global client store mirroring server lists
- Hooks importing `*ApiClient` or `getAuthedContext` (use `*.queries.ts`)
