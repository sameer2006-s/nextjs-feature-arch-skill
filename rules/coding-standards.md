# Coding standards

## TypeScript

- Enable `strict` in `tsconfig.json`.
- Prohibit `any` unless documented with reason.
- Prefer `type` for unions/aliases; `interface` for extensible object shapes.
- Use discriminated unions for action and service results.

## Zod

- Define schemas in `features/<name>/schemas/<entity>.schema.ts`.
- Export `z.infer<typeof schema>` as the input/output type name.
- Validate at Server Action boundaries with `safeParse`.
- Pass validated data to services — do not re-parse in services unless transforming external DTOs.

## Server Actions

```typescript
"use server";

type ActionResult =
  | { ok: true; data: T }
  | { ok: false; error: string };
```

- Parse `FormData` or arguments with Zod.
- Call services only.
- Return `ActionResult` — do not throw for expected validation failures.
- Call `revalidatePath` / `revalidateTag` after successful mutations.

## Services

- No React imports.
- No `"use client"`.
- Async functions only.
- Integrated: enforce domain rules here.
- Separate: orchestrate only — do not duplicate backend rules.

## gRPC services (Separate-gRPC)

```typescript
export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };
```

- Attach `Authorization: Bearer ${accessToken}` from `getAuthedContext()`.
- Use `getErrorMessage(error, fallback)` in catch blocks.
- Request params: `Omit<ProtoRequest, "$typeName">`.

## Server Components

- Default for `page.tsx`, `layout.tsx`, and list/display components.
- Use `async` when awaiting services.
- Use `Suspense` + `loading.tsx` for streaming slow subtrees.
- Pass only serializable props to client children.

## Client Components

- File must start with `"use client"`.
- Keep as small as possible — forms, buttons, filters, live refresh islands.
- Use `useActionState` for forms calling Server Actions.
- Use TanStack Query only when server-first initial load + client refresh is required.

## TanStack Query (when used)

- Define `queryKeys` factory in the hook file.
- `queryFn` must call a Server Action or `"use server"` queries module when the underlying service uses server auth.
- Do not set `staleTime: 0` by default without reason.
- Prefer passing server-fetched initial data from parent Server Component.

## Environment

- Validate with Zod in `lib/env.ts`.
- Never read secret env vars in `"use client"` files.
- `NEXT_PUBLIC_*` only for values safe in the browser.

## Error handling

- Integrated: map ORM errors in services; user-safe messages in actions.
- REST: `ApiError` in `lib/api/client`; 404 → null where appropriate in repositories.
- gRPC: never throw to UI — return `{ success: false, error }`.

## Performance

- Use `React.cache()` in services for per-request deduplication.
- Parallelize independent reads with `Promise.all`.
- Colocate fetches in the Server Component that consumes the data.
- Minimize client bundle: avoid pulling server-only deps into client graphs.
