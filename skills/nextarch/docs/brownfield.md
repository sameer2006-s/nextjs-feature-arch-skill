# Brownfield (existing repos)

Load when the codebase **already** has patterns — do not impose a greenfield `features/` tree by default.

## Scan first

- `package.json` — Prisma, Drizzle, `@trpc`, GraphQL clients, Connect
- `app/` — Route Handlers, colocated `page.tsx` fetches, `"use client"` pages
- `lib/`, `server/`, `src/` — existing db, api, auth layout
- Naming — `.service.ts` vs `*-service.ts`, existing feature folders or domain modules

## Extend, do not rewrite

| Existing pattern | Action |
|------------------|--------|
| `app/api/*` + client fetch | Improve in place or thin BFF; delete route only if user agrees |
| Server fetch in `page.tsx` | OK for simple reads; extract service when logic is duplicated |
| No `features/` folder | Add `features/<name>/` for **new** domain work; migrate old code only on request |
| tRPC / GraphQL routers | See [escape-hatches.md](escape-hatches.md) |

## Layer adoption ladder

1. **No new folders** — fix boundary violation in place (e.g. move fetch out of client page).
2. **`services/`** — when the same orchestration appears in 2+ call sites.
3. **`repositories/`** — when 3+ callers hit the same DB table or HTTP resource.
4. **`actions/`** — mutations and TanStack server bridges.

Do not create empty `repositories/`, `actions/`, or `hooks/` folders.

## When to propose full migration

Only if the user asks to “refactor to feature architecture” or repeated anti-patterns span many routes. Offer incremental steps, not a single PR that moves every file.

## Naming

Match existing suffixes and import aliases (`@/lib/db`, `@/server/db`) before introducing new conventions from [folder-structure](../rules/folder-structure.md).
