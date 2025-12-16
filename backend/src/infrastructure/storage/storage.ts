export interface StoredObject {
  key: string
  url?: string
}

export interface StorageProvider {
  uploadObject(key: string, content: Buffer | Uint8Array, contentType: string): Promise<StoredObject>
  getObjectUrl(key: string): Promise<string>
}

export class NoopStorage implements StorageProvider {
  async uploadObject(key: string, _content: Buffer | Uint8Array, _contentType: string): Promise<StoredObject> {
    return { key }
  }
  async getObjectUrl(key: string): Promise<string> {
    return `/${key}`
  }
}

