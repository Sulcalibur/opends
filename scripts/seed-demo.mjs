#!/usr/bin/env node
/**
 * OpenDS demo seed — pushes the Ember demo design system
 * (design-system-data/) into a running OpenDS instance through its
 * public HTTP API, so seeding exercises the same contract a user's first
 * import does and works identically in SQL and PocketBase modes.
 *
 * Usage:
 *   pnpm seed:demo
 *   OPENDS_URL=http://localhost:3000 pnpm seed:demo
 *   OPENDS_ADMIN_EMAIL=a@b.c OPENDS_ADMIN_PASSWORD=secret pnpm seed:demo
 *
 * Auth resolution order:
 *   1. OPENDS_ADMIN_EMAIL + OPENDS_ADMIN_PASSWORD → login (PB or SQL mode auto-detected)
 *   2. otherwise → register the default admin (works on a fresh SQL-mode
 *      instance where the first registered user becomes admin)
 *
 * Seeding is idempotent: tokens/components/docs that already exist by
 * name/slug are skipped (409 / import dedupe), so re-running is safe.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DATA_DIR = join(ROOT, 'design-system-data')

const DEFAULT_EMAIL = 'admin@opends.local'
// Must satisfy the app's password policy (uppercase required)
const DEFAULT_PASSWORD = 'OpenDS-Demo-1'

/* ------------------------------------------------------------------ */
/* Tiny HTTP client with auth cookie/Bearer support                    */
/* ------------------------------------------------------------------ */

function createClient(baseUrl) {
  const state = { bearer: null, cookie: null }

  async function request(path, { method = 'GET', body } = {}) {
    const headers = { accept: 'application/json' }
    if (body !== undefined) headers['content-type'] = 'application/json'
    if (state.bearer) headers.authorization = `Bearer ${state.bearer}`
    if (state.cookie) headers.cookie = state.cookie

    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      redirect: 'manual',
    })

    // Persist auth cookies (PocketBase mode sets an httpOnly pb_auth cookie)
    const setCookies = res.headers.getSetCookie?.() ?? []
    if (setCookies.length > 0) {
      state.cookie = setCookies
        .map((c) => c.split(';')[0])
        .join('; ')
    }

    const text = await res.text()
    let json = null
    try { json = text ? JSON.parse(text) : null } catch { /* non-JSON */ }

    return { status: res.status, json }
  }

  return {
    request,
    setBearer(token) { state.bearer = token },
    get cookie() { return state.cookie },
  }
}

/** Extract a human message from any of the API's error envelopes. */
function errorMessage(status, json, fallback) {
  const error = json?.error
  return (
    error?.message
    || json?.statusMessage
    || json?.message
    || (status ? `HTTP ${status}` : '')
    || fallback
  )
}

/* ------------------------------------------------------------------ */
/* Auth                                                                */
/* ------------------------------------------------------------------ */

async function resolveAuth(client, { email, password }) {
  // 1) Login — try PocketBase first, then SQL/JWT mode
  const pbLogin = await client.request('/api/auth-pb/login', {
    method: 'POST',
    body: { email, password },
  })
  if (pbLogin.status === 200) {
    console.log(`✔ Logged in via PocketBase (${email})`)
    return { mode: 'pocketbase' }
  }

  const sqlLogin = await client.request('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  })
  const tokens = sqlLogin.json?.data?.tokens
  if (sqlLogin.status === 200 && tokens?.accessToken) {
    client.setBearer(tokens.accessToken)
    console.log(`✔ Logged in via SQL/JWT (${email}, role ${sqlLogin.json.data.user.role})`)
    return { mode: 'sql', role: sqlLogin.json.data.user.role }
  }

  return { mode: null }
}

async function registerFirstUser(client, { email, password }) {
  const res = await client.request('/api/auth/register', {
    method: 'POST',
    body: { email, password, name: 'OpenDS Admin' },
  })
  const tokens = res.json?.data?.tokens
  // Accept any 2xx — some wrappers report 200 even when the route sets 201
  if (res.status >= 200 && res.status < 300 && tokens?.accessToken) {
    client.setBearer(tokens.accessToken)
    return res.json.data.user
  }
  return null
}

/* ------------------------------------------------------------------ */
/* Seed steps                                                          */
/* ------------------------------------------------------------------ */

async function seedSettings(client, config) {
  const orgName = config.organizationName
  if (!orgName) return 0
  const res = await client.request('/api/settings', {
    method: 'PUT',
    body: { organization_name: orgName },
  })
  if (res.status === 200) {
    console.log(`✔ Setting organization_name → "${orgName}"`)
    return 1
  }
  console.warn(`⚠ Settings skipped (${errorMessage(res.status, res.json, 'unknown')}) — requires an admin account`)
  return 0
}

async function seedTokens(client, tokensJson) {
  const record = {}
  for (const t of tokensJson.tokens) {
    record[t.name] = { value: t.value, category: t.category, description: t.description ?? '' }
  }
  const res = await client.request('/api/tokens/import', {
    method: 'POST',
    body: { tokens: record },
  })
  if (res.status === 200) {
    const { imported = 0, skipped = 0, errors = [] } = res.json?.data ?? {}
    console.log(`✔ Tokens — imported ${imported}, skipped ${skipped}${errors.length ? `, errors ${errors.length}` : ''}`)
    return { imported, skipped, errors }
  }
  throw new Error(`Token import failed: ${errorMessage(res.status, res.json, 'HTTP error')}`)
}

async function seedComponents(client, files) {
  let imported = 0
  let skipped = 0
  const failed = []
  for (const file of files) {
    const c = JSON.parse(readFileSync(join(DATA_DIR, 'components', file), 'utf8'))
    const res = await client.request('/api/components', {
      method: 'POST',
      body: {
        name: c.name,
        display_name: c.displayName,
        description: c.description,
        category: c.category,
        status: c.status,
        spec: c.spec,
      },
    })
    if (res.status === 201) imported++
    else if (res.status === 409) skipped++
    else failed.push(`${c.name} (${errorMessage(res.status, res.json, 'HTTP error')})`)
  }
  console.log(`✔ Components — imported ${imported}, skipped ${skipped}${failed.length ? `, failed ${failed.length}` : ''}`)
  if (failed.length) console.warn(`  failed: ${failed.join(', ')}`)
  return { imported, skipped, failed }
}

async function seedDocs(client, docsJson) {
  let imported = 0
  let skipped = 0
  const failed = []
  for (const doc of docsJson.docs) {
    const content = readFileSync(join(DATA_DIR, doc.file), 'utf8')
    const res = await client.request('/api/docs', {
      method: 'POST',
      body: {
        slug: doc.slug,
        title: doc.title,
        content,
        excerpt: doc.excerpt,
        category: doc.category,
        sortOrder: doc.sortOrder,
        isPublished: doc.isPublished !== false,
      },
    })
    if (res.status === 201) imported++
    else if (res.status === 409) skipped++
    else failed.push(`${doc.slug} (${errorMessage(res.status, res.json, 'HTTP error')})`)
  }
  console.log(`✔ Docs — imported ${imported}, skipped ${skipped}${failed.length ? `, failed ${failed.length}` : ''}`)
  if (failed.length) console.warn(`  failed: ${failed.join(', ')}`)
  return { imported, skipped, failed }
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

export async function seedDemo({
  baseUrl = process.env.OPENDS_URL || 'http://localhost:3000',
  adminEmail = process.env.OPENDS_ADMIN_EMAIL || DEFAULT_EMAIL,
  adminPassword = process.env.OPENDS_ADMIN_PASSWORD || DEFAULT_PASSWORD,
  log = true,
} = {}) {
  const client = createClient(baseUrl)
  const config = JSON.parse(readFileSync(join(DATA_DIR, 'config.json'), 'utf8'))
  const tokensJson = JSON.parse(readFileSync(join(DATA_DIR, 'tokens.json'), 'utf8'))
  const docsJson = JSON.parse(readFileSync(join(DATA_DIR, 'docs.json'), 'utf8'))
  const componentFiles = readdirSync(join(DATA_DIR, 'components'))
    .filter((f) => f.endsWith('.json'))
    .sort()

  if (log) console.log(`Seeding “${config.name}” demo design system → ${baseUrl}`)

  // Auth: try provided credentials, then first-user registration
  let authed = await resolveAuth(client, { email: adminEmail, password: adminPassword })
  if (!authed.mode) {
    const user = await registerFirstUser(client, { email: adminEmail, password: adminPassword })
    if (user) {
      if (log) console.log(`✔ Registered first user (${user.email}, role ${user.role})`)
      authed = { mode: 'sql', role: user.role }
    }
  }
  if (!authed.mode) {
    throw new Error(
      `Could not authenticate as ${adminEmail}. Provide OPENDS_ADMIN_EMAIL / ` +
      'OPENDS_ADMIN_PASSWORD for an existing account, or start with an empty instance so the first user can register.',
    )
  }

  const summary = {}
  summary.settings = await seedSettings(client, config)
  summary.tokens = await seedTokens(client, tokensJson)
  summary.components = await seedComponents(client, componentFiles)
  summary.docs = await seedDocs(client, docsJson)

  if (log) {
    console.log('\nSeed complete:')
    console.log(`  settings   ${summary.settings}`)
    console.log(`  tokens     ${summary.tokens.imported} imported · ${summary.tokens.skipped} skipped`)
    console.log(`  components ${summary.components.imported} imported · ${summary.components.skipped} skipped`)
    console.log(`  docs       ${summary.docs.imported} imported · ${summary.docs.skipped} skipped`)
  }

  return summary
}

/* Run as CLI when executed directly (not imported by the E2E harness) */
const invokedDirectly = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href
if (invokedDirectly) {
  seedDemo().catch((error) => {
    console.error(`✖ ${error.message}`)
    process.exit(1)
  })
}
