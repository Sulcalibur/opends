export const onRequestGet: PagesFunction = async () => {
  return new Response(JSON.stringify({
    status: 'ok',
    service: 'opends-simplified',
    timestamp: new Date().toISOString()
  }), {
    headers: { 'content-type': 'application/json' }
  })
}

