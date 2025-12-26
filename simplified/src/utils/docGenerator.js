/**
 * Documentation Generator
 * Automatically generates interactive component documentation
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Template cache
const docTemplates = new Map()

// Load documentation template
async function loadDocTemplate(type) {
  const cacheKey = `doc-${type}`
  if (docTemplates.has(cacheKey)) {
    return docTemplates.get(cacheKey)
  }

  const templatePath = path.join(__dirname, '..', 'templates', 'docs', `${type}.md`)
  try {
    const template = await fs.readFile(templatePath, 'utf8')
    docTemplates.set(cacheKey, template)
    return template
  } catch (error) {
    throw new Error(`Documentation template not found: docs/${type}`)
  }
}

// Generate component documentation
export async function generateComponentDocs(component, options = {}) {
  const {
    includePlayground = true,
    includeExamples = true,
    frameworks = ['vue', 'react', 'svelte']
  } = options

  // Load component doc template
  const template = await loadDocTemplate('component')

  // Prepare template data
  const templateData = {
    componentName: component.name,
    componentNamePascal: toPascalCase(component.name),
    componentNameKebab: toKebabCase(component.name),
    description: component.description || 'A design system component.',
    category: component.category || 'general',

    // Props table data
    props: (component.props || []).map(prop => ({
      name: prop.name,
      type: prop.type || 'string',
      default: prop.default !== undefined ? JSON.stringify(prop.default) : '-',
      required: prop.required ? 'Yes' : 'No',
      description: prop.description || ''
    })),

    // Events table data
    events: (component.events || []).map(event => ({
      name: event.name,
      description: event.description || ''
    })),

    // Slots table data
    slots: (component.slots || []).map(slot => ({
      name: slot.name,
      description: slot.description || ''
    })),

    // Usage examples
    usage: component.usage || 'Import and use this component in your application.',

    // Notes
    notes: (component.notes || []).join('\n'),

    // Playground options
    includePlayground,
    includeExamples,
    frameworks: frameworks.join(', '),

    // Metadata
    generatedAt: new Date().toISOString(),
    componentId: component.id
  }

  return renderTemplate(template, templateData)
}

// Generate index page for all components
export async function generateIndexPage(components, options = {}) {
  const template = await loadDocTemplate('index')

  // Group components by category
  const categories = {}
  components.forEach(comp => {
    const category = comp.category || 'general'
    if (!categories[category]) {
      categories[category] = []
    }
    categories[category].push(comp)
  })

  const categoryList = Object.entries(categories).map(([name, comps]) => ({
    name,
    displayName: toTitleCase(name),
    count: comps.length,
    components: comps.map(c => ({
      name: c.name,
      description: c.description || 'A design system component'
    }))
  }))

  const templateData = {
    categories: categoryList,
    totalComponents: components.length,
    generatedAt: new Date().toISOString()
  }

  return renderTemplate(template, templateData)
}

// Generate search index for components
export function generateSearchIndex(components) {
  return components.map(comp => ({
    id: comp.id,
    name: comp.name,
    description: comp.description || '',
    category: comp.category || 'general',
    props: (comp.props || []).map(p => p.name),
    events: (comp.events || []).map(e => e.name),
    tags: [comp.category, ...(comp.props || []).map(p => p.type)].filter(Boolean)
  }))
}

// Simple template engine
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

function toTitleCase(str) {
  return str
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}