# Coding standards

Match the **project’s existing** language, validation library, and naming. This skill defines **layers and boundaries**, not a mandatory TypeScript style.

## Validation

- Validate user input at **Server Action** (or mutation) boundaries.
- Common in Next.js: Zod in `features/<name>/schemas/` — use another library if the repo already does.
- Pass validated data to services; avoid duplicating checks in UI.

## Server Actions / mutations

- Mark server-only entry points (`"use server"` in TS/JS).
- Call **services** only — no direct DB, HTTP, or RPC in the action file.
- Return clear success/error shapes the UI can handle (match existing patterns in the repo).
- Revalidate routes or cache tags after successful writes when using App Router caching.

## Services

- No React or client-only imports.
- Async orchestration: repositories (integrated/REST) or RPC clients (gRPC).
- **Integrated:** domain rules live here.
- **Separate:** orchestrate and map DTOs — do not reimplement backend business rules.

## gRPC (Separate-gRPC)

- Auth and tokens on the server (e.g. `getAuthedContext()`).
- Prefer explicit success/error results over throwing into UI for expected failures.
- Use generated protobuf types — no hand-written proto copies.

## Server vs client components

- Default **Server Component** for pages, layouts, and read-mostly UI.
- **Client** only for interactivity, browser APIs, or client-only libraries.
- Pass serializable props to client children.
- Use `loading.tsx`, `error.tsx`, and `notFound()` where routes need them.

## Client data fetching (optional)

- Prefer server initial load + small client islands.
- If using TanStack Query (or similar), keep auth and RPC/HTTP on the server via action bridges when required.
- Align query keys and hooks with existing project conventions.

## Environment & secrets

- Centralize env validation if the project already does (`lib/env.ts` or equivalent).
- Never expose secrets in client bundles or client-side fetch/RPC.

## Errors

- **Integrated:** map persistence errors in services; user-safe messages at the UI boundary.
- **REST:** handle HTTP status in repositories; 404 → null when appropriate.
- **gRPC:** map RPC errors to messages the UI can display.

## Performance

- Deduplicate per-request reads when the stack supports it (`React.cache`, etc.).
- Parallelize independent reads where it helps.
- Colocate fetches in the component that consumes the data.
- Keep client bundles small — avoid importing server-only modules into client graphs.
