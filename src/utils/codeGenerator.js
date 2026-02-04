/**
 * Code Generation Framework
 * Generates Vue, React, and Svelte components from design system data
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Template cache
const templates = new Map()

// Load template from file system
async function loadTemplate(framework, type) {
  const cacheKey = `${framework}-${type}`
  if (templates.has(cacheKey)) {
    return templates.get(cacheKey)
  }

  const templatePath = path.join(__dirname, '..', 'templates', framework, `${type}.hbs`)
  try {
    const template = await fs.readFile(templatePath, 'utf8')
    templates.set(cacheKey, template)
    return template
  } catch {
    throw new Error(`Template not found: ${framework}/${type}`)
  }
}

// Simple template engine (Handlebars-like)
function renderTemplate(template, data) {
  let result = template

  // Replace {{variable}} with data.variable
  result = result.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] || ''
  })

  // Handle {{#each items}}{{/each}} loops
  result = result.replace(/\{\{#each (\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, arrayName, content) => {
    const array = data[arrayName] || []
    return array.map(item => {
      let itemContent = content
      // Replace {{this}} with item value, or {{property}} with item.property
      itemContent = itemContent.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return key === 'this' ? item : item[key] || ''
      })
      return itemContent
    }).join('')
  })

  // Handle {{#if condition}}{{/if}} blocks
  result = result.replace(/\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, condition, content) => {
    return data[condition] ? content : ''
  })

  return result
}

// Generate component code for a specific framework
export async function generateComponentCode(component, framework = 'vue', options = {}) {
  const {
    styling = 'tailwind', // 'tailwind', 'css-modules', 'styled-components'
    typescript = false,
    includeStyles = true
  } = options

  // Load component template
  const template = await loadTemplate(framework, 'component')

  // Prepare template data
  const templateData = {
    componentName: component.name,
    componentNamePascal: toPascalCase(component.name),
    componentNameKebab: toKebabCase(component.name),
    description: component.description || '',
    category: component.category || 'other',

    // Props
    props: (component.props || []).map(prop => ({
      name: prop.name,
      type: prop.type || 'string',
      default: prop.default || null,
      required: prop.required || false,
      description: prop.description || ''
    })),

    // Events
    events: (component.events || []).map(event => ({
      name: event.name,
      description: event.description || ''
    })),

    // Slots
    slots: (component.slots || []).map(slot => ({
      name: slot.name,
      description: slot.description || ''
    })),

    // Styling options
    styling,
    typescript: typescript ? 'ts' : 'js',
    includeStyles,

    // Framework-specific
    framework,
    isVue: framework === 'vue',
    isReact: framework === 'react',
    isSvelte: framework === 'svelte'
  }

  return renderTemplate(template, templateData)
}

// Generate component index file
export async function generateIndexFile(components, framework = 'vue') {
  const template = await loadTemplate(framework, 'index')

  const templateData = {
    components: components.map(comp => ({
      name: comp.name,
      componentName: toPascalCase(comp.name),
      componentNameKebab: toKebabCase(comp.name)
    })),
    framework
  }

  return renderTemplate(template, templateData)
}

// Generate style utilities
export async function generateStyleUtils(tokens, framework = 'vue') {
  const template = await loadTemplate(framework, 'styles')

  // Group tokens by category
  const colorTokens = tokens.filter(t => t.category === 'color')
  const spacingTokens = tokens.filter(t => t.category === 'spacing')
  const typographyTokens = tokens.filter(t => t.category === 'typography')
  const borderRadiusTokens = tokens.filter(t => t.category === 'borderRadius')

  const templateData = {
    colorTokens: colorTokens.map(t => ({
      name: toCamelCase(t.name.split('/').pop()),
      cssName: toKebabCase(t.name.split('/').pop()),
      value: t.value
    })),
    spacingTokens: spacingTokens.map(t => ({
      name: toCamelCase(t.name.split('/').pop()),
      cssName: toKebabCase(t.name.split('/').pop()),
      value: t.value
    })),
    typographyTokens: typographyTokens.map(t => ({
      name: toCamelCase(t.name.split('/').pop()),
      cssName: toKebabCase(t.name.split('/').pop()),
      value: t.value
    })),
    borderRadiusTokens: borderRadiusTokens.map(t => ({
      name: toCamelCase(t.name.split('/').pop()),
      cssName: toKebabCase(t.name.split('/').pop()),
      value: t.value
    })),
    framework
  }

  return renderTemplate(template, templateData)
}

// Utility functions
function toPascalCase(str) {
  return str
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}

function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

function toCamelCase(str) {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
}