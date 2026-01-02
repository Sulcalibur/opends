# Design Tool API Documentation

## Overview

The Design Tool API enables integration with Penpot, Figma, and Sketch for syncing design tokens and components.

## Base URL

```
/api/design-tools
```

## Endpoints

### List Available Design Tools

```
GET /api/design-tools
```

**Response:**

```json
{
  "success": true,
  "data": {
    "tools": [
      {
        "name": "penpot",
        "displayName": "Penpot",
        "description": "Open-source design and prototyping platform",
        "authType": "apiKey",
        "features": ["colors", "typography", "components", "library"],
        "connected": false
      },
      {
        "name": "figma",
        "displayName": "Figma",
        "description": "Collaborative interface design tool",
        "authType": "apiKey",
        "features": ["colors", "typography", "components", "styles"],
        "connected": false
      },
      {
        "name": "sketch",
        "displayName": "Sketch",
        "description": "Vector graphics editor for macOS",
        "authType": "apiKey",
        "features": ["colors", "typography", "components", "library"],
        "connected": false
      }
    ],
    "count": 3
  }
}
```

### Connect a Design Tool

```
POST /api/design-tools/:tool/connect
```

**Body:**

```json
{
  "apiKey": "your-api-key"
}
```

**Example (Penpot):**

```bash
curl -X POST /api/design-tools/penpot/connect \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "penpot-api-key"}'
```

**Example (Figma):**

```bash
curl -X POST /api/design-tools/figma/connect \
  -H "Content-Type: application/json" \
  -d '{"accessToken": "figma-personal-access-token"}'
```

### Disconnect a Design Tool

```
DELETE /api/design-tools/:tool/disconnect
```

### Get Tool Status

```
GET /api/design-tools/tools/:tool
```

### List Imported Tokens

```
GET /api/design-tools/tokens
```

### Import Tokens

```
POST /api/design-tools/tokens
```

**Body:**

```json
{
  "tool": "penpot",
  "options": {
    "includeColors": true,
    "includeTypography": true,
    "set": "default"
  }
}
```

**Example:**

```bash
curl -X POST /api/design-tools/tokens \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "penpot",
    "options": {
      "includeColors": true,
      "includeTypography": true
    }
  }'
```

### List Imported Components

```
GET /api/design-tools/components
```

### Import Components

```
POST /api/design-tools/components
```

**Body:**

```json
{
  "tool": "penpot",
  "options": {
    "category": "My Components",
    "includeMetadata": true
  }
}
```

### Get Tool Metadata

```
GET /api/design-tools/:tool/metadata
```

## Webhooks

### Webhook Endpoint

```
POST /api/webhooks/design-tools/:tool
```

**Headers:**

- `X-Webhook-Signature`: HMAC-SHA256 signature
- `X-Webhook-Timestamp`: Unix timestamp

**Example Penpot Webhook Payload:**

```json
{
  "event": "library.updated",
  "timestamp": "1704067200",
  "data": {
    "libraryId": "abc123",
    "libraryName": "Design System"
  }
}
```

**Example Figma Webhook Payload:**

```json
{
  "event_type": "FILE_UPDATE",
  "file_key": "abc123",
  "passcode": "secret"
}
```

## Token Format

Imported tokens follow this structure:

```typescript
interface DesignToken {
  id: string;
  name: string;
  type: "color" | "typography" | "spacing" | "shadow" | "radius" | "size";
  value: any;
  description?: string;
  category?: string;
  source: "penpot" | "figma" | "sketch";
  sourceId: string;
  importedAt: string;
}
```

## Component Format

Imported components follow this structure:

```typescript
interface DesignComponent {
  id: string;
  name: string;
  description?: string;
  category: string;
  props: any[];
  source: "penpot" | "figma" | "sketch";
  sourceId: string;
  importedAt: string;
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Tool is required",
    "field": "tool"
  }
}
```

**Error Codes:**

- `VALIDATION_ERROR`: Invalid request body
- `INVALID_INPUT`: Invalid parameter value
- `MISSING_FIELD`: Required field is missing
- `UNAUTHORIZED`: Invalid or missing authentication
- `INVALID_CREDENTIALS`: Design tool credentials are invalid
- `NOT_FOUND`: Resource not found
- `EXTERNAL_SERVICE_ERROR`: Design tool API error

## Environment Variables

- `WEBHOOK_SECRET`: Secret key for webhook signature verification

## Limitations

1. **Sketch**: Full API integration requires Sketch Cloud subscription
2. **Export**: Currently one-way sync (design tool → OpenDS)
3. **Rate Limiting**: Respects design tool API rate limits
