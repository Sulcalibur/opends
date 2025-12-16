import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'

export interface ApiError {
  message: string
  status?: number
  errors?: string[]
}

export interface DesignFile {
  id: string
  name: string
  source: 'penpot' | 'figma'
  createdAt: string
  updatedAt: string
}

export interface SyncResult {
  id: string
  status: 'completed' | 'failed'
  message: string
  componentsSynced?: number
  tokensSynced?: number
  warnings?: string[]
  errors?: string[]
  completedAt?: string
  failedAt?: string
}

export interface HealthStatus {
  status: string
  timestamp: string
  service: string
  version: string
}

export interface ReadyStatus {
  status: 'ready' | 'degraded' | 'unhealthy'
  database: string
  timestamp: string
  error?: string
}

export interface DashboardStats {
  designFiles: number
  components: number
  designTokens: number
  recentSyncs: number
  lastSync?: string | undefined
}

class ApiClient {
  private client: AxiosInstance
  private baseURL: string

  constructor() {
    this.baseURL = import.meta.env['VITE_API_URL'] || 'http://localhost:3001'
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    })

    // Request interceptor for auth tokens
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const apiError: ApiError = {
          message: error.response?.data?.message || 'An unexpected error occurred',
          status: error.response?.status,
          errors: error.response?.data?.errors,
        }
        return Promise.reject(apiError)
      }
    )
  }

  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.request(config)
      return response.data
    } catch (error) {
      throw error as ApiError
    }
  }

  // Health endpoints
  async getHealth(): Promise<HealthStatus> {
    return this.request<HealthStatus>({
      method: 'GET',
      url: '/api/health',
    })
  }

  async getReadyStatus(): Promise<ReadyStatus> {
    return this.request<ReadyStatus>({
      method: 'GET',
      url: '/api/health/ready',
    })
  }

  async getLiveStatus(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>({
      method: 'GET',
      url: '/api/health/live',
    })
  }

  // Design Files
  async listDesignFiles(): Promise<{ files: DesignFile[] }> {
    return this.request<{ files: DesignFile[] }>({
      method: 'GET',
      url: '/api/design-files',
    })
  }

  async getDesignFile(id: string): Promise<DesignFile> {
    return this.request<DesignFile>({
      method: 'GET',
      url: `/api/design-files/${id}`,
    })
  }

  async syncDesignFile(id: string): Promise<SyncResult> {
    return this.request<SyncResult>({
      method: 'POST',
      url: `/api/design-files/${id}/sync`,
    })
  }

  // Dashboard stats (placeholder - will need to implement backend endpoint)
  async getDashboardStats(): Promise<DashboardStats> {
    // For now, we'll simulate stats by fetching design files
    const designFiles = await this.listDesignFiles()
    
    return {
      designFiles: designFiles.files.length,
      components: 0, // TODO: Implement components endpoint
      designTokens: 0, // TODO: Implement tokens endpoint
      recentSyncs: 0, // TODO: Track sync history
      lastSync: designFiles.files.length > 0 
        ? designFiles.files[0]!.updatedAt 
        : undefined,
    }
  }

  // Authentication (placeholder - will need to implement backend endpoints)
  async login(_email: string, _password: string): Promise<{ token: string }> {
    // TODO: Implement actual login endpoint
    return Promise.resolve({ token: 'mock-token' })
  }

  async register(_email: string, _password: string, _name: string): Promise<{ token: string }> {
    // TODO: Implement actual register endpoint
    return Promise.resolve({ token: 'mock-token' })
  }

  async logout(): Promise<void> {
    // TODO: Implement actual logout endpoint
    localStorage.removeItem('auth_token')
    return Promise.resolve()
  }

  async getCurrentUser(): Promise<{ id: string; email: string; name: string }> {
    // TODO: Implement actual user endpoint
    return Promise.resolve({
      id: '1',
      email: 'user@example.com',
      name: 'Demo User',
    })
  }
}

export const apiClient = new ApiClient()