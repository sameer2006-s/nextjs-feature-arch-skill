# Example: Comments feature

## Request

> Add comments: list on a post, submit new comment.

## Architecture (integrated)

```markdown
## Topology: Integrated
PostgreSQL via Prisma in this repo; domain rules in Next.js services.

## Architecture
features/comments/{components,services,repositories,schemas,actions}
app/posts/[id]/page.tsx

## Data flow
- Read: page → list-comments.service → comment.repository
- Write: CommentForm → create-comment.action → create-comment.service → repository
```

## Key implementation

```typescript
// app/posts/[id]/page.tsx — Server Component
import { listComments } from "@/features/comments/services/list-comments.service";
import { CommentList } from "@/features/comments/components/comment-list";
import { CommentForm } from "@/features/comments/components/comment-form";

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const comments = await listComments(id);
  return (
    <>
      <CommentList comments={comments} />
      <CommentForm postId={id} />
    </>
  );
}
```

## Rejected pattern

```typescript
"use client";
export default function PostPage() {
  const [comments, setComments] = useState([]);
  useEffect(() => { fetch("/api/comments").then(/* ... */); }, []);
}
```

Full page hydration, no slice, no Zod/action boundary.

## REST variant

Same UI. Repositories use `lib/api/client`; backend owns validation. See [docs/snippets/core.md](../docs/snippets/core.md).

## gRPC variant

Server read via `getItem` service → `itemApiClient`. Client refresh via `getItemQuery` action bridge — see [docs/snippets/grpc.md](../docs/snippets/grpc.md).
