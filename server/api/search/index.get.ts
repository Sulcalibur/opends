/**
 * Search API
 * GET /api/search
 *
 * Query Parameters:
 * - q (required): Search query string
 * - type (optional): Filter by type ('token', 'component', 'doc')
 * - limit (optional): Results per page (default: 20, max: 100)
 * - offset (optional): Pagination offset (default: 0)
 */

import { z } from "zod";
import { getQuery } from "h3";
import { asyncHandler } from "../../middleware/error-handler";
import {
  createSuccessResponse,
  createErrorResponse,
  ErrorCodes,
} from "../../utils/response";
import { search as searchService } from "../../services/search.service";
import type {
  SearchResponse,
  SearchContentType,
} from "../../../app/types/search";

// Validation schema
const searchQuerySchema = z.object({
  q: z.string().min(1, "Search query is required").max(200, "Query too long"),
  type: z.enum(["token", "component", "doc"]).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

type SearchQuery = z.infer<typeof searchQuerySchema>;

export default asyncHandler(async (event) => {
  const query = getQuery(event);

  // Validate query parameters
  const validation = searchQuerySchema.safeParse(query);
  if (!validation.success) {
    const error = validation.error.issues[0];
    return createErrorResponse(
      ErrorCodes.VALIDATION_ERROR,
      error.message,
      undefined,
      error.path.join("."),
    );
  }

  const { q, type, limit, offset } = validation.data;

  try {
    // Execute search via service
    const response = await searchService(q, { type, limit, offset });

    const formattedResponse: SearchResponse = {
      results: response.results,
      meta: {
        ...response.meta,
        type: (type || "all") as SearchContentType,
      },
    };

    return createSuccessResponse(formattedResponse);
  } catch (error) {
    console.error("[Search API] Error:", error);
    return createErrorResponse(
      ErrorCodes.INTERNAL_ERROR,
      "Search operation failed. Please try again.",
    );
  }
});
