# Performance (apps built with this skill)

Apply when implementing features — not when loading this skill package.

## Rendering

- Default Server Components; hydrate only interactive leaves.
- Colocate fetches in the Server Component that consumes data.
- Use `Suspense` + `loading.tsx` to stream slow subtrees without blocking the page shell.

## Data fetching

- `React.cache()` in services for per-request deduplication of the same read.
- `Promise.all([...])` for independent reads in one server render.
- `unstable_cache` / `fetch` tags at repository or service boundary when cross-request caching is needed.

## Client data

- Prefer server initial load; add TanStack Query only for refetch, polling, or optimistic updates.
- Stable `queryKeys`; sensible `staleTime` (avoid `0` without reason).
- Pass server-fetched data as `initialData` when using Query for refresh.

## Bundles

- Never import server-only modules (`lib/db`, `lib/api`, grpc clients, `getAuthedContext`) into `"use client"` files.
- Split client islands small; avoid lifting `"use client"` to layout/page.

## Mutations

- Server Actions over client POST to internal API routes (integrated).
- `revalidatePath` / `revalidateTag` after successful writes — avoid full client refetch of server-owned lists.
