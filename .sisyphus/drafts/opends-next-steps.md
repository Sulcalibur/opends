# Draft: OpenDS Next Steps Planning

## Project Context

- **Name**: OpenDS v0.2.0
- **Type**: Self-hosted design system documentation platform
- **Stack**: Nuxt 4.2.2 + Vue 3 + NuxtUI v4 + PostgreSQL
- **Stage**: Early development
- **Recent Work**: NuxtUI v4 styling issues resolved

## User Request

Plan the next actions to move the project forward.

## Questions to Explore

- What are the current capabilities vs what's planned?
- What features are incomplete or missing?
- What's the MVP vs full vision?
- Are there specific pain points or blockers?

## Research Findings

### What's Fully Implemented ✅

1. **Design Tokens** - Complete system with:
   - Database schema with hierarchy support (parent_id, path)
   - Full CRUD API endpoints
   - Import/export (JSON, Penpot/Figma formats)
   - Admin + public UI pages
   - MCP tools integration

2. **Component Documentation** - Working system:
   - Interactive component viewer with search
   - Live examples
   - Auto-generation utilities
   - Category organization

3. **Penpot Integration** - Production-ready:
   - Token/component import API
   - Color/typography converters
   - Sync status tracking
   - Webhook support
   - Full documentation

4. **Authentication** - JWT-based auth:
   - Login/register endpoints
   - Role-based access (admin/editor/viewer)
   - Session management
   - API key management

### Critical Gaps (Breaking Functionality)

1. **Missing GET single token** - `/api/tokens/[id].get.ts` doesn't exist (only PUT/DELETE)
2. **No user CRUD** - Can only list users, can't create/update/delete
3. **Auth middleware TODOs** - 3 endpoints missing auth checks
4. **Component version/review** - Stubbed out but not implemented
5. **Component edit/delete** - Admin UI has TODOs

### Partial Implementations (Needs Work)

1. **Code Generation** - Basic stub exists but:
   - No actual templates directory
   - Simple placeholder code only
   - Not production-ready

2. **Team Management** - Auth works but:
   - No teams table in database
   - No multi-team/workspace support
   - No team-scoped permissions

3. **Design Tools Storage** - In-memory only (not persisted)

## Decisions Made

(To be populated)
