<template>
  <div class="component-detail">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">{{ component.name }}</h1>
              <p v-if="component.displayName && component.displayName !== component.name" class="text-xl text-gray-600 mt-1">
                {{ component.displayName }}
              </p>
            </div>
            <div class="flex items-center gap-3">
              <span
                :class="[
                  'px-3 py-1 rounded-full text-sm font-medium',
                  {
                    'bg-green-100 text-green-800': component.status === 'approved',
                    'bg-yellow-100 text-yellow-800': component.status === 'review',
                    'bg-blue-100 text-blue-800': component.status === 'draft',
                    'bg-red-100 text-red-800': component.status === 'deprecated'
                  }
                ]"
              >
                {{ component.status }}
              </span>
              <button
                @click="editMode = !editMode"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {{ editMode ? 'Cancel' : 'Edit' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- Main Content -->
        <div class="lg:col-span-2">

          <!-- Description -->
          <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 class="text-xl font-semibold mb-4">Description</h2>
            <p v-if="editMode">
              <textarea
                v-model="editableComponent.description"
                class="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows="3"
                placeholder="Component description..."
              ></textarea>
            </p>
            <p v-else class="text-gray-700">
              {{ component.description || 'No description provided.' }}
            </p>
          </div>

          <!-- Preview -->
          <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 class="text-xl font-semibold mb-4">Preview</h2>
            <ComponentPreview
              :component-spec="component.spec"
              :key="component.id"
            />
          </div>

          <!-- Usage Examples -->
          <div v-if="component.spec && component.spec.examples" class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 class="text-xl font-semibold mb-4">Examples</h2>
            <div class="space-y-6">
              <div
                v-for="(example, index) in component.spec.examples"
                :key="index"
                class="border border-gray-200 rounded-lg p-4"
              >
                <h3 class="font-medium mb-2">{{ example.name }}</h3>
                <p v-if="example.description" class="text-gray-600 text-sm mb-3">
                  {{ example.description }}
                </p>
                <pre class="bg-gray-100 p-3 rounded text-sm overflow-x-auto"><code>{{ example.code }}</code></pre>
              </div>
            </div>
          </div>

        </div>

        <!-- Sidebar -->
        <div class="space-y-6">

          <!-- Properties -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold mb-4">Properties</h3>
            <div v-if="component.spec && component.spec.props" class="space-y-3">
              <div
                v-for="prop in component.spec.props"
                :key="prop.name"
                class="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
              >
                <div class="flex items-center gap-2 mb-1">
                  <code class="bg-gray-100 px-2 py-1 rounded text-sm">{{ prop.name }}</code>
                  <span v-if="prop.required" class="text-red-500 text-xs">required</span>
                  <span class="text-gray-500 text-xs">{{ prop.type }}</span>
                </div>
                <p v-if="prop.description" class="text-gray-600 text-sm">{{ prop.description }}</p>
                <p v-if="prop.default !== undefined" class="text-gray-500 text-xs">
                  Default: {{ prop.default }}
                </p>
              </div>
            </div>
            <p v-else class="text-gray-500 text-sm">No properties defined.</p>
          </div>

          <!-- Variants -->
          <div v-if="component.spec && component.spec.variants" class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold mb-4">Variants</h3>
            <div class="space-y-3">
              <div
                v-for="variant in component.spec.variants"
                :key="variant.name"
                class="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
              >
                <h4 class="font-medium">{{ variant.name }}</h4>
                <p v-if="variant.description" class="text-gray-600 text-sm">{{ variant.description }}</p>
                <div v-if="variant.props" class="mt-2">
                  <div class="text-xs text-gray-500 mb-1">Props:</div>
                  <code class="bg-gray-100 px-2 py-1 rounded text-xs">{{ JSON.stringify(variant.props, null, 2) }}</code>
                </div>
              </div>
            </div>
          </div>

          <!-- Metadata -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold mb-4">Metadata</h3>
            <dl class="space-y-2 text-sm">
              <div>
                <dt class="font-medium text-gray-500">Category</dt>
                <dd>{{ component.category || 'None' }}</dd>
              </div>
              <div>
                <dt class="font-medium text-gray-500">Created</dt>
                <dd>{{ formatDate(component.createdAt) }}</dd>
              </div>
              <div>
                <dt class="font-medium text-gray-500">Updated</dt>
                <dd>{{ formatDate(component.updatedAt) }}</dd>
              </div>
              <div v-if="component.approvedAt">
                <dt class="font-medium text-gray-500">Approved</dt>
                <dd>{{ formatDate(component.approvedAt) }}</dd>
              </div>
            </dl>
          </div>

          <!-- Actions -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold mb-4">Actions</h3>
            <div class="space-y-2">
              <button
                v-if="editMode"
                @click="saveChanges"
                class="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Save Changes
              </button>
              <button
                @click="createVersion"
                class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Version
              </button>
              <button
                v-if="component.status === 'draft'"
                @click="submitForReview"
                class="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
              >
                Submit for Review
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ComponentPreview from './ComponentPreview.vue'

// Props
const props = defineProps({
  component: {
    type: Object,
    required: true
  }
})

// Reactive data
const editMode = ref(false)
const editableComponent = ref({ ...props.component })

// Methods
function formatDate(dateString) {
  if (!dateString) return 'Never'
  return new Date(dateString).toLocaleDateString()
}

function saveChanges() {
  // TODO: Implement save logic
  console.log('Saving changes:', editableComponent.value)
  editMode.value = false
}

function createVersion() {
  // TODO: Implement version creation
  console.log('Creating version for component:', props.component.id)
}

function submitForReview() {
  // TODO: Implement review submission
  console.log('Submitting for review:', props.component.id)
}
</script>

<style scoped>
.component-detail {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>