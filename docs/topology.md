# Topology (extended)

Load only when detection is ambiguous or documenting hybrid splits.

## Signals

| Signal | Mode |
|--------|------|
| `lib/db`, Prisma/Drizzle, ORM | Integrated |
| `API_URL`, OpenAPI, external fetch, no ORM | Separate-REST |
| `@connectrpc/connect`, `grpc/clients`, `*_pb` | Separate-gRPC |
| Both local DB and remote APIs | Hybrid (per feature) |

## Integrated

- `lib/db.ts` + feature `repositories/`
- Domain invariants in `services/`
- Mutations: Server Action → service → repository

## Separate-REST

- `lib/env.ts` + `lib/api/client.ts`
- Repositories map HTTP; services orchestrate only
- No secrets in `"use client"` files

## Separate-gRPC

- `lib/grpc/clients.ts` — one transport, typed clients from `@your-org/proto`
- Services return `{ success, data } | { success, error }`
- TanStack hooks call `*.queries.ts` Server Actions when auth is server-only
- `API_URL` for server; `NEXT_PUBLIC_API_URL` only when the browser must reach the gateway without secrets

## Hybrid

- Pick one transport per feature
- Never mix DB + HTTP + gRPC in one repository/service file
