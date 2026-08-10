/**
 * Delete User (Soft Delete)
 * DELETE /api/users/:id
 * Admin only, cannot delete self
 */

import { z } from "zod";
import { asyncHandler } from "../../middleware/error-handler";
import {
  createSuccessResponse,
  ErrorCodes,
  createErrorResponse,
} from "../../utils/response";
import UserRepository from "../../repositories/user.repository";
import JwtService from "../../services/jwt.service";
import { isPocketBaseMode, getPbAuthRecord, PB_AUTH_COOKIE } from "../../utils/pocketbase";

import { getRouterParam, setResponseStatus, getRequestHeader, getCookie } from "h3";

// PocketBase uses 15-char alphanumeric ids, not UUIDs
const paramsSchema = z.object({
  id: isPocketBaseMode()
    ? z.string().min(5).max(50)
    : z.string().uuid("Invalid user ID format"),
});

export default asyncHandler(async (event) => {
  // Resolve the acting user: pb_auth cookie in PocketBase mode, JWT Bearer
  // token in SQL mode. A verification failure yields null -> 403 below,
  // preserving the route's historical semantics.
  let currentUser: { userId: string; role: string; email: string } | null = null;

  if (isPocketBaseMode()) {
    const cookieToken = getCookie(event, PB_AUTH_COOKIE);
    const record = cookieToken ? await getPbAuthRecord(cookieToken) : null;
    if (record) {
      currentUser = {
        userId: record.id,
        role: record.role || "viewer",
        email: record.email,
      };
    }
  } else {
    const authHeader = getRequestHeader(event, "authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      setResponseStatus(event, 401);
      return createErrorResponse(
        ErrorCodes.UNAUTHORIZED,
        "Authentication required",
      );
    }

    const token = authHeader.substring(7);
    try {
      currentUser = JwtService.verify(token) as {
        userId: string;
        role: string;
        email: string;
      } | null;
    } catch {
      currentUser = null;
    }
  }

  if (!currentUser || currentUser.role !== "admin") {
    setResponseStatus(event, 403);
    return createErrorResponse(ErrorCodes.FORBIDDEN, "Admin access required");
  }

  // Validate parameters
  const id = getRouterParam(event, "id");

  if (!id) {
    setResponseStatus(event, 400);
    return createErrorResponse(
      ErrorCodes.VALIDATION_ERROR,
      "User ID is required",
    );
  }

  const paramsValidation = paramsSchema.safeParse({ id });

  if (!paramsValidation.success) {
    setResponseStatus(event, 400);
    const firstError = paramsValidation.error.issues[0];
    return createErrorResponse(
      ErrorCodes.VALIDATION_ERROR,
      firstError?.message || "Invalid user ID format",
    );
  }

  const { id: userIdToDelete } = paramsValidation.data;

  // Prevent self-deletion
  if (currentUser.userId === userIdToDelete) {
    setResponseStatus(event, 403);
    return createErrorResponse(
      ErrorCodes.FORBIDDEN,
      "Cannot delete your own account",
    );
  }

  // Check if user exists
  const user = await UserRepository.findById(userIdToDelete);
  if (!user) {
    setResponseStatus(event, 404);
    return createErrorResponse(ErrorCodes.NOT_FOUND, "User not found");
  }

  // Soft delete
  await UserRepository.delete(userIdToDelete);

  return createSuccessResponse({
    message: "User deleted successfully",
    deletedId: userIdToDelete,
  });
});
