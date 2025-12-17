import type { FastifyPluginAsync } from 'fastify'
import { dataSource } from '../infrastructure/database/data-source'
import { ExternalAccount } from '../domain/entities/ExternalAccount'
import { decryptToken } from '../infrastructure/crypto/tokens'
import * as figma from '../infrastructure/oauth/figma'
import * as penpot from '../infrastructure/oauth/penpot'

export const filesRoutes: FastifyPluginAsync = async fastify => {
  fastify.get('/:provider', async (request, reply) => {
    const provider = (request.params as any).provider as 'figma' | 'penpot'
    const repo = dataSource.getRepository(ExternalAccount)
    const acc = await repo.findOne({ where: { provider } })
    if (!acc || !acc.accessTokenEnc) {
      return reply.code(400).send({ error: true, code: 'ACCOUNT_NOT_CONNECTED' })
    }
    const access = decryptToken(acc.accessTokenEnc as any)
    try {
      const data =
        provider === 'figma' ? await figma.listFiles(access) : await penpot.listFiles(access)
      return { files: data.files ?? data }
    } catch (e: any) {
      return reply.code(500).send({ error: true, code: 'FILES_LIST_FAILED', message: e?.message })
    }
  })
}

