import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { ADMIN_EMAIL, ADMIN_PASSWORD } from './support/env'

/**
 * Content-conformance specs — assert the public API serves exactly what the
 * demo dataset defines, plus the write flows (create/update/delete) an admin
 * performs. These run with the `request` fixture, no browser needed.
 */
const DATA = 'design-system-data'
const tokens = JSON.parse(readFileSync(`${DATA}/tokens.json`, 'utf8')).tokens
const componentFiles = ['alert', 'badge', 'button', 'card', 'checkbox', 'input', 'select', 'spinner']
const docs = JSON.parse(readFileSync(`${DATA}/docs.json`, 'utf8')).docs

async function login(request) {
  const res = await request.post('/api/auth/login', {
    data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
  })
  expect(res.ok()).toBeTruthy()
  const { data } = await res.json()
  return data.tokens.accessToken
}

function authed(token: string) {
  return { authorization: `Bearer ${token}` }
}

test.describe('Seed contract', () => {
  test('tokens, components and docs match the dataset exactly', async ({ request }) => {
    const tok = await (await request.get('/api/tokens')).json()
    const tokenList = tok.data.tokens
    expect(tokenList).toHaveLength(tokens.length)
    expect(tokenList.some((t) => t.name === 'color.primary.500')).toBeTruthy()
    expect(tokenList.some((t) => t.name === 'motion.duration.fast')).toBeTruthy()

    const comp = await (await request.get('/api/components')).json()
    const componentList = comp.data.components
    expect(componentList.map((c) => c.name).sort()).toEqual([...componentFiles].sort())
    const statuses = new Set(componentList.map((c) => c.status))
    expect(statuses.has('approved')).toBeTruthy()
    expect(statuses.has('draft')).toBeTruthy()
    expect(statuses.has('review')).toBeTruthy()

    const doc = await (await request.get('/api/docs')).json()
    const docList = doc.data.pages
    expect(docList.map((p) => p.slug).sort()).toEqual(docs.map((d) => d.slug).sort())
  })

  test('by-slug returns the full component spec', async ({ request }) => {
    const res = await request.get('/api/components/by-slug/button')
    expect(res.status()).toBe(200)
    const component = (await res.json()).data.component
    expect(component.display_name).toBe('Button')
    expect(component.spec.variants).toHaveLength(6)
    expect(component.spec.props).toHaveLength(8)
    expect(component.spec.a11y).toHaveLength(6)
    expect(component.spec.props.every((p) => p.name && p.type)).toBeTruthy()
  })

  test('search finds components, tokens and docs', async ({ request }) => {
    const component = await (await request.get('/api/search?q=button&type=component')).json()
    expect(component.data.results.map((r) => r.title)).toContain('Button')

    const token = await (await request.get('/api/search?q=primary&type=token')).json()
    expect(token.data.results.length).toBeGreaterThanOrEqual(5)
    expect(token.data.results.map((r) => r.title)).toContain('color.primary.500')

    const doc = await (await request.get('/api/search?q=theming&type=doc')).json()
    expect(doc.data.results.map((r) => r.title)).toContain('Theming with tokens')
  })

  test('token export round-trips the seeded names', async ({ request }) => {
    const res = await request.get('/api/tokens/export?format=json')
    expect(res.status()).toBe(200)
    const content = (await res.json()).data.content
    expect(content).toContain('color.primary.500')
    expect(content).toContain('font.family.sans')
  })

  test('codegen emits code for vue, react and svelte', async ({ request }) => {
    const list = (await (await request.get('/api/components')).json()).data.components
    const button = list.find((c) => c.name === 'button')

    for (const framework of ['vue', 'react', 'svelte']) {
      const res = await request.post(`/api/components/${button.id}/generate`, {
        data: { framework },
      })
      expect(res.status()).toBe(200)
      const { data } = await res.json()
      expect(data.componentName).toBe('button')
      expect(data.code.length).toBeGreaterThan(50)
    }
  })
})

test.describe('Admin write flows', () => {
  test('create → read → update → delete a token', async ({ request }) => {
    const token = await login(request)
    const headers = authed(token)
    const name = `e2e.test.token.${Date.now()}` // names stay unique across reruns (soft-deleted names are retained)

    const created = await request.post('/api/tokens', {
      headers,
      data: { name, category: 'color', value: '#123456', description: 'Created by E2E' },
    })
    expect(created.status()).toBe(201)

    const list = (await (await request.get('/api/tokens')).json()).data.tokens
    const row = list.find((t) => t.name === name)
    expect(row).toBeTruthy()
    expect(row.category).toBe('color')

    const del = await request.delete(`/api/tokens/${row.id}`, { headers })
    expect(del.status()).toBe(200)
    const after = (await (await request.get('/api/tokens')).json()).data.tokens
    expect(after.some((t) => t.name === name)).toBeFalsy()
  })

  test('update a component and see it on the public API', async ({ request }) => {
    const token = await login(request)
    const headers = authed(token)

    const list = (await (await request.get('/api/components')).json()).data.components
    const badge = list.find((c) => c.name === 'badge')

    const updated = await request.put(`/api/components/${badge.id}`, {
      headers,
      data: { description: 'Badge (updated by E2E)' },
    })
    expect(updated.status()).toBe(200)

    const res = await request.get('/api/components/by-slug/badge')
    expect((await res.json()).data.component.description).toContain('updated by E2E')
  })

  test('non-admin users cannot write settings', async ({ request }) => {
    // A second self-registered account gets the viewer role
    const email = `viewer-${Date.now()}@opends.local`
    const reg = await request.post('/api/auth/register', {
      data: { email, password: 'Viewer-123', name: 'Viewer' },
    })
    expect(reg.status()).toBe(201)
    const viewerToken = (await reg.json()).data.tokens.accessToken

    const res = await request.put('/api/settings', {
      headers: authed(viewerToken),
      data: { organization_name: 'Hijacked' },
    })
    expect(res.status()).toBe(403)
  })
})

/**
 * Penpot plugin import contract — the two endpoints the OpenDS Penpot plugin
 * pushes to, authenticated with the plugin API key (dev/test key resolves via
 * the validator's key set without needing a DB row).
 */
test.describe('Penpot plugin import contract', () => {
  const PLUGIN_KEY = 'test-api-key'
  const plugin = (extra = {}) => ({ headers: { authorization: `Bearer ${PLUGIN_KEY}` }, ...extra })

  test('tokens import: syncs once, dedupes on re-push, appears publicly', async ({ request }) => {
    const name = `penpot.e2e.color.${Date.now()}`
    const payload = { colors: [{ id: 'e2e', name, value: '#8A5CF6', type: 'color' }], typography: [], spacing: [] }

    const first = await request.post('/api/penpot/tokens', plugin({ data: payload }))
    expect(first.status()).toBe(200)
    expect((await first.json()).data.synced).toBe(1)

    const second = await request.post('/api/penpot/tokens', plugin({ data: payload }))
    expect((await second.json()).data.skipped).toBe(1)

    const list = (await (await request.get('/api/tokens')).json()).data.tokens
    expect(list.some((t) => t.name === name)).toBeTruthy()
  })

  test('components import: syncs, dedupes, lands as review with source spec', async ({ request }) => {
    const payload = {
      components: [
        { id: 'pc-e2e', name: 'Penpot Badge', displayName: 'Penpot Badge', description: 'Imported by E2E', type: 'COMPONENT', structure: { shapesCount: 2 } },
      ],
    }

    const first = await request.post('/api/penpot/components', plugin({ data: payload }))
    expect(first.status()).toBe(200)
    expect((await first.json()).data.synced).toBe(1)

    const second = await request.post('/api/penpot/components', plugin({ data: payload }))
    expect((await second.json()).data.skipped).toBe(1)

    const res = await request.get('/api/components/by-slug/penpot-badge')
    expect(res.status()).toBe(200)
    const component = (await res.json()).data.component
    expect(component.display_name).toBe('Penpot Badge')
    expect(component.status).toBe('review')

    // The public by-slug projection only surfaces specs that have authored
    // variants; the imported Penpot spec (source/sourceId) lives on the row.
    const list = (await (await request.get('/api/components')).json()).data.components
    const row = list.find((c) => c.name === 'penpot-badge')
    const raw = row.spec
    const spec = typeof raw === 'string' ? JSON.parse(raw) : raw || {}
    expect(spec.source).toBe('penpot')
    expect(spec.sourceId).toBe('pc-e2e')
    expect(spec.nodeType).toBe('COMPONENT')
  })
})
