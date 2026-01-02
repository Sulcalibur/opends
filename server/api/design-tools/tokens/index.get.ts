/**
 * Design Tools Tokens List Endpoint
 * GET /api/design-tools/tokens
 */

import { createSuccessResponse } from "../../../utils/response";
import designToolStorage from "../storage";

export default defineEventHandler(async () => {
  const tokens = designToolStorage.getImportedTokens();
  const connections = designToolStorage.getConnections();

  const tokensWithSource = tokens.map((token) => ({
    ...token,
    source:
      connections.find((c) => c.tool === token.source)?.libraryName ||
      token.source,
  }));

  return createSuccessResponse({
    tokens: tokensWithSource,
    count: tokens.length,
  });
});
