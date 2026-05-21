# gRPC / Connect snippets

Load only for **Separate-gRPC** work.

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

One shared transport per app. Never create transports in feature folders.

## Service

```typescript
export async function getItem(params: {
  request: Omit<GetItemRequest, "$typeName">;
}): Promise<ServiceResult<Item>> {
  try {
    const { accessToken } = await getAuthedContext();
    const data = await itemApiClient.getItem(params.request, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return { success: true as const, data };
  } catch (error) {
    return { success: false as const, error: getErrorMessage(error, "Failed") };
  }
}
```

## TanStack bridge

```typescript
// features/items/actions/item.queries.ts
"use server";

export async function getItemQuery(params: { request: Omit<GetItemRequest, "$typeName"> }) {
  return getItem(params);
}
```

```typescript
// features/items/hooks/use-item-query.ts
"use client";

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

Hooks call `getItemQuery` — not `itemApiClient` or `getAuthedContext`.
