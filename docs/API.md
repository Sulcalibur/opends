# OpenDS API Reference

Base URL: `http://localhost:3000` (or your self-hosted domain)

---

## Authentication

| Method | Header | Used by |
|---|---|---|
| JWT Bearer | `Authorization: Bearer <token>` | Admin dashboard, user sessions |
| API Key | `Authorization: Bearer <api-key>` | Penpot plugin, external integrations |
| None | — | Public endpoints (docs, components, tokens) |

JWT tokens obtained via `POST /api/auth/login`. API keys managed at `/admin/api-keys`.

---

## Auth

### `POST /api/auth/login`
Login with email and password. Returns JWT token pair.

```json
// Request
{ "email": "admin@opends.local", "password": "your-password" }

// Response (200)
{
  "success": true,
  "data": {
    "user": { "id": "...", "email": "...", "name": "...", "role": "admin" },
    "tokens": { "accessToken": "...", "refreshToken": "..." }
  }
}
```

### `POST /api/auth/register`
Register a new user account.

```json
// Request
{ "name": "Jane Smith", "email": "jane@team.co", "password": "secure-pass" }

// Response (200)
{ "success": true, "data": { "user": {...}, "tokens": {...} } }
```

---

## Components

### `GET /api/components`
List all components. Optional query params: `?category=inputs&status=approved&search=button`.

```json
// Response (200)
{
  "success": true,
  "data": {
    "components": [
      { "id": "...", "name": "button", "display_name": "Button", "category": "Inputs", "status": "approved", "spec": {...} }
    ],
    "stats": { "total": 1, "draft": 0, "review": 0, "approved": 1, "deprecated": 0 }
  }
}
```

### `GET /api/components/:id`
Get a single component by ID.

### `GET /api/components/by-slug/:slug`
Get a component by its name (e.g., `/api/components/by-slug/button`). Returns parsed spec with variants, props, and a11y data.

```json
// Response (200)
{
  "success": true,
  "data": {
    "component": {
      "id": "...",
      "name": "button",
      "display_name": "Button",
      "description": "Triggers an action or event.",
      "category": "Inputs",
      "status": "approved",
      "version": "v1.0.0",
      "source_path": "app/components/Button.vue",
      "tags": ["inputs"],
      "spec": {
        "variants": [{ "name": "Primary", "label": "primary", "description": "..." }],
        "props": [{ "name": "variant", "type": "string", "default": "\"primary\"", "description": "..." }],
        "a11y": [{ "check": "Focus visible", "result": "Pass", "detail": "...", "pass": true }]
      }
    }
  }
}
```

### `POST /api/components`
Create a new component.

```json
// Request
{
  "name": "checkbox",
  "display_name": "Checkbox",
  "description": "Binary toggle input.",
  "category": "Inputs",
  "status": "draft",
  "spec": { "variants": [...], "props": [...], "a11y": [...] }
}
```

### `PUT /api/components/:id`
Update an existing component.

### `DELETE /api/components/:id`
Soft-delete a component.

---

## Design Tokens

### `GET /api/tokens`
List all design tokens. Optional query: `?category=color&search=primary`.

```json
// Response (200)
{
  "success": true,
  "data": {
    "tokens": [
      { "id": "...", "name": "color.primary.500", "value": "#FF6B4A", "category": "color", "description": "Sweet Salmon" }
    ],
    "stats": { "total": 218, "byCategory": { "color": 88, "space": 12, ... } }
  }
}
```

### `GET /api/tokens/:id`
Get a single token by ID.

### `POST /api/tokens`
Create a new design token.

```json
// Request
{ "name": "color.primary.500", "value": "#FF6B4A", "category": "color", "description": "Sweet Salmon — primary CTAs" }
```

### `PUT /api/tokens/:id`
Update a token.

### `DELETE /api/tokens/:id`
Soft-delete a token.

---

## Documentation Pages

### `GET /api/docs`
List all documentation pages. Query: `?published=true`.

```json
// Response (200)
{ "success": true, "data": { "pages": [{ "id": "...", "slug": "getting-started", "title": "Getting Started", "category": "guides", "isPublished": true }] } }
```

### `GET /api/docs/:slug`
Get a single documentation page by slug.

```json
// Response (200)
{ "success": true, "data": { "title": "...", "slug": "...", "content": "# Markdown content...", "category": "...", "isPublished": true } }
```

### `POST /api/docs`
Create a new documentation page.

```json
// Request
{ "title": "Getting Started", "slug": "getting-started", "content": "# Welcome...", "category": "guides", "isPublished": true }
```

### `PUT /api/docs/:slug`
Update a documentation page.

### `DELETE /api/docs/:slug`
Delete a documentation page.

---

## Users

### `GET /api/users`
List all users.

```json
// Response (200)
{ "success": true, "data": [{ "id": "...", "email": "admin@opends.local", "name": "Admin", "role": "admin", "is_active": 1 }] }
```

---

## Search

### `GET /api/search?q=button&type=component`
Full-text search across components, tokens, and docs.

```json
// Response (200)
{ "success": true, "data": { "results": [...], "total": 12 } }
```

---

## Penpot Integration

These endpoints are for the Penpot plugin. **Auth: API Key** (`Bearer <api-key>`).

### `GET /api/plugin/health`
Connection test. Returns 200 if the instance is reachable with a valid API key.

### `POST /api/penpot/tokens`
Push design tokens from Penpot to OpenDS.

```json
// Request
{
  "version": "1.0",
  "source": "penpot",
  "exportedAt": "2026-06-23T12:00:00Z",
  "colors": [{ "id": "...", "name": "primary.500", "value": "#FF6B4A", "type": "color" }],
  "typography": [{ "id": "...", "name": "heading", "fontFamily": "Outfit", "fontSize": "32px", "fontWeight": 700, "lineHeight": "1.2", "type": "typography" }],
  "spacing": [{ "id": "...", "name": "space-4", "value": "16px", "type": "spacing" }]
}

// Response (200)
{ "success": true, "data": { "synced": 3, "failed": 0 } }
```

### `GET /api/penpot/sync-status`
Get the last sync status.

```json
// Response (200)
{ "synced": 218, "pending": 0, "conflicts": 0 }
```

---

## Settings

### `GET /api/settings/public`
Public settings (no auth required).

### `GET /api/settings`
Get all workspace settings. **Auth: Bearer JWT**.

### `PUT /api/settings`
Update workspace settings. **Auth: Bearer JWT**.

```json
// Request
{ "organization_name": "My Design System", "allow_registration": true }
```

---

## Admin

### `GET /api/admin/api-keys`
List API keys. **Auth: Bearer JWT**.

### `POST /api/admin/api-keys`
Create a new API key. **Auth: Bearer JWT**.

```json
// Request
{ "name": "Penpot Integration" }

// Response (200)
{ "success": true, "data": { "key": "opends_mcp_...", "id": "...", "name": "Penpot Integration" } }
```

### `DELETE /api/admin/api-keys/:id`
Revoke an API key. **Auth: Bearer JWT**.

---

## Health

### `GET /api/health`
Server health check. Returns database status and uptime.

```json
// Response (200)
{ "status": "healthy", "database": "connected", "uptime": 3600 }
```
