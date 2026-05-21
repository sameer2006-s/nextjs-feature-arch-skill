# Auth & environment (shared)

Load when creating or wiring `lib/auth`, `lib/env`, or outbound authenticated requests.

## `lib/env.ts` (Zod-validated, server-only)

```typescript
import { z } from "zod";

const envSchema = z.object({
  API_URL: z.string().url().optional(),
  API_TIMEOUT_MS: z.coerce.number().default(10_000),
  DATABASE_URL: z.string().url().optional(),
});

export const env = envSchema.parse(process.env);
```

Never import `env` in `"use client"` files. Use `NEXT_PUBLIC_*` only for values safe in the browser.

## `lib/auth.ts` (pattern)

```typescript
import "server-only";

export async function getAuthedContext(): Promise<{ accessToken: string }> {
  // Read session from cookies / headers — match your auth library
  const accessToken = ""; // TODO: implement
  if (!accessToken) throw new Error("Unauthorized");
  return { accessToken };
}

export async function getServerAccessToken(): Promise<string | undefined> {
  const ctx = await getAuthedContext().catch(() => null);
  return ctx?.accessToken;
}
```

- **Integrated / REST:** repositories call `getServerAccessToken()` inside `apiRequest` or pass token from service.
- **gRPC:** services attach `Authorization: Bearer ${accessToken}` per RPC in `lib/grpc/clients` callers.
- Handle 401/403 in **middleware** or layout — not per-component redirects.
