<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const toast = useToast()

const form = ref({
  name: '',
  display_name: '',
  description: '',
  category: '',
  status: 'draft' as 'draft' | 'approved',
})

const categories = ['Inputs', 'Display', 'Overlay', 'Navigation', 'Data', 'Feedback']
const saving = ref(false)
const error = ref('')

async function saveComponent() {
  if (!form.value.name) {
    error.value = 'Component name is required.'
    return
  }
  saving.value = true
  error.value = ''

  try {
    const response = await $fetch<{ success: boolean }>('/api/components', {
      method: 'POST',
      body: {
        name: form.value.name.toLowerCase().replace(/\s+/g, '-'),
        display_name: form.value.display_name || form.value.name,
        description: form.value.description,
        category: form.value.category,
        status: form.value.status,
        spec: {
          variants: [
            { name: 'Primary', label: 'primary', description: '' },
            { name: 'Secondary', label: 'secondary', description: '' },
            { name: 'Soft', label: 'soft', description: '' },
          ],
          props: [
            { name: 'label', type: 'string', default: '—', description: 'Visible text.' },
            { name: 'variant', type: 'string', default: '"primary"', description: 'Visual emphasis.' },
            { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Sizing.' },
          ],
          a11y: [
            { check: 'Focus visible', result: 'Pass', detail: '', pass: true },
            { check: 'Color contrast', result: 'Pass', detail: '', pass: true },
            { check: 'Keyboard', result: 'Pass', detail: '', pass: true },
          ],
        },
      },
    })

    if (response.success) {
      toast.add({ color: 'success', title: 'Created', description: 'Component created successfully.' })
      await navigateTo('/admin/components')
    }
  } catch (e: any) {
    error.value = e?.data?.message || 'Failed to create component.'
  } finally {
    saving.value = false
  }
}

useHead({ title: 'New Component — Admin' })
</script>

<template>
  <div class="new-component-page">
    <div class="page-header">
      <NuxtLink to="/admin/components" class="back-link">
        <UIcon name="i-lucide-arrow-left" class="size-3.5" />
        Back to Components
      </NuxtLink>
      <h1 class="page-title">New Component</h1>
      <p class="page-subtitle">Add a component to your design system.</p>
    </div>

    <div class="form-card">
      <div class="form-section">
        <div class="field">
          <label for="name" class="field-label">Component name <span class="field-required">*</span></label>
          <UInput id="name" v-model="form.name" placeholder="e.g., Button" size="xl" autofocus />
          <span class="field-hint">Lowercase, hyphenated: "{{ form.name.toLowerCase().replace(/\s+/g, '-') || 'button' }}"</span>
        </div>

        <div class="field">
          <label for="display" class="field-label">Display name</label>
          <UInput id="display" v-model="form.display_name" placeholder="e.g., Primary Button" size="md" />
        </div>

        <div class="field">
          <label for="desc" class="field-label">Description</label>
          <UTextarea id="desc" v-model="form.description" placeholder="What does this component do? When should teams use it?" :rows="3" />
        </div>

        <div class="field-row">
          <div class="field field-half">
            <label class="field-label">Category</label>
            <USelect v-model="form.category" :items="categories" placeholder="Select category" />
          </div>
          <div class="field field-half">
            <label class="field-label">Initial status</label>
            <div class="segmented">
              <button class="segmented-btn" :class="{ active: form.status === 'draft' }" @click="form.status = 'draft'">Draft</button>
              <button class="segmented-btn" :class="{ active: form.status === 'approved' }" @click="form.status = 'approved'">Approved</button>
            </div>
          </div>
        </div>

        <div v-if="error" class="error-box">
          <UIcon name="i-lucide-alert-circle" class="size-4" />
          {{ error }}
        </div>
      </div>

      <div class="form-actions">
        <UButton variant="outline" to="/admin/components">Cancel</UButton>
        <UButton :loading="saving" icon="i-lucide-check" @click="saveComponent">
          Create Component
        </UButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.new-component-page {
  max-width: 680px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-secondary);
  text-decoration: none;
  margin-bottom: 16px;
}
.back-link:hover { color: var(--text); }

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 4px;
}

.page-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 28px;
}

.form-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-card);
  overflow: hidden;
}

.form-section {
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
}

.field-required {
  color: var(--danger);
}

.field-hint {
  font-size: 11px;
  color: var(--text-tertiary);
  font-family: var(--f-mono);
}

.field-row {
  display: flex;
  gap: 16px;
}
.field-half { flex: 1; }

.segmented {
  display: inline-flex;
  gap: 3px;
  background: var(--surface-2);
  padding: 3px;
  border-radius: 6px;
}
.segmented-btn {
  padding: 5px 14px;
  font-size: 12.5px;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: transparent;
  color: var(--text-secondary);
  transition: all var(--duration-micro);
}
.segmented-btn.active {
  background: var(--surface);
  color: var(--text);
  box-shadow: var(--shadow-card);
}

.error-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: var(--danger-soft);
  color: var(--danger);
  border-radius: var(--r-input);
  font-size: 13px;
  font-weight: 500;
}

.form-actions {
  padding: 20px 28px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
