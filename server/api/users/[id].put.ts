/**
 * Update User
 * PUT /api/users/:id
 * Admin only (or self for non-role updates)
 */

import { z } from "zod";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../../middleware/error-handler";
import {
  createSuccessResponse,
  ErrorCodes,
  createErrorResponse,
} from "../../utils/response";
import UserRepository from "../../repositories/user.repository";
import JwtService from "../../services/jwt.service";
import {
  getRouterParam,
  setResponseStatus,
  getRequestHeader,
  readBody,
} from "h3";

const paramsSchema = z.object({
  id: z.string().uuid("Invalid user ID format"),
});

const updateUserSchema = z
  .object({
    email: z.string().email("Invalid email format").toLowerCase().optional(),
    name: z.string().min(1).max(100).optional(),
    password: z.string().min(8).max(128).optional(),
    role: z.enum(["admin", "editor", "viewer"]).optional(),
    is_active: z.boolean().optional(),
    avatar_url: z.string().url().optional().or(z.literal("")),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export default asyncHandler(async (event) => {
  // Verify authentication
  const authHeader = getRequestHeader(event, "authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    setResponseStatus(event, 401);
    return createErrorResponse(
      ErrorCodes.UNAUTHORIZED,
      "Authentication required",
    );
  }

  const token = authHeader.substring(7);
  const payload = JwtService.verify(token);

  if (!payload) {
    setResponseStatus(event, 401);
    return createErrorResponse(ErrorCodes.INVALID_TOKEN, "Invalid token");
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

  const validationResult = paramsSchema.safeParse({ id });
  if (!validationResult.success) {
    setResponseStatus(event, 400);
    const firstError = validationResult.error.issues[0];
    return createErrorResponse(
      ErrorCodes.VALIDATION_ERROR,
      firstError?.message || "Invalid user ID format",
    );
  }

  const body = await readBody(event);
  const data = updateUserSchema.parse(body);

  // Check permissions
  const isAdmin = payload.role === "admin";
  const isSelf = payload.userId === id;

  // Only admins can change roles or status
  if ((data.role !== undefined || data.is_active !== undefined) && !isAdmin) {
    setResponseStatus(event, 403);
    return createErrorResponse(
      ErrorCodes.FORBIDDEN,
      "Only admins can change roles or status",
    );
  }

  // Prevent self-demotion from admin
  if (isSelf && data.role && data.role !== "admin" && isAdmin) {
    setResponseStatus(event, 403);
    return createErrorResponse(
      ErrorCodes.FORBIDDEN,
      "Cannot remove your own admin role",
    );
  }

  // Non-admins can only update themselves
  if (!isAdmin && !isSelf) {
    setResponseStatus(event, 403);
    return createErrorResponse(
      ErrorCodes.FORBIDDEN,
      "Can only update your own profile",
    );
  }

  // Prepare update data
  const updateData: Parameters<typeof UserRepository.update>[1] = {};

  if (data.email) updateData.email = data.email;
  if (data.name) updateData.name = data.name;
  if (data.password)
    updateData.password_hash = await bcrypt.hash(data.password, 10);
  if (data.role) updateData.role = data.role;
  if (data.is_active !== undefined) updateData.is_active = data.is_active;
  if (data.avatar_url) updateData.avatar_url = data.avatar_url;

  try {
    const user = await UserRepository.update(id, updateData);

    // Remove sensitive data
    const { password_hash, ...safeUser } = user as any;

    return createSuccessResponse({ user: safeUser });
  } catch (error: any) {
    if (error.message?.includes("not found")) {
      setResponseStatus(event, 404);
      return createErrorResponse(ErrorCodes.NOT_FOUND, "User not found");
    }
    throw error;
  }
});
