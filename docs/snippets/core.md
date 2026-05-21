# Integrated & REST snippets

Load for **Integrated** or **Separate-REST** work. Adapt types and validation to the repo’s stack.

## REST: `lib/api/client.ts`

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

## Repository (integrated)

```typescript
// features/posts/repositories/post.repository.ts
import { db } from "@/lib/db";
import type { CreatePostInput } from "../schemas/post.schema";

export const postRepository = {
  findById: (id: string) => db.post.findUnique({ where: { id } }),
  create: (data: CreatePostInput) => db.post.create({ data }),
};
```

## Repository (integrated — Drizzle)

```typescript
// features/posts/repositories/post.repository.ts
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { CreatePostInput } from "../schemas/post.schema";

export const postRepository = {
  async findById(id: string) {
    const [row] = await db.select().from(posts).where(eq(posts.id, id));
    return row ?? null;
  },
  async create(data: CreatePostInput) {
    const [row] = await db.insert(posts).values(data).returning();
    return row;
  },
};
```

## Repository (REST)

```typescript
import { apiRequest, ApiError } from "@/lib/api/client";
import { postSchema } from "../schemas/post.schema";

export const postRepository = {
  async findById(id: string) {
    try {
      return postSchema.parse(await apiRequest<unknown>(`/posts/${id}`));
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) return null;
      throw e;
    }
  },
};
```

## Service (integrated — domain rules)

```typescript
export async function createPost(input: CreatePostInput) {
  if (await postRepository.findBySlug(input.slug)) throw new Error("Slug exists");
  return postRepository.create(input);
}
```

## Service (REST — thin)

```typescript
export async function createPost(input: CreatePostInput) {
  return postRepository.create(input);
}
```

## Server Action

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { createPostSchema } from "../schemas/post.schema";
import { createPost } from "../services/create-post.service";

export async function createPostAction(_prev: unknown, formData: FormData) {
  const parsed = createPostSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    body: formData.get("body"),
  });
  if (!parsed.success) return { ok: false, error: "Invalid input" };
  try {
    const post = await createPost(parsed.data);
    revalidatePath("/posts");
    return { ok: true, id: post.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}
```

## Server page + client form

```typescript
// app/posts/page.tsx — Server Component
import { listPosts } from "@/features/posts/services/list-posts.service";
import { PostList } from "@/features/posts/components/post-list";
import { CreatePostForm } from "@/features/posts/components/create-post-form";

export default async function PostsPage() {
  const posts = await listPosts();
  return (
    <>
      <PostList posts={posts} />
      <CreatePostForm />
    </>
  );
}
```

```typescript
// create-post-form.tsx — client island
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

## Streaming

```typescript
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <SlowPanel />
    </Suspense>
  );
}

// SlowPanel.tsx — async Server Component; fetches via service inside
```
