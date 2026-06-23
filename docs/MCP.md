# OpenDS MCP Server

OpenDS exposes a **Model Context Protocol (MCP)** server at `/mcp` for AI tools (Claude Desktop, Cursor, Codex, etc.) to query your design system.

---

## Quick Start

### Endpoint

```
POST http://localhost:3000/mcp
```

### Authentication

```
Header: Authorization: Bearer <mcp-api-key>
```

### Generating an API Key

1. Log into your OpenDS admin dashboard (`/admin`)
2. Navigate to **API Keys** (`/admin/api-keys`)
3. Click **Create New Key**
4. Copy the key immediately — it's shown only once

---

## Available Tools

OpenDS currently exposes **5 MCP tools** and **1 resource**:

### Tools

#### `list-design-tokens`
List all design tokens in the system. Optional filter by category.

```
Parameters:
  category (optional): string — "color", "space", "radius", "shadow", "font", "motion", "z-index"

Returns:
  Array of tokens with name, value, category, and description
```

#### `get-design-token`
Get a single design token by name.

```
Parameters:
  name (required): string — e.g., "color.primary.500"

Returns:
  Single token object with full metadata
```

#### `list-components`
List all components in the design system.

```
Parameters:
  category (optional): string
  status (optional): "draft" | "review" | "approved" | "deprecated"

Returns:
  Array of components with name, description, category, status
```

#### `get-component`
Get a single component by name.

```
Parameters:
  name (required): string — e.g., "button"

Returns:
  Component with full spec including variants, props, and a11y data
```

#### `search-design-system`
Full-text search across components, tokens, and documentation.

```
Parameters:
  query (required): string — search term
  type (optional): "component" | "token" | "doc"

Returns:
  Array of matching results with type, name, description, and URL
```

### Resources

#### `design-system://tokens`
Readable resource exposing the full token collection as structured data.

---

## Configuring AI Tools

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "opends": {
      "url": "http://localhost:3000/mcp",
      "headers": {
        "Authorization": "Bearer opends_mcp_your-key-here"
      }
    }
  }
}
```

### Cursor

Add to `.cursor/mcp.json` in your project:

```json
{
  "mcpServers": {
    "opends": {
      "url": "http://localhost:3000/mcp",
      "headers": {
        "Authorization": "Bearer opends_mcp_your-key-here"
      }
    }
  }
}
```

### Codex / CodeWhale

Configure via `config.toml` or the MCP settings panel:

```toml
[mcp_servers.opends]
url = "http://localhost:3000/mcp"
headers = { Authorization = "Bearer opends_mcp_your-key-here" }
```

---

## Key Scopes

When creating an API key, you can assign scopes to limit what the key can access:

| Scope | Access |
|---|---|
| `read:tokens` | List and get design tokens |
| `read:components` | List and get components |
| `read:docs` | Read documentation pages |
| `write:tokens` | Create and update tokens |
| `write:components` | Create and update components |

Default scope for new keys: `["read:tokens", "read:components"]`

---

## Architecture

The MCP server is built on `@nuxtjs/mcp-toolkit` and runs as part of the Nuxt Nitro server:

```
server/mcp/
├── index.ts           # MCP handler entry point — auth, routing
├── tools/
│   ├── list-design-tokens.ts
│   ├── get-design-token.ts
│   ├── list-components.ts
│   ├── get-component.ts
│   └── search-design-system.ts
└── resources/
    └── tokens.ts      # design-system://tokens resource
```

Authentication is handled by `server/utils/mcp-auth.ts` which validates the API key hash against the `mcp_api_keys` database table.
