# API Reference

OpenDS provides a RESTful API for programmatic access to design system data. All endpoints are prefixed with `/api/`.

## Authentication

Most endpoints require authentication. Use JWT tokens obtained from the login endpoint.

### Headers
```http
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

## Base URL

- **Development**: `http://localhost:3001/api`
- **Production**: `https://your-opends-instance.com/api`

## Health Endpoints

| Endpoint | Method | Description | Authentication |
|----------|--------|-------------|----------------|
| `/health` | GET | Service status | No |
| `/health/ready` | GET | Readiness probe | No |
| `/health/live` | GET | Liveness probe | No |

**Example Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-16T23:45:00.000Z",
  "version": "0.1.0"
}
```

## Authentication Endpoints

| Endpoint | Method | Description | Authentication |
|----------|--------|-------------|----------------|
| `/auth/login` | POST | User login | No |
| `/auth/register` | POST | User registration | No |
| `/auth/me` | GET | Current user info | Yes |
| `/auth/logout` | POST | Logout | Yes |

**Login Example:**
```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

## Design Files Endpoints

Manage design files from connected design tools.

| Endpoint | Method | Description | Authentication |
|----------|--------|-------------|----------------|
| `/design-files` | GET | List all design files | Yes |
| `/design-files/:id` | GET | Get specific design file | Yes |
| `/design-files/:id/sync` | POST | Sync design file from source | Yes |
| `/design-files/:id/components` | GET | Get components from design file | Yes |

**Design File Object:**
```json
{
  "id": "uuid",
  "name": "Design System",
  "source": "penpot",
  "sourceId": "penpot-file-id",
  "lastSyncedAt": "2025-12-16T23:45:00.000Z",
  "createdAt": "2025-12-16T23:45:00.000Z",
  "updatedAt": "2025-12-16T23:45:00.000Z"
}
```

## Components Endpoints

Work with extracted design components.

| Endpoint | Method | Description | Authentication |
|----------|--------|-------------|----------------|
| `/components` | GET | List all components | Yes |
| `/components/:id` | GET | Get specific component | Yes |
| `/components/:id/generate` | POST | Generate code for component | Yes |
| `/components/:id/spec` | GET | Get component specification | Yes |

**Component Object:**
```json
{
  "id": "uuid",
  "name": "Button",
  "description": "Primary action button",
  "framework": "vue",
  "code": "<template>...</template>",
  "props": [...],
  "designFileId": "uuid",
  "createdAt": "2025-12-16T23:45:00.000Z",
  "updatedAt": "2025-12-16T23:45:00.000Z"
}
```

## Design Tokens Endpoints

Manage design tokens (colors, typography, spacing, etc.).

| Endpoint | Method | Description | Authentication |
|----------|--------|-------------|----------------|
| `/tokens` | GET | List all design tokens | Yes |
| `/tokens/:id` | GET | Get specific token | Yes |
| `/tokens/export` | POST | Export tokens as CSS/JSON | Yes |

## Plugin Endpoints

Interact with the Penpot plugin.

| Endpoint | Method | Description | Authentication |
|----------|--------|-------------|----------------|
| `/plugin/connect` | POST | Connect Penpot plugin | Yes |
| `/plugin/data` | POST | Receive data from Penpot plugin | Yes |

## File Management Endpoints

Manage uploaded files and assets.

| Endpoint | Method | Description | Authentication |
|----------|--------|-------------|----------------|
| `/files` | POST | Upload file | Yes |
| `/files/:id` | GET | Get file | Yes |
| `/files/:id` | DELETE | Delete file | Yes |

## Error Responses

All endpoints return standard error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "statusCode": 400
}
```

**Common Error Codes:**
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid request data
- `INTERNAL_ERROR` - Server error

## Rate Limiting

API requests are limited to 100 requests per minute per IP address. Exceeding this limit returns HTTP 429.

## Interactive API Documentation

For interactive exploration of the API, visit `/docs` on your OpenDS instance (e.g., http://localhost:3001/docs).

