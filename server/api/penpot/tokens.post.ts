import { extractApiKey, validateApiKey, getAuthError } from "../../utils/auth";

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
  const { colors, typography, spacing } = body;

  return {
    success: true,
    processed:
      (colors?.length || 0) +
      (typography?.length || 0) +
      (spacing?.length || 0),
  };
});
