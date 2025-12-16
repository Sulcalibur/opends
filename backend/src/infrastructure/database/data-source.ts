import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { config } from '../../config'
import { DesignFile } from '../../domain/entities/DesignFile'
import { ComponentSpec } from '../../domain/entities/ComponentSpec'
import { DesignToken } from '../../domain/entities/DesignToken'

export const dataSource = new DataSource({
  type: 'sqlite',
  database: './opends.db',
  synchronize: true, // Auto-create tables for development (SQLite doesn't need migrations)
  logging: config.isDevelopment,
  entities: [DesignFile, ComponentSpec, DesignToken]
})

export async function initDataSource() {
  if (!dataSource.isInitialized) {
    await dataSource.initialize()
  }
  return dataSource
}

