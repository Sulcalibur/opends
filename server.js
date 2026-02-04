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
import pkg from 'pg'
import { v4 as uuidv4 } from 'uuid'

// Admin API Routes
import authRouter from './src/api/admin/auth.js'

// Component API Routes
import componentsRouter from './src/api/components.js'
const { Pool } = pkg


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

// Database connection
const pool = new Pool({
  connectionString: process.env.VITE_DATABASE_URL || process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database')
})

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err)
})

// Initialize database (run migrations)
async function initDatabase() {
  try {
    console.log('🔄 Initializing database...')

    // Read and execute migration files
    const migrationsDir = path.join(__dirname, 'migrations')
    const migrationFiles = [
      '001_initial_schema.sql',
      '002_add_token_hierarchy.sql',
      '003_component_system_init.sql'
    ]

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file)
      try {
        const sql = await fs.readFile(filePath, 'utf8')
        await pool.query(sql)
        console.log(`✅ Executed migration: ${file}`)
      } catch (error) {
        // Ignore "already exists" errors
        if (!error.message.includes('already exists')) {
          console.error(`❌ Migration failed for ${file}:`, error.message)
        }
      }
    }

    console.log('✅ Database initialization complete')
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
  }
}

const app = express()
const PORT = process.env.PORT || 3002

// Middleware
app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});


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
        description: typography.description
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

app.use('/api/plugin', (req, res, next) => {
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
app.use('/api/admin', authRouter)
app.use('/api/components', componentsRouter)

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

// Serve static files (Vue SPA)
app.use(express.static(path.join(__dirname, 'dist')))

// Start server
// Initialize database and start server
async function startServer() {
  await initDatabase()

  app.listen(PORT, () => {
    console.log(`OpenDS Simplified Server running on http://localhost:${PORT}`)
    console.log(`API available at http://localhost:${PORT}/api/plugin/health`)
    console.log(`Component API available at http://localhost:${PORT}/api/components`)
    console.log('Default API key: test-api-key')
    console.log('Admin login: admin / admin')
    console.log('Database: PostgreSQL')
  })
}

startServer().catch(error => {
  console.error('Failed to start server:', error)
  process.exit(1)
})

// =============================================================================
// COMPONENT API ENDPOINTS
// =============================================================================

// Get all components with optional filtering
app.get('/api/components', async (req, res) => {
  try {
    const { search, category, limit = 50, offset = 0 } = req.query

    let query = `
      SELECT id, name, description, category, props, slots, events, examples, usage, notes,
             created_at, updated_at
      FROM components
      WHERE deleted_at IS NULL
    `
    const params = []
    const conditions = []

    if (search) {
      conditions.push(`search_vector @@ plainto_tsquery('english', $${params.length + 1})`)
      params.push(search)
    }

    if (category) {
      conditions.push(`category = $${params.length + 1}`)
      params.push(category)
    }

    if (conditions.length > 0) {
      query += ' AND ' + conditions.join(' AND ')
    }

    query += ` ORDER BY updated_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)

    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching components:', error)
    res.status(500).json({ error: 'Failed to fetch components' })
  }
})

// Get single component by ID
app.get('/api/components/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(`
      SELECT id, name, description, category, props, slots, events, examples, usage, notes,
             created_at, updated_at
      FROM components
      WHERE id = $1 AND deleted_at IS NULL
    `, [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Component not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Error fetching component:', error)
    res.status(500).json({ error: 'Failed to fetch component' })
  }
})

// Create new component
app.post('/api/components', async (req, res) => {
  try {
    const { name, description, category, props = [], slots = [], events = [], examples = [], usage, notes = [] } = req.body

    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: 'Component name is required' })
    }

    const result = await pool.query(`
      INSERT INTO components (name, description, category, props, slots, events, examples, usage, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, name, description, category, props, slots, events, examples, usage, notes, created_at, updated_at
    `, [name, description, category, JSON.stringify(props), JSON.stringify(slots), JSON.stringify(events), JSON.stringify(examples), usage, JSON.stringify(notes)])

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Error creating component:', error)
    if (error.code === '23505') { // Unique violation
      res.status(409).json({ error: 'Component name already exists' })
    } else {
      res.status(500).json({ error: 'Failed to create component' })
    }
  }
})

// Update component
app.put('/api/components/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, category, props, slots, events, examples, usage, notes } = req.body

    const result = await pool.query(`
      UPDATE components
      SET name = $2, description = $3, category = $4, props = $5, slots = $6, events = $7,
          examples = $8, usage = $9, notes = $10, updated_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING id, name, description, category, props, slots, events, examples, usage, notes, created_at, updated_at
    `, [id, name, description, category, JSON.stringify(props), JSON.stringify(slots), JSON.stringify(events), JSON.stringify(examples), usage, JSON.stringify(notes)])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Component not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Error updating component:', error)
    if (error.code === '23505') { // Unique violation
      res.status(409).json({ error: 'Component name already exists' })
    } else {
      res.status(500).json({ error: 'Failed to update component' })
    }
  }
})

// Delete component (soft delete)
app.delete('/api/components/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(`
      UPDATE components
      SET deleted_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING id
    `, [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Component not found' })
    }

    res.json({ message: 'Component deleted successfully' })
  } catch (error) {
    console.error('Error deleting component:', error)
    res.status(500).json({ error: 'Failed to delete component' })
  }
})

// Get component categories
app.get('/api/components/categories', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT category, COUNT(*) as count
      FROM components
      WHERE deleted_at IS NULL AND category IS NOT NULL
      GROUP BY category
      ORDER BY count DESC
    `)
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching categories:', error)
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
})

// =============================================================================
// CODE GENERATION API ENDPOINTS
// =============================================================================

// Generate code for a single component
app.post('/api/generate/component', async (req, res) => {
  try {
    const { componentId, framework = 'vue', options = {} } = req.body

    if (!componentId) {
      return res.status(400).json({ error: 'Component ID is required' })
    }

    // Get component data
    const componentResult = await pool.query(`
      SELECT id, name, description, category, props, slots, events, examples, usage, notes
      FROM components
      WHERE id = $1 AND deleted_at IS NULL
    `, [componentId])

    if (componentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Component not found' })
    }

    const component = componentResult.rows[0]

    // Get design tokens for styling
    const tokensResult = await pool.query(`
      SELECT name, value, type, category
      FROM design_tokens
      WHERE deleted_at IS NULL
      ORDER BY category, name
    `)

    // Generate component code
    const { generateComponentCode, generateStyleUtils } = await import('./src/utils/codeGenerator.js')
    const componentCode = await generateComponentCode(component, framework, options)
    const styleUtils = await generateStyleUtils(tokensResult.rows, framework)

    res.json({
      component: {
        name: component.name,
        code: componentCode,
        framework
      },
      styles: styleUtils,
      metadata: {
        generatedAt: new Date().toISOString(),
        componentId: component.id,
        framework
      }
    })
  } catch (error) {
    console.error('Error generating component code:', error)
    res.status(500).json({ error: 'Failed to generate component code' })
  }
})

// Generate code for multiple components
app.post('/api/generate/library', async (req, res) => {
  try {
    const { componentIds, framework = 'vue', options = {} } = req.body

    if (!componentIds || !Array.isArray(componentIds)) {
      return res.status(400).json({ error: 'Component IDs array is required' })
    }

    // Get component data
    const componentsResult = await pool.query(`
      SELECT id, name, description, category, props, slots, events, examples, usage, notes
      FROM components
      WHERE id = ANY($1) AND deleted_at IS NULL
      ORDER BY name
    `, [componentIds])

    // Get design tokens
    const tokensResult = await pool.query(`
      SELECT name, value, type, category
      FROM design_tokens
      WHERE deleted_at IS NULL
      ORDER BY category, name
    `)

    // Generate code for each component
    const { generateComponentCode, generateIndexFile, generateStyleUtils } = await import('./src/utils/codeGenerator.js')

    const components = []
    for (const component of componentsResult.rows) {
      const code = await generateComponentCode(component, framework, options)
      components.push({
        id: component.id,
        name: component.name,
        code,
        framework
      })
    }

    // Generate index file
    const indexCode = await generateIndexFile(componentsResult.rows, framework, options)
    const styleUtils = await generateStyleUtils(tokensResult.rows, framework)

    res.json({
      components,
      index: {
        code: indexCode,
        filename: framework === 'vue' ? 'index.js' :
                 framework === 'react' ? 'index.js' : 'index.js'
      },
      styles: {
        code: styleUtils,
        filename: 'design-tokens.css'
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        framework,
        componentCount: components.length
      }
    })
  } catch (error) {
    console.error('Error generating library code:', error)
    res.status(500).json({ error: 'Failed to generate library code' })
  }
})

// Get available frameworks
app.get('/api/generate/frameworks', (req, res) => {
  res.json({
    frameworks: [
      { id: 'vue', name: 'Vue 3', description: 'Vue 3 Composition API components' },
      { id: 'react', name: 'React', description: 'React functional components' },
      { id: 'svelte', name: 'Svelte', description: 'Svelte components' }
    ],
    options: {
      styling: ['tailwind', 'css-modules', 'styled-components'],
      typescript: [true, false]
    }
  })
})

// =============================================================================
// DOCUMENTATION GENERATION API ENDPOINTS
// =============================================================================

// Generate documentation for a single component
app.get('/api/docs/component/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { frameworks = 'vue,react,svelte' } = req.query

    // Get component data
    const componentResult = await pool.query(`
      SELECT id, name, description, category, props, slots, events, examples, usage, notes
      FROM components
      WHERE id = $1 AND deleted_at IS NULL
    `, [id])

    if (componentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Component not found' })
    }

    const component = componentResult.rows[0]

    // Generate documentation
    const { generateComponentDocs } = await import('./src/utils/docGenerator.js')
    const docs = await generateComponentDocs(component, {
      frameworks: frameworks.split(','),
      includePlayground: true,
      includeExamples: true
    })

    res.json({
      component: component.name,
      documentation: docs,
      metadata: {
        generatedAt: new Date().toISOString(),
        componentId: component.id,
        frameworks: frameworks.split(',')
      }
    })
  } catch (error) {
    console.error('Error generating component docs:', error)
    res.status(500).json({ error: 'Failed to generate component documentation' })
  }
})

// Generate complete documentation site
app.get('/api/docs/site', async (req, res) => {
  try {
    // Get all components
    const componentsResult = await pool.query(`
      SELECT id, name, description, category, props, slots, events, examples, usage, notes
      FROM components
      WHERE deleted_at IS NULL
      ORDER BY category, name
    `)

    const components = componentsResult.rows

    // Generate documentation for each component
    const { generateComponentDocs, generateIndexPage, generateSearchIndex } = await import('./src/utils/docGenerator.js')

    const componentDocs = []
    for (const component of components) {
      const docs = await generateComponentDocs(component)
      componentDocs.push({
        component: component.name,
        filename: `${component.name}.md`,
        content: docs
      })
    }

    // Generate index page
    const indexDocs = await generateIndexPage(components)

    // Generate search index
    const searchIndex = generateSearchIndex(components)

    res.json({
      index: {
        filename: 'index.md',
        content: indexDocs
      },
      components: componentDocs,
      searchIndex,
      metadata: {
        generatedAt: new Date().toISOString(),
        totalComponents: components.length,
        categories: [...new Set(components.map(c => c.category || 'general'))]
      }
    })
  } catch (error) {
    console.error('Error generating documentation site:', error)
    res.status(500).json({ error: 'Failed to generate documentation site' })
  }
})

// Get documentation metadata
app.get('/api/docs/metadata', async (req, res) => {
  try {
    // Get component statistics
    const statsResult = await pool.query(`
      SELECT
        COUNT(*) as total_components,
        COUNT(DISTINCT category) as total_categories,
        json_agg(DISTINCT category) as categories
      FROM components
      WHERE deleted_at IS NULL
    `)

    const stats = statsResult.rows[0]

    res.json({
      totalComponents: parseInt(stats.total_components),
      totalCategories: parseInt(stats.total_categories),
      categories: (stats.categories || []).filter(Boolean),
      generatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching docs metadata:', error)
    res.status(500).json({ error: 'Failed to fetch documentation metadata' })
  }
})

// =============================================================================
// END DOCUMENTATION GENERATION API ENDPOINTS
// =============================================================================

// =============================================================================
// DESIGN TOKENS API ENDPOINTS
// =============================================================================

// Get all design tokens
app.get('/api/tokens', async (req, res) => {
  try {
    const { category, search, limit = 100, offset = 0 } = req.query

    let query = `
      SELECT id, name, category, value, description, path, type, references, metadata, parent_id, created_at, updated_at
      FROM design_tokens
      WHERE deleted_at IS NULL
    `
    const params = []
    let paramIndex = 1

    // Add filters
    if (category) {
      query += ` AND category = $${paramIndex++}`
      params.push(category)
    }

    if (search) {
      query += ` AND (name ILIKE $${paramIndex++} OR description ILIKE $${paramIndex++})`
      params.push(`%${search}%`, `%${search}%`)
    }

    // Add ordering and pagination
    query += ` ORDER BY path ASC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`
    params.push(parseInt(limit), parseInt(offset))

    const result = await pool.query(query, params)

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM design_tokens
      WHERE deleted_at IS NULL
      ${category ? 'AND category = $1' : ''}
      ${search ? `AND (name ILIKE $${category ? 2 : 1} OR description ILIKE $${category ? 3 : 2})` : ''}
    `
    const countParams = []
    if (category) countParams.push(category)
    if (search) countParams.push(`%${search}%`, `%${search}%`)

    const countResult = await pool.query(countQuery, countParams)
    const total = parseInt(countResult.rows[0].total)

    res.json({
      tokens: result.rows,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    })
  } catch (error) {
    console.error('Error fetching tokens:', error)
    res.status(500).json({ error: 'Failed to fetch tokens' })
  }
})

// Get single token by ID
app.get('/api/tokens/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(`
      SELECT id, name, category, value, description, path, type, references, metadata, parent_id, created_at, updated_at
      FROM design_tokens
      WHERE id = $1 AND deleted_at IS NULL
    `, [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Token not found' })
    }

    // Get resolved value if it's a reference
    const token = result.rows[0]
    if (token.type === 'reference' && token.references) {
      try {
        const resolvedResult = await pool.query('SELECT resolve_token_value($1) as resolved_value', [token.id])
        token.resolved_value = resolvedResult.rows[0].resolved_value
      } catch (resolveError) {
        console.warn('Could not resolve token value:', resolveError)
      }
    }

    res.json({ token })
  } catch (error) {
    console.error('Error fetching token:', error)
    res.status(500).json({ error: 'Failed to fetch token' })
  }
})

// Create new token
app.post('/api/tokens', async (req, res) => {
  try {
    const { name, category, value, description, parent_id, type = 'value', references, metadata } = req.body

    // Get all existing tokens for validation
    const allTokensResult = await pool.query(`
      SELECT id, name, category, value, path, type, references, parent_id
      FROM design_tokens
      WHERE deleted_at IS NULL
    `)
    const allTokens = allTokensResult.rows

    // Import validation function (in a real implementation, this would be imported)
    const validation = await validateTokenInput({ name, category, value, description, parent_id, type, references, metadata }, allTokens)

    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.errors,
        warnings: validation.warnings
      })
    }

    const result = await pool.query(`
      INSERT INTO design_tokens (name, category, value, description, parent_id, type, references, metadata)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, name, category, value, description, path, type, references, metadata, parent_id, created_at, updated_at
    `, [name, category, JSON.stringify(value), description, parent_id, type, references ? JSON.stringify(references) : null, metadata ? JSON.stringify(metadata) : null])

    res.status(201).json({ token: result.rows[0] })
  } catch (error) {
    console.error('Error creating token:', error)
    res.status(500).json({ error: 'Failed to create token' })
  }
})

// Update token
app.put('/api/tokens/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, category, value, description, parent_id, type, references, metadata } = req.body

    // Get existing token and all tokens for validation
    const existingResult = await pool.query('SELECT * FROM design_tokens WHERE id = $1 AND deleted_at IS NULL', [id])
    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Token not found' })
    }

    const allTokensResult = await pool.query(`
      SELECT id, name, category, value, path, type, references, parent_id
      FROM design_tokens
      WHERE deleted_at IS NULL
    `)
    const allTokens = allTokensResult.rows

    // Validate the updated token
    const updatedToken = { id, name, category, value, description, parent_id, type, references, metadata }
    const validation = await validateTokenInput(updatedToken, allTokens)

    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.errors,
        warnings: validation.warnings
      })
    }

    const result = await pool.query(`
      UPDATE design_tokens
      SET name = COALESCE($2, name),
          category = COALESCE($3, category),
          value = COALESCE($4::jsonb, value),
          description = COALESCE($5, description),
          parent_id = $6,
          type = COALESCE($7, type),
          references = COALESCE($8::jsonb, references),
          metadata = COALESCE($9::jsonb, metadata),
          updated_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING id, name, category, value, description, path, type, references, metadata, parent_id, created_at, updated_at
    `, [id, name, category, value ? JSON.stringify(value) : null, description, parent_id, type, references ? JSON.stringify(references) : null, metadata ? JSON.stringify(metadata) : null])

    res.json({ token: result.rows[0] })
  } catch (error) {
    console.error('Error updating token:', error)
    res.status(500).json({ error: 'Failed to update token' })
  }
})

// Delete token (soft delete)
app.delete('/api/tokens/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(`
      UPDATE design_tokens
      SET deleted_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING id
    `, [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Token not found' })
    }

    res.json({ success: true, message: 'Token deleted successfully' })
  } catch (error) {
    console.error('Error deleting token:', error)
    res.status(500).json({ error: 'Failed to delete token' })
  }
})

// Get token categories
app.get('/api/tokens/categories', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT category, COUNT(*) as count
      FROM design_tokens
      WHERE deleted_at IS NULL
      GROUP BY category
      ORDER BY category
    `)

    res.json({
      categories: result.rows.map(row => ({
        name: row.category,
        count: parseInt(row.count)
      }))
    })
  } catch (error) {
    console.error('Error fetching token categories:', error)
    res.status(500).json({ error: 'Failed to fetch token categories' })
  }
})

// Get token hierarchy/tree
app.get('/api/tokens/tree', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, category, path, type, parent_id
      FROM design_tokens
      WHERE deleted_at IS NULL
      ORDER BY path
    `)

    // Build tree structure
    const tokens = result.rows
    const tree = []
    const tokenMap = new Map()

    // First pass: create all nodes
    tokens.forEach(token => {
      tokenMap.set(token.id, {
        ...token,
        children: []
      })
    })

    // Second pass: build hierarchy
    tokens.forEach(token => {
      const node = tokenMap.get(token.id)
      if (token.parent_id) {
        const parent = tokenMap.get(token.parent_id)
        if (parent) {
          parent.children.push(node)
        }
      } else {
        tree.push(node)
      }
    })

    res.json({ tree })
  } catch (error) {
    console.error('Error fetching token tree:', error)
    res.status(500).json({ error: 'Failed to fetch token tree' })
  }
})

// Token validation function
async function validateTokenInput(token, allTokens) {
  const errors = []
  const warnings = []

  // Required fields
  if (!token.name?.trim()) errors.push('Name is required')
  if (!token.category?.trim()) errors.push('Category is required')
  if (token.value === undefined || token.value === null) errors.push('Value is required')

  // Validate token type
  if (!['value', 'reference', 'alias'].includes(token.type)) {
    errors.push('Type must be value, reference, or alias')
  }

  // Validate name format
  if (token.name && !/^[a-zA-Z0-9_-]+$/.test(token.name)) {
    errors.push('Name can only contain letters, numbers, hyphens, and underscores')
  }

  // Check for duplicate paths
  if (token.name) {
    const path = token.parent_id ? `${await getParentPath(token.parent_id)}/${token.name}` : token.name
    const existing = allTokens.find(t => t.path === path)
    if (existing) {
      errors.push(`Token path "${path}" already exists`)
    }
  }

  // Validate parent exists
  if (token.parent_id) {
    const parentExists = allTokens.some(t => t.id === token.parent_id)
    if (!parentExists) {
      errors.push('Parent token does not exist')
    }
  }

  // Validate references
  if (token.references && Array.isArray(token.references)) {
    for (const refId of token.references) {
      const refExists = allTokens.some(t => t.id === refId)
      if (!refExists) {
        errors.push(`Referenced token "${refId}" does not exist`)
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

// Helper function to get parent path
async function getParentPath(parentId) {
  const result = await pool.query('SELECT path FROM design_tokens WHERE id = $1', [parentId])
  return result.rows[0]?.path || ''
}

// =============================================================================
// END DESIGN TOKENS API ENDPOINTS
// =============================================================================

// Serve Vue SPA for all other routes
app.get(/(.*)/, (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})