import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { config } from '../../config'
import { DesignFile } from '../../domain/entities/DesignFile'
import { ComponentSpec } from '../../domain/entities/ComponentSpec'
import { DesignToken } from '../../domain/entities/DesignToken'
import { User } from '../../domain/entities/User'
import { ExternalAccount } from '../../domain/entities/ExternalAccount'
import { OAuthState } from '../../domain/entities/OAuthState'

export const dataSource = new DataSource({
  type: 'postgres',
  url: config.databaseUrl,
  synchronize: config.isDevelopment,
  logging: config.isDevelopment,
  entities: [DesignFile, ComponentSpec, DesignToken, User, ExternalAccount, OAuthState]
})

export async function initDataSource() {
  if (!dataSource.isInitialized) {
    await dataSource.initialize()
  }
  return dataSource
}
