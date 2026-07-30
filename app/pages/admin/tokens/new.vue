<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const toast = useToast()

const form = ref({
  name: '',
  value: '',
  description: '',
  category: 'color',
})

const categories = ['color', 'space', 'radius', 'shadow', 'font', 'motion', 'z-index']
const saving = ref(false)
const error = ref('')

async function saveToken() {
  if (!form.value.name || !form.value.value) {
    error.value = 'Token name and value are required.'
    return
  }
  saving.value = true
  error.value = ''

  try {
    const response = await $fetch<{ success: boolean }>('/api/tokens', {
      method: 'POST',
      body: {
        name: form.value.name,
        value: form.value.value,
        description: form.value.description,
        category: form.value.category,
      },
    })

    if (response.success) {
      toast.add({ color: 'success', title: 'Created', description: 'Design token created successfully.' })
      await navigateTo('/admin/tokens')
    }
  } catch (e: any) {
    error.value = e?.data?.message || 'Failed to create token.'
  } finally {
    saving.value = false
  }
}

useHead({ title: 'New Token — Admin' })
</script>

<template>
  <div class="new-token-page">
    <div class="page-header">
      <NuxtLink to="/admin/tokens" class="back-link">
        <UIcon name="i-lucide-arrow-left" class="size-3.5" />
        Back to Tokens
      </NuxtLink>
      <h1 class="page-title">New Token</h1>
      <p class="page-subtitle">Define a new design token for your system.</p>
    </div>

    <div class="form-card">
      <div class="form-section">
        <div class="field">
          <label for="name" class="field-label">Token name <span class="field-required">*</span></label>
          <UInput id="name" v-model="form.name" placeholder="e.g., color.primary.500" size="xl" autofocus />
          <span class="field-hint">Dot-separated path: "category.subcategory.shade"</span>
        </div>

        <div class="field">
          <label for="value" class="field-label">Value <span class="field-required">*</span></label>
          <div class="value-row">
            <div v-if="form.value.startsWith('#')" class="color-swatch" :style="{ background: form.value }" />
            <UInput id="value" v-model="form.value" placeholder="e.g., #CC4128 or 16px or 0.25s" size="md" class="flex-1" />
          </div>
        </div>

        <div class="field">
          <label for="desc" class="field-label">Description</label>
          <UInput id="desc" v-model="form.description" placeholder="e.g., Sweet Salmon — primary CTAs and focus rings" size="md" />
        </div>

        <div class="field">
          <label class="field-label">Category</label>
          <div class="category-grid">
            <button
              v-for="cat in categories"
              :key="cat"
              class="category-chip"
              :class="{ active: form.category === cat }"
              @click="form.category = cat"
            >{{ cat }}</button>
          </div>
        </div>

        <div v-if="error" class="error-box">
          <UIcon name="i-lucide-alert-circle" class="size-4" />
          {{ error }}
        </div>
      </div>

      <div class="form-actions">
        <UButton variant="outline" to="/admin/tokens">Cancel</UButton>
        <UButton :loading="saving" icon="i-lucide-check" @click="saveToken">
          Create Token
        </UButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.new-token-page {
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

.value-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.flex-1 { flex: 1; }

.color-swatch {
  width: 36px;
  height: 36px;
  border-radius: var(--r-input);
  border: 1px solid var(--border);
  flex-shrink: 0;
}

.category-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.category-chip {
  padding: 6px 14px;
  font-size: 12.5px;
  font-weight: 600;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--duration-micro);
}
.category-chip:hover { border-color: var(--border-strong); }
.category-chip.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
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
