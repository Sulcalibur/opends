<template>
  <div class="api-keys-page">
    <div class="page-header">
      <h1>API Keys</h1>
      <p class="subtitle">Manage API keys for external integrations</p>
    </div>

    <UCard>
      <template #header>
        <div class="card-header">
          <h2>Your API Keys</h2>
          <UButton
            icon="i-lucide-plus"
            label="Create New Key"
            @click="showCreateDialog = true"
          />
        </div>
      </template>

      <UTable :data="apiKeys" :columns="columns" :loading="loading">
        <template #name-cell="{ row }">
          <div class="key-name">
            <Icon name="i-lucide-key" class="text-gray-400" />
            <span>{{ row.original.name }}</span>
          </div>
        </template>
        <template #key-cell="{ row }">
          <code class="key-value">{{ row.original.key }}</code>
        </template>
        <template #createdAt-cell="{ row }">
          {{ formatDate(row.original.createdAt) }}
        </template>
        <template #lastUsed-cell="{ row }">
          {{
            row.original.lastUsed ? formatDate(row.original.lastUsed) : "Never"
          }}
        </template>
        <template #actions-cell="{ row }">
          <UButton
            icon="i-lucide-trash-2"
            color="error"
            variant="ghost"
            size="sm"
            @click="confirmDelete(row.original)"
          />
        </template>
      </UTable>

      <div v-if="apiKeys.length === 0 && !loading" class="empty-state">
        <Icon name="i-lucide-key" class="empty-icon" />
        <h3>No API keys yet</h3>
        <p>Create your first API key to integrate with design tools</p>
        <UButton
          icon="i-lucide-plus"
          label="Create API Key"
          @click="showCreateDialog = true"
        />
      </div>
    </UCard>

    <!-- Create Dialog -->
    <UModal v-model:open="showCreateDialog" title="Create API Key">
      <template #body>
        <div class="form-field">
          <label for="keyName">Key Name</label>
          <UInput
            id="keyName"
            v-model="newKeyName"
            placeholder="e.g., Penpot Integration"
          />
          <small>Give your API key a descriptive name</small>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            variant="ghost"
            label="Cancel"
            @click="showCreateDialog = false"
          />
          <UButton
            icon="i-lucide-check"
            label="Create Key"
            :loading="creating"
            @click="createKey"
          />
        </div>
      </template>
    </UModal>

    <!-- Success Dialog -->
    <UModal v-model:open="showSuccessDialog" title="API Key Created">
      <template #body>
        <div class="success-content">
          <Icon name="i-lucide-check-circle" class="success-icon" />
          <p>
            Your new API key has been created. Copy it now - you won't be able
            to see it again!
          </p>
          <div class="created-key">
            <code>{{ newCreatedKey }}</code>
            <UButton
              icon="i-lucide-copy"
              variant="ghost"
              size="sm"
              @click="copyKey"
            />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end">
          <UButton label="Done" @click="showSuccessDialog = false" />
        </div>
      </template>
    </UModal>

    <!-- Delete Confirmation -->
    <UModal v-model:open="showDeleteDialog" title="Revoke API Key">
      <template #body>
        <p>
          Are you sure you want to revoke
          <strong>{{ deletingKey?.name }}</strong
          >? This action cannot be undone.
        </p>
        <p class="warning-text">
          Any applications using this key will lose access immediately.
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            variant="ghost"
            label="Cancel"
            @click="showDeleteDialog = false"
          />
          <UButton
            color="error"
            label="Revoke Key"
            :loading="deleting"
            @click="deleteKey"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: "auth",
});

const toast = useToast();

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string | null;
}

const columns = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "key", header: "API Key" },
  { accessorKey: "createdAt", header: "Created" },
  { accessorKey: "lastUsed", header: "Last Used" },
  { id: "actions", header: "Actions" },
];

const apiKeys = ref<ApiKey[]>([]);
const loading = ref(false);
const creating = ref(false);
const deleting = ref(false);
const showCreateDialog = ref(false);
const showSuccessDialog = ref(false);
const showDeleteDialog = ref(false);
const newKeyName = ref("");
const newCreatedKey = ref("");
const deletingKey = ref<ApiKey | null>(null);

async function fetchApiKeys() {
  loading.value = true;
  try {
    const response = await $fetch<{ success: boolean; data?: { keys: ApiKey[]; count: number } }>('/api/admin/api-keys', {
      headers: {
        Authorization: `Bearer ${useAuthStore().accessToken}`,
      },
    });
    if (response.success && response.data) {
      apiKeys.value = response.data.keys || [];
    }
  } catch (error: any) {
    toast.add({
      color: 'error',
      title: 'Error',
      description: 'Failed to load API keys',
    });
  } finally {
    loading.value = false;
  }
}

async function createKey() {
  if (!newKeyName.value.trim()) {
    toast.add({
      color: 'warning',
      title: 'Warning',
      description: 'Please enter a name for the API key',
    });
    return;
  }

  creating.value = true;
  try {
    const response = await $fetch<{ success: boolean; data?: { key: string; keyId: string; message: string } }>('/api/admin/api-keys', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${useAuthStore().accessToken}`,
      },
      body: { name: newKeyName.value },
    });

    if (response.success && response.data) {
      newCreatedKey.value = response.data.key;
      showCreateDialog.value = false;
      showSuccessDialog.value = true;
      newKeyName.value = '';
      await fetchApiKeys();
    }
  } catch (error: any) {
    toast.add({
      color: 'error',
      title: 'Error',
      description: 'Failed to create API key',
    });
  } finally {
    creating.value = false;
  }
}

function confirmDelete(key: ApiKey) {
  deletingKey.value = key;
  showDeleteDialog.value = true;
}

async function deleteKey() {
  if (!deletingKey.value) return;

  deleting.value = true;
  try {
    await $fetch(`/api/admin/api-keys/${deletingKey.value.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${useAuthStore().accessToken}`,
      },
    });

    toast.add({
      color: 'success',
      title: 'Success',
      description: 'API key revoked',
    });

    showDeleteDialog.value = false;
    deletingKey.value = null;
    await fetchApiKeys();
  } catch (error: any) {
    toast.add({
      color: 'error',
      title: 'Error',
      description: 'Failed to revoke API key',
    });
  } finally {
    deleting.value = false;
  }
}

function copyKey() {
  navigator.clipboard.writeText(newCreatedKey.value);
  toast.add({
    color: "success",
    title: "Copied",
    description: "API key copied to clipboard",
  });
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

onMounted(() => {
  fetchApiKeys();
});
</script>

<style scoped>
.api-keys-page {
  padding: 2rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.subtitle {
  color: #64748b;
  margin: 0.5rem 0 0 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.key-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.key-value {
  font-family: monospace;
  font-size: 0.875rem;
  background: #f1f5f9;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  color: #475569;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 3rem;
  color: #cbd5e1;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.25rem;
  color: #475569;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: #94a3b8;
  margin: 0 0 1.5rem 0;
}

.form-field {
  margin-bottom: 1.5rem;
}

.form-field label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-field small {
  display: block;
  color: #6b7280;
  margin-top: 0.25rem;
}

.success-content {
  text-align: center;
}

.success-icon {
  font-size: 3rem;
  color: #22c55e;
  margin-bottom: 1rem;
}

.created-key {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f1f5f9;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.created-key code {
  flex: 1;
  font-family: monospace;
  font-size: 0.875rem;
  color: #1e293b;
  word-break: break-all;
}

.warning-text {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.dark .page-header h1,
.dark .card-header h2 {
  color: var(--dark-color-text-primary);
}
</style>
