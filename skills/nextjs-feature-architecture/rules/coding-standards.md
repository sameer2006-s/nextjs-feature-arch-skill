# TypeScript & Next.js practices

## TypeScript

- `strict: true` in `tsconfig.json`.
- Avoid `any` unless documented.
- `type` for unions; `interface` for extensible objects.
- Discriminated unions for action and service results.

## Zod

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

- Parse `FormData` with Zod; call services only.
- Return `ActionResult` for expected failures (do not throw).
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
- Use `getErrorMessage` in catch blocks.

## Server & client components

- Default Server Component for `page.tsx`, layouts, lists.
- `async` pages when awaiting services.
- `Suspense` + `loading.tsx` for slow subtrees.
- Client: `"use client"` at file top; `useActionState` for Server Action forms.
- TanStack Query only when server initial load + client refresh is required.

## TanStack Query

- `queryKeys` factory with `as const` in hook file.
- `queryFn` → Server Action / `*.queries.ts` when auth is server-only.
- Sensible `staleTime`; pass server data as `initialData` when possible.

## Environment

- Zod in `lib/env.ts`; never import `env` in client files.
- `NEXT_PUBLIC_*` only for browser-safe values.

## Errors

- **Integrated:** map ORM errors in services.
- **REST:** `ApiError`; 404 → null in repositories.
- **gRPC:** return `{ success: false, error }` — do not throw to UI.
