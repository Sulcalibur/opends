<template>
  <div class="settings-view">
    <div class="view-header">
      <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-50">Settings</h1>
      <p class="text-surface-600 dark:text-surface-400 mt-2">
        Manage your OpenDS application settings
      </p>
    </div>

    <div class="view-content mt-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Navigation -->
        <Card class="lg:col-span-1">
          <template #content>
            <div class="space-y-1">
              <div 
                v-for="tab in tabs" 
                :key="tab.id"
                :class="[
                  'tab-item p-3 rounded cursor-pointer transition-colors',
                  activeTab === tab.id
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border-l-4 border-primary-500'
                    : 'hover:bg-surface-50 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300'
                ]"
                @click="activeTab = tab.id"
              >
                <div class="flex items-center gap-3">
                  <i :class="tab.icon" class="text-lg"></i>
                  <span class="font-medium">{{ tab.label }}</span>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <!-- Right Content -->
        <div class="lg:col-span-2">
          <!-- Profile Settings -->
          <Card v-if="activeTab === 'profile'">
            <template #title>
              <div class="flex items-center gap-3">
                <i class="pi pi-user text-primary-500"></i>
                <span>Profile Settings</span>
              </div>
            </template>
            <template #content>
              <div class="space-y-6">
                <div class="flex items-center gap-6">
                  <div class="relative">
                    <div class="w-24 h-24 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center overflow-hidden">
                      <i class="pi pi-user text-3xl text-surface-400 dark:text-surface-500"></i>
                    </div>
                    <Button 
                      icon="pi pi-camera" 
                      severity="secondary" 
                      size="small"
                      class="absolute bottom-0 right-0"
                      @click="changeAvatar"
                    />
                  </div>
                  <div>
                    <h3 class="text-lg font-medium text-surface-900 dark:text-surface-50">
                      {{ user.name }}
                    </h3>
                    <p class="text-surface-600 dark:text-surface-400">
                      {{ user.email }}
                    </p>
                    <p class="text-sm text-surface-500 dark:text-surface-400 mt-1">
                      Member since {{ formatDate(user.createdAt) }}
                    </p>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="field">
                    <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Full Name
                    </label>
                    <InputText 
                      v-model="user.name" 
                      class="w-full"
                    />
                  </div>
                  
                  <div class="field">
                    <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Email
                    </label>
                    <InputText 
                      v-model="user.email" 
                      type="email"
                      class="w-full"
                    />
                  </div>
                </div>

                <div class="field">
                  <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Bio
                  </label>
                  <Textarea 
                    v-model="user.bio" 
                    rows="3" 
                    placeholder="Tell us about yourself..."
                    class="w-full"
                  />
                </div>

                <div class="flex justify-end gap-2 pt-4 border-t border-surface-200 dark:border-surface-700">
                  <Button 
                    label="Cancel" 
                    severity="secondary" 
                    @click="resetProfile"
                  />
                  <Button 
                    label="Save Changes" 
                    severity="primary" 
                    :loading="savingProfile"
                    @click="saveProfile"
                  />
                </div>
              </div>
            </template>
          </Card>

          <!-- API Settings -->
          <Card v-else-if="activeTab === 'api'">
            <template #title>
              <div class="flex items-center gap-3">
                <i class="pi pi-key text-primary-500"></i>
                <span>API Settings</span>
              </div>
            </template>
            <template #content>
              <div class="space-y-6">
                <div>
                  <h3 class="text-lg font-medium text-surface-900 dark:text-surface-50 mb-4">
                    API Keys
                  </h3>
                  <div v-if="apiKeys.length === 0" class="text-center py-8 text-surface-500 dark:text-surface-400">
                    <i class="pi pi-key text-4xl mb-4"></i>
                    <p>No API keys generated yet</p>
                  </div>
                  <div v-else class="space-y-4">
                    <div 
                      v-for="key in apiKeys" 
                      :key="key.id"
                      class="api-key-item p-4 rounded-lg border border-surface-200 dark:border-surface-700"
                    >
                      <div class="flex items-center justify-between">
                        <div>
                          <div class="font-medium text-surface-900 dark:text-surface-50">
                            {{ key.name }}
                          </div>
                          <div class="text-sm text-surface-500 dark:text-surface-400 mt-1">
                            Created {{ formatDate(key.createdAt) }}
                            <span v-if="key.lastUsed"> • Last used {{ formatDate(key.lastUsed) }}</span>
                          </div>
                        </div>
                        <div class="flex items-center gap-2">
                          <Tag :value="key.permissions" size="small" />
                          <Button 
                            icon="pi pi-trash" 
                            severity="danger" 
                            size="small"
                            @click="deleteApiKey(key)"
                          />
                        </div>
                      </div>
                      <div class="mt-3">
                        <div class="text-xs text-surface-500 dark:text-surface-400 mb-1">
                          API Key
                        </div>
                        <div class="flex items-center gap-2">
                          <InputText 
                            :value="maskApiKey(key.key)" 
                            readonly
                            class="flex-1 font-mono text-sm"
                          />
                          <Button 
                            icon="pi pi-copy" 
                            severity="secondary" 
                            size="small"
                            @click="copyApiKey(key.key)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="pt-6 border-t border-surface-200 dark:border-surface-700">
                  <h3 class="text-lg font-medium text-surface-900 dark:text-surface-50 mb-4">
                    Generate New API Key
                  </h3>
                  <div class="space-y-4">
                    <div class="field">
                      <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Key Name
                      </label>
                      <InputText 
                        v-model="newApiKeyName" 
                        placeholder="e.g., Production API Key"
                        class="w-full"
                      />
                    </div>
                    
                    <div class="field">
                      <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Permissions
                      </label>
                      <div class="space-y-2">
                        <div class="flex items-center">
                          <Checkbox 
                            v-model="apiPermissions.read" 
                            inputId="perm-read" 
                            :binary="true"
                          />
                          <label for="perm-read" class="ml-2 text-sm text-surface-700 dark:text-surface-300">
                            Read access
                          </label>
                        </div>
                        <div class="flex items-center">
                          <Checkbox 
                            v-model="apiPermissions.write" 
                            inputId="perm-write" 
                            :binary="true"
                          />
                          <label for="perm-write" class="ml-2 text-sm text-surface-700 dark:text-surface-300">
                            Write access
                          </label>
                        </div>
                        <div class="flex items-center">
                          <Checkbox 
                            v-model="apiPermissions.admin" 
                            inputId="perm-admin" 
                            :binary="true"
                          />
                          <label for="perm-admin" class="ml-2 text-sm text-surface-700 dark:text-surface-300">
                            Admin access
                          </label>
                        </div>
                      </div>
                    </div>

                    <div class="flex justify-end">
                      <Button 
                        label="Generate Key" 
                        severity="primary" 
                        :disabled="!newApiKeyName"
                        @click="generateApiKey"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </Card>

          <!-- Integration Settings -->
          <Card v-else-if="activeTab === 'integrations'">
            <template #title>
              <div class="flex items-center gap-3">
                <i class="pi pi-plug text-primary-500"></i>
                <span>Integrations</span>
              </div>
            </template>
            <template #content>
              <div class="space-y-6">
                <div>
                  <h3 class="text-lg font-medium text-surface-900 dark:text-surface-50 mb-4">
                    Design Tools
                  </h3>
                  <div class="space-y-4">
                    <div class="integration-item p-4 rounded-lg border border-surface-200 dark:border-surface-700">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-4">
                          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                            <i class="pi pi-palette text-purple-600 dark:text-purple-400 text-xl"></i>
                          </div>
                          <div>
                            <div class="font-medium text-surface-900 dark:text-surface-50">
                              Penpot
                            </div>
                            <div class="text-sm text-surface-500 dark:text-surface-400">
                              Open source design tool integration
                            </div>
                          </div>
                        </div>
                        <Checkbox 
                          v-model="integrations.penpot.enabled" 
                          :binary="true"
                          @change="toggleIntegration('penpot')"
                        />
                      </div>
                      <div v-if="integrations.penpot.enabled" class="mt-4 space-y-3">
                        <div class="field">
                          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                            API Token
                          </label>
                          <Password 
                            v-model="integrations.penpot.apiToken" 
                            :feedback="false" 
                            toggleMask
                            placeholder="Enter your Penpot API token"
                            class="w-full"
                          />
                        </div>
                        <div class="field">
                          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                            Base URL
                          </label>
                          <InputText 
                            v-model="integrations.penpot.baseUrl" 
                            placeholder="https://design.penpot.app"
                            class="w-full"
                          />
                        </div>
                      </div>
                    </div>

                    <div class="integration-item p-4 rounded-lg border border-surface-200 dark:border-surface-700">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-4">
                          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <i class="pi pi-desktop text-blue-600 dark:text-blue-400 text-xl"></i>
                          </div>
                          <div>
                            <div class="font-medium text-surface-900 dark:text-surface-50">
                              Figma
                            </div>
                            <div class="text-sm text-surface-500 dark:text-surface-400">
                              Figma design platform integration
                            </div>
                          </div>
                        </div>
                        <Checkbox 
                          v-model="integrations.figma.enabled" 
                          :binary="true"
                          @change="toggleIntegration('figma')"
                        />
                      </div>
                      <div v-if="integrations.figma.enabled" class="mt-4 space-y-3">
                        <div class="field">
                          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                            Personal Access Token
                          </label>
                          <Password 
                            v-model="integrations.figma.apiToken" 
                            :feedback="false" 
                            toggleMask
                            placeholder="Enter your Figma token"
                            class="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="pt-6 border-t border-surface-200 dark:border-surface-700">
                  <h3 class="text-lg font-medium text-surface-900 dark:text-surface-50 mb-4">
                    Version Control
                  </h3>
                  <div class="integration-item p-4 rounded-lg border border-surface-200 dark:border-surface-700">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-gray-100 dark:bg-gray-900/30 rounded-lg flex items-center justify-center">
                          <i class="pi pi-github text-gray-700 dark:text-gray-400 text-xl"></i>
                        </div>
                        <div>
                          <div class="font-medium text-surface-900 dark:text-surface-50">
                            GitHub
                          </div>
                          <div class="text-sm text-surface-500 dark:text-surface-400">
                            Sync components to GitHub repositories
                          </div>
                        </div>
                      </div>
                      <Checkbox 
                        v-model="integrations.github.enabled" 
                        :binary="true"
                        @change="toggleIntegration('github')"
                      />
                    </div>
                    <div v-if="integrations.github.enabled" class="mt-4 space-y-3">
                      <div class="field">
                        <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          GitHub Token
                        </label>
                        <Password 
                          v-model="integrations.github.apiToken" 
                          :feedback="false" 
                          toggleMask
                          placeholder="Enter your GitHub token"
                          class="w-full"
                        />
                      </div>
                      <div class="field">
                        <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                          Default Repository
                        </label>
                        <InputText 
                          v-model="integrations.github.defaultRepo" 
                          placeholder="username/repository"
                          class="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </Card>

          <!-- Appearance Settings -->
          <Card v-else-if="activeTab === 'appearance'">
            <template #title>
              <div class="flex items-center gap-3">
                <i class="pi pi-palette text-primary-500"></i>
                <span>Appearance</span>
              </div>
            </template>
            <template #content>
              <div class="space-y-6">
                <div>
                  <h3 class="text-lg font-medium text-surface-900 dark:text-surface-50 mb-4">
                    Theme
                  </h3>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div 
                      :class="[
                        'theme-option p-4 rounded-lg border cursor-pointer transition-all',
                        appearance.theme === 'light'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
                      ]"
                      @click="appearance.theme = 'light'"
                    >
                      <div class="flex items-center gap-3 mb-3">
                        <i class="pi pi-sun text-yellow-500"></i>
                        <span class="font-medium">Light</span>
                      </div>
                      <div class="theme-preview h-16 rounded bg-white border border-surface-300"></div>
                    </div>
                    
                    <div 
                      :class="[
                        'theme-option p-4 rounded-lg border cursor-pointer transition-all',
                        appearance.theme === 'dark'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
                      ]"
                      @click="appearance.theme = 'dark'"
                    >
                      <div class="flex items-center gap-3 mb-3">
                        <i class="pi pi-moon text-indigo-500"></i>
                        <span class="font-medium">Dark</span>
                      </div>
                      <div class="theme-preview h-16 rounded bg-surface-900 border border-surface-700"></div>
                    </div>
                    
                    <div 
                      :class="[
                        'theme-option p-4 rounded-lg border cursor-pointer transition-all',
                        appearance.theme === 'system'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
                      ]"
                      @click="appearance.theme = 'system'"
                    >
                      <div class="flex items-center gap-3 mb-3">
                        <i class="pi pi-desktop text-blue-500"></i>
                        <span class="font-medium">System</span>
                      </div>
                      <div class="theme-preview h-16 rounded bg-gradient-to-r from-white to-surface-900 border border-surface-300 dark:border-surface-700"></div>
                    </div>
                  </div>
                </div>

                <div class="pt-6 border-t border-surface-200 dark:border-surface-700">
                  <h3 class="text-lg font-medium text-surface-900 dark:text-surface-50 mb-4">
                    UI Preferences
                  </h3>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <div class="font-medium text-surface-900 dark:text-surface-50">
                          Ripple Effect
                        </div>
                        <div class="text-sm text-surface-500 dark:text-surface-400">
                          Enable ripple animations on interactive elements
                        </div>
                      </div>
                      <Checkbox v-model="appearance.ripple" :binary="true" />
                    </div>
                    
                    <div class="flex items-center justify-between">
                      <div>
                        <div class="font-medium text-surface-900 dark:text-surface-50">
                          Reduced Motion
                        </div>
                        <div class="text-sm text-surface-500 dark:text-surface-400">
                          Minimize animations and transitions
                        </div>
                      </div>
                      <Checkbox v-model="appearance.reducedMotion" :binary="true" />
                    </div>
                    
                    <div class="flex items-center justify-between">
                      <div>
                        <div class="font-medium text-surface-900 dark:text-surface-50">
                          Compact Mode
                        </div>
                        <div class="text-sm text-surface-500 dark:text-surface-400">
                          Use denser spacing and smaller fonts
                        </div>
                      </div>
                      <Checkbox v-model="appearance.compactMode" :binary="true" />
                    </div>
                  </div>
                </div>

                <div class="flex justify-end pt-4 border-t border-surface-200 dark:border-surface-700">
                  <Button 
                    label="Save Preferences" 
                    severity="primary" 
                    @click="saveAppearance"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'
// Switch component might not be available in PrimeVue 4.5.3
// Using Checkbox as alternative
import Tag from 'primevue/tag'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const activeTab = ref('profile')
const savingProfile = ref(false)

const tabs = [
  { id: 'profile', label: 'Profile', icon: 'pi pi-user' },
  { id: 'api', label: 'API', icon: 'pi pi-key' },
  { id: 'integrations', label: 'Integrations', icon: 'pi pi-plug' },
  { id: 'appearance', label: 'Appearance', icon: 'pi pi-palette' },
]

const user = ref({
  name: 'John Doe',
  email: 'john@example.com',
  bio: 'Design system enthusiast and frontend developer.',
  createdAt: '2024-01-01T00:00:00Z',
})

const apiKeys = ref([
  {
    id: '1',
    name: 'Development Key',
    key: 'opends_dev_abcdef123456',
    permissions: 'read,write',
    createdAt: '2024-01-15T10:30:00Z',
    lastUsed: '2024-01-20T14:45:00Z',
  },
  {
    id: '2',
    name: 'CI/CD Key',
    key: 'opends_cicd_789012',
    permissions: 'read',
    createdAt: '2024-01-18T09:15:00Z',
    lastUsed: null,
  },
])

const newApiKeyName = ref('')
const apiPermissions = ref({
  read: true,
  write: false,
  admin: false,
})

const integrations = ref({
  penpot: {
    enabled: true,
    apiToken: '',
    baseUrl: 'https://design.penpot.app',
  },
  figma: {
    enabled: false,
    apiToken: '',
  },
  github: {
    enabled: false,
    apiToken: '',
    defaultRepo: '',
  },
})

const appearance = ref({
  theme: 'system',
  ripple: true,
  reducedMotion: false,
  compactMode: false,
})

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

function maskApiKey(key: string) {
  if (key.length <= 8) return '••••••••'
  return `${key.substring(0, 4)}••••${key.substring(key.length - 4)}`
}

function copyApiKey(key: string) {
  navigator.clipboard.writeText(key)
  toast.add({
    severity: 'success',
    summary: 'Copied',
    detail: 'API key copied to clipboard',
    life: 2000,
  })
}

async function saveProfile() {
  try {
    savingProfile.value = true
    // TODO: Implement API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.add({
      severity: 'success',
      summary: 'Profile Updated',
      detail: 'Your profile has been updated',
      life: 3000,
    })
  } catch (error) {
    console.error('Failed to save profile:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update profile',
      life: 3000,
    })
  } finally {
    savingProfile.value = false
  }
}

function resetProfile() {
  // Reset to original values
  user.value = {
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Design system enthusiast and frontend developer.',
    createdAt: '2024-01-01T00:00:00Z',
  }
}

function generateApiKey() {
  if (!newApiKeyName.value) return
  
  const permissions = []
  if (apiPermissions.value.read) permissions.push('read')
  if (apiPermissions.value.write) permissions.push('write')
  if (apiPermissions.value.admin) permissions.push('admin')
  
  const newKey = {
    id: Date.now().toString(),
    name: newApiKeyName.value,
    key: `opends_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 8)}`,
    permissions: permissions.join(','),
    createdAt: new Date().toISOString(),
    lastUsed: null,
  }
  
  apiKeys.value.push(newKey)
  newApiKeyName.value = ''
  apiPermissions.value = { read: true, write: false, admin: false }
  
  toast.add({
    severity: 'success',
    summary: 'API Key Generated',
    detail: `New API key "${newKey.name}" created`,
    life: 5000,
  })
}

function deleteApiKey(key: any) {
  const index = apiKeys.value.findIndex(k => k.id === key.id)
  if (index !== -1) {
    apiKeys.value.splice(index, 1)
    toast.add({
      severity: 'info',
      summary: 'API Key Deleted',
      detail: `API key "${key.name}" has been deleted`,
      life: 3000,
    })
  }
}

function toggleIntegration(integration: string) {
  console.log(`Toggle ${integration}:`, integrations.value[integration as keyof typeof integrations.value].enabled)
  // TODO: Implement integration toggle
}

function saveAppearance() {
  // TODO: Implement appearance save
  console.log('Save appearance:', appearance.value)
  toast.add({
    severity: 'success',
    summary: 'Preferences Saved',
    detail: 'Your appearance preferences have been saved',
    life: 3000,
  })
}

function changeAvatar() {
  // TODO: Implement avatar change
  toast.add({
    severity: 'info',
    summary: 'Change Avatar',
    detail: 'Avatar change functionality would open',
    life: 3000,
  })
}

onMounted(() => {
  // Load settings from API
})
</script>

<style scoped>
.settings-view {
  @apply p-6;
}

.view-header {
  @apply mb-8;
}

.tab-item {
  @apply transition-all duration-200;
}

.tab-item:hover:not(.tab-item.active) {
  @apply transform -translate-x-1;
}

.integration-item {
  @apply transition-all duration-200;
}

.integration-item:hover {
  @apply shadow-md;
}

.theme-option {
  @apply transition-all duration-200;
}

.theme-option:hover {
  @apply transform -translate-y-1;
}
</style>