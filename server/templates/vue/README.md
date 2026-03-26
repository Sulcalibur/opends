# Vue Component Templates

This directory contains Handlebars-style templates for generating Vue 3 components.

## Templates

### `component/base.vue.template`

A simple Vue component with a single default slot. Suitable for basic container components.

### `component/with-props.vue.template`

A Vue component with TypeScript props support. Generates variant classes based on prop values.

### `component/with-slots.vue.template`

A Vue component with named slots support. Suitable for complex components with multiple content areas.

## Usage

These templates are placeholder templates for future use with a templating engine. The current code generation is handled by the `codeGenerator.ts` utility in `server/utils/`.

## Variables

The templates use Handlebars-style placeholders:

- `{{name}}` - Component name (PascalCase)
- `{{kebabCase name}}` - Component name (kebab-case)
- `{{display_name}}` - Human-readable component name
- `{{description}}` - Component description
- `{{#each props}}` - Iterate over props
- `{{typescriptType type}}` - Convert type to TypeScript type
- `{{json default}}` - Convert default value to JSON
