import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { config } from '../../config'
import { DesignFile } from '../../domain/entities/DesignFile'
import { ComponentSpec } from '../../domain/entities/ComponentSpec'
import { DesignToken } from '../../domain/entities/DesignToken'

export const dataSource = new DataSource({
  type: 'postgres',
  url: config.databaseUrl,
  synchronize: false,
  logging: config.isDevelopment,
  entities: [DesignFile, ComponentSpec, DesignToken],
  migrations: ['src/infrastructure/database/migrations/*.ts']
})

export async function initDataSource() {
  if (!dataSource.isInitialized) {
    await dataSource.initialize()
  }
  return dataSource
}

