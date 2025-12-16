import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { config } from '../../config'
import type { StorageProvider, StoredObject } from './storage'

export class S3Storage implements StorageProvider {
  private client: S3Client
  private bucket: string

  constructor() {
    const s3Config: any = {
      region: config.s3Region,
      forcePathStyle: config.s3ForcePathStyle
    }

    if (config.s3Endpoint) {
      s3Config.endpoint = config.s3Endpoint
    }

    if (config.s3AccessKeyId && config.s3SecretAccessKey) {
      s3Config.credentials = {
        accessKeyId: config.s3AccessKeyId,
        secretAccessKey: config.s3SecretAccessKey
      }
    }

    this.client = new S3Client(s3Config)
    this.bucket = config.s3Bucket
  }

  async uploadObject(key: string, content: Buffer | Uint8Array, contentType: string): Promise<StoredObject> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: content,
      ContentType: contentType
    })

    await this.client.send(command)

    return {
      key,
      url: await this.getObjectUrl(key)
    }
  }

  async getObjectUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key
    })

    return getSignedUrl(this.client, command, { expiresIn: 3600 })
  }
}