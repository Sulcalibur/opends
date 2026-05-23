<template>
  <div class="opends-search">
    <div class="search-input-container">
      <UInput
        v-model="searchQuery"
        placeholder="Search components, props, events..."
        class="search-input w-full"
        icon="i-lucide-search"
        @input="performSearch"
      />
    </div>

    <!-- Search Results -->
    <div v-if="searchResults.length > 0" class="search-results">
      <div class="results-header">
        <h4>Search Results ({{ searchResults.length }})</h4>
        <UButton
          icon="i-lucide-x"
          size="sm"
          variant="ghost"
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
            <UIcon :name="`i-lucide-${getComponentIcon(result.category)}`" />
            {{ result.name }}
            <UBadge :label="result.category" color="info" class="category-badge" />
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
      <UIcon name="i-lucide-search" class="text-gray-400 text-2xl mb-2" />
      <p class="text-gray-600">No components found matching "{{ searchQuery }}"</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading">
      <div class="animate-spin inline-block"><UIcon name="i-lucide-loader-2" class="text-gray-400" /></div>
      <p class="text-gray-600">Searching...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

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
const componentData = ref<unknown[]>([])

onMounted(async () => {
  try {
    const response = await fetch('/api/docs/site')
    const data = await response.json()
    componentData.value = data.components || []
  } catch (error) {
    console.warn('Failed to load component data for search:', error)
  }
})

const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  loading.value = true

  try {
    const query = searchQuery.value.toLowerCase()
    const results: SearchResult[] = []

    componentData.value.forEach(component => {
      const comp = (component as Record<string, unknown>).component as Record<string, unknown> || {}
      const name = (comp.name as string) || ''
      const description = (comp.description as string) || ''
      const category = (comp.category as string) || 'general'
      const props = ((comp.props as Record<string, string>[]) || []).map(p => p.name)
      const events = ((comp.events as Record<string, string>[]) || []).map(e => e.name)

      const matchesName = name.toLowerCase().includes(query)
      const matchesDescription = description.toLowerCase().includes(query)
      const matchesProps = props.some(prop => prop.toLowerCase().includes(query))
      const matchesEvents = events.some(event => event.toLowerCase().includes(query))

      if (matchesName || matchesDescription || matchesProps || matchesEvents) {
        results.push({
          id: comp.id as string,
          name,
          description,
          category,
          props,
          events,
          url: `/components/${name}.html`
        })
      }
    })

    searchResults.value = results.slice(0, 10)
  } catch (error) {
    console.error('Search error:', error)
    searchResults.value = []
  } finally {
    loading.value = false
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
}

const navigateToResult = (result: SearchResult) => {
  window.location.href = result.url
}

const getComponentIcon = (category: string) => {
  const icons: Record<string, string> = {
    form: 'text-cursor-input',
    data: 'table',
    layout: 'layout-dashboard',
    navigation: 'menu',
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
</style>
