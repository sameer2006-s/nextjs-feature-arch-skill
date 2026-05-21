# Prompt: Refactor toward feature architecture

Copy and adapt when migrating legacy Next.js code.

---

Using the **nextjs-feature-architecture** skill, refactor **`<path or area>`** to match feature-sliced, server-first architecture.

**Problems to fix (check all that apply):**
- [ ] `"use client"` on pages, layouts, or data wrappers
- [ ] `useEffect` + `fetch` for server-loadable data
- [ ] DB / HTTP / `*ApiClient` calls inside components or `page.tsx`
- [ ] Business logic in UI or Server Actions
- [ ] Client-side calls to external API with tokens
- [ ] Hooks importing grpc clients or `getAuthedContext`
- [ ] Files organized by technical type instead of feature
- [ ] Missing input validation at mutation boundaries
- [ ] Duplicated backend domain logic (separate topology)

**Topology:** Detect from repo; state explicitly in the refactor plan.

**Process:**
1. Scan [rules/architecture.md](../rules/architecture.md) anti-patterns.
2. Propose target folder tree under `features/<name>/`.
3. Output architecture skeleton (same as [generate-feature.md](./generate-feature.md)) for the **after** state.
4. Migrate in order: data access → services → actions → server pages → client islands.
5. Run review checklist from [SKILL.md](../SKILL.md).

**Do not:**
- Add `"use client"` to pages to “fix” hydration issues without splitting islands.
- Introduce Route Handlers for mutations that Server Actions can handle (integrated).
- Mix DB and HTTP/gRPC in one repository file (hybrid).

---

## Refactoring checklist (agent)

1. Detect topology — ORM vs `lib/api` vs `@connectrpc` + `grpc/clients`
2. Move `"use client"` out of `app/` pages — split leaves
3. Move `fetch` / ORM / `*ApiClient` from components → service/repository
4. **Separate-REST:** centralize HTTP in `lib/api/client` + repositories
5. **Separate-gRPC:** consolidate clients in `lib/grpc/clients.ts`; add Server Action bridges for hooks using server auth
6. Remove duplicated domain logic that belongs on the backend
7. Group orphaned files under `features/<name>/`
8. Validate mutations at action boundaries; use generated proto types for RPC
9. **Integrated:** prefer Server Actions over internal API routes for form mutations
