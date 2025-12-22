import { describe, it, expect } from 'vitest'
import axios from 'axios'

// Assuming the server runs on http://localhost:3000 as per simplified/server.js
const API_BASE_URL = 'http://localhost:3002/api/admin'

describe('Authentication API', () => {
  it('should return a token for valid admin credentials', async () => {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      username: 'admin',
      password: 'admin'
    })

    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('success', true)
    expect(response.data).toHaveProperty('token', 'admin-token-mvp')
    expect(response.data.user).toEqual({ username: 'admin', role: 'admin' })
  })

  it('should return 401 for invalid admin credentials', async () => {
    await expect(
      axios.post(`${API_BASE_URL}/login`, {
        username: 'admin',
        password: 'wrong-password'
      })
    ).rejects.toHaveProperty('response.status', 401)
  })

  it('should return 401 for missing admin credentials', async () => {
    await expect(
      axios.post(`${API_BASE_URL}/login`, {})
    ).rejects.toHaveProperty('response.status', 401)
  })


  it('should return user profile for valid token', async () => {
    const response = await axios.get(`${API_BASE_URL}/me`, {
      headers: { Authorization: 'Bearer admin-token-mvp' }
    })

    expect(response.status).toBe(200)
    expect(response.data.user).toEqual({ username: 'admin', role: 'admin' })
  })

  it('should return 401 for invalid token', async () => {
    await expect(
      axios.get(`${API_BASE_URL}/me`, {
        headers: { Authorization: 'Bearer fake-token' }
      })
    ).rejects.toHaveProperty('response.status', 401)
  })
})
