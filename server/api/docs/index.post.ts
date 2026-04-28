/**
 * Create Documentation Page
 * POST /api/docs
 * Requires authentication
 */

import { z } from "zod";
import { readBody, setResponseStatus } from "h3";
import { asyncHandler } from "../../middleware/error-handler";
import {
  createSuccessResponse,
  createErrorResponse,
  ErrorCodes,
} from "../../utils/response";
import { requireAuth } from "../../utils/auth";
import { createPage } from "../../services/documentation.service";

const createPageSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes"),
  title: z.string().min(1).max(200),
  content: z.string().default(""),
  excerpt: z.string().max(500).optional(),
  category: z.string().max(50).optional(),
  parentId: z.string().optional(),
  sortOrder: z.number().int().min(0).optional(),
  isPublished: z.boolean().optional(),
});

export default asyncHandler(async (event) => {
  const userId = await requireAuth(event);
  const body = await readBody(event);
  const data = createPageSchema.parse(body);

  try {
    const page = await createPage(
      {
        slug: data.slug,
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        category: data.category,
        parent_id: data.parentId,
        sort_order: data.sortOrder,
        is_published: data.isPublished,
      },
      userId,
    );

    setResponseStatus(event, 201);
    return createSuccessResponse(page);
  } catch (error) {
    if (error instanceof Error && error.message === "Slug already exists") {
      setResponseStatus(event, 409);
      return createErrorResponse(
        ErrorCodes.CONFLICT,
        "A page with this slug already exists",
      );
    }
    throw error;
  }
});
