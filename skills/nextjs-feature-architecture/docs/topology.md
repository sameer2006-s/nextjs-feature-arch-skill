# Topology (extended)

Use when SKILL.md detection is ambiguous or you are splitting a **hybrid** app.

## Decision guide

| If you see… | Choose |
|-------------|--------|
| Prisma/Drizzle + `lib/db` | Integrated for that feature |
| `API_URL`, OpenAPI client, no ORM | Separate-REST for that feature |
| `@connectrpc/connect`, `*_pb`, `grpc/clients` | Separate-gRPC for that feature |
| Orders in Postgres + payments via REST API | Hybrid — two features, two transports |

## Integrated

- `lib/db.ts` + feature `repositories/`
- Domain invariants in `services/`
- Mutations: Server Action → service → repository

## Separate-REST

- `lib/env.ts` + `lib/api/client.ts`
- Repositories map HTTP; services orchestrate only
- No secrets in `"use client"` files

## Separate-gRPC

- `lib/grpc/clients.ts` — one transport, generated proto types
- Services return `ServiceResult<T>`
- TanStack hooks use `*.queries.ts` when auth is server-only

## Hybrid examples

- `features/orders/` → Prisma repository only
- `features/payments/` → `apiRequest` repository only
- Never import `db` and `apiRequest` in the same repository file
