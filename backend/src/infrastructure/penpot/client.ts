import axios, { AxiosInstance } from 'axios'
import { config } from '../../config'

export class PenpotClient {
  private http: AxiosInstance

  constructor(token?: string) {
    this.http = axios.create({
      baseURL: config.penpotApiUrl,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    })
  }

  async getFile(fileId: string) {
    const { data } = await this.http.get(`/files/${fileId}`)
    return data
  }

  async listComponents(fileId: string) {
    const { data } = await this.http.get(`/files/${fileId}/components`)
    return data
  }

  async listTokens(fileId: string) {
    const { data } = await this.http.get(`/files/${fileId}/tokens`)
    return data
  }
}

