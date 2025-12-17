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
  const params = new URLSearchParams({
    client_id: process.env.FIGMA_CLIENT_ID || '',
    redirect_uri: process.env.FIGMA_REDIRECT_URI || `${config.publicBaseUrl}/api/auth/figma/callback`,
    response_type: 'code',
    scope: 'file_read',
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256'
  })
  return `https://www.figma.com/oauth?${params.toString()}`
}

export async function exchangeCodeForToken(code: string, verifier: string) {
  const params = new URLSearchParams({
    client_id: process.env.FIGMA_CLIENT_ID || '',
    client_secret: process.env.FIGMA_CLIENT_SECRET || '',
    redirect_uri: process.env.FIGMA_REDIRECT_URI || `${config.publicBaseUrl}/api/auth/figma/callback`,
    grant_type: 'authorization_code',
    code,
    code_verifier: verifier
  })
  const { data } = await axios.post('https://www.figma.com/api/oauth/token', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  return data as { access_token: string; refresh_token?: string; expires_in?: number }
}

export async function refreshToken(refreshToken: string) {
  const params = new URLSearchParams({
    client_id: process.env.FIGMA_CLIENT_ID || '',
    client_secret: process.env.FIGMA_CLIENT_SECRET || '',
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  })
  const { data } = await axios.post('https://www.figma.com/api/oauth/token', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  return data as { access_token: string; refresh_token?: string; expires_in?: number }
}

export async function listFiles(accessToken: string) {
  const { data } = await axios.get('https://api.figma.com/v1/me/files', {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
  return data
}

