import axios from 'axios'
import crypto from 'crypto'
import { config } from '../../config'

export function createCodeVerifier() {
  return crypto.randomBytes(32).toString('base64url')
}

export function createCodeChallenge(verifier: string) {
  const hash = crypto.createHash('sha256').update(verifier).digest()
  return Buffer.from(hash).toString('base64url')
}

export function getAuthorizeUrl(state: string, codeChallenge: string) {
  const issuer = process.env.PENPOT_OIDC_ISSUER || 'https://design.penpot.app/auth'
  const authUrl = `${issuer}/oauth/authorize`
  const params = new URLSearchParams({
    client_id: process.env.PENPOT_CLIENT_ID || '',
    redirect_uri: process.env.PENPOT_REDIRECT_URI || `${config.publicBaseUrl}/api/auth/penpot/callback`,
    response_type: 'code',
    scope: 'openid profile email',
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256'
  })
  return `${authUrl}?${params.toString()}`
}

export async function exchangeCodeForToken(code: string, verifier: string) {
  const issuer = process.env.PENPOT_OIDC_ISSUER || 'https://design.penpot.app/auth'
  const tokenUrl = `${issuer}/oauth/token`
  const params = new URLSearchParams({
    client_id: process.env.PENPOT_CLIENT_ID || '',
    client_secret: process.env.PENPOT_CLIENT_SECRET || '',
    redirect_uri: process.env.PENPOT_REDIRECT_URI || `${config.publicBaseUrl}/api/auth/penpot/callback`,
    grant_type: 'authorization_code',
    code,
    code_verifier: verifier
  })
  const { data } = await axios.post(tokenUrl, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  return data as { access_token: string; refresh_token?: string; expires_in?: number; id_token?: string }
}

export async function refreshToken(refreshToken: string) {
  const issuer = process.env.PENPOT_OIDC_ISSUER || 'https://design.penpot.app/auth'
  const tokenUrl = `${issuer}/oauth/token`
  const params = new URLSearchParams({
    client_id: process.env.PENPOT_CLIENT_ID || '',
    client_secret: process.env.PENPOT_CLIENT_SECRET || '',
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  })
  const { data } = await axios.post(tokenUrl, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  return data as { access_token: string; refresh_token?: string; expires_in?: number }
}

export async function listFiles(accessToken: string) {
  const api = process.env.PENPOT_API_URL || `${config.penpotApiUrl}`
  const { data } = await axios.get(`${api}/files`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
  return data
}

