/**
 * Token Engine Service
 * Handles format conversion for design tokens
 */

import DesignTokenRepository, {
  type DesignToken,
} from "../repositories/token.repository";

export type ExportFormat = "json" | "css" | "scss" | "less" | "stylus";

const SUPPORTED_FORMATS: ExportFormat[] = [
  "json",
  "css",
  "scss",
  "less",
  "stylus",
];

/**
 * Flatten nested token values for CSS-like formats
 */
function flattenValue(value: unknown, prefix = ""): Record<string, string> {
  if (value === null || value === undefined) {
    return { [prefix]: "null" };
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return { [prefix]: String(value) };
  }

  if (Array.isArray(value)) {
    return { [prefix]: value.join(", ") };
  }

  if (typeof value === "object") {
    const result: Record<string, string> = {};
    for (const [key, val] of Object.entries(value)) {
      const newKey = prefix ? `${prefix}-${key}` : key;
      Object.assign(result, flattenValue(val, newKey));
    }
    return result;
  }

  return { [prefix]: String(value) };
}

/**
 * Convert tokens to the requested format
 */
export function convertTokensToFormat(
  tokens: DesignToken[],
  format: ExportFormat,
): string {
  if (!SUPPORTED_FORMATS.includes(format)) {
    throw new Error(
      `Unsupported format: ${format}. Supported: ${SUPPORTED_FORMATS.join(", ")}`,
    );
  }

  switch (format) {
    case "json":
      return convertToJson(tokens);
    case "css":
      return convertToCss(tokens);
    case "scss":
      return convertToScss(tokens);
    case "less":
      return convertToLess(tokens);
    case "stylus":
      return convertToStylus(tokens);
  }
}

function convertToJson(tokens: DesignToken[]): string {
  const exported: Record<
    string,
    { value: unknown; category: string; description: string | null }
  > = {};

  for (const token of tokens) {
    exported[token.name] = {
      value: token.value,
      category: token.category,
      description: token.description,
    };
  }

  return JSON.stringify(exported, null, 2);
}

function convertToCss(tokens: DesignToken[]): string {
  const lines: string[] = [":root {"];

  for (const token of tokens) {
    const flat = flattenValue(token.value, `--${token.name}`);
    for (const [key, val] of Object.entries(flat)) {
      lines.push(`  ${key}: ${val};`);
    }
  }

  lines.push("}");
  return lines.join("\n");
}

function convertToScss(tokens: DesignToken[]): string {
  const lines: string[] = [];

  for (const token of tokens) {
    const flat = flattenValue(token.value, `$${token.name}`);
    for (const [key, val] of Object.entries(flat)) {
      lines.push(`${key}: ${val};`);
    }
  }

  return lines.join("\n");
}

function convertToLess(tokens: DesignToken[]): string {
  const lines: string[] = [];

  for (const token of tokens) {
    const flat = flattenValue(token.value, `@${token.name}`);
    for (const [key, val] of Object.entries(flat)) {
      lines.push(`${key}: ${val};`);
    }
  }

  return lines.join("\n");
}

function convertToStylus(tokens: DesignToken[]): string {
  const lines: string[] = [];

  for (const token of tokens) {
    const flat = flattenValue(token.value, `${token.name}`);
    for (const [key, val] of Object.entries(flat)) {
      lines.push(`${key} = ${val}`);
    }
  }

  return lines.join("\n");
}

/**
 * Export all tokens in the requested format
 */
export async function exportTokens(
  format: ExportFormat = "json",
): Promise<string> {
  const tokens = await DesignTokenRepository.findAll();
  return convertTokensToFormat(tokens, format);
}

/**
 * Get supported export formats
 */
export function getSupportedFormats(): ExportFormat[] {
  return [...SUPPORTED_FORMATS];
}
