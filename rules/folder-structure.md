# Folder structure rules

## Project layout

```
app/
features/<feature-name>/
  components/
  services/
  schemas/
  types/
  hooks/          # optional, minimal
  utils/          # optional, pure only
  repositories/   # add when feature has data access
  actions/        # add when feature has mutations or query bridges
components/
lib/
  db.ts                 # Integrated only
  api/                  # Separate-REST
  grpc/clients.ts       # Separate-gRPC (or grpc/clients.ts at root)
types/
middleware.ts
```

## Path responsibilities

| Path | Rule |
|------|------|
| `app/` | Thin routes only — no business logic, no direct DB/API/RPC |
| `features/<name>/` | One domain per folder; all feature code colocated |
| `features/<name>/components/` | Feature UI; Server Component by default |
| `features/<name>/services/` | One use-case per file: `<verb>-<entity>.service.ts` |
| `features/<name>/schemas/` | Input validation (e.g. Zod) when the project uses it |
| `features/<name>/repositories/` | Data access only (integrated + REST) |
| `features/<name>/actions/` | Server Actions + optional `*.queries.ts` bridges |
| `features/<name>/hooks/` | Client hooks only; TanStack when needed |
| `components/` | Shared design-system — no feature imports inward |
| `lib/` | Cross-cutting: auth, env, db/api/grpc — **no feature logic** |

## `lib/` by topology

| File / dir | Integrated | Separate-REST | Separate-gRPC |
|------------|------------|---------------|---------------|
| `lib/db.ts` | Required | Omit | Omit |
| `lib/api/` | Omit | Required | Omit |
| `lib/grpc/clients.ts` | Omit | Omit | Required |
| `lib/auth.ts`, `lib/env.ts` | Required | Required | Required |
| `lib/utils.ts` (`getErrorMessage`) | Optional | Optional | Required for RPC |

## Naming conventions

| Artifact | Pattern | Example |
|----------|---------|---------|
| Repository | `<entity>.repository.ts` | `comment.repository.ts` |
| Service | `<verb>-<entity>.service.ts` | `list-comments.service.ts` |
| Action | `<verb>-<entity>.action.ts` | `create-comment.action.ts` |
| Query bridge | `<entity>.queries.ts` | `dashboard.queries.ts` |
| Schema | `<entity>.schema.ts` | `comment.schema.ts` |
| Query hook | `use-<entity>-query.ts` | `use-dashboard-query.ts` |
| Query keys | `<feature>QueryKeys` | `dashboardQueryKeys` |
| Server UI | PascalCase | `CommentList.tsx` |
| Client UI | PascalCase; `Client` suffix only if paired | `CommentForm.tsx` |

## When to add folders

| Folder | Add when |
|--------|----------|
| `repositories/` | Feature performs DB or REST I/O |
| `actions/` | Feature has mutations or TanStack server bridges |
| `hooks/` | Client needs refetch, polling, or optimistic UI |
| `types/` | Domain types not covered by schemas |

Do not create empty placeholder folders.

## gRPC client registry

- One `lib/grpc/clients.ts` (or `grpc/clients.ts`) per app.
- One shared transport; export one `createClient` per proto service.
- Group exports by domain in comments.
- Never create transports inside feature folders.

## Import rules

- Features must not import another feature's `components/`, `services/`, or `repositories/` directly.
- UI must not import from `lib/db`, `lib/api/client`, or `@/lib/grpc/clients`.
- Only `services/` or `repositories/` may import `*ApiClient`.
