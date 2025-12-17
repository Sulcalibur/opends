import { config } from '../../config'
import { NoopStorage } from './storage'
import { S3Storage } from './s3-storage'
import type { StorageProvider } from './storage'

export function createStorageProvider(): StorageProvider {
  if (config.s3AccessKeyId && config.s3SecretAccessKey) {
    return new S3Storage()
  }
  
  return new NoopStorage()
}

export const storage = createStorageProvider()