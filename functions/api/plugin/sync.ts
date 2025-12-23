export const onRequestPost: PagesFunction = async ({ request }) => {
  const headers = { 'content-type': 'application/json' }
  const auth = request.headers.get('authorization') || ''
  if (!auth.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Missing API key' }), { status: 401, headers })
  }
  const apiKey = auth.slice(7)
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Invalid API key' }), { status: 401, headers })
  }
  const body = await request.json().catch(() => ({}))
  const colors = Array.isArray(body.colors) ? body.colors : []
  const typographies = Array.isArray(body.typographies) ? body.typographies : []
  const components = Array.isArray(body.components) ? body.components : []
  const fileName = typeof body.fileName === 'string' ? body.fileName : undefined
  const tokensCount = colors.length + typographies.length
  return new Response(JSON.stringify({
    success: true,
    components: components.length,
    tokens: tokensCount,
    message: `Received ${components.length} components and ${tokensCount} tokens from ${fileName || 'Penpot'}`
  }), { status: 200, headers })
}

