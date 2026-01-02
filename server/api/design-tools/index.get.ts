/**
 * Design Tools List Endpoint
 * GET /api/design-tools
 */

import { createSuccessResponse } from "../../utils/response";
import { SUPPORTED_TOOLS } from "./types";
import designToolStorage from "./storage";

export default defineEventHandler(async () => {
  const connections = designToolStorage.getConnections();
  const tools = SUPPORTED_TOOLS.map((tool) => ({
    name: tool.name,
    displayName: tool.displayName,
    description: tool.description,
    authType: tool.authType,
    features: tool.features,
    connected: connections.some((c) => c.tool === tool.name && c.connected),
  }));

  return createSuccessResponse({
    tools,
    count: tools.length,
  });
});
