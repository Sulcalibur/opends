/**
 * Get Single Design Token
 * GET /api/tokens/:id
 */

import { z } from "zod";
import { asyncHandler } from "../../middleware/error-handler";
import {
  createSuccessResponse,
  ErrorCodes,
  createErrorResponse,
} from "../../utils/response";
import DesignTokenRepository from "../../repositories/token.repository";
import { getRouterParam, setResponseStatus } from "h3";

const paramsSchema = z.object({
  id: z.string().uuid("Invalid token ID format"),
});

export default asyncHandler(async (event) => {
  // Get ID from router params
  const id = getRouterParam(event, "id");

  if (!id) {
    setResponseStatus(event, 400);
    return createErrorResponse(
      ErrorCodes.VALIDATION_ERROR,
      "Token ID is required",
    );
  }

  // Validate ID format
  const validationResult = paramsSchema.safeParse({ id });

  if (!validationResult.success) {
    setResponseStatus(event, 400);
    const firstError = validationResult.error.issues[0];
    return createErrorResponse(
      ErrorCodes.VALIDATION_ERROR,
      firstError?.message || "Invalid token ID format",
    );
  }

  // Fetch token
  const token = await DesignTokenRepository.findById(id);

  if (!token) {
    setResponseStatus(event, 404);
    return createErrorResponse(ErrorCodes.NOT_FOUND, "Token not found");
  }

  return createSuccessResponse({ token });
});
