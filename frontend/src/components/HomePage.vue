<template>
  <div class="home">
    <h1>OpenDS</h1>
    <p>Open-source, self-hosted design system platform</p>
    <p>Bridging design tools with development workflows</p>
    
    <div class="primevue-test">
      <h2>PrimeVue Integration Test</h2>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Card from 'primevue/card'
import { ODSButton, ODSInput } from '@/components/ui'
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
</style>