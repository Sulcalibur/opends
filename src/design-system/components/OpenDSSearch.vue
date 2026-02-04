<template>
  <div class="opends-search">
    <div class="search-input-container">
      <InputText
        v-model="searchQuery"
        placeholder="Search components, props, events..."
        class="search-input"
        @input="performSearch"
      />
      <i class="pi pi-search search-icon"/>
    </div>

    <!-- Search Results -->
    <div v-if="searchResults.length > 0" class="search-results">
      <div class="results-header">
        <h4>Search Results ({{ searchResults.length }})</h4>
        <Button
          icon="pi pi-times"
          size="small"
          text
          class="clear-button"
          @click="clearSearch"
        />
      </div>

      <div class="results-list">
        <div
          v-for="result in searchResults"
          :key="result.id"
          class="result-item"
          @click="navigateToResult(result)"
        >
          <div class="result-title">
            <i :class="`pi pi-${getComponentIcon(result.category)}`"/>
            {{ result.name }}
            <Badge :value="result.category" severity="info" class="category-badge" />
          </div>
          <div class="result-description">{{ result.description }}</div>
          <div v-if="result.props && result.props.length > 0" class="result-props">
            <small>Props: {{ result.props.slice(0, 3).join(', ') }}{{ result.props.length > 3 ? '...' : '' }}</small>
          </div>
        </div>
      </div>
    </div>

    <!-- No Results -->
    <div v-else-if="searchQuery && !loading" class="no-results">
      <i class="pi pi-search text-gray-400 text-2xl mb-2"/>
      <p class="text-gray-600">No components found matching "{{ searchQuery }}"</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading">
      <i class="pi pi-spin pi-spinner text-gray-400"/>
      <p class="text-gray-600">Searching...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Badge from 'primevue/badge'

interface SearchResult {
  id: string
  name: string
  description: string
  category: string
  props: string[]
  events: string[]
  url: string
}

const searchQuery = ref('')
const searchResults = ref<SearchResult[]>([])
const loading = ref(false)
const componentData = ref<any[]>([])

// Load component data on mount
onMounted(async () => {
  try {
    const response = await fetch('/api/docs/site')
    const data = await response.json()
    componentData.value = data.components || []
  } catch (error) {
    console.warn('Failed to load component data for search:', error)
  }
})

// Perform search
const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  loading.value = true

  try {
    // Simple client-side search (in production, this could be server-side)
    const query = searchQuery.value.toLowerCase()
    const results: SearchResult[] = []

    componentData.value.forEach(component => {
      const comp = component.component || {}
      const name = comp.name || ''
      const description = comp.description || ''
      const category = comp.category || 'general'
      const props = (comp.props || []).map((p: any) => p.name)
      const events = (comp.events || []).map((e: any) => e.name)

      // Check if query matches name, description, props, or events
      const matchesName = name.toLowerCase().includes(query)
      const matchesDescription = description.toLowerCase().includes(query)
      const matchesProps = props.some((prop: string) => prop.toLowerCase().includes(query))
      const matchesEvents = events.some((event: string) => event.toLowerCase().includes(query))

      if (matchesName || matchesDescription || matchesProps || matchesEvents) {
        results.push({
          id: comp.id,
          name,
          description,
          category,
          props,
          events,
          url: `/components/${name}.html`
        })
      }
    })

    searchResults.value = results.slice(0, 10) // Limit to 10 results
  } catch (error) {
    console.error('Search error:', error)
    searchResults.value = []
  } finally {
    loading.value = false
  }
}

// Clear search
const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
}

// Navigate to result
const navigateToResult = (result: SearchResult) => {
  window.location.href = result.url
}

// Get component icon based on category
const getComponentIcon = (category: string) => {
  const icons: Record<string, string> = {
    form: 'input',
    data: 'table',
    layout: 'layout',
    navigation: 'bars',
    feedback: 'bell',
    general: 'box'
  }
  return icons[category] || 'box'
}
</script>

<style scoped>
.opends-search {
  position: relative;
  width: 100%;
  max-width: 600px;
}

.search-input-container {
  position: relative;
}

.search-input {
  width: 100%;
  padding-right: 2.5rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
}

.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 0.875rem;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 50;
  max-height: 400px;
  overflow-y: auto;
  margin-top: 0.5rem;
}

.results-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9fafb;
  border-radius: 0.5rem 0.5rem 0 0;
}

.results-header h4 {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.clear-button {
  color: #6b7280;
}

.results-list {
  padding: 0;
}

.result-item {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.result-item:last-child {
  border-bottom: none;
}

.result-item:hover {
  background-color: #f9fafb;
}

.result-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.25rem;
}

.result-title i {
  color: #6b7280;
  font-size: 0.875rem;
}

.category-badge {
  font-size: 0.625rem;
  padding: 0.125rem 0.375rem;
}

.result-description {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.result-props {
  color: #9ca3af;
}

.no-results, .loading {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 50;
  margin-top: 0.5rem;
}

.dark .search-results {
  background: #1f2937;
  border-color: #374151;
}

.dark .results-header {
  background: #111827;
  border-color: #374151;
}

.dark .result-item {
  border-color: #374151;
}

.dark .result-item:hover {
  background-color: #111827;
}

.dark .result-title {
  color: #f9fafb;
}

.dark .result-description {
  color: #9ca3af;
}
</style>