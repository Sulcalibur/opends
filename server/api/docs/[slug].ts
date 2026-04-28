/**
 * Documentation Page API Handler
 * Handles GET, PUT, DELETE for /api/docs/[slug]
 */

import { z } from "zod";
import { readBody, getRouterParam, setResponseStatus } from "h3";
import { asyncHandler } from "../../middleware/error-handler";
import {
  createSuccessResponse,
  createErrorResponse,
  ErrorCodes,
} from "../../utils/response";
import { requireAuth, requireRole } from "../../utils/auth";
import {
  getPage,
  updatePage,
  deletePage,
} from "../../services/documentation.service";

const updatePageSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes")
    .optional(),
  title: z.string().min(1).max(200).optional(),
  content: z.string().optional(),
  excerpt: z.string().max(500).optional(),
  category: z.string().max(50).optional(),
  parentId: z.string().nullable().optional(),
  sortOrder: z.number().int().min(0).optional(),
  isPublished: z.boolean().optional(),
});

export default asyncHandler(async (event) => {
  const method = event.method;
  const slug = getRouterParam(event, "slug");

  if (!slug) {
    setResponseStatus(event, 400);
    return createErrorResponse(ErrorCodes.VALIDATION_ERROR, "Slug is required");
  }

  // GET - Retrieve documentation page (public)
  if (method === "GET") {
    const page = await getPage(slug);

    if (!page) {
      setResponseStatus(event, 404);
      return createErrorResponse(ErrorCodes.NOT_FOUND, "Page not found");
    }

    return createSuccessResponse(page);
  }

  // PUT - Update documentation page (requires auth)
  if (method === "PUT") {
    const userId = await requireAuth(event);
    const body = await readBody(event);
    const data = updatePageSchema.parse(body);

    const page = await updatePage(
      slug,
      {
        slug: data.slug,
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        category: data.category,
        parent_id: data.parentId === null ? undefined : data.parentId,
        sort_order: data.sortOrder,
        is_published: data.isPublished,
      },
      userId,
    );

    return createSuccessResponse(page);
  }

  // DELETE - Soft delete documentation page (requires admin)
  if (method === "DELETE") {
    await requireRole(event, "admin");
    await deletePage(slug);

    return createSuccessResponse({ message: "Page deleted successfully" });
  }

  // Method not allowed
  setResponseStatus(event, 405);
  return createErrorResponse(ErrorCodes.VALIDATION_ERROR, "Method not allowed");
});
