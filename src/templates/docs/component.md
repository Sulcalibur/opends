# {{componentName}}

{{description}}

**Category:** {{category}} | **Generated:** {{generatedAt}}

## Props

{{#if props}}
| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
{{#each props}}| `{{name}}` | `{{type}}` | {{default}} | {{required}} | {{description}} |
{{/each}}
{{else}}
No props defined for this component.
{{/if}}

## Events

{{#if events}}
| Name | Description |
|------|-------------|
{{#each events}}| `{{name}}` | {{description}} |
{{/each}}
{{else}}
No events defined for this component.
{{/if}}

## Slots

{{#if slots}}
| Name | Description |
|------|-------------|
{{#each slots}}| `{{name}}` | {{description}} |
{{/each}}
{{else}}
No slots defined for this component.
{{/if}}

## Usage

```javascript
import {{componentNamePascal}} from '@/components/{{componentNamePascal}}'
```

```vue
<template>
  <{{componentNameKebab}}
    {{#each props}}
    {{#if default}}
    :{{name}}="{{default}}"
    {{/if}}
    {{/each}}
  >
    <!-- Component content -->
  </{{componentNameKebab}}>
</template>
```

{{#if usage}}
### Usage Guidelines

{{usage}}
{{/if}}

{{#if notes}}
## Notes

{{notes}}
{{/if}}

{{#if includePlayground}}
## Interactive Playground

<ComponentPlayground component="{{componentName}}" frameworks="{{frameworks}}" />
{{/if}}

---
*Auto-generated from component specification. Last updated: {{generatedAt}}*