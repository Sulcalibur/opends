/**
 * Component API endpoints
 * Provides CRUD operations for design system components
 */

import { Router } from 'express'
import { body, param, query, validationResult } from 'express-validator'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { db } from '../database.js'
import { ApiError } from '../utils/errors.js'

const router = Router()

// Validation middleware
const componentValidators = {
  create: [
    body('name').isLength({ min: 1, max: 255 }).withMessage('Name is required and must be less than 255 characters'),
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
router.get('/', componentValidators.search, handleValidationErrors, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      status,
      query
    } = req.query

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
      conditions.push(`to_tsvector('english', name || ' ' || COALESCE(description, '')) @@ plainto_tsquery('english', $${params.length + 1})`)
      params.push(query)
    }

    if (conditions.length > 0) {
      sql += ' AND ' + conditions.join(' AND ')
    }

    sql += ' ORDER BY updated_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2)
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
    console.error('Error listing components:', error)
    throw new ApiError('Failed to list components', 500)
  }
})

// GET /api/components/:id - Get single component
router.get('/:id', [
  param('id').isUUID().withMessage('Invalid component ID')
], handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params

    const result = await db.query(`
      SELECT
        id, name, display_name, description, category, status, spec,
        preview_url, created_by, updated_by, approved_by,
        created_at, updated_at, approved_at
      FROM components
      WHERE id = $1 AND deleted_at IS NULL
    `, [id])

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Component not found'
      })
    }

    const row = result.rows[0]
    res.json({
      success: true,
      data: {
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
      }
    })

  } catch (error) {
    console.error('Error getting component:', error)
    throw new ApiError('Failed to get component', 500)
  }
})

// POST /api/components - Create component
router.post('/', requireAuth, componentValidators.create, handleValidationErrors, async (req, res) => {
  try {
    const {
      name,
      displayName,
      description,
      category,
      spec
    } = req.body

    const userId = req.user.id

    const result = await db.query(`
      INSERT INTO components (name, display_name, description, category, spec, created_by, updated_by)
      VALUES ($1, $2, $3, $4, $5, $6, $6)
      RETURNING id, name, display_name, description, category, status, spec, created_at, updated_at
    `, [name, displayName, description, category, JSON.stringify(spec), userId])

    const row = result.rows[0]
    res.status(201).json({
      success: true,
      data: {
        id: row.id,
        name: row.name,
        displayName: row.display_name,
        description: row.description,
        category: row.category,
        status: row.status,
        spec: row.spec,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }
    })

  } catch (error) {
    console.error('Error creating component:', error)

    // Handle unique constraint violations
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        error: 'Component name already exists'
      })
    }

    throw new ApiError('Failed to create component', 500)
  }
})

// PUT /api/components/:id - Update component
router.put('/:id', requireAuth, componentValidators.update, handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params
    const {
      displayName,
      description,
      category,
      spec,
      status
    } = req.body

    const userId = req.user.id

    // Check if component exists
    const existing = await db.query(
      'SELECT id FROM components WHERE id = $1 AND deleted_at IS NULL',
      [id]
    )

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Component not found'
      })
    }

    const updates = []
    const params = [id]
    let paramIndex = 2

    if (displayName !== undefined) {
      updates.push(`display_name = $${paramIndex}`)
      params.push(displayName)
      paramIndex++
    }

    if (description !== undefined) {
      updates.push(`description = $${paramIndex}`)
      params.push(description)
      paramIndex++
    }

    if (category !== undefined) {
      updates.push(`category = $${paramIndex}`)
      params.push(category)
      paramIndex++
    }

    if (spec !== undefined) {
      updates.push(`spec = $${paramIndex}`)
      params.push(JSON.stringify(spec))
      paramIndex++
    }

    if (status !== undefined) {
      updates.push(`status = $${paramIndex}`)
      params.push(status)
      paramIndex++
    }

    updates.push(`updated_by = $${paramIndex}`)
    params.push(userId)
    paramIndex++

    const sql = `
      UPDATE components
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING id, name, display_name, description, category, status, spec, updated_at
    `

    const result = await db.query(sql, params)

    const row = result.rows[0]
    res.json({
      success: true,
      data: {
        id: row.id,
        name: row.name,
        displayName: row.display_name,
        description: row.description,
        category: row.category,
        status: row.status,
        spec: row.spec,
        updatedAt: row.updated_at
      }
    })

  } catch (error) {
    console.error('Error updating component:', error)
    throw new ApiError('Failed to update component', 500)
  }
})

// DELETE /api/components/:id - Delete component
router.delete('/:id', requireAuth, requireRole(['admin', 'editor']), [
  param('id').isUUID().withMessage('Invalid component ID')
], handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    // Check if component exists
    const existing = await db.query(
      'SELECT id FROM components WHERE id = $1 AND deleted_at IS NULL',
      [id]
    )

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Component not found'
      })
    }

    // Soft delete
    await db.query(
      'UPDATE components SET deleted_at = NOW(), updated_by = $2 WHERE id = $1',
      [id, userId]
    )

    res.json({
      success: true,
      message: 'Component deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting component:', error)
    throw new ApiError('Failed to delete component', 500)
  }
})

// GET /api/components/:id/versions - Get component versions
router.get('/:id/versions', [
  param('id').isUUID().withMessage('Invalid component ID')
], handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params

    const result = await db.query(`
      SELECT id, version, spec, changelog, created_by, created_at
      FROM component_versions
      WHERE component_id = $1
      ORDER BY created_at DESC
    `, [id])

    res.json({
      success: true,
      data: result.rows.map(row => ({
        id: row.id,
        version: row.version,
        spec: row.spec,
        changelog: row.changelog,
        createdBy: row.created_by,
        createdAt: row.created_at
      }))
    })

  } catch (error) {
    console.error('Error getting component versions:', error)
    throw new ApiError('Failed to get component versions', 500)
  }
})

// POST /api/components/:id/versions - Create component version
router.post('/:id/versions', requireAuth, [
  param('id').isUUID().withMessage('Invalid component ID'),
  body('version').isLength({ min: 1, max: 50 }).withMessage('Version is required'),
  body('spec').isObject().withMessage('Component spec is required'),
  body('changelog').optional().isLength({ max: 1000 })
], handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params
    const { version, spec, changelog } = req.body
    const userId = req.user.id

    // Check if component exists
    const component = await db.query(
      'SELECT id FROM components WHERE id = $1 AND deleted_at IS NULL',
      [id]
    )

    if (component.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Component not found'
      })
    }

    // Check if version already exists
    const existingVersion = await db.query(
      'SELECT id FROM component_versions WHERE component_id = $1 AND version = $2',
      [id, version]
    )

    if (existingVersion.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Version already exists'
      })
    }

    const result = await db.query(`
      INSERT INTO component_versions (component_id, version, spec, changelog, created_by)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, version, spec, changelog, created_by, created_at
    `, [id, version, JSON.stringify(spec), changelog, userId])

    const row = result.rows[0]
    res.status(201).json({
      success: true,
      data: {
        id: row.id,
        version: row.version,
        spec: row.spec,
        changelog: row.changelog,
        createdBy: row.created_by,
        createdAt: row.created_at
      }
    })

  } catch (error) {
    console.error('Error creating component version:', error)
    throw new ApiError('Failed to create component version', 500)
  }
})

export default router