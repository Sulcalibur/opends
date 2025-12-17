import { PenpotClient } from '../../infrastructure/penpot/client'
import { DesignFileRepository } from '../repositories/DesignFileRepository'
import { ComponentSpecRepository } from '../repositories/ComponentSpecRepository'
import { DesignTokenRepository } from '../repositories/DesignTokenRepository'
import { DesignFile, type DesignSource } from '../entities/DesignFile'
import { ComponentSpec } from '../entities/ComponentSpec'
import { DesignToken } from '../entities/DesignToken'
import { config } from '../../config'

export interface SyncResult {
  success: boolean
  fileId: string
  componentsSynced: number
  tokensSynced: number
  errors: string[]
  warnings: string[]
}

export class DesignSyncService {
  private penpotClient: PenpotClient
  private designFileRepo: DesignFileRepository
  private componentSpecRepo: ComponentSpecRepository
  private designTokenRepo: DesignTokenRepository

  constructor() {
    this.penpotClient = new PenpotClient(config.penpotApiToken)
    this.designFileRepo = new DesignFileRepository()
    this.componentSpecRepo = new ComponentSpecRepository()
    this.designTokenRepo = new DesignTokenRepository()
  }

  async syncDesignFile(fileId: string, source: DesignSource = 'penpot'): Promise<SyncResult> {
    const result: SyncResult = {
      success: false,
      fileId,
      componentsSynced: 0,
      tokensSynced: 0,
      errors: [],
      warnings: []
    }

    try {
      // Get or create design file
      let designFile = await this.designFileRepo.getById(fileId)
      if (!designFile) {
        designFile = new DesignFile()
        designFile.id = fileId
        designFile.name = `Design File ${fileId.slice(0, 8)}`
        designFile.source = source
        designFile = await this.designFileRepo.save(designFile)
        result.warnings.push(`Created new design file record for ${fileId}`)
      }

      // Fetch data from source
      if (source === 'penpot') {
        await this.syncFromPenpot(designFile, result)
      } else {
        result.errors.push(`Source '${source}' not yet supported`)
        return result
      }

      result.success = result.errors.length === 0
      return result

    } catch (error) {
      result.errors.push(`Sync failed: ${error instanceof Error ? error.message : String(error)}`)
      return result
    }
  }

  private async syncFromPenpot(designFile: DesignFile, result: SyncResult): Promise<void> {
    try {
      // Fetch components from Penpot
      const penpotComponents = await this.penpotClient.listComponents(designFile.id)
      
      for (const penpotComponent of penpotComponents) {
        try {
          const componentSpec = new ComponentSpec()
          componentSpec.name = penpotComponent.name
          componentSpec.variant = penpotComponent.variant || 'default'
          componentSpec.properties = {
            ...penpotComponent.properties,
            penpotId: penpotComponent.id
          }
          componentSpec.designFile = designFile

          await this.componentSpecRepo.save(componentSpec)
          result.componentsSynced++
        } catch (error) {
          result.errors.push(`Failed to sync component ${penpotComponent.name}: ${error instanceof Error ? error.message : String(error)}`)
        }
      }

      // Fetch design tokens from Penpot
      const penpotTokens = await this.penpotClient.listTokens(designFile.id)
      
      for (const penpotToken of penpotTokens) {
        try {
          const designToken = new DesignToken()
          designToken.name = penpotToken.name
          // Map Penpot token type to our TokenType
          const tokenType = penpotToken.type === 'typography' ? 'typography' : 
                           penpotToken.type === 'color' ? 'color' : 'other'
          designToken.type = tokenType
          designToken.value = penpotToken.value
          designToken.designFile = designFile

          await this.designTokenRepo.save(designToken)
          result.tokensSynced++
        } catch (error) {
          result.errors.push(`Failed to sync token ${penpotToken.name}: ${error instanceof Error ? error.message : String(error)}`)
        }
      }

      // Update design file timestamp
      designFile.updatedAt = new Date()
      await this.designFileRepo.save(designFile)

    } catch (error) {
      throw new Error(`Penpot sync failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  async syncAllDesignFiles(): Promise<SyncResult[]> {
    const designFiles = await this.designFileRepo.list()
    const results: SyncResult[] = []

    for (const designFile of designFiles) {
      const result = await this.syncDesignFile(designFile.id, designFile.source)
      results.push(result)
    }

    return results
  }
}