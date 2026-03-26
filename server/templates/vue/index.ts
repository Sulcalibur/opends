/**
 * Vue Template Registry
 * Manages and loads Vue component templates
 */

import { readFile } from "fs/promises";
import { join } from "path";

export type TemplateType = "component" | "composable" | "page" | "layout";

interface TemplateMetadata {
  name: string;
  type: TemplateType;
  description: string;
  tags: string[];
}

const TEMPLATE_DIR = __dirname;

/**
 * Load a template by type and name
 */
export async function loadTemplate(
  type: TemplateType,
  name: string,
): Promise<string> {
  const templatePath = join(TEMPLATE_DIR, type, `${name}.vue.template`);

  try {
    return await readFile(templatePath, "utf-8");
  } catch (error) {
    throw new Error(`Template not found: ${type}/${name}`);
  }
}

/**
 * List available templates of a given type
 */
export async function listTemplates(type: TemplateType): Promise<string[]> {
  // For MVP, return hardcoded list
  // In production, scan directory
  const templates: Record<TemplateType, string[]> = {
    component: ["base", "with-props", "with-slots"],
    composable: ["use[Name]"],
    page: ["default"],
    layout: ["default"],
  };

  return templates[type] || [];
}

/**
 * Get template metadata
 */
export async function getTemplateMetadata(
  type: TemplateType,
  name: string,
): Promise<TemplateMetadata> {
  // For MVP, return basic metadata
  // In production, parse frontmatter from template
  const descriptions: Record<string, string> = {
    base: "Basic Vue component template",
    "with-props": "Component with typed props",
    "with-slots": "Component with named slots",
    "use[Name]": "Vue composable template",
  };

  return {
    name,
    type,
    description: descriptions[name] || "Vue template",
    tags: [type, "vue3", "typescript"],
  };
}
