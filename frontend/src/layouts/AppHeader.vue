<template>
  <header class="app-header">
    <div class="header-left">
      <h2 class="page-title">{{ pageTitle }}</h2>
      <Breadcrumb :model="breadcrumbItems" class="breadcrumb" />
    </div>
    
    <div class="header-right">
      <Button 
        icon="pi pi-bell" 
        severity="secondary" 
        text 
        rounded 
        aria-label="Notifications"
      />
      <Button 
        icon="pi pi-question-circle" 
        severity="secondary" 
        text 
        rounded 
        aria-label="Help"
      />
      <Avatar icon="pi pi-user" shape="circle" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Breadcrumb from 'primevue/breadcrumb'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'

const route = useRoute()

const pageTitle = computed(() => {
  const name = route.name?.toString() || 'Dashboard'
  return name.charAt(0).toUpperCase() + name.slice(1)
})

const breadcrumbItems = computed(() => {
  return [
    { label: 'Home', route: '/' },
    { label: pageTitle.value }
  ]
})
</script>

<style scoped>
.app-header {
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--opends-admin-gray-200);
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dark .app-header {
  background: var(--opends-admin-gray-800);
  border-bottom-color: var(--opends-admin-gray-700);
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--opends-admin-gray-900);
  margin: 0;
}

.dark .page-title {
  color: var(--opends-admin-gray-100);
}

.breadcrumb {
  border: none;
  background: transparent;
  padding: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
</style>