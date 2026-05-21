# Escape hatches (alternate stacks)

When the repo **already** chose a primary data layer, keep **topology + server/client boundaries**; flex **folder ceremony**.

| Stack | Still apply | Do not force |
|-------|-------------|--------------|
| **tRPC** | Minimal `"use client"`; server routers for secrets; typed boundaries | `lib/api/client`, feature `repositories/` wrapping REST |
| **GraphQL** (Apollo, urql, RSC) | Colocate queries; no tokens in client components | Prisma repositories per GraphQL field |
| **Colocated server fetch** in `page.tsx` | Fine for one-off read-only pages | Extra service + repository with no reuse |
| **Route Handlers** as public API | Keep webhooks, external consumers, streaming | Replacing with Server Actions unless internal forms (integrated) |

## tRPC

- Extend `server/routers` or existing `app/api/trpc` setup.
- Client components use generated hooks — not raw `fetch` to internal REST.
- Defer this skill’s repository/service template unless migrating **off** tRPC.

## GraphQL

- Prefer colocated queries or established `graphql/` folder.
- Server Components may call server-side GQL client; do not add Prisma repo layer only for the UI.

## Defer this skill

If the task is **only** “add a tRPC procedure” or “add a GraphQL field” with no App Router structure change, follow that stack’s docs instead of imposing `features/*/repositories/`.

For mixed apps (tRPC + a few Server Actions), state **Hybrid** mentally: one transport per feature file.
