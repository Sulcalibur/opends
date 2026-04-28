/**
 * Generate Component Code
 * POST /api/components/:id/generate
 */

import { z } from "zod";
import { getValidatedRouterParams, readBody } from "h3";
import { asyncHandler } from "../../../middleware/error-handler";
import {
  createSuccessResponse,
  ErrorCodes,
  createErrorResponse,
} from "../../../utils/response";
import ComponentRepository from "../../../repositories/component.repository";
import {
  generateComponentCodeService,
  generateUsageExampleService,
} from "../../../services/codeGenerator.service";

const paramsSchema = z.object({
  id: z.string().uuid("Invalid component ID format"),
});

const bodySchema = z.object({
  framework: z.enum(["vue", "react", "svelte"]).default("vue"),
  variant: z.string().optional(),
});

export default asyncHandler(async (event) => {
  // Validate parameters
  const params = await getValidatedRouterParams(event, paramsSchema.parse);
  const body = await readBody(event);
  const { framework, variant } = bodySchema.parse(body);

  // Fetch component using instance method
  const component = await ComponentRepository.findById(params.id);

  if (!component) {
    return createErrorResponse(ErrorCodes.NOT_FOUND, "Component not found");
  }

  // Generate code using the service
  const code = await generateComponentCodeService(
    component,
    framework,
    variant,
  );

  return createSuccessResponse({
    code,
    framework,
    componentName: component.name,
    generatedAt: new Date().toISOString(),
  });
});
