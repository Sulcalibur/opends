// Simple storage for OpenDS Vue SPA
// Uses LocalStorage for client-side storage

// Types
export interface DesignToken {
  name: string
  type: 'color' | 'size' | 'spacing' | 'typography' | 'shadow' | 'radius' | 'other'
  value: any
  description?: string
  category?: string
}

export interface ComponentSpec {
  name: string
  description?: string
  props: any[]
  slots?: any[]
  events?: any[]
  examples?: string[]
  usage?: string
  notes?: string[]
}

export interface DesignSystemConfig {
  name: string
  version: string
  description?: string
  syncFrequency?: 'manual' | 'daily' | 'weekly'
}

export interface PenpotExport {
  version: string
  source: 'penpot'
  exportedAt: string
  colors: Array<{
    name: string
    value: string
    type: 'color'
    description?: string
  }>
  components?: Array<{
    name: string
    description?: string
    category?: string
  }>
}

// Storage keys
const TOKENS_KEY = 'opends-tokens'
const COMPONENTS_KEY = 'opends-components'
const CONFIG_KEY = 'opends-config'

class DesignSystemStorage {
  // Token operations
  getTokens(): DesignToken[] {
    try {
      const tokensJson = localStorage.getItem(TOKENS_KEY)
      if (tokensJson) {
        return JSON.parse(tokensJson)
      }
    } catch (error) {
      console.error('Error loading tokens:', error)
    }
    return []
  }

  saveTokens(tokens: DesignToken[]): void {
    try {
      localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens))
    } catch (error) {
      console.error('Error saving tokens:', error)
    }
  }

  addToken(token: DesignToken): void {
    const tokens = this.getTokens()
    tokens.push(token)
    this.saveTokens(tokens)
  }

  // Component operations
  getComponents(): ComponentSpec[] {
    try {
      const componentsJson = localStorage.getItem(COMPONENTS_KEY)
      if (componentsJson) {
        return JSON.parse(componentsJson)
      }
    } catch (error) {
      console.error('Error loading components:', error)
    }
    return []
  }

  saveComponents(components: ComponentSpec[]): void {
    try {
      localStorage.setItem(COMPONENTS_KEY, JSON.stringify(components))
    } catch (error) {
      console.error('Error saving components:', error)
    }
  }

  addComponent(component: ComponentSpec): void {
    const components = this.getComponents()
    components.push(component)
    this.saveComponents(components)
  }

  // Config operations
  getConfig(): DesignSystemConfig {
    try {
      const configJson = localStorage.getItem(CONFIG_KEY)
      if (configJson) {
        return JSON.parse(configJson)
      }
    } catch (error) {
      console.error('Error loading config:', error)
    }
    return {
      name: 'My Design System',
      version: '1.0.0',
      description: 'A design system managed by OpenDS',
      syncFrequency: 'manual'
    }
  }

  saveConfig(config: DesignSystemConfig): void {
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
    } catch (error) {
      console.error('Error saving config:', error)
    }
  }

  // Import from Penpot
  importFromPenpot(penpotData: PenpotExport): { tokens: number, components: number } {
    const importedTokens: DesignToken[] = []
    const importedComponents: ComponentSpec[] = []

    // Import colors as tokens
    if (penpotData.colors) {
      penpotData.colors.forEach(color => {
        importedTokens.push({
          name: color.name,
          value: color.value,
          type: 'color',
          category: 'colors',
          description: color.description
        })
      })
    }

    // Import basic component info
    if (penpotData.components) {
      penpotData.components.forEach(component => {
        importedComponents.push({
          name: component.name,
          description: component.description || '',
          props: [],
          slots: [],
          events: [],
          examples: [],
          usage: '',
          notes: ['Imported from Penpot']
        })
      })
    }

    // Save imported data
    this.saveTokens(importedTokens)
    this.saveComponents(importedComponents)

    return {
      tokens: importedTokens.length,
      components: importedComponents.length
    }
  }

  // Export to JSON
  exportToJSON(): string {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      tokens: this.getTokens(),
      components: this.getComponents(),
      config: this.getConfig()
    }
    return JSON.stringify(data, null, 2)
  }

  // Import from JSON
  importFromJSON(json: string): boolean {
    try {
      const data = JSON.parse(json)
      
      if (data.tokens && Array.isArray(data.tokens)) {
        this.saveTokens(data.tokens)
      }
      
      if (data.components && Array.isArray(data.components)) {
        this.saveComponents(data.components)
      }
      
      if (data.config) {
        this.saveConfig(data.config)
      }
      
      return true
    } catch (error) {
      console.error('Error importing from JSON:', error)
      return false
    }
  }

  // Get stats
  getStats() {
    return {
      tokens: this.getTokens().length,
      components: this.getComponents().length,
      storage: 'local',
      version: '0.2.0'
    }
  }

  // Clear all data
  clearAll(): void {
    localStorage.removeItem(TOKENS_KEY)
    localStorage.removeItem(COMPONENTS_KEY)
    localStorage.removeItem(CONFIG_KEY)
  }
}

// Singleton instance
const designSystemStorage = new DesignSystemStorage()
export default designSystemStorage