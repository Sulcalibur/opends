/**
 * Component Preview Engine
 * Dynamically renders components based on their specifications
 */

import { defineAsyncComponent, h } from 'vue'

// Component registry for known components
const componentRegistry = {
  // Built-in components
  'button': defineAsyncComponent(() => import('./components/Button.vue')),
  'input': defineAsyncComponent(() => import('./components/Input.vue')),
  'card': defineAsyncComponent(() => import('./components/Card.vue')),
  'icon': defineAsyncComponent(() => import('./components/Icon.vue')),
  // Add more as needed
}

/**
 * Render a component based on its specification
 */
export function renderComponent(spec, props = {}, slots = {}) {
  if (!spec || !spec.type) {
    return h('div', { class: 'error' }, 'Invalid component specification')
  }

  // Check if we have a registered component for this type
  if (componentRegistry[spec.type]) {
    const Component = componentRegistry[spec.type]
    return h(Component, props, slots)
  }

  // Fallback to generic component renderer
  return renderGenericComponent(spec, props, slots)
}

/**
 * Render a generic component based on specification
 */
function renderGenericComponent(spec, props = {}, slots = {}) {
  const {
    type,
    framework = 'vue',
    props: specProps = [],
    styles = {},
    attributes = {}
  } = spec

  // For now, create a basic HTML element representation
  // This can be enhanced to support more complex component types

  let tag = 'div'
  let className = `component-${type}`
  let style = {}

  // Apply framework-specific rendering
  if (framework === 'vue') {
    // Vue-specific rendering logic
    tag = getHtmlTagForType(type)
    style = styles
  }

  // Merge props with spec-defined attributes
  const finalProps = {
    ...attributes,
    class: className,
    style,
    ...props
  }

  // Handle slots/content
  let children = slots.default || []

  // If spec has text content, add it
  if (spec.content) {
    children = spec.content
  }

  // If spec has children components, render them recursively
  if (spec.children && Array.isArray(spec.children)) {
    children = spec.children.map(childSpec =>
      renderComponent(childSpec, {}, {})
    )
  }

  return h(tag, finalProps, children)
}

/**
 * Get appropriate HTML tag for component type
 */
function getHtmlTagForType(type) {
  const tagMap = {
    button: 'button',
    input: 'input',
    textarea: 'textarea',
    select: 'select',
    form: 'form',
    link: 'a',
    image: 'img',
    heading: 'h1',
    text: 'span',
    paragraph: 'p',
    list: 'ul',
    item: 'li',
    container: 'div',
    section: 'section',
    header: 'header',
    footer: 'footer',
    nav: 'nav',
    aside: 'aside',
    main: 'main'
  }

  return tagMap[type] || 'div'
}

/**
 * Validate component props against specification
 */
export function validateComponentProps(spec, props) {
  if (!spec || !spec.props) return { valid: true, errors: [] }

  const errors = []
  const specProps = spec.props

  // Check required props
  specProps.forEach(specProp => {
    if (specProp.required && !(specProp.name in props)) {
      errors.push(`Missing required prop: ${specProp.name}`)
    }
  })

  // Validate prop types and values
  Object.entries(props).forEach(([propName, propValue]) => {
    const specProp = specProps.find(p => p.name === propName)
    if (specProp) {
      // Type validation (basic)
      if (specProp.type && typeof propValue !== specProp.type) {
        errors.push(`Invalid type for prop ${propName}: expected ${specProp.type}, got ${typeof propValue}`)
      }

      // Options validation
      if (specProp.options && !specProp.options.includes(propValue)) {
        errors.push(`Invalid value for prop ${propName}: must be one of ${specProp.options.join(', ')}`)
      }
    } else {
      errors.push(`Unknown prop: ${propName}`)
    }
  })

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Generate preview props from component specification
 */
export function generatePreviewProps(spec, variantName = null) {
  if (!spec || !spec.props) return {}

  const props = {}

  spec.props.forEach(specProp => {
    // Use default value if available
    if (specProp.default !== undefined) {
      props[specProp.name] = specProp.default
    }
    // For required props without defaults, provide reasonable examples
    else if (specProp.required) {
      props[specProp.name] = getExampleValueForProp(specProp)
    }
  })

  // Apply variant overrides if specified
  if (variantName && spec.variants) {
    const variant = spec.variants.find(v => v.name === variantName)
    if (variant && variant.props) {
      Object.assign(props, variant.props)
    }
  }

  return props
}

/**
 * Get example value for a prop based on its type
 */
function getExampleValueForProp(specProp) {
  const { type, name } = specProp

  switch (type) {
    case 'string':
      if (name.toLowerCase().includes('label') || name.toLowerCase().includes('text')) {
        return 'Example Text'
      }
      if (name.toLowerCase().includes('color')) {
        return '#3b82f6'
      }
      return 'example'
    case 'number':
      return name.toLowerCase().includes('size') ? 16 : 1
    case 'boolean':
      return name.toLowerCase().includes('disabled') ? false : true
    case 'array':
      return []
    case 'object':
      return {}
    default:
      return null
  }
}

/**
 * Check component accessibility
 */
export function checkComponentAccessibility(spec, props = {}) {
  const issues = []

  // Basic accessibility checks based on component type
  switch (spec.type) {
    case 'button':
      if (!props['aria-label'] && !props.label && !props.children) {
        issues.push({
          type: 'error',
          message: 'Buttons must have accessible text content, label prop, or aria-label attribute'
        })
      }
      if (!props.type || props.type === 'submit') {
        // Allow submit buttons without explicit type
      } else if (!['button', 'submit', 'reset'].includes(props.type)) {
        issues.push({
          type: 'warning',
          message: 'Button type should be one of: button, submit, reset'
        })
      }
      break

    case 'input':
      if (!props.id) {
        issues.push({
          type: 'warning',
          message: 'Inputs should have an id for label association'
        })
      }
      if (!props.type) {
        issues.push({
          type: 'warning',
          message: 'Input type should be specified for proper keyboard interaction'
        })
      }
      if ((props.type === 'email' || props.type === 'tel' || props.type === 'url') && !props.pattern) {
        issues.push({
          type: 'info',
          message: 'Consider adding input validation pattern for better UX'
        })
      }
      break

    case 'textarea':
      if (!props.id) {
        issues.push({
          type: 'warning',
          message: 'Textareas should have an id for label association'
        })
      }
      if (!props.rows || props.rows < 1) {
        issues.push({
          type: 'warning',
          message: 'Textarea should have a valid number of rows'
        })
      }
      break

    case 'select':
      if (!props.id) {
        issues.push({
          type: 'warning',
          message: 'Select elements should have an id for label association'
        })
      }
      break

    case 'link':
    case 'a':
      if (!props.href) {
        issues.push({
          type: 'error',
          message: 'Links must have an href attribute'
        })
      }
      if (!props.children && !props['aria-label']) {
        issues.push({
          type: 'error',
          message: 'Links must have text content or aria-label'
        })
      }
      break

    case 'image':
    case 'img':
      if (!props.alt && !props['aria-label'] && !props['aria-hidden']) {
        issues.push({
          type: 'error',
          message: 'Images must have alt text, aria-label, or be marked as decorative'
        })
      }
      break
  }

  // General accessibility checks
  if (props.disabled && !props['aria-disabled']) {
    issues.push({
      type: 'warning',
      message: 'Disabled elements should have aria-disabled="true"'
    })
  }

  if (props.hidden && !props['aria-hidden']) {
    issues.push({
      type: 'warning',
      message: 'Hidden elements should use aria-hidden or CSS visibility techniques'
    })
  }

  // Check for proper heading hierarchy (if this is a heading)
  if (spec.type && spec.type.startsWith('h') && spec.type.length === 2) {
    const level = parseInt(spec.type.substring(1))
    if (level < 1 || level > 6) {
      issues.push({
        type: 'error',
        message: 'Heading level must be between 1 and 6'
      })
    }
  }

  // Color contrast would require runtime analysis of computed styles
  // For now, we'll skip this as it requires DOM access

  // Calculate overall score
  const errors = issues.filter(i => i.type === 'error').length
  const warnings = issues.filter(i => i.type === 'warning').length

  let score = 'good'
  if (errors > 0) {
    score = 'poor'
  } else if (warnings > 0) {
    score = 'needs-improvement'
  }

  return {
    score,
    issues,
    summary: {
      total: issues.length,
      errors,
      warnings,
      info: issues.filter(i => i.type === 'info').length
    }
  }
}