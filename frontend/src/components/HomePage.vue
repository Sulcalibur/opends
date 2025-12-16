<template>
  <div class="home">
    <h1>OpenDS</h1>
    <p>Open-source, self-hosted design system platform</p>
    <p>Bridging design tools with development workflows</p>
    
    <div class="primevue-test">
      <div class="theme-header">
        <h2>PrimeVue Integration Test</h2>
        <div class="theme-toggle">
          <span class="theme-label">Light</span>
          <ToggleButton 
            v-model="isDarkMode" 
            onLabel="Dark" 
            offLabel="Light"
            onIcon="pi pi-moon" 
            offIcon="pi pi-sun"
            @change="toggleTheme"
            aria-label="Toggle dark mode"
          />
          <span class="theme-label">Dark</span>
        </div>
      </div>
      <p>Testing PrimeVue components with OpenDS design system</p>
      
      <div class="design-tokens-preview">
        <h3>OpenDS Admin Interface Design Tokens</h3>
        <p class="token-description">These are the design tokens for the OpenDS admin interface itself, implemented with PrimeVue.</p>
        <div class="token-grid">
          <div class="token-item primary-token">Primary: #3b82f6</div>
          <div class="token-item success-token">Success: #10b981</div>
          <div class="token-item warning-token">Warning: #f59e0b</div>
          <div class="token-item danger-token">Danger: #ef4444</div>
        </div>
        <p class="token-note"><small>Note: User design systems are managed separately through the DesignToken entities.</small></p>
      </div>
      
      <div class="component-grid">
        <div class="component-card">
          <h3>PrimeVue Button Components</h3>
          <Button label="Primary Button" severity="primary" />
          <Button label="Secondary Button" severity="secondary" class="ml-2" />
          <Button label="Success Button" severity="success" class="ml-2" />
          <Button label="Warning Button" severity="warning" class="ml-2" />
          <Button label="Danger Button" severity="danger" class="ml-2" />
        </div>
        
        <div class="component-card">
          <h3>OpenDS Wrapper Button Components</h3>
          <ODSButton label="Primary ODS Button" severity="primary" />
          <ODSButton label="Secondary ODS Button" severity="secondary" class="ml-2" />
          <ODSButton label="Success ODS Button" severity="success" class="ml-2" />
          <ODSButton>
            <template #default>
              <i class="pi pi-check mr-2" />
              Button with Icon
            </template>
          </ODSButton>
        </div>
        
        <div class="component-card">
          <h3>PrimeVue Input Components</h3>
          <InputText placeholder="Enter text here" />
          <InputText placeholder="Disabled input" disabled class="mt-2" />
          <InputText placeholder="With icon" class="mt-2">
            <template #prefix>
              <i class="pi pi-search" />
            </template>
          </InputText>
        </div>
        
        <div class="component-card">
          <h3>OpenDS Wrapper Input Components</h3>
          <ODSInput label="Username" placeholder="Enter your username" />
          <ODSInput label="Email" placeholder="Enter your email" type="email" class="mt-2" />
          <ODSInput 
            label="Password" 
            placeholder="Enter your password" 
            type="password"
            error="Password must be at least 8 characters"
            class="mt-2"
          />
          <ODSInput 
            label="Optional Field" 
            placeholder="This is optional"
            hint="This field is optional"
            class="mt-2"
          />
        </div>
        
        <div class="component-card">
          <h3>Card Component</h3>
          <Card>
            <template #title>PrimeVue Card</template>
            <template #content>
              <p class="m-0">
                This is a PrimeVue Card component integrated with OpenDS design tokens.
                The colors, spacing, and typography use OpenDS design system variables.
              </p>
            </template>
          </Card>
        </div>
      </div>
      
      <div class="data-table-demo">
        <h3>PrimeVue DataTable Component</h3>
        <p class="table-description">Demonstrating PrimeVue DataTable with sorting, filtering, and pagination.</p>
        
        <div class="table-container">
          <Card class="table-card">
            <template #title>Design Tokens</template>
            <template #content>
              <DataTable 
                :value="designTokens" 
                paginator 
                :rows="5"
                :rowsPerPageOptions="[5, 10, 20]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                filterDisplay="menu"
                :globalFilterFields="['name', 'category', 'usage']"
              >
                <Column field="name" header="Token Name" sortable filter></Column>
                <Column field="value" header="Value" sortable>
                  <template #body="slotProps">
                    <span class="token-value" :style="{ color: slotProps.data.value.startsWith('#') ? slotProps.data.value : 'inherit' }">
                      {{ slotProps.data.value }}
                      <span v-if="slotProps.data.value.startsWith('#')" class="color-swatch" :style="{ backgroundColor: slotProps.data.value }"></span>
                    </span>
                  </template>
                </Column>
                <Column field="category" header="Category" sortable filter></Column>
                <Column field="usage" header="Usage" sortable filter></Column>
              </DataTable>
            </template>
          </Card>
          
          <Card class="table-card">
            <template #title>Component Status</template>
            <template #content>
              <DataTable 
                :value="components" 
                :paginator="false"
                :rows="10"
                showGridlines
                stripedRows
              >
                <Column field="name" header="Component" sortable></Column>
                <Column field="type" header="Type" sortable>
                  <template #body="slotProps">
                    <span :class="['type-badge', slotProps.data.type.toLowerCase()]">
                      {{ slotProps.data.type }}
                    </span>
                  </template>
                </Column>
                <Column field="status" header="Status" sortable>
                  <template #body="slotProps">
                    <span :class="['status-badge', slotProps.data.status.toLowerCase().replace(' ', '-')]">
                      {{ slotProps.data.status }}
                    </span>
                  </template>
                </Column>
                <Column field="framework" header="Framework" sortable></Column>
              </DataTable>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Card from 'primevue/card'
import ToggleButton from 'primevue/togglebutton'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { ODSButton, ODSInput } from '@/components/ui'

const isDarkMode = ref(false)

// Sample data for DataTable
const designTokens = ref([
  { name: 'Primary 500', value: '#3b82f6', category: 'Color', usage: 'Primary actions' },
  { name: 'Success 500', value: '#10b981', category: 'Color', usage: 'Success states' },
  { name: 'Warning 500', value: '#f59e0b', category: 'Color', usage: 'Warning states' },
  { name: 'Danger 500', value: '#ef4444', category: 'Color', usage: 'Error states' },
  { name: 'Spacing MD', value: '1rem', category: 'Spacing', usage: 'Default spacing' },
  { name: 'Border Radius MD', value: '0.375rem', category: 'Border', usage: 'Default corners' },
  { name: 'Font Size Base', value: '1rem', category: 'Typography', usage: 'Body text' },
])

const components = ref([
  { name: 'ODSButton', status: 'Complete', type: 'Wrapper', framework: 'Vue 3' },
  { name: 'ODSInput', status: 'Complete', type: 'Wrapper', framework: 'Vue 3' },
  { name: 'DataTable', status: 'In Progress', type: 'PrimeVue', framework: 'Vue 3' },
  { name: 'Card', status: 'Complete', type: 'PrimeVue', framework: 'Vue 3' },
  { name: 'ToggleButton', status: 'Complete', type: 'PrimeVue', framework: 'Vue 3' },
])

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  // Save preference to localStorage
  localStorage.setItem('opends-theme', isDarkMode.value ? 'dark' : 'light')
}

onMounted(() => {
  // Check for saved theme preference or system preference
  const savedTheme = localStorage.getItem('opends-theme')
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  }
})
</script>

<style scoped>
.home {
  text-align: center;
  padding: 2rem;
}

h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.primevue-test {
  margin-top: 3rem;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
  text-align: left;
}

.primevue-test h2 {
  color: #333;
  margin-bottom: 1rem;
}

.component-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.component-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.component-card h3 {
  margin-bottom: 1rem;
  color: #444;
}

.ml-2 {
  margin-left: 0.5rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

.mr-2 {
  margin-right: 0.5rem;
}

.m-0 {
  margin: 0;
}

.design-tokens-preview {
  background: white;
  padding: 1.5rem;
  border-radius: var(--border-radius-md);
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.design-tokens-preview h3 {
  margin-bottom: 1rem;
  color: var(--opends-admin-gray-800);
}

.token-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.token-item {
  padding: 1rem;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  text-align: center;
}

.primary-token {
  background-color: var(--opends-admin-primary-500);
  color: white;
}

.success-token {
  background-color: var(--opends-admin-success-500);
  color: white;
}

.warning-token {
  background-color: var(--opends-admin-warning-500);
  color: white;
}

.danger-token {
  background-color: var(--opends-admin-danger-500);
  color: white;
}

.token-description {
  color: var(--opends-admin-gray-600);
  margin-bottom: 1rem;
}

.token-note {
  color: var(--opends-admin-gray-500);
  margin-top: 1rem;
  font-style: italic;
}

.theme-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.theme-toggle {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.theme-label {
  font-weight: 500;
  color: var(--opends-admin-gray-700);
  font-size: 0.875rem;
}

/* Dark mode specific styles */
.dark .theme-label {
  color: var(--opends-admin-gray-300);
}

.dark .design-tokens-preview,
.dark .component-card {
  background: var(--opends-admin-gray-800);
  color: var(--opends-admin-gray-200);
}

.dark .design-tokens-preview h3,
.dark .component-card h3 {
  color: var(--opends-admin-gray-100);
}

.dark .token-description {
  color: var(--opends-admin-gray-400);
}

.dark .token-note {
  color: var(--opends-admin-gray-500);
}

/* DataTable styles */
.data-table-demo {
  margin-top: 3rem;
  padding: 2rem;
  background: white;
  border-radius: var(--border-radius-md);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.dark .data-table-demo {
  background: var(--opends-admin-gray-800);
  color: var(--opends-admin-gray-200);
}

.data-table-demo h3 {
  color: var(--opends-admin-gray-800);
  margin-bottom: 0.5rem;
}

.dark .data-table-demo h3 {
  color: var(--opends-admin-gray-100);
}

.table-description {
  color: var(--opends-admin-gray-600);
  margin-bottom: 1.5rem;
}

.dark .table-description {
  color: var(--opends-admin-gray-400);
}

.table-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 2rem;
  margin-top: 1rem;
}

.table-card {
  background: var(--opends-admin-gray-50);
  border: 1px solid var(--opends-admin-gray-200);
}

.dark .table-card {
  background: var(--opends-admin-gray-900);
  border-color: var(--opends-admin-gray-700);
}

.token-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.color-swatch {
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
  border: 1px solid var(--opends-admin-gray-300);
  display: inline-block;
}

.dark .color-swatch {
  border-color: var(--opends-admin-gray-600);
}

.type-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
}

.type-badge.wrapper {
  background-color: var(--opends-admin-primary-100);
  color: var(--opends-admin-primary-700);
}

.dark .type-badge.wrapper {
  background-color: var(--opends-admin-primary-900);
  color: var(--opends-admin-primary-300);
}

.type-badge.primevue {
  background-color: var(--opends-admin-success-100);
  color: var(--opends-admin-success-700);
}

.dark .type-badge.primevue {
  background-color: var(--opends-admin-success-900);
  color: var(--opends-admin-success-300);
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
}

.status-badge.complete {
  background-color: var(--opends-admin-success-100);
  color: var(--opends-admin-success-700);
}

.dark .status-badge.complete {
  background-color: var(--opends-admin-success-900);
  color: var(--opends-admin-success-300);
}

.status-badge.in-progress {
  background-color: var(--opends-admin-warning-100);
  color: var(--opends-admin-warning-700);
}

.dark .status-badge.in-progress {
  background-color: var(--opends-admin-warning-900);
  color: var(--opends-admin-warning-300);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .table-container {
    grid-template-columns: 1fr;
  }
  
  .component-grid {
    grid-template-columns: 1fr;
  }
  
  .theme-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>