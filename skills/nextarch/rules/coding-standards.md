# TypeScript & Next.js practices

## Match the repo first

Before applying defaults below, check the codebase for:

- **Validation** — Zod, Valibot, ArkType, or manual checks at boundaries
- **Results** — existing `ActionResult`, `Result`, throws, or error codes
- **Client refresh** — TanStack Query, SWR, Relay, or none

Use project conventions when present. Defaults below apply when the repo is silent.

## TypeScript

- `strict: true` in `tsconfig.json`.
- Avoid `any` unless documented.
- `type` for unions; `interface` for extensible objects.
- Discriminated unions for action and service results (when using result objects).

## Zod (default validation)

- Schemas in `features/<name>/schemas/<entity>.schema.ts`.
- Export `z.infer<typeof schema>` for input types.
- `safeParse` at Server Action boundaries; pass validated data to services.

## Server Actions

```typescript
"use server";

type ActionResult<T = void> =
  | { ok: true; data?: T }
  | { ok: false; error: string };
```

- Parse `FormData` with Zod (or repo validator); call services only.
- Return `ActionResult` for expected failures (do not throw) unless repo throws by convention.
- `revalidatePath` / `revalidateTag` after successful mutations.

## Services

- No React imports; no `"use client"`.
- **Integrated:** domain rules here.
- **Separate:** orchestrate only — do not duplicate backend rules.

## gRPC services

```typescript
export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };
```

- `Authorization: Bearer ${accessToken}` from `getAuthedContext()`.
- Request params: `Omit<ProtoRequest, "$typeName">`.

## Server & client components

- Default Server Component for `page.tsx`, layouts, lists.
- `Suspense` + `loading.tsx` for slow subtrees.
- Client: `useActionState` for Server Action forms when applicable.

## TanStack Query (when used)

- `queryKeys` with `as const`; `queryFn` → Server Action / `*.queries.ts` when auth is server-only.

## Environment

- Zod in `lib/env.ts` when project uses it; never import `env` in client files.
