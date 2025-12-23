import { env } from 'node:process'

async function rollbackPages() {
  const accountId = env.CF_ACCOUNT_ID
  const projectName = env.CF_PAGES_PROJECT
  const token = env.CF_API_TOKEN
  if (!accountId || !projectName || !token) {
    console.error('Missing CF_ACCOUNT_ID, CF_PAGES_PROJECT or CF_API_TOKEN')
    process.exit(1)
  }
  const base = `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}`
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
  const deploymentsRes = await fetch(`${base}/deployments?per_page=10`, { headers })
  const deployments = await deploymentsRes.json()
  if (!deployments?.result?.length) {
    console.error('No deployments found')
    process.exit(1)
  }
  const successful = deployments.result.filter((d) => d.environment === 'production' && d.latest_stage?.status === 'SUCCESS')
  if (successful.length < 2) {
    console.error('No previous successful deployment to rollback to')
    process.exit(1)
  }
  const target = successful[1]
  console.log(`Rolling back to ${target.id} created at ${target.created_on}`)
  const promoteRes = await fetch(`${base}/deployments/${target.id}/retry`, { method: 'POST', headers })
  const promote = await promoteRes.json()
  if (!promote.success) {
    console.error('Rollback failed', JSON.stringify(promote.errors || promote, null, 2))
    process.exit(1)
  }
  console.log('Rollback triggered')
}

async function rollbackWorkers() {
  const accountId = env.CF_ACCOUNT_ID
  const scriptName = env.CF_WORKER_NAME
  const token = env.CF_API_TOKEN
  if (!accountId || !scriptName || !token) {
    console.error('Missing CF_ACCOUNT_ID, CF_WORKER_NAME or CF_API_TOKEN')
    process.exit(1)
  }
  const base = `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${scriptName}`
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
  const res = await fetch(`${base}/versions`, { headers })
  const data = await res.json()
  const versions = data?.result || []
  if (versions.length < 2) {
    console.error('No previous worker version to rollback to')
    process.exit(1)
  }
  const target = versions[1]
  console.log(`Target worker version: ${target.id}`)
  console.log('Rollback requires redeploying the previous version with wrangler')
  console.log('Run: wrangler versions deploy --hash <hash> or use wrangler rollback if available')
}

async function main() {
  const target = env.CF_ROLLBACK_TARGET || 'pages'
  if (target === 'pages') {
    await rollbackPages()
  } else {
    await rollbackWorkers()
  }
}

main()

