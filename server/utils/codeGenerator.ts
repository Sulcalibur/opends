/**
 * Code Generator Utility
 * Generates framework-specific code from component definitions
 */

import type { Component } from "../repositories/component.repository";

export interface GeneratedCode {
  code: string;
  language: string;
  filename: string;
}

/**
 * Generate component code for specified framework
 */
export async function generateComponentCode(
  component: Component,
  framework: "vue" | "react" | "svelte",
  _variant?: string,
): Promise<string> {
  switch (framework) {
    case "vue":
      return generateVueCode(component);
    case "react":
      return generateReactCode(component);
    case "svelte":
      return generateSvelteCode(component);
    default:
      throw new Error(`Unsupported framework: ${framework}`);
  }
}

/**
 * Generate Vue 3 SFC
 */
function generateVueCode(component: Component): string {
  const spec = (component.spec as Record<string, unknown>) || {};
  const props =
    (spec.props as Array<{
      name: string;
      type?: string;
      required?: boolean;
      default?: unknown;
    }>) || [];
  const slots = (spec.slots as Array<{ name: string }>) || [];
  const events =
    (spec.events as Array<{
      name: string;
      payload?: string;
    }>) || [];

  const hasProps = props.length > 0;
  const hasSlots = slots.length > 0;
  const hasEvents = events.length > 0;

  // Generate props interface
  const propsInterface = hasProps
    ? `interface Props {
${props
  .map((p) => {
    const optional = !p.required ? "?" : "";
    const type = mapTypeToTypeScript(p.type);
    return `  ${p.name}${optional}: ${type}`;
  })
  .join("\n")}
}`
    : "";

  // Generate defineProps
  const definePropsCode = hasProps
    ? `const props = withDefaults(defineProps<Props>(), {
${props
  .filter((p) => p.default !== undefined)
  .map((p) => `  ${p.name}: ${formatDefaultValue(p.default, p.type)}`)
  .join(",\n")}
})`
    : "";

  // Generate emits
  const emitsCode = hasEvents
    ? `const emit = defineEmits<{
${events.map((e) => `  ${e.name}: [${e.payload || "void"}]`).join("\n")}
}>`
    : "";

  // Generate template
  const slotContent = hasSlots
    ? slots.map((s) => `<slot name="${s.name}" />`).join("\n  ")
    : "<slot />";

  const clickHandler =
    hasEvents && events.some((e) => e.name === "click")
      ? ' @click="handleClick"'
      : "";

  const template = `<template>
  <button class="${component.name.toLowerCase()}"${clickHandler}>
    ${slotContent}
  </button>
</template>`;

  // Generate script handlers
  const handlersCode = hasEvents
    ? events
        .map((e) => {
          if (e.name === "click") {
            return `function handleClick(event: MouseEvent) {
  emit('click', event)
}`;
          }
          return `function handle${capitalize(e.name)}(payload: ${e.payload || "unknown"}) {
  emit('${e.name}', payload)
}`;
        })
        .join("\n\n")
    : "";

  // Combine
  const scriptParts = [
    propsInterface,
    definePropsCode,
    emitsCode,
    handlersCode,
  ].filter(Boolean);

  const script =
    scriptParts.length > 0
      ? `<script setup lang="ts">
${scriptParts.join("\n\n")}
</script>`
      : `<script setup lang="ts">
// Component: ${component.display_name || component.name}
</script>`;

  const style = `<style scoped>
.${component.name.toLowerCase()} {
  /* Add your styles here */
}
</style>`;

  return `${template}

${script}

${style}`;
}

/**
 * Generate React component
 */
function generateReactCode(component: Component): string {
  const spec = (component.spec as Record<string, unknown>) || {};
  const props =
    (spec.props as Array<{
      name: string;
      type?: string;
      required?: boolean;
      default?: unknown;
    }>) || [];
  const events =
    (spec.events as Array<{
      name: string;
      payload?: string;
    }>) || [];

  const hasProps = props.length > 0;

  // Generate props interface
  const propsInterface = hasProps
    ? `interface ${component.name}Props {
${props
  .map((p) => {
    const optional = !p.required ? "?" : "";
    const type = mapTypeToTypeScript(p.type);
    return `  ${p.name}${optional}: ${type}`;
  })
  .join("\n")}
  children?: React.ReactNode
}`
    : `interface ${component.name}Props {
  children?: React.ReactNode
}`;

  // Generate component
  const propsDestructuring = hasProps
    ? `{ ${props.map((p) => p.name).join(", ")}, children }`
    : "{ children }";

  const eventHandlers = events
    .map((e) => {
      const handlerName = `on${capitalize(e.name)}`;
      return `  const ${handlerName} = (payload: ${e.payload || "void"}) => {
    // Handle ${e.name} event
  }`;
    })
    .join("\n");

  return `import React from 'react'

${propsInterface}

export const ${component.name}: React.FC<${component.name}Props> = (${propsDestructuring}) => {
${eventHandlers}

  return (
    <button className="${component.name.toLowerCase()}">
      {children}
    </button>
  )
}`;
}

/**
 * Generate Svelte component
 */
function generateSvelteCode(component: Component): string {
  const spec = (component.spec as Record<string, unknown>) || {};
  const props =
    (spec.props as Array<{
      name: string;
      type?: string;
      required?: boolean;
      default?: unknown;
    }>) || [];

  const hasProps = props.length > 0;

  // Generate script
  const scriptExports = hasProps
    ? props
        .map((p) => {
          const defaultValue =
            p.default !== undefined
              ? ` = ${formatDefaultValue(p.default, p.type)}`
              : "";
          return `  export let ${p.name}${defaultValue}`;
        })
        .join("\n")
    : "";

  const script = `<script lang="ts">
${scriptExports}
</script>`;

  // Generate template
  const template = `<button class="${component.name.toLowerCase()}">
  <slot />
</button>`;

  // Generate style
  const style = `<style>
  .${component.name.toLowerCase()} {
    /* Add your styles here */
  }
</style>`;

  return `${script}

${template}

${style}`;
}

/**
 * Map simple type to TypeScript type
 */
function mapTypeToTypeScript(type?: string): string {
  const typeMap: Record<string, string> = {
    string: "string",
    number: "number",
    boolean: "boolean",
    array: "unknown[]",
    object: "Record<string, unknown>",
    function: "(...args: unknown[]) => unknown",
  };
  return typeMap[type || "string"] || "unknown";
}

/**
 * Format default value for code
 */
function formatDefaultValue(value: unknown, type?: string): string {
  if (value === undefined) return "undefined";
  if (value === null) return "null";
  if (typeof value === "string") return `'${value}'`;
  if (typeof value === "boolean") return String(value);
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) return "[]";
  if (typeof value === "object") return "{}";
  return String(value);
}

/**
 * Capitalize first letter
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Keep existing functions for backward compatibility
export async function generateCode(
  spec: Record<string, unknown>,
  framework: "vue" | "react" | "svelte",
  _variant?: string,
): Promise<string> {
  // Simple code generation - in real implementation this would be more sophisticated
  switch (framework) {
    case "vue":
      return generateVueCodeSimple(spec);
    case "react":
      return generateReactCodeSimple(spec);
    case "svelte":
      return generateSvelteCodeSimple(spec);
    default:
      throw new Error(`Unsupported framework: ${framework}`);
  }
}

export async function generateUsageExample(
  name: string,
  framework: "vue" | "react" | "svelte",
): Promise<string> {
  switch (framework) {
    case "vue":
      return `<${name} />`;
    case "react":
      return `import { ${name} } from './components'`;
    case "svelte":
      return `<${name} />`;
    default:
      throw new Error(`Unsupported framework: ${framework}`);
  }
}

function generateVueCodeSimple(
  spec: Record<string, unknown>,
  _variant?: string,
): string {
  // Basic Vue component generation
  return `<template>
  <div class="${spec.className || "component"}">
    ${spec.content || "Component content"}
  </div>
</template>

<script setup lang="ts">
${generateScriptSimple(spec, "vue")}
</script>

<style scoped>
${generateStyleSimple(spec)}
</style>`;
}

function generateReactCodeSimple(
  spec: Record<string, unknown>,
  _variant?: string,
): string {
  // Basic React component generation
  return `import React from 'react'

const ${spec.name || "Component"} = (props) => {
  ${generateScriptSimple(spec, "react")}
  
  return (
    <div className={\`\${props.className || 'component'}\`}>
      {props.children}
    </div>
  )
}

export default ${spec.name || "Component"}
`;
}

function generateSvelteCodeSimple(
  spec: Record<string, unknown>,
  _variant?: string,
): string {
  // Basic Svelte component generation
  return `<script lang="ts">
${generateScriptSimple(spec, "svelte")}
</script>

<div class="${spec.className || "component"}">
  ${spec.content || "Component content"}
</div>

<style>
${generateStyleSimple(spec)}
</style>`;
}

function generateScriptSimple(
  spec: Record<string, unknown>,
  framework: "vue" | "react" | "svelte",
): string {
  const props = (spec.props as Record<string, unknown>) || {};
  const propsInterface = Object.keys(props)
    .map(
      (key) => `${key}: ${typeof props[key] === "object" ? "any" : props[key]}`,
    )
    .join("\n  ");

  return `${framework === "vue" ? "" : "// Component props interface\n" + propsInterface + "\n\n"}export default {
  ${Object.entries(spec)
    .map(([key, value]) =>
      typeof value === "object"
        ? `${key}: ${JSON.stringify(value)}`
        : `${key}: ${value}`,
    )
    .join(",\n  ")}
}`;
}

function generateStyleSimple(spec: Record<string, unknown>): string {
  const styles = (spec.styles as Record<string, unknown>) || {};
  return Object.entries(styles)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
}
