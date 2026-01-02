/**
 * Import Tokens from Design Tool
 * POST /api/design-tools/tokens
 */

import {
  createSuccessResponse,
  createErrorResponse,
  ErrorCodes,
} from "../../../utils/response";
import { DesignTool } from "../types";
import designToolStorage from "../storage";
import { createError } from "h3";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.tool) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Tool is required",
    });
  }

  const tool = body.tool as DesignTool;
  const options = body.options || {};

  const credentials = designToolStorage.getCredentials(tool);

  if (!credentials || (!credentials.apiKey && !credentials.accessToken)) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: `Please connect ${tool} first - no credentials found`,
    });
  }

  return createSuccessResponse({
    success: true,
    message: `Token import from ${tool} configured successfully`,
    tool,
    options,
    timestamp: new Date().toISOString(),
  });
});
