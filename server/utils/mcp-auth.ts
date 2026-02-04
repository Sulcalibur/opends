import { getHeader, type H3Event } from "h3";
import { createHash } from "node:crypto";
import McpApiKeyRepository from "../repositories/mcp-key.repository";
import UserRepository from "../repositories/user.repository";

export async function validateMcpApiKey(
  event: H3Event,
): Promise<{
  user: import('../repositories/user.repository').User;
  userId: string;
  keyScope: string[];
  keyId: string;
} | null> {
  const authHeader = getHeader(event, "authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice(7);
  const tokenHash = createHash("sha256").update(token).digest("hex");

  const mcpKey = await McpApiKeyRepository.findByHash(tokenHash);

  if (!mcpKey) {
    return null;
  }

  const user = await UserRepository.findById(mcpKey.user_id);

  if (!user) {
    return null;
  }

  return {
    user,
    userId: user.id,
    keyId: mcpKey.id,
    keyScope: Array.isArray(mcpKey.scope)
      ? mcpKey.scope
      : JSON.parse(mcpKey.scope),
  };
}

export function hasMcpPermission(event: any, required: string): boolean {
  const scope = (event.context?.keyScope as string[]) || [];
  return scope.includes(required);
}

export function authRequiredResponse() {
  return {
    content: [
      {
        type: "text",
        text: "Authentication required. Please provide a valid MCP API key.",
      },
    ],
  };
}

export function insufficientPermissionsResponse(permission: string) {
  return {
    content: [
      {
        type: "text",
        text: `Insufficient permissions. Your MCP key scope does not include ${permission}.`,
      },
    ],
  };
}

export function extractMcpApiKey(event: H3Event): string | null {
  const authHeader = getHeader(event, "authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.slice(7);
}
