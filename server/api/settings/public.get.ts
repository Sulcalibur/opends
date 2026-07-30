import { asyncHandler } from "../../middleware/error-handler";
import { createSuccessResponse } from "../../utils/response";

export default asyncHandler(async () => {
  // In PocketBase mode, SQLite is unavailable — return empty settings gracefully
  try {
    const SettingsRepository = (await import("../../repositories/settings.repository")).default;
    const publicSettings = await SettingsRepository.getPublic();
    return createSuccessResponse({ settings: publicSettings });
  } catch {
    return createSuccessResponse({ settings: {} });
  }
});
