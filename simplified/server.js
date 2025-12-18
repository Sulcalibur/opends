#!/usr/bin/env node

/**
 * OpenDS Simplified Server
 * 
 * Serves the Vue SPA and provides API endpoints for Penpot plugin integration.
 */

import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'
import yaml from 'js-yaml'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'dist')))

// API Routes for Penpot Plugin
app.get('/api/plugin/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    version: '1.0.0',
    message: 'OpenDS Simplified API is running'
  })
})

app.post('/api/plugin/sync', async (req, res) => {
  try {
    const { colors = [], typographies = [], components = [], fileName } = req.body
    
    console.log(`Received sync request: ${colors.length} colors, ${components.length} components`)
    
    // Convert Penpot data to OpenDS format
    const tokens = []
    
    // Process colors
    colors.forEach(color => {
      tokens.push({
        name: color.name || `color-${color.id}`,
        value: color.value || '#000000',
        type: 'color',
        category: 'colors',
        description: color.description || `Color from ${fileName || 'Penpot'}`
      })
    })
    
    // Process typographies
    typographies.forEach(typography => {
      tokens.push({
        name: typography.name || `typography-${typography.id}`,
        value: typography.value || '16px',
        type: 'typography',
        category: 'typography',
        description: typography.description || `Typography from ${fileName || 'Penpot'}`
      })
    })
    
    // Save tokens to YAML
    const tokensPath = path.join(__dirname, 'design-system-data', 'tokens.yaml')
    const existingTokens = await loadTokens(tokensPath)
    
    // Merge with existing tokens (avoid duplicates)
    const mergedTokens = mergeTokens(existingTokens, tokens)
    
    const tokensYaml = yaml.dump({
      version: '1.0',
      tokens: mergedTokens
    })
    
    await fs.writeFile(tokensPath, tokensYaml)
    
    // Process components
    const componentsDir = path.join(__dirname, 'design-system-data', 'components')
    await fs.mkdir(componentsDir, { recursive: true })
    
    let savedComponents = 0
    for (const component of components) {
      const safeName = (component.name || `component-${component.id}`).toLowerCase().replace(/[^a-z0-9]/g, '-')
      const componentPath = path.join(componentsDir, `${safeName}.yaml`)
      
      const componentData = {
        name: component.name || `Component ${component.id}`,
        description: component.description || `Component from ${fileName || 'Penpot'}`,
        category: 'penpot',
        status: 'stable',
        props: [],
        examples: [],
        usage: 'Imported from Penpot design file',
        notes: [`Imported from: ${fileName || 'Unknown file'}`]
      }
      
      const componentYaml = yaml.dump(componentData)
      await fs.writeFile(componentPath, componentYaml)
      savedComponents++
    }
    
    res.json({
      success: true,
      components: savedComponents,
      tokens: tokens.length,
      message: `Synced ${savedComponents} components and ${tokens.length} tokens from ${fileName || 'Penpot'}`
    })
    
  } catch (error) {
    console.error('Sync error:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Simple API key authentication (for MVP)
const API_KEYS = new Set(['test-api-key', 'opends-simple-key'])

app.use('/api/plugin/*', (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing API key' })
  }
  
  const apiKey = authHeader.substring(7)
  if (!API_KEYS.has(apiKey)) {
    return res.status(401).json({ error: 'Invalid API key' })
  }
  
  next()
})

// Admin API endpoints
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body
  
  // Simple hardcoded admin for MVP
  if (username === 'admin' && password === 'admin') {
    res.json({ 
      success: true, 
      token: 'admin-token-mvp',
      user: { username: 'admin', role: 'admin' }
    })
  } else {
    res.status(401).json({ success: false, error: 'Invalid credentials' })
  }
})

app.get('/api/admin/stats', async (_req, res) => {
  try {
    const tokensPath = path.join(__dirname, 'design-system-data', 'tokens.yaml')
    const tokens = await loadTokens(tokensPath)
    
    const componentsDir = path.join(__dirname, 'design-system-data', 'components')
    let componentFiles = []
    try {
      componentFiles = await fs.readdir(componentsDir)
    } catch (error) {
      // Directory might not exist yet
    }
    
    res.json({
      tokens: tokens.length,
      components: componentFiles.filter(f => f.endsWith('.yaml')).length,
      storage: 'local',
      version: '0.2.0'
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Serve Vue SPA for all other routes
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// Helper functions
async function loadTokens(tokensPath) {
  try {
    const content = await fs.readFile(tokensPath, 'utf8')
    const data = yaml.load(content)
    
    if (data?.tokens && Array.isArray(data.tokens)) {
      return data.tokens
    }
    
    // Try old format (categorized)
    const tokens = []
    if (data.colors) {
      Object.entries(data.colors).forEach(([name, token]) => {
        tokens.push({
          name,
          value: token.value,
          type: 'color',
          category: 'colors',
          description: token.description
        })
      })
    }
    if (data.typography) {
      Object.entries(data.typography).forEach(([name, token]) => {
        tokens.push({
          name,
          value: token.value,
          type: 'typography',
          category: 'typography',
          description: token.description
        })
      })
    }
    if (data.spacing) {
      Object.entries(data.spacing).forEach(([name, token]) => {
        tokens.push({
          name,
          value: token.value,
          type: 'spacing',
          category: 'spacing',
          description: token.description
        })
      })
    }
    if (data.radius) {
      Object.entries(data.radius).forEach(([name, token]) => {
        tokens.push({
          name,
          value: token.value,
          type: 'radius',
          category: 'radius',
          description: token.description
        })
      })
    }
    
    return tokens
  } catch (error) {
    console.log('No tokens file found, starting fresh')
    return []
  }
}

function mergeTokens(existing, newTokens) {
  const tokenMap = new Map()
  
  // Add existing tokens
  existing.forEach(token => {
    tokenMap.set(token.name, token)
  })
  
  // Add new tokens, overwriting if name exists
  newTokens.forEach(token => {
    tokenMap.set(token.name, token)
  })
  
  return Array.from(tokenMap.values())
}

// Start server
if (process.env.NODE_ENV !== 'production') {
  // In development, we need to build the Vue app first
  import('child_process').then(({ exec }) => {
    console.log('Building Vue app for production...')
    exec('pnpm run build', (error) => {
      if (error) {
        console.error('Build failed:', error)
        process.exit(1)
      }
      
      app.listen(PORT, () => {
        console.log(`OpenDS Simplified Server running on http://localhost:${PORT}`)
        console.log(`API available at http://localhost:${PORT}/api/plugin/health`)
        console.log('Default API key: test-api-key')
        console.log('Admin login: admin / admin')
      })
    })
  })
} else {
  app.listen(PORT, () => {
    console.log(`OpenDS Simplified Server running on port ${PORT}`)
  })
}