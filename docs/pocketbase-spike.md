# PocketBase Spike — Findings

## What was built

1. **docker-compose.yml** — PocketBase service added (port 8090) alongside the Nuxt app
2. **server/utils/pocketbase.ts** — Shared PocketBase client + admin/user auth helpers
3. **pb_schema.json** — Collection schemas for components, tokens, docs, settings, api_keys
4. **server/repositories/component.repository.pb.ts** — Full ComponentRepository reimplemented via PocketBase SDK (same interface, ~60% less code)
5. **server/api/auth-pb/login.post.ts** — Login via PocketBase (replaces password.service + jwt.service + old login route)
6. **server/api/auth-pb/register.post.ts** — Registration via PocketBase (no bcryptjs needed)
7. **server/api/auth-pb/me.get.ts** — Session check via httpOnly cookie

## Code deletion candidates

If we go all-in on PocketBase, these files become dead code:

```
server/services/password.service.ts    # bcryptjs — PocketBase hashes passwords
server/services/jwt.service.ts         # JWT sign/verify — PocketBase manages tokens
server/utils/db.ts                     # UniversalDatabase class — no more raw SQL
server/utils/migrations.ts             # 143 SQL migration files — PocketBase auto-migrates
server/middleware/auth.ts              # requireAuth/requireRole — PocketBase access rules
server/api/auth/login.post.ts          # → /api/auth-pb/login.post.ts
server/api/auth/register.post.ts       # → /api/auth-pb/register.post.ts  
server/api/auth/me.get.ts              # → /api/auth-pb/me.get.ts
migrations/                            # 143 SQL files — replaced by pb_schema.json
```

## What stays unchanged

```
app/                                   # All Vue components, pages, layouts — untouched
app/stores/auth.ts                     # Minor change: use pb_auth cookie instead of localStorage
server/api/penpot/                     # Penpot plugin endpoints
server/api/components/                 # Component API routes (repos change, routes stay)
server/api/tokens/                     # Token API routes
server/api/docs/                       # Docs API routes
server/api/settings/                   # Settings API routes
server/api/mcp/                        # MCP server
server/services/codeGenerator.service.ts
server/services/search.service.ts
server/services/tokenEngine.service.ts
```

## Key numbers

| Metric | Old (SQL) | New (PocketBase) |
|--------|-----------|-------------------|
| Component repository lines | 213 | 170 |
| Auth service lines | ~350 | 0 (PocketBase built-in) |
| Migration files | 143 SQL files | 1 JSON schema |
| DB connection management | Custom reconnect logic | Not needed |
| Access control | Middleware checks | Collection rules |

## Migration path

1. Start PocketBase: `docker-compose up pocketbase`
2. Visit `http://localhost:8090/_/` → create admin account
3. Create collections via UI or import pb_schema.json
4. Migrate data: read from old SQL, write to PocketBase
5. Swap API routes to use `-pb` versions
6. Update frontend to use `pb_auth` cookie
7. Remove old dead code
