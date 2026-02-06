import { asyncHandler } from "../../middleware/error-handler";
import { createSuccessResponse } from "../../utils/response";
import SettingsRepository from "../../repositories/settings.repository";

export default asyncHandler(async () => {
  const publicSettings = await SettingsRepository.getPublic();

  return createSuccessResponse({
    settings: publicSettings,
  });
});
