# Architecture rules

## Topology-first

1. Detect: Integrated, Separate-REST, Separate-gRPC, or Hybrid.
2. State topology in the architecture response.
3. Never mix DB, HTTP, and gRPC in one repository or service file.

| Topology | Chain |
|----------|-------|
| Integrated | UI → actions → services → repositories → DB |
| Separate-REST | UI → actions → services → repositories → HTTP API |
| Separate-gRPC | UI → actions → services → *ApiClient → backend |
| Hybrid | One chain per feature |

## Layer rules

| Layer | Must | Must not |
|-------|------|----------|
| UI | Render, call actions, serializable props | `lib/db`, `lib/api`, `*ApiClient`, domain rules |
| actions | `"use server"`, Zod `safeParse`, call services, revalidate | SQL/HTTP/RPC, domain logic, React |
| services | Async orchestration, map DTOs, gRPC result unions | React, `"use client"` |
| repositories | CRUD / HTTP mapping | Business rules, React |
| hooks | TanStack via `*.queries.ts` bridges | `*ApiClient`, `getAuthedContext` |

**Reads:** Server Component → service → repository/RPC.  
**Writes:** client island → Server Action → service → repository/RPC.

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

## Anti-patterns (auto-reject)

- Client pages fetching server-loadable data
- Secrets in client-side fetch/RPC
- Duplicating backend validation (separate topologies)
- `"use client"` on `app/**/page.tsx` for data loading
- Global client store mirroring server lists
