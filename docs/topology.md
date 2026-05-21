# Topology

Load when detection is ambiguous or documenting hybrid splits.

| Signal | Mode |
|--------|------|
| `lib/db`, Prisma/Drizzle | Integrated |
| `API_URL`, no ORM | Separate-REST |
| `@connectrpc/connect`, `*_pb` | Separate-gRPC |
| Mixed | Hybrid (one transport per feature) |

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

## Hybrid

- One transport per feature (e.g. orders → Prisma, payments → REST)
- Never mix DB + HTTP + gRPC in one repository or service file
