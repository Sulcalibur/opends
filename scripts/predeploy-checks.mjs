import { readFileSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { join } from 'node:path'

function semverGte(a, b) {
  const pa = a.replace(/^v/, '').split('.').map(Number)
  const pb = b.replace(/^v/, '').split('.').map(Number)
  for (let i = 0; i < 3; i++) {
    if ((pa[i] || 0) > (pb[i] || 0)) return true
    if ((pa[i] || 0) < (pb[i] || 0)) return false
  }
  return true
}

function checkNode() {
  const v = process.version
  const ok = semverGte(v, '20.0.0')
  return { name: 'node', version: v, ok, message: ok ? '' : 'Node.js >= 20 required' }
}

function checkPackageManager() {
  let pm = ''
  let ok = true
  try {
    pm = execSync('pnpm -v', { stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim()
  } catch {
    ok = false
  }
  return { name: 'pnpm', version: pm || 'not found', ok, message: ok ? '' : 'pnpm not available' }
}

function checkLockfiles(root) {
  const npmLockRoot = existsSync(join(root, 'package-lock.json'))
  const npmLockSimplified = existsSync(join(root, 'simplified', 'package-lock.json'))
  const npmLockPlugin = existsSync(join(root, 'opends-penpot-plugin', 'package-lock.json'))
  const pnpmLockRoot = existsSync(join(root, 'pnpm-lock.yaml'))
  const pnpmLockSimplified = existsSync(join(root, 'simplified', 'pnpm-lock.yaml'))
  const ok = !npmLockRoot && !npmLockSimplified && !npmLockPlugin && pnpmLockRoot && pnpmLockSimplified
  let message = ''
  if (!ok) {
    message = 'Ensure npm lockfiles are removed and pnpm lockfiles exist at root and simplified'
  }
  return {
    name: 'lockfiles',
    ok,
    details: { npmLockRoot, npmLockSimplified, npmLockPlugin, pnpmLockRoot, pnpmLockSimplified },
    message
  }
}

function checkWorkspace(root) {
  const wsPath = join(root, 'pnpm-workspace.yaml')
  if (!existsSync(wsPath)) return { name: 'workspace', ok: false, message: 'pnpm-workspace.yaml missing' }
  const content = readFileSync(wsPath, 'utf8')
  const hasSimplified = /simplified/.test(content)
  const ok = hasSimplified
  return { name: 'workspace', ok, message: ok ? '' : 'simplified package not included in workspace' }
}

function checkEnv() {
  const required = ['CF_ACCOUNT_ID', 'CF_API_TOKEN']
  const missing = required.filter((k) => !process.env[k])
  const ok = missing.length === 0
  return { name: 'env', ok, message: ok ? '' : `Missing env: ${missing.join(', ')}` }
}

function summarize(results) {
  const lines = []
  for (const r of results) {
    if (r.version) lines.push(`${r.name}: ${r.version} ${r.ok ? '✓' : '✗'} ${r.message}`)
    else lines.push(`${r.name}: ${r.ok ? '✓' : '✗'} ${r.message}`)
  }
  const ok = results.every((r) => r.ok)
  return { ok, text: lines.join('\n') }
}

function main() {
  const root = process.cwd()
  const results = [checkNode(), checkPackageManager(), checkLockfiles(root), checkWorkspace(root), checkEnv()]
  const summary = summarize(results)
  console.log(summary.text)
  if (!summary.ok) process.exit(1)
}

main()

