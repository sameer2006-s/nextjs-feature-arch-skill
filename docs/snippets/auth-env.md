# Auth & environment

Load when wiring `lib/auth`, `lib/env`, or authenticated outbound calls.

## `lib/env.ts`

```typescript
import { z } from "zod";

const envSchema = z.object({
  API_URL: z.string().url().optional(),
  API_TIMEOUT_MS: z.coerce.number().default(10_000),
  DATABASE_URL: z.string().url().optional(),
});

export const env = envSchema.parse(process.env);
```

Never import `env` in `"use client"` files.

## `lib/auth.ts`

```typescript
import "server-only";

export async function getAuthedContext(): Promise<{ accessToken: string }> {
  const accessToken = ""; // session / cookies — match your auth library
  if (!accessToken) throw new Error("Unauthorized");
  return { accessToken };
}

export async function getServerAccessToken(): Promise<string | undefined> {
  const ctx = await getAuthedContext().catch(() => null);
  return ctx?.accessToken;
}
```

- **REST:** `getServerAccessToken()` inside `apiRequest`.
- **gRPC:** Bearer header per RPC in services.
- Handle 401/403 in middleware or layout — not per-component redirects.
