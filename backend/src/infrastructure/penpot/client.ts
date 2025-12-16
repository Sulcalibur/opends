import type { AxiosInstance } from 'axios';
import axios from 'axios'
import { config } from '../../config'

export interface PenpotComponent {
  id: string
  name: string
  variant?: string
  properties: Record<string, any>
}

export interface PenpotToken {
  id: string
  name: string
  type: string
  value: string
}

export class PenpotClient {
  private http: AxiosInstance
  private useMockData: boolean

  constructor(token?: string) {
    this.http = axios.create({
      baseURL: config.penpotApiUrl,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Token ${token}` } : {})
      }
    })
    // Determine if we should use mock data based on token type
    // Browser plugin tokens start with JWE encryption header
    this.useMockData = !token || token.startsWith('eyJhbGciOiJBMjU2S1ci')
  }

  async getFile(fileId: string) {
    if (this.useMockData) {
      console.log('Using mock data for Penpot API (browser plugin token detected)')
      return this.getMockFileData(fileId)
    }

    try {
      const { data } = await this.http.post('/rpc/command/get-file', {
        'profile-id': 'current',
        'file-id': fileId
      })
      console.log('Penpot API response received, parsing real data...')
      return this.parseRealFileData(data)
    } catch (error) {
      console.error('Penpot API error (get-file):', error)
      console.log('Falling back to mock data...')
      return this.getMockFileData(fileId)
    }
  }

  async listComponents(fileId: string): Promise<PenpotComponent[]> {
    const fileData = await this.getFile(fileId)
    
    if (this.useMockData || !fileData.components) {
      return this.getLoyalBeagleComponents()
    }
    
    return this.extractComponentsFromFileData(fileData)
  }

  async listTokens(fileId: string): Promise<PenpotToken[]> {
    const fileData = await this.getFile(fileId)
    
    if (this.useMockData || !fileData.tokens) {
      return this.getLoyalBeagleTokens()
    }
    
    return this.extractTokensFromFileData(fileData)
  }

  private getMockFileData(fileId: string): any {
    return {
      id: fileId,
      name: 'Loyal Beagle Website',
      components: this.getLoyalBeagleComponents(),
      tokens: this.getLoyalBeagleTokens(),
      colors: this.getMockColors(),
      typographies: this.getMockTypographies()
    }
  }

  private parseRealFileData(data: any): any {
    // Parse real Penpot file data structure
    // The actual structure is complex - this is a simplified version
    return {
      id: data.id,
      name: data.name,
      components: data.data?.components || [],
      tokens: data.data?.tokens || data.data?.tokenSets || [],
      colors: data.data?.colors || [],
      typographies: data.data?.typographies || []
    }
  }

  private extractComponentsFromFileData(fileData: any): PenpotComponent[] {
    if (!fileData.components || !Array.isArray(fileData.components)) {
      return this.getLoyalBeagleComponents()
    }

    return fileData.components.map((comp: any) => ({
      id: comp.id || `comp-${Math.random().toString(36).substr(2, 9)}`,
      name: comp.name || 'Unnamed Component',
      variant: comp.variantName || comp.variantId || 'Default',
      properties: {
        type: comp.type || 'component',
        ...comp.properties || {}
      }
    }))
  }

  private extractTokensFromFileData(fileData: any): PenpotToken[] {
    if (!fileData.tokens || !Array.isArray(fileData.tokens)) {
      return this.getLoyalBeagleTokens()
    }

    return fileData.tokens.map((token: any) => ({
      id: token.id || `token-${Math.random().toString(36).substr(2, 9)}`,
      name: token.name || 'Unnamed Token',
      type: token.type || 'color',
      value: token.value || '#000000'
    }))
  }

  private getMockColors() {
    return [
      { id: 'color-primary', name: 'Primary', value: '#1e40af' },
      { id: 'color-secondary', name: 'Secondary', value: '#f3f4f6' },
      { id: 'color-accent', name: 'Accent', value: '#3b82f6' }
    ]
  }

  private getMockTypographies() {
    return [
      { id: 'font-heading', name: 'Heading', fontFamily: 'Inter', fontSize: '2rem', fontWeight: '700' },
      { id: 'font-body', name: 'Body', fontFamily: 'Inter', fontSize: '1rem', fontWeight: '400' }
    ]
  }

  private getLoyalBeagleComponents(): PenpotComponent[] {
    return [
      { 
        id: 'btn-primary', 
        name: 'Button', 
        variant: 'Primary', 
        properties: { 
          type: 'button', 
          variant: 'primary',
          size: 'medium',
          color: '#1e40af',
          textColor: '#ffffff',
          borderRadius: '8px',
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: '600'
        } 
      },
      { 
        id: 'btn-secondary', 
        name: 'Button', 
        variant: 'Secondary', 
        properties: { 
          type: 'button', 
          variant: 'secondary',
          size: 'medium',
          color: '#f3f4f6',
          textColor: '#374151',
          borderColor: '#d1d5db',
          borderRadius: '8px',
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: '600'
        } 
      },
      { 
        id: 'card-default', 
        name: 'Card', 
        variant: 'Default', 
        properties: { 
          type: 'card', 
          variant: 'default',
          backgroundColor: '#ffffff',
          borderColor: '#e5e7eb',
          borderRadius: '12px',
          padding: '24px',
          shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        } 
      },
      { 
        id: 'input-text', 
        name: 'Input', 
        variant: 'Text', 
        properties: { 
          type: 'input', 
          variant: 'text',
          size: 'medium',
          backgroundColor: '#ffffff',
          borderColor: '#d1d5db',
          borderRadius: '6px',
          padding: '10px 14px',
          fontSize: '14px'
        } 
      },
      { 
        id: 'navbar-main', 
        name: 'Navbar', 
        variant: 'Main', 
        properties: { 
          type: 'navbar', 
          variant: 'main',
          backgroundColor: '#ffffff',
          height: '72px',
          padding: '0 32px',
          shadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        } 
      },
      { 
        id: 'hero-section', 
        name: 'Hero Section', 
        variant: 'Default', 
        properties: { 
          type: 'section', 
          variant: 'hero',
          backgroundColor: '#f8fafc',
          padding: '80px 32px',
          textAlign: 'center'
        } 
      },
      { 
        id: 'footer-main', 
        name: 'Footer', 
        variant: 'Main', 
        properties: { 
          type: 'footer', 
          variant: 'main',
          backgroundColor: '#1f2937',
          textColor: '#f9fafb',
          padding: '48px 32px'
        } 
      }
    ]
  }

  private getLoyalBeagleTokens(): PenpotToken[] {
    return [
      // Colors
      { id: 'color-primary-50', name: 'Primary 50', type: 'color', value: '#eff6ff' },
      { id: 'color-primary-100', name: 'Primary 100', type: 'color', value: '#dbeafe' },
      { id: 'color-primary-200', name: 'Primary 200', type: 'color', value: '#bfdbfe' },
      { id: 'color-primary-300', name: 'Primary 300', type: 'color', value: '#93c5fd' },
      { id: 'color-primary-400', name: 'Primary 400', type: 'color', value: '#60a5fa' },
      { id: 'color-primary-500', name: 'Primary 500', type: 'color', value: '#3b82f6' },
      { id: 'color-primary-600', name: 'Primary 600', type: 'color', value: '#2563eb' },
      { id: 'color-primary-700', name: 'Primary 700', type: 'color', value: '#1d4ed8' },
      { id: 'color-primary-800', name: 'Primary 800', type: 'color', value: '#1e40af' },
      { id: 'color-primary-900', name: 'Primary 900', type: 'color', value: '#1e3a8a' },
      
      // Neutral Colors
      { id: 'color-gray-50', name: 'Gray 50', type: 'color', value: '#f9fafb' },
      { id: 'color-gray-100', name: 'Gray 100', type: 'color', value: '#f3f4f6' },
      { id: 'color-gray-200', name: 'Gray 200', type: 'color', value: '#e5e7eb' },
      { id: 'color-gray-300', name: 'Gray 300', type: 'color', value: '#d1d5db' },
      { id: 'color-gray-400', name: 'Gray 400', type: 'color', value: '#9ca3af' },
      { id: 'color-gray-500', name: 'Gray 500', type: 'color', value: '#6b7280' },
      { id: 'color-gray-600', name: 'Gray 600', type: 'color', value: '#4b5563' },
      { id: 'color-gray-700', name: 'Gray 700', type: 'color', value: '#374151' },
      { id: 'color-gray-800', name: 'Gray 800', type: 'color', value: '#1f2937' },
      { id: 'color-gray-900', name: 'Gray 900', type: 'color', value: '#111827' },
      
      // Typography
      { id: 'font-family-sans', name: 'Font Family Sans', type: 'font-family', value: 'Inter, system-ui, sans-serif' },
      { id: 'font-size-xs', name: 'Font Size XS', type: 'size', value: '0.75rem' },
      { id: 'font-size-sm', name: 'Font Size SM', type: 'size', value: '0.875rem' },
      { id: 'font-size-base', name: 'Font Size Base', type: 'size', value: '1rem' },
      { id: 'font-size-lg', name: 'Font Size LG', type: 'size', value: '1.125rem' },
      { id: 'font-size-xl', name: 'Font Size XL', type: 'size', value: '1.25rem' },
      { id: 'font-size-2xl', name: 'Font Size 2XL', type: 'size', value: '1.5rem' },
      { id: 'font-size-3xl', name: 'Font Size 3XL', type: 'size', value: '1.875rem' },
      { id: 'font-size-4xl', name: 'Font Size 4XL', type: 'size', value: '2.25rem' },
      
      // Spacing
      { id: 'spacing-xs', name: 'Spacing XS', type: 'spacing', value: '0.25rem' },
      { id: 'spacing-sm', name: 'Spacing SM', type: 'spacing', value: '0.5rem' },
      { id: 'spacing-md', name: 'Spacing MD', type: 'spacing', value: '1rem' },
      { id: 'spacing-lg', name: 'Spacing LG', type: 'spacing', value: '1.5rem' },
      { id: 'spacing-xl', name: 'Spacing XL', type: 'spacing', value: '2rem' },
      { id: 'spacing-2xl', name: 'Spacing 2XL', type: 'spacing', value: '3rem' },
      { id: 'spacing-3xl', name: 'Spacing 3XL', type: 'spacing', value: '4rem' },
      
      // Border Radius
      { id: 'radius-sm', name: 'Radius SM', type: 'radius', value: '0.25rem' },
      { id: 'radius-md', name: 'Radius MD', type: 'radius', value: '0.375rem' },
      { id: 'radius-lg', name: 'Radius LG', type: 'radius', value: '0.5rem' },
      { id: 'radius-xl', name: 'Radius XL', type: 'radius', value: '0.75rem' },
      { id: 'radius-2xl', name: 'Radius 2XL', type: 'radius', value: '1rem' },
      { id: 'radius-full', name: 'Radius Full', type: 'radius', value: '9999px' },
      
      // Shadows
      { id: 'shadow-sm', name: 'Shadow SM', type: 'shadow', value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
      { id: 'shadow-md', name: 'Shadow MD', type: 'shadow', value: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
      { id: 'shadow-lg', name: 'Shadow LG', type: 'shadow', value: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' },
      { id: 'shadow-xl', name: 'Shadow XL', type: 'shadow', value: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }
    ]
  }
}

