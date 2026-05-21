# Example: Hybrid topology

## Request

> Orders are in PostgreSQL (Prisma). Payments call external REST API.

## Architecture

```markdown
## Topology: Hybrid
Orders: Integrated (Prisma). Payments: Separate-REST (API_URL). One transport per feature.

## Architecture
features/orders/     → repositories → lib/db
features/payments/   → repositories → lib/api/client
lib/db.ts, lib/api/, lib/auth.ts, lib/env.ts
```

## Rules

- `features/orders/repositories/order.repository.ts` — **only** Prisma
- `features/payments/repositories/payment.repository.ts` — **only** `apiRequest`
- Never import `db` and `apiRequest` in the same repository file
- Shared auth via `lib/auth.ts` — see [docs/snippets/auth-env.md](../docs/snippets/auth-env.md)
