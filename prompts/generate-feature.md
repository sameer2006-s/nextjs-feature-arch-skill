# Prompt: Generate a new feature

Copy and adapt this prompt when starting a new vertical slice.

---

Using the **nextjs-feature-architecture** skill, add a **`<feature-name>`** feature.

**Requirements:**
- `<bullet: user-facing capability 1>`
- `<bullet: user-facing capability 2>`

**Context (fill one):**
- **Integrated:** We use `<Prisma|Drizzle>`; database is in this repo.
- **Separate-REST:** Backend at `API_URL`; no ORM in this repo.
- **Separate-gRPC:** Connect RPC; proto package `<@your-org/api>`; clients in `lib/grpc/clients.ts`.
- **Hybrid:** `<which features are local vs remote>`

**Constraints:**
- Follow [rules/](../rules/); match existing validation and typing in the repo.
- Deliver the full architecture response skeleton **before** writing code.
- Default to Server Components; `"use client"` only for interactive islands.
- Mutations via Server Actions; validate in `features/<feature-name>/schemas/` when the project uses schemas.

---

## Required response skeleton (agent must output first)

```markdown
## Topology
Integrated | Separate-REST | Separate-gRPC | Hybrid
[One sentence: persistence, transport, where domain rules live]

## Architecture
features/<feature-name>/
  components/
  services/
  schemas/
  [repositories/ | actions/ | hooks/ as needed]
app/<route>/page.tsx

## Layer responsibilities
- UI: ...
- actions: ...
- services: ...
- repositories / grpc: ...

## Rendering strategy
- Server: ...
- Suspense/streaming: ...
- Client islands: ...

## Data flow
- Read: ...
- Write: ...

## Server vs client
| File | Server | Client | Reason |
|------|--------|--------|--------|

## Performance
- Hydration scope: ...
- Caching / parallel fetch: ...
```

Then implement files. Use naming from [rules/folder-structure.md](../rules/folder-structure.md).
