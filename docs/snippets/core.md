# Integrated & REST snippets

Load for **Integrated** or **Separate-REST** work.

## `lib/api/client.ts`

```typescript
import { env } from "@/lib/env";
import { getServerAccessToken } from "@/lib/auth";

export class ApiError extends Error {
  constructor(public status: number, message: string, public body?: unknown) {
    super(message);
  }
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getServerAccessToken();
  const res = await fetch(`${env.API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
    signal: AbortSignal.timeout(env.API_TIMEOUT_MS),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => undefined);
    throw new ApiError(res.status, res.statusText, body);
  }
  return res.json() as Promise<T>;
}
```

## Repository (integrated — Prisma)

```typescript
export const postRepository = {
  findById: (id: string) => db.post.findUnique({ where: { id } }),
  create: (data: CreatePostInput) => db.post.create({ data }),
};
```

## Repository (REST — 404 → null)

```typescript
async findById(id: string) {
  try {
    return postSchema.parse(await apiRequest<unknown>(`/posts/${id}`));
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}
```

## Server Action + `useActionState`

```typescript
export async function createPostAction(_prev: ActionResult | null, formData: FormData) {
  const parsed = createPostSchema.safeParse({ title: formData.get("title") });
  if (!parsed.success) return { ok: false as const, error: "Invalid input" };
  try {
    const post = await createPost(parsed.data);
    revalidatePath("/posts");
    return { ok: true as const, data: { id: post.id } };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "Failed" };
  }
}
```

```typescript
"use client";
import { useActionState } from "react";
import { createPostAction } from "../actions/create-post.action";

export function CreatePostForm() {
  const [state, action, pending] = useActionState(createPostAction, null);
  return (
    <form action={action}>
      {state?.ok === false && <p role="alert">{state.error}</p>}
      <button type="submit" disabled={pending}>Create</button>
    </form>
  );
}
```
