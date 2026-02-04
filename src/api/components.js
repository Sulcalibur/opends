/**
 * Component API endpoints
 * Provides CRUD operations for design system components
 */

import { Router } from 'express'
import { body, param, query, validationResult } from 'express-validator'
import { db } from '../database.js'

const router = Router()

// Validation middleware
const componentValidators = {
  create: [
    body('name')
      .isLength({ min: 1, max: 255 })
      .withMessage('Name is required and must be less than 255 characters'),
    body('spec').isObject().withMessage('Component spec is required'),
    body('spec.type').isString().withMessage('Component type is required'),
    body('displayName').optional().isLength({ max: 255 }),
    body('description').optional().isLength({ max: 1000 }),
    body('category').optional().isLength({ max: 100 })
  ],
  update: [
    param('id').isUUID().withMessage('Invalid component ID'),
    body('displayName').optional().isLength({ max: 255 }),
    body('description').optional().isLength({ max: 1000 }),
    body('category').optional().isLength({ max: 100 }),
    body('spec').optional().isObject(),
    body('status').optional().isIn(['draft', 'review', 'approved', 'deprecated'])
  ],
  search: [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('category').optional().isLength({ max: 100 }),
    query('status').optional().isIn(['draft', 'review', 'approved', 'deprecated']),
    query('query').optional().isLength({ max: 255 })
  ]
}

// Helper function to check for validation errors
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    })
  }
  next()
}

// GET /api/components - List components with search/filter
router.get('/', componentValidators.search, handleValidationErrors, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, category, status, query } = req.query

    const offset = (page - 1) * limit

    let sql = `
      SELECT
        id, name, display_name, description, category, status, spec,
        preview_url, created_by, updated_by, approved_by,
        created_at, updated_at, approved_at
      FROM components
      WHERE deleted_at IS NULL
    `
    const params = []
    const conditions = []

    if (category) {
      conditions.push('category = $' + (params.length + 1))
      params.push(category)
    }

    if (status) {
      conditions.push('status = $' + (params.length + 1))
      params.push(status)
    }

    if (query) {
      conditions.push(
        `to_tsvector('english', name || ' ' || COALESCE(description, '')) @@ plainto_tsquery('english', $${params.length + 1})`
      )
      params.push(query)
    }

    if (conditions.length > 0) {
      sql += ' AND ' + conditions.join(' AND ')
    }

    sql +=
      ' ORDER BY updated_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2)
    params.push(limit, offset)

    const result = await db.query(sql, params)

    // Get total count for pagination
    let countSql = 'SELECT COUNT(*) as total FROM components WHERE deleted_at IS NULL'
    if (conditions.length > 0) {
      countSql += ' AND ' + conditions.join(' AND ')
    }

    const countResult = await db.query(countSql, params.slice(0, -2)) // Remove limit and offset
    const total = parseInt(countResult.rows[0].total)

    res.json({
      success: true,
      data: result.rows.map(row => ({
        id: row.id,
        name: row.name,
        displayName: row.display_name,
        description: row.description,
        category: row.category,
        status: row.status,
        spec: row.spec,
        previewUrl: row.preview_url,
        createdBy: row.created_by,
        updatedBy: row.updated_by,
        approvedBy: row.approved_by,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        approvedAt: row.approved_at
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/components-public - List all components from YAML files (no auth) 
// Note: This route must be registered BEFORE the catch-all route in server.js
router.get('/components-public', async (req, res) => {
  try {
    const fs = await import('fs')
    const path = await import('path')
    const yaml = await import('js-yaml')
    const componentsDir = path.join(process.cwd(), 'design-system-data', 'components')

    if (!fs.existsSync(componentsDir)) {
      return res.json({
        success: true,
        data: []
      })
    }

    const files = fs.readdirSync(componentsDir)
    const yamlFiles = files.filter(f => f.endsWith('.yaml'))

    const components = []
    for (const file of yamlFiles) {
      const componentName = file.replace('.yaml', '')
      const componentPath = path.join(componentsDir, file)
      const content = fs.readFileSync(componentPath, 'utf-8')
      const componentData = yaml.load(content)

      const componentPathVue = path.join(process.cwd(), 'src', 'design-system', 'components', `${componentName}.vue`)
      let codeTimestamp = null

      if (fs.existsSync(componentPathVue)) {
        const stats = fs.statSync(componentPathVue)
        codeTimestamp = stats.mtime.toISOString()
      }

      components.push({
        id: componentName,
        name: componentData.name,
        displayName: componentData.name,
        description: componentData.description,
        category: componentData.category,
        status: componentData.status,
        spec: {
          type: componentData.category,
          props: componentData.props || [],
          slots: componentData.slots || [],
          events: componentData.events || []
        },
        examples: componentData.examples || [],
        usage: componentData.usage,
        notes: componentData.notes || '',
        design: componentData.design || {
          tool: null,
          fileId: null,
          frameId: null,
          timestamp: null
        },
        code: {
          timestamp: codeTimestamp
        }
      })
    }

    res.json({
      success: true,
      data: components
    })
  } catch (error) {
    console.error('Error listing components from YAML:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to list components'
    })
  }
})

export default router
