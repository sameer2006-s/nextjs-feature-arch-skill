# Folder structure

```
app/
features/<name>/
  components/
  services/
  schemas/
  types/          # optional
  hooks/          # optional
  utils/          # optional, pure only
  repositories/   # when feature has I/O
  actions/        # mutations + query bridges
components/
lib/
  db.ts           # Integrated
  api/            # Separate-REST
  grpc/clients.ts # Separate-gRPC
  auth.ts
  env.ts
types/
middleware.ts
```

## Path rules

| Path | Rule |
|------|------|
| `app/` | Thin routes — no business logic, no direct DB/API/RPC |
| `features/<name>/` | One domain per folder |
| `features/<name>/components/` | Server Component by default |
| `features/<name>/services/` | `<verb>-<entity>.service.ts` |
| `features/<name>/schemas/` | Zod schemas + `z.infer` types |
| `features/<name>/repositories/` | Data access (integrated + REST) |
| `features/<name>/actions/` | Server Actions + `*.queries.ts` |
| `lib/` | Cross-cutting only — no feature logic |

## Naming

| Artifact | Pattern | Example |
|----------|---------|---------|
| Service | `<verb>-<entity>.service.ts` | `list-comments.service.ts` |
| Action | `<verb>-<entity>.action.ts` | `create-comment.action.ts` |
| Repository | `<entity>.repository.ts` | `comment.repository.ts` |
| Schema | `<entity>.schema.ts` | `comment.schema.ts` |
| Query bridge | `<entity>.queries.ts` | `item.queries.ts` |
| Hook | `use-<entity>-query.ts` | `use-item-query.ts` |

Add `repositories/`, `actions/`, `hooks/` only when needed — no empty placeholders.

## Imports

- No cross-feature imports of `components/`, `services/`, or `repositories/`.
- UI must not import `lib/db`, `lib/api/client`, or grpc clients.
- Only services/repositories may import `*ApiClient`.
