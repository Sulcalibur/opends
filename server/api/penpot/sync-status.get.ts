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

  return {
    synced: 0,
    pending: 0,
    conflicts: 0,
  };
});
