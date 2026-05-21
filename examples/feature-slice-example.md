# Example: Comments feature (full slice)

## Request

> Add comments: list on a post, submit new comment. Prisma in repo.

## Architecture (integrated)

```markdown
## Topology: Integrated
PostgreSQL via Prisma; domain rules in Next.js services.

## Architecture
features/comments/
  schemas/comment.schema.ts      # validation — match project library
  repositories/comment.repository.ts
  services/list-comments.service.ts
  services/create-comment.service.ts
  actions/create-comment.action.ts
  components/comment-list.tsx
  components/comment-form.tsx
app/posts/[id]/page.tsx
```

## Flow (no prescribed TS types)

1. **Page (server):** `listComments(postId)` → render list + form.
2. **Action:** validate body/postId → `createComment` service → revalidate post route.
3. **Service:** rules + call repository.
4. **Repository:** Prisma only.

## Rejected pattern

Client page with `useEffect` fetching `/api/comments` for data the server can load on first paint.

## Other topologies

| Topology | Guide |
|----------|--------|
| REST | [docs/snippets/core.md](../docs/snippets/core.md) |
| gRPC | [docs/snippets/grpc.md](../docs/snippets/grpc.md) |
| Hybrid | [hybrid-topology.md](hybrid-topology.md) |
