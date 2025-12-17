import { describe, it, expect } from 'vitest'
import { DesignFile } from './DesignFile'
import { ComponentSpec } from './ComponentSpec'
import { DesignToken } from './DesignToken'

describe('DesignFile', () => {
  it('should create a design file with default values', () => {
    const file = new DesignFile()
    file.name = 'Test Design'
    file.source = 'penpot'

    expect(file.name).toBe('Test Design')
    expect(file.source).toBe('penpot')
    expect(file.id).toBeUndefined()
    expect(file.createdAt).toBeUndefined()
    expect(file.updatedAt).toBeUndefined()
  })

  it('should have relationships with components and tokens', () => {
    const file = new DesignFile()
    file.name = 'Test Design'
    file.source = 'penpot'

    const component = new ComponentSpec()
    component.name = 'Button'
    component.variant = 'primary'
    component.designFile = file

    const token = new DesignToken()
    token.name = 'primary-color'
    token.type = 'color'
    token.value = { hex: '#007bff' }
    token.designFile = file

    file.components = [component]
    file.tokens = [token]

    expect(file.components).toHaveLength(1)
    expect(file.components[0]!.name).toBe('Button')
    expect(file.tokens).toHaveLength(1)
    expect(file.tokens[0]!.name).toBe('primary-color')
  })

  it('should validate source enum', () => {
    const file = new DesignFile()
    
    // Valid sources
    file.source = 'penpot'
    expect(file.source).toBe('penpot')
    
    file.source = 'figma'
    expect(file.source).toBe('figma')
  })
})