import { asyncHandler } from "../../middleware/error-handler";
import {
  createSuccessResponse,
  createErrorResponse,
  ErrorCodes,
} from "../../utils/response";
import SettingsRepository from "../../repositories/settings.repository";
import { getCurrentUser } from "../../utils/auth";
import { setResponseStatus, readBody } from "h3";

export default asyncHandler(async (event) => {
  // Get current user (JWT in SQL mode, pb_auth cookie in PocketBase mode)
  const currentUser = await getCurrentUser(event);

  if (!currentUser) {
    setResponseStatus(event, 401);
    return createErrorResponse(
      ErrorCodes.UNAUTHORIZED,
      "Missing or invalid authentication token",
    );
  }

  // Check if user is admin
  if (currentUser.role !== "admin") {
    setResponseStatus(event, 403);
    return createErrorResponse(ErrorCodes.FORBIDDEN, "Admin access required");
  }

  const body = await readBody(event);
  if (!body || typeof body !== "object") {
    return createErrorResponse(
      ErrorCodes.VALIDATION_ERROR,
      "Invalid settings data",
    );
  }

  await SettingsRepository.updateMultiple(body);

  return createSuccessResponse({
    message: "Settings updated successfully",
  });
});
