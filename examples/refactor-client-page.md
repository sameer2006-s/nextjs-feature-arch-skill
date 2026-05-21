# Example: Refactor client-heavy page

## Request

> Refactor `app/dashboard/page.tsx` — full client page with useEffect fetch.

## Before (reject)

```
app/dashboard/page.tsx          # "use client", useEffect + fetch
```

## After (target)

```
app/dashboard/page.tsx          # async Server Component
features/dashboard/
  components/
    dashboard-view.tsx          # Server — displays data
    dashboard-filters.tsx       # Client island — interactive filters only
  services/
    get-dashboard.service.ts
  actions/
    refresh-dashboard.queries.ts   # optional — TanStack bridge
  hooks/
    use-dashboard-query.ts       # optional — client refresh
```

## Architecture output (excerpt)

```markdown
## Data flow
- Read: page → get-dashboard.service → repository or *ApiClient
- Write (if any): DashboardFilters (client) → action → service

## Server vs client
| dashboard/page.tsx | Server | async fetch |
| dashboard-view.tsx | Server | props from page |
| dashboard-filters.tsx | Client | useState, onChange |
```

## Migration order

1. Extract fetch to `get-dashboard.service` (+ repository/RPC)
2. Make `page.tsx` async Server Component
3. Move interactivity to smallest client child
4. Add Server Action + validation only if mutations exist
5. Delete internal `/api/dashboard` route if it only bypassed Server Actions

See [prompts/refactor-architecture.md](../prompts/refactor-architecture.md).
