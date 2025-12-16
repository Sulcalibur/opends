export interface GenerationContext {
  framework: 'vue' | 'react' | 'svelte'
  designFileId: string
  options?: Record<string, unknown>
}

export interface ComponentGenerator {
  generateComponent(specId: string, ctx: GenerationContext): Promise<{
    files: Array<{ path: string; content: string }>
    warnings?: string[]
  }>
}

