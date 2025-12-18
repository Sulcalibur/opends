// Netlify Function for Penpot plugin sync
// Deploy to: /.netlify/functions/sync

// Simple in-memory storage for MVP (would use database in production)

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  }

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    }
  }

  // Simple API key check
  const authHeader = event.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Missing API key' })
    }
  }

  const apiKey = authHeader.substring(7)
  const validKeys = ['test-api-key', 'opends-simple-key']
  
  if (!validKeys.includes(apiKey)) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Invalid API key' })
    }
  }

  // Health check endpoint
  if (event.httpMethod === 'GET' && event.path.endsWith('/health')) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'ok',
        version: '1.0.0',
        message: 'OpenDS Simplified API is running'
      })
    }
  }

  // Sync endpoint
  if (event.httpMethod === 'POST' && event.path.endsWith('/sync')) {
    try {
      const body = JSON.parse(event.body)
      const { colors = [], typographies = [], components: penpotComponents = [], fileName } = body

      console.log(`Syncing: ${colors.length} colors, ${penpotComponents.length} components`)

      // Process tokens
      const newTokens = []
      
      colors.forEach(color => {
        newTokens.push({
          name: color.name || `color-${color.id}`,
          value: color.value || '#000000',
          type: 'color',
          category: 'colors',
          description: color.description || `Color from ${fileName || 'Penpot'}`
        })
      })

      typographies.forEach(typography => {
        newTokens.push({
          name: typography.name || `typography-${typography.id}`,
          value: typography.value || '16px',
          type: 'typography',
          category: 'typography',
          description: typography.description || `Typography from ${fileName || 'Penpot'}`
        })
      })

      // In MVP, we just return success (would save to database in production)
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          components: penpotComponents.length,
          tokens: newTokens.length,
          message: `Received ${penpotComponents.length} components and ${newTokens.length} tokens from ${fileName || 'Penpot'}`
        })
      }

    } catch (error) {
      console.error('Sync error:', error)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: error.message
        })
      }
    }
  }

  // Not found
  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({ error: 'Not found' })
  }
}