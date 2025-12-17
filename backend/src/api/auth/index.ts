import type { FastifyPluginAsync } from 'fastify'
import { randomUUID } from 'crypto'
import { dataSource } from '../../infrastructure/database/data-source'
import { OAuthState } from '../../domain/entities/OAuthState'
import { ExternalAccount } from '../../domain/entities/ExternalAccount'
import { encryptToken } from '../../infrastructure/crypto/tokens'
import * as figma from '../../infrastructure/oauth/figma'
import * as penpot from '../../infrastructure/oauth/penpot'

export const authRoutes: FastifyPluginAsync = async fastify => {
  fastify.get('/providers', async () => {
    return {
      providers: [
        { id: 'figma', name: 'Figma', connectUrl: '/api/auth/figma/connect' },
        { id: 'penpot', name: 'Penpot', connectUrl: '/api/auth/penpot/connect' }
      ]
    }
  })

  fastify.get('/:provider/connect', async (request, reply) => {
    const provider = (request.params as any).provider as 'figma' | 'penpot'
    const verifier =
      provider === 'figma' ? figma.createCodeVerifier() : penpot.createCodeVerifier()
    const challenge =
      provider === 'figma'
        ? figma.createCodeChallenge(verifier)
        : penpot.createCodeChallenge(verifier)
    const state = randomUUID().replace(/-/g, '')
    const repo = dataSource.getRepository(OAuthState)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
    await repo.save({ state, codeVerifier: verifier, provider, redirectUri: '', userId: null, expiresAt })
    const url =
      provider === 'figma'
        ? figma.getAuthorizeUrl(state, challenge)
        : penpot.getAuthorizeUrl(state, challenge)
    reply.redirect(url)
  })

  fastify.get('/:provider/callback', async (request, reply) => {
    const provider = (request.params as any).provider as 'figma' | 'penpot'
    const { state, code, error } = request.query as any
    if (error) return reply.code(400).send({ error: true, code: 'OAUTH_ERROR', message: String(error) })
    const stateRepo = dataSource.getRepository(OAuthState)
    const record = await stateRepo.findOne({ where: { state } })
    if (!record || record.expiresAt.getTime() < Date.now()) {
      return reply.code(400).send({ error: true, code: 'OAUTH_STATE_INVALID' })
    }
    const tokenData =
      provider === 'figma'
        ? await figma.exchangeCodeForToken(code, record.codeVerifier)
        : await penpot.exchangeCodeForToken(code, record.codeVerifier)
    const accessEnc = encryptToken(tokenData.access_token)
    const refreshEnc = tokenData.refresh_token ? encryptToken(tokenData.refresh_token) : null
    const expiresAt =
      tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000) : null
    const accRepo = dataSource.getRepository(ExternalAccount)
    const providerUserId = 'self'
    const existing = await accRepo.findOne({
      where: { provider, providerUserId }
    })
    const entity =
      existing ??
      accRepo.create({
        provider,
        providerUserId
      } as ExternalAccount)
    entity.accessTokenEnc = accessEnc
    entity.refreshTokenEnc = refreshEnc
    entity.expiresAt = expiresAt
    entity.lastRefreshedAt = new Date()
    await accRepo.save(entity)
    await stateRepo.delete({ id: record.id })
    reply.redirect('/connections')
  })
}

