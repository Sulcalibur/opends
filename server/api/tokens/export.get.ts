/**
 * Export Design Tokens
 * GET /api/tokens/export
 */

import { z } from "zod";
import { getQuery, setResponseHeader } from "h3";
import { asyncHandler } from "../../middleware/error-handler";
import {
  createSuccessResponse,
  createErrorResponse,
  ErrorCodes,
} from "../../utils/response";
import {
  exportTokens,
  getSupportedFormats,
  type ExportFormat,
} from "../../services/tokenEngine.service";

const querySchema = z.object({
  format: z.enum(["json", "css", "scss", "less", "stylus"]).default("json"),
});

const contentTypeMap: Record<ExportFormat, string> = {
  json: "application/json",
  css: "text/css",
  scss: "text/x-scss",
  less: "text/x-less",
  stylus: "text/x-stylus",
};

export default asyncHandler(async (event) => {
  const query = getQuery(event);
  const validation = querySchema.safeParse(query);

  if (!validation.success) {
    return createErrorResponse(
      ErrorCodes.VALIDATION_ERROR,
      `Invalid format. Supported: ${getSupportedFormats().join(", ")}`,
    );
  }

  const { format } = validation.data;
  const content = await exportTokens(format);

  setResponseHeader(event, "Content-Type", contentTypeMap[format]);

  return createSuccessResponse({ content, format });
});
