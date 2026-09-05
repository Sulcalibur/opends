import { extractApiKey, validateApiKey, getAuthError } from "../../utils/auth";
import tokenRepository from "../../repositories/token.repository";

export default defineEventHandler(async (event) => {
  const apiKey = extractApiKey(event);

  if (!apiKey) {
    throw getAuthError();
  }

  const isValid = await validateApiKey(apiKey);

  if (!isValid) {
    throw getAuthError();
  }

  const body = await readBody(event);
  const { colors = [], typography = [], spacing = [] } = body || {};

  // Reshape Penpot plugin arrays into importTokens format:
  // { "color.primary-500": { category: "color", value: "#3b82f6" } }
  const tokensData: Record<string, { category: string; value: unknown; description?: string }> = {};

  for (const token of colors) {
    const name = token.name || `color-${token.id}`;
    tokensData[name] = {
      category: 'color',
      value: token.value,
      description: token.description || undefined,
    };
  }

  for (const token of typography) {
    const name = token.name || `typography-${token.id}`;
    tokensData[name] = {
      category: 'typography',
      value: {
        fontFamily: token.fontFamily,
        fontSize: token.fontSize,
        fontWeight: token.fontWeight,
        lineHeight: token.lineHeight,
      },
      description: token.description || undefined,
    };
  }

  for (const token of spacing) {
    const name = token.name || `spacing-${token.id}`;
    tokensData[name] = {
      category: 'spacing',
      value: token.value,
      description: token.description || undefined,
    };
  }

  // Persist tokens to database. API-key imports have no user session —
  // created_by is a nullable FK, so pass null.
  const result = await tokenRepository.importTokens(tokensData, null as unknown as string);

  return {
    success: true,
    data: {
      synced: result.imported,
      skipped: result.skipped,
      failed: result.errors.length,
      errors: result.errors.length > 0 ? result.errors : undefined,
    },
  };
});
