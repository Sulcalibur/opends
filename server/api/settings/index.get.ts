import { asyncHandler } from "../../middleware/error-handler";
import {
  createSuccessResponse,
  createErrorResponse,
  ErrorCodes,
} from "../../utils/response";
import SettingsRepository from "../../repositories/settings.repository";
import JwtService from "../../services/jwt.service";
import { getRequestHeader, setResponseStatus } from "h3";

export default asyncHandler(async (event) => {
  // Get user from JWT
  const authHeader = getRequestHeader(event, "authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    setResponseStatus(event, 401);
    return createErrorResponse(
      ErrorCodes.UNAUTHORIZED,
      "Missing authentication token",
    );
  }

  const token = authHeader.substring(7);
  const payload = JwtService.verify(token);

  if (!payload) {
    setResponseStatus(event, 401);
    return createErrorResponse(ErrorCodes.UNAUTHORIZED, "Invalid token");
  }

  // Check if user is admin
  if (payload.role !== "admin") {
    setResponseStatus(event, 403);
    return createErrorResponse(ErrorCodes.FORBIDDEN, "Admin access required");
  }

  const settings = await SettingsRepository.getAll();

  // Transform to a cleaner object for the frontend
  const settingsMap: Record<string, unknown> = {};
  settings.forEach((s) => {
    settingsMap[s.key] = s.value;
  });

  return createSuccessResponse({
    settings: settingsMap,
  });
});
