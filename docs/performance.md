# Performance

Apply when implementing features — not when loading the skill entry.

## Rendering

- Default Server Components; hydrate only interactive leaves.
- Colocate fetches in the Server Component that consumes data.
- `Suspense` + `loading.tsx` for slow subtrees.

## Data fetching

- `React.cache()` in services for per-request deduplication.
- `Promise.all` for independent reads in one server render.
- `unstable_cache` / `fetch` tags at repository or service when cross-request caching is needed.

## Client data

- Server initial load first; TanStack Query only for refetch, polling, or optimistic UI.
- Stable `queryKeys`; sensible `staleTime` (avoid `0` without reason).
- Pass server-fetched data as `initialData` when using Query for refresh.

## Bundles

- Never import `lib/db`, `lib/api`, grpc clients, or `getAuthedContext` in `"use client"` files.
- Keep client islands small; do not lift `"use client"` to layout/page.

## Mutations

- Server Actions over client POST to internal API routes (integrated).
- `revalidatePath` / `revalidateTag` after writes — avoid refetching server-owned lists on the client.
