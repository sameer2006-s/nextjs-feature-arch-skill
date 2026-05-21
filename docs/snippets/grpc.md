# gRPC / Connect snippets

Load only for **Separate-gRPC** work. Replace `YourApi`, `Item`, and `@your-org/proto` with the project's generated package.

## `lib/grpc/clients.ts`

```typescript
import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { ItemApi } from "@your-org/proto/gen/ts/api/v1/item_pb";

const transport = createConnectTransport({
  baseUrl: process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "",
  jsonOptions: { useProtoFieldName: true, ignoreUnknownFields: true },
});

export const itemApiClient = createClient(ItemApi, transport);
```

One shared transport per app. Export one client per proto service. Do not create transports in feature folders.

## Feature service

```typescript
// features/items/services/get-item.service.ts
import { itemApiClient } from "@/lib/grpc/clients";
import { getAuthedContext, getErrorMessage } from "@/lib/utils";
import type { GetItemRequest, Item } from "@your-org/proto/gen/ts/api/v1/item_pb";

export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function getItem(params: {
  request: Omit<GetItemRequest, "$typeName">;
}): Promise<ServiceResult<Item>> {
  try {
    const { accessToken } = await getAuthedContext();
    const data = await itemApiClient.getItem(params.request, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Failed to load item") };
  }
}
```

## Server Action bridge (TanStack)

```typescript
// features/items/actions/item.queries.ts
"use server";

import { getItem } from "../services/get-item.service";
import type { GetItemRequest } from "@your-org/proto/gen/ts/api/v1/item_pb";

export async function getItemQuery(params: {
  request: Omit<GetItemRequest, "$typeName">;
}) {
  return getItem(params);
}
```

## Query hook

```typescript
// features/items/hooks/use-item-query.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getItemQuery } from "../actions/item.queries";

export const itemQueryKeys = {
  all: ["items"] as const,
  detail: (id: string) => [...itemQueryKeys.all, id] as const,
};

export function useItemQuery(id: string) {
  return useQuery({
    queryKey: itemQueryKeys.detail(id),
    queryFn: () => getItemQuery({ request: { id } }),
    staleTime: 10_000,
  });
}
```

Do not import the service directly in the hook when it uses `getAuthedContext`.

## Server page (initial load)

```typescript
// app/items/[id]/page.tsx
import { getItem } from "@/features/items/services/get-item.service";
import { ItemView } from "@/features/items/components/item-view";

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getItem({ request: { id } });
  if (!result.success) return <p role="alert">{result.error}</p>;
  return <ItemView data={result.data} />;
}
```
