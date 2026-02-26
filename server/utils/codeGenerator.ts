import type { Component } from "../../src/types/component";

export async function generateCode(
  spec: Record<string, unknown>,
  framework: "vue" | "react" | "svelte",
  _variant?: string,
): Promise<string> {
  // Simple code generation - in real implementation this would be more sophisticated
  switch (framework) {
    case "vue":
      return generateVueCode(spec);
    case "react":
      return generateReactCode(spec);
    case "svelte":
      return generateSvelteCode(spec);
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

function generateVueCode(spec: Record<string, unknown>, _variant?: string): string {
  // Basic Vue component generation
  return `<template>
  <div class="${spec.className || "component"}">
    ${spec.content || "Component content"}
  </div>
</template>

<script setup lang="ts">
${generateScript(spec, "vue")}
</script>

<style scoped>
${generateStyle(spec)}
</style>`;
}

function generateReactCode(spec: Record<string, unknown>, _variant?: string): string {
  // Basic React component generation
  return `import React from 'react'

const ${spec.name || "Component"} = (props) => {
  ${generateScript(spec, "react")}
  
  return (
    <div className={\`\${props.className || 'component'}\`}>
      {props.children}
    </div>
  )
}

export default ${spec.name || "Component"}
`;
}

function generateSvelteCode(spec: Record<string, unknown>, _variant?: string): string {
  // Basic Svelte component generation
  return `<script lang="ts">
${generateScript(spec, "svelte")}
</script>

<div class="${spec.className || "component"}">
  ${spec.content || "Component content"}
</div>

<style>
${generateStyle(spec)}
</style>`;
}

function generateScript(
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

function generateStyle(spec: Record<string, unknown>): string {
  const styles = (spec.styles as Record<string, unknown>) || {};
  return Object.entries(styles)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
}
