import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'

import ConnectionWizard from '../ConnectionWizard.vue'
import { apiClient } from '../../api/client'

// Mock the API client
vi.mock('../../api/client', () => ({
  apiClient: {
    createDesignFile: vi.fn(),
    syncDesignFile: vi.fn()
  }
}))

describe('ConnectionWizard', () => {
  const createWrapper = (props = {}) => {
    const app = createApp(ConnectionWizard, {
      modelValue: true,
      ...props
    })
    
    app.use(createTestingPinia({ createSpy: vi.fn }))
    app.use(PrimeVue)
    app.use(ToastService)
    
    return mount(ConnectionWizard, {
      props: {
        modelValue: true,
        ...props
      },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn }), PrimeVue, ToastService]
      }
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('renders correctly when visible', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('.p-dialog').exists()).toBe(true)
    })

    it('has correct initial step', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.currentStep).toBe(0)
    })

    it('has penpot as default source', () => {
      const wrapper = createWrapper()
      expect(wrapper.vm.selectedSource).toBe('penpot')
    })
  })

  describe('Step Navigation', () => {
    it('advances to next step when source is selected', async () => {
      const wrapper = createWrapper()
      
      // Select penpot source (already selected by default)
      const penpotCard = wrapper.find('[data-testid="source-penpot"]')
      await penpotCard.trigger('click')
      
      const nextButton = wrapper.find('[data-testid="next-button"]')
      await nextButton.trigger('click')
      
      expect(wrapper.vm.currentStep).toBe(1)
    })

    it('goes back to previous step', async () => {
      const wrapper = createWrapper()
      
      // Go to step 1
      wrapper.vm.currentStep = 1
      await wrapper.vm.$nextTick()
      
      const backButton = wrapper.find('[data-testid="back-button"]')
      await backButton.trigger('click')
      
      expect(wrapper.vm.currentStep).toBe(0)
    })
  })

  describe('Form Validation', () => {
    it('disables connect button when form is incomplete', async () => {
      const wrapper = createWrapper()
      
      // Go to step 1 (details)
      wrapper.vm.currentStep = 1
      await wrapper.vm.$nextTick()
      
      const connectButton = wrapper.find('[data-testid="connect-button"]')
      expect(connectButton.attributes('disabled')).toBeDefined()
    })

    it('enables connect button when form is complete', async () => {
      const wrapper = createWrapper()
      
      // Go to step 1 (details)
      wrapper.vm.currentStep = 1
      await wrapper.vm.$nextTick()
      
      // Fill in all required fields
      wrapper.vm.fileDetails = {
        name: 'Test Design System',
        url: 'https://design.penpot.app/#/workspace/test',
        apiToken: 'test-token-123'
      }
      
      await wrapper.vm.$nextTick()
      
      const connectButton = wrapper.find('[data-testid="connect-button"]')
      expect(connectButton.attributes('disabled')).toBeUndefined()
    })
  })

  describe('API Integration', () => {
    it('calls createDesignFile API when connecting', async () => {
      const wrapper = createWrapper()
      
      // Mock successful API response
      const mockFile = {
        id: 'test-id-123',
        name: 'Test Design System',
        source: 'penpot',
        url: 'https://design.penpot.app/#/workspace/test',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      vi.mocked(apiClient.createDesignFile).mockResolvedValue(mockFile)
      vi.mocked(apiClient.syncDesignFile).mockResolvedValue({
        id: 'test-id-123',
        status: 'completed',
        message: 'Sync completed successfully',
        componentsSynced: 5,
        tokensSynced: 12,
        warnings: [],
        completedAt: new Date().toISOString()
      })
      
      // Set up form data and go to step 2
      wrapper.vm.selectedSource = 'penpot'
      wrapper.vm.fileDetails = {
        name: 'Test Design System',
        url: 'https://design.penpot.app/#/workspace/test',
        apiToken: 'test-token-123'
      }
      wrapper.vm.currentStep = 2
      
      await wrapper.vm.$nextTick()
      
      // Start connection
      await wrapper.vm.startConnection()
      
      // Verify API was called
      expect(apiClient.createDesignFile).toHaveBeenCalledWith({
        name: 'Test Design System',
        source: 'penpot',
        url: 'https://design.penpot.app/#/workspace/test',
        apiToken: 'test-token-123'
      })
      
      expect(apiClient.syncDesignFile).toHaveBeenCalledWith('test-id-123')
    })

    it('handles API errors gracefully', async () => {
      const wrapper = createWrapper()
      
      // Mock API error
      const mockError = {
        message: 'Invalid API token',
        status: 401
      }
      
      vi.mocked(apiClient.createDesignFile).mockRejectedValue(mockError)
      
      // Set up form data
      wrapper.vm.selectedSource = 'penpot'
      wrapper.vm.fileDetails = {
        name: 'Test Design System',
        url: 'https://design.penpot.app/#/workspace/test',
        apiToken: 'invalid-token'
      }
      wrapper.vm.currentStep = 2
      
      await wrapper.vm.$nextTick()
      
      // Start connection
      await wrapper.vm.startConnection()
      
      // Verify error state
      expect(wrapper.vm.connectionError).toBe(true)
      expect(wrapper.vm.connectionStatus?.type).toBe('error')
      expect(wrapper.vm.connectionStatus?.title).toBe('Authentication Failed')
    })
  })

  describe('Progress Tracking', () => {
    it('updates progress steps during connection', async () => {
      const wrapper = createWrapper()
      
      // Mock API responses
      const mockFile = {
        id: 'test-id-123',
        name: 'Test Design System',
        source: 'penpot',
        url: 'https://design.penpot.app/#/workspace/test',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      vi.mocked(apiClient.createDesignFile).mockResolvedValue(mockFile)
      vi.mocked(apiClient.syncDesignFile).mockResolvedValue({
        id: 'test-id-123',
        status: 'completed',
        message: 'Sync completed successfully',
        componentsSynced: 5,
        tokensSynced: 12,
        warnings: [],
        completedAt: new Date().toISOString()
      })
      
      // Set up form data
      wrapper.vm.selectedSource = 'penpot'
      wrapper.vm.fileDetails = {
        name: 'Test Design System',
        url: 'https://design.penpot.app/#/workspace/test',
        apiToken: 'test-token-123'
      }
      wrapper.vm.currentStep = 2
      
      await wrapper.vm.$nextTick()
      
      // Start connection
      const connectionPromise = wrapper.vm.startConnection()
      
      // Check initial progress
      expect(wrapper.vm.progressSteps[0].status).toBe('active')
      
      // Wait for connection to complete
      await connectionPromise
      
      // Check final progress
      expect(wrapper.vm.progressSteps[4].status).toBe('completed')
      expect(wrapper.vm.connectionComplete).toBe(true)
    })
  })
})