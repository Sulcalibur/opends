/**
 * Code Generator Service
 * Service layer for framework-specific code generation
 */

import {
  generateComponentCode,
  generateUsageExample,
  type GeneratedCode,
} from "../utils/codeGenerator";
import type { Component } from "../repositories/component.repository";

const SUPPORTED_FRAMEWORKS = ["vue", "react", "svelte"] as const;
export type SupportedFramework = (typeof SUPPORTED_FRAMEWORKS)[number];

/**
 * Validate framework is supported
 */
function validateFramework(framework: string): SupportedFramework {
  if (!SUPPORTED_FRAMEWORKS.includes(framework as SupportedFramework)) {
    throw new Error(
      `Unsupported framework: ${framework}. Supported: ${SUPPORTED_FRAMEWORKS.join(", ")}`,
    );
  }
  return framework as SupportedFramework;
}

/**
 * Generate component code for specified framework
 */
export async function generateComponentCodeService(
  component: Component,
  framework: string,
  variant?: string,
): Promise<string> {
  const validFramework = validateFramework(framework);
  return generateComponentCode(component, validFramework, variant);
}

/**
 * Generate usage example for specified framework
 */
export async function generateUsageExampleService(
  name: string,
  framework: string,
): Promise<string> {
  const validFramework = validateFramework(framework);
  return generateUsageExample(name, validFramework);
}

/**
 * Get list of supported frameworks
 */
export function getSupportedFrameworks(): string[] {
  return [...SUPPORTED_FRAMEWORKS];
}
