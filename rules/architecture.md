# Architecture rules

Enforce these on every generation and refactor.

## Topology-first

1. Detect mode before creating files: Integrated, Separate-REST, Separate-gRPC, or Hybrid.
2. State topology in the architecture response.
3. Never mix DB, HTTP, and gRPC access in one repository or service file.

## Dependency direction (mandatory)

| Topology | Read/write chain |
|----------|------------------|
| Integrated | UI → actions → services → repositories → database |
| Separate-REST | UI → actions → services → repositories → external HTTP API |
| Separate-gRPC | UI → actions → services → *ApiClient → backend |
| Hybrid | Per feature: one chain only |

## Layer rules

### UI (`app/`, `features/*/components/`)

- **Must:** render data, call Server Actions, compose children, pass serializable props.
- **Must not:** import `lib/db`, `lib/api/client`, `*ApiClient`, run ORM/SQL/raw backend fetch, encode domain rules.

### Actions (`features/*/actions/`)

- **Must:** server-only entry, validate input (project convention), call services, revalidate after mutations when using App Router cache.
- **Must not:** contain SQL/ORM/HTTP/RPC calls, complex domain logic, React imports.

### Services (`features/*/services/`)

- **Must:** async functions; orchestrate repositories or RPC; map DTOs to UI shapes; clear success/error results for gRPC (avoid throwing expected failures to UI).
- **Must not:** import React, use `"use client"`, be imported from `"use client"` hooks when using server-only auth (use action bridge).

### Repositories (`features/*/repositories/`)

- **Must:** sole CRUD/query/HTTP mapping for integrated and REST.
- **Must not:** business rules, React, gRPC imports (REST repos).

### Hooks (`features/*/hooks/`)

- **Must:** `"use client"` only when needed; TanStack Query/Mutation; `queryFn` → Server Action or `*.queries.ts` when auth is server-only.
- **Must not:** import `*ApiClient`, `getAuthedContext`, or services that use server-only APIs directly.

## Logic ownership

| Concern | Integrated | Separate |
|---------|------------|----------|
| Domain invariants | Next.js services | External backend only |
| Form validation | At action boundary | At action boundary |
| Auth on outbound calls | lib/auth → repos | lib/api or Bearer in gRPC services |
| Transport errors | Map in services/repos | REST: repos + ApiError; gRPC: services + getErrorMessage |

## Queries vs mutations

- **Read:** Server Component or server child → service → repository/RPC.
- **Write:** Client island (form) → Server Action → service → repository/RPC.
- Do not use Route Handlers for mutations that Server Actions can handle (integrated).

## Cross-feature

- Do not import `features/a` internals from `features/b`.
- Share via `types/` or extracted shared modules — not via feature component imports.

## Route Handlers (limited)

Acceptable only for: webhooks, OAuth callbacks, public API owned by this app, streaming uploads, BFF when Server Actions cannot carry payload (separate).

Default mutation path: Server Action → service → repository/RPC.

## Errors, loading, and not-found

- Colocate `loading.tsx` and `error.tsx` with routes that stream or fail independently.
- Use `notFound()` when entity missing after service returns null (REST 404 → null pattern).
- Map transport errors in repositories (REST) or services (gRPC unions, integrated throws).
- Show user-safe messages in UI — never raw stack traces or internal API bodies.

## Anti-patterns (auto-reject)

- Client pages fetching server-loadable data
- Secrets or bearer tokens in client-side fetch/RPC
- Duplicating backend validation rules in Next.js (separate topologies)
- `"use client"` on `app/**/page.tsx` for data loading
- Global client store mirroring server-fetched lists
