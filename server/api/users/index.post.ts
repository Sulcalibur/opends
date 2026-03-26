/**
 * Create New User
 * POST /api/users
 * Admin only
 */

import { z } from "zod";
import bcrypt from "bcryptjs";
import { getRequestHeader, setResponseStatus, readBody } from "h3";
import { asyncHandler } from "../../middleware/error-handler";
import {
  createSuccessResponse,
  ErrorCodes,
  createErrorResponse,
} from "../../utils/response";
import UserRepository from "../../repositories/user.repository";
import JwtService from "../../services/jwt.service";
import {
  userRoleSchema,
  emailSchema,
  passwordSchema,
} from "../../utils/validation";

const createUserSchema = z.object({
  email: emailSchema,
  name: z.string().min(1, "Name is required").max(100),
  password: passwordSchema,
  role: userRoleSchema.default("viewer"),
});

export default asyncHandler(async (event) => {
  // Verify admin authentication
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

  if (!payload || payload.role !== "admin") {
    setResponseStatus(event, 403);
    return createErrorResponse(ErrorCodes.FORBIDDEN, "Admin access required");
  }

  // Validate request body
  const body = await readBody(event);
  const data = createUserSchema.parse(body);

  // Hash password
  const passwordHash = await bcrypt.hash(data.password, 10);

  try {
    // Create user
    const user = await UserRepository.create({
      email: data.email,
      name: data.name,
      password_hash: passwordHash,
      role: data.role,
    });

    // Remove sensitive data from response
    const { password_hash, ...safeUser } = user;

    setResponseStatus(event, 201);
    return createSuccessResponse({ user: safeUser });
  } catch (error: unknown) {
    if (error instanceof Error && error.message?.includes("already exists")) {
      setResponseStatus(event, 409);
      return createErrorResponse(
        ErrorCodes.DUPLICATE_ENTRY,
        "Email already exists",
      );
    }
    throw error;
  }
});
