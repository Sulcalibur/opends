<template>
  <div class="settings-page">
    <div class="page-header">
      <h1 class="page-title">Settings</h1>
      <p class="page-subtitle">Manage workspace configuration</p>
    </div>

    <div class="settings-grid">
      <div class="settings-nav">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['nav-item', { active: currentTab === tab.id }]"
          @click="currentTab = tab.id"
        >
          <i :class="tab.icon"></i>
          {{ tab.label }}
        </button>
      </div>

      <div class="settings-content">
        <Card class="content-card">
          <template #content>
            <!-- General Settings -->
            <div v-if="currentTab === 'general'" class="space-y-6">
              <h3 class="section-title">General Information</h3>
              
              <div class="form-field">
                <label>Workspace Name</label>
                <InputText v-model="settings.general.name" class="w-full" />
              </div>

              <div class="form-field">
                <label>Description</label>
                <Textarea v-model="settings.general.description" rows="3" class="w-full" />
              </div>

              <Divider />

              <h3 class="section-title">Localization</h3>
              <div class="grid grid-cols-2 gap-4">
                <div class="form-field">
                  <label>Language</label>
                  <Dropdown 
                    v-model="settings.general.language" 
                    :options="languages" 
                    optionLabel="name" 
                    optionValue="code" 
                    class="w-full" 
                  />
                </div>
                <div class="form-field">
                  <label>Timezone</label>
                  <Dropdown 
                    v-model="settings.general.timezone" 
                    :options="timezones" 
                    class="w-full" 
                  />
                </div>
              </div>
            </div>

            <!-- Appearance Settings -->
            <div v-else-if="currentTab === 'appearance'" class="space-y-6">
              <h3 class="section-title">Theme</h3>
              <div class="grid grid-cols-3 gap-4">
                <div 
                  class="theme-option" 
                  :class="{ active: settings.appearance.theme === 'light' }"
                  @click="settings.appearance.theme = 'light'"
                >
                  <div class="bg-white border rounded h-24 mb-2"></div>
                  <span>Light</span>
                </div>
                <div 
                  class="theme-option" 
                  :class="{ active: settings.appearance.theme === 'dark' }"
                  @click="settings.appearance.theme = 'dark'"
                >
                  <div class="bg-gray-900 border border-gray-700 rounded h-24 mb-2"></div>
                  <span>Dark</span>
                </div>
                <div 
                  class="theme-option" 
                  :class="{ active: settings.appearance.theme === 'system' }"
                  @click="settings.appearance.theme = 'system'"
                >
                  <div class="bg-gradient-to-br from-white to-gray-900 border rounded h-24 mb-2"></div>
                  <span>System</span>
                </div>
              </div>

              <Divider />

              <h3 class="section-title">Brand Color</h3>
              <div class="flex gap-4">
                <div 
                  v-for="color in brandColors" 
                  :key="color"
                  class="w-8 h-8 rounded-full cursor-pointer transition-transform hover:scale-110"
                  :style="{ backgroundColor: color }"
                  :class="{ 'ring-2 ring-offset-2 ring-blue-500': settings.appearance.primaryColor === color }"
                  @click="settings.appearance.primaryColor = color"
                ></div>
              </div>
            </div>

            <!-- Security Settings -->
            <div v-else-if="currentTab === 'security'" class="space-y-6">
              <h3 class="section-title">Access Control</h3>
              
              <div class="field-checkbox">
                <Checkbox v-model="settings.security.publicAccess" :binary="true" inputId="public-access" />
                <label for="public-access" class="ml-2 font-medium">Allow public access to documentation</label>
              </div>
              <p class="text-sm text-gray-500 ml-8">If unchecked, only authenticated users can view the documentation.</p>

              <div class="field-checkbox mt-4">
                <Checkbox v-model="settings.security.allowRegistration" :binary="true" inputId="allow-registration" />
                <label for="allow-registration" class="ml-2 font-medium">Allow new user registration</label>
              </div>
            </div>

            <div class="mt-8 flex justify-end">
              <Button label="Save Changes" icon="pi pi-check" @click="saveSettings" :loading="saving" />
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const tabs = [
  { id: 'general', label: 'General', icon: 'pi pi-cog' },
  { id: 'appearance', label: 'Appearance', icon: 'pi pi-palette' },
  { id: 'security', label: 'Security', icon: 'pi pi-lock' }
]

const currentTab = ref('general')
const saving = ref(false)

const settings = ref({
  general: {
    name: 'OpenDS Workspace',
    description: 'Self-hosted design system documentation',
    language: 'en',
    timezone: 'UTC'
  },
  appearance: {
    theme: 'light',
    primaryColor: '#3b82f6'
  },
  security: {
    publicAccess: true,
    allowRegistration: false
  }
})

const languages = [
  { name: 'English', code: 'en' },
  { name: 'Spanish', code: 'es' },
  { name: 'French', code: 'fr' }
]

const timezones = [
  'UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo'
]

const brandColors = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'
]

async function saveSettings() {
  saving.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  saving.value = false
  // notification would go here
}
</script>

<style scoped>
.settings-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.page-subtitle {
  color: #64748b;
  margin-top: 0.5rem;
}

.settings-grid {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 2rem;
  align-items: start;
}

.settings-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  color: #64748b;
  font-weight: 500;
  transition: all 0.2s;
  text-align: left;
}

.nav-item:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.nav-item.active {
  background: #eff6ff;
  color: #3b82f6;
}

.content-card {
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-field label {
  font-weight: 500;
  color: #334155;
}

.theme-option {
  cursor: pointer;
  text-align: center;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 2px solid transparent;
}

.theme-option.active {
  border-color: #3b82f6;
  background: #eff6ff;
}

.theme-option span {
  font-weight: 500;
  color: #334155;
}

@media (max-width: 768px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
  
  .settings-nav {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 1rem;
  }
  
  .nav-item {
    white-space: nowrap;
  }
}
</style>
