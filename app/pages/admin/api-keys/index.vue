<template>
  <div class="api-keys-page">
    <div class="page-header">
      <h1>API Keys</h1>
      <p class="subtitle">Manage API keys for external integrations</p>
    </div>

    <div class="content-card">
      <div class="card-header">
        <h2>Your API Keys</h2>
        <Button
          label="Create New Key"
          icon="pi pi-plus"
          @click="showCreateDialog = true"
        />
      </div>

      <DataTable :value="apiKeys" :loading="loading" responsive-layout="scroll">
        <Column field="name" header="Name">
          <template #body="slotProps">
            <div class="key-name">
              <i class="pi pi-key"/>
              <span>{{ slotProps.data.name }}</span>
            </div>
          </template>
        </Column>
        <Column field="key" header="API Key">
          <template #body="slotProps">
            <code class="key-value">{{ slotProps.data.key }}</code>
          </template>
        </Column>
        <Column field="createdAt" header="Created">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.createdAt) }}
          </template>
        </Column>
        <Column field="lastUsed" header="Last Used">
          <template #body="slotProps">
            {{
              slotProps.data.lastUsed
                ? formatDate(slotProps.data.lastUsed)
                : "Never"
            }}
          </template>
        </Column>
        <Column header="Actions" style="width: 100px">
          <template #body="slotProps">
            <Button
              icon="pi pi-trash"
              class="p-button-danger p-button-text"
              @click="confirmDelete(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>

      <div v-if="apiKeys.length === 0 && !loading" class="empty-state">
        <i class="pi pi-key empty-icon"/>
        <h3>No API keys yet</h3>
        <p>Create your first API key to integrate with design tools</p>
        <Button
          label="Create API Key"
          icon="pi pi-plus"
          @click="showCreateDialog = true"
        />
      </div>
    </div>

    <!-- Create Dialog -->
    <Dialog
      v-model:visible="showCreateDialog"
      header="Create API Key"
      :modal="true"
      :style="{ width: '450px' }"
    >
      <div class="form-field">
        <label for="keyName">Key Name</label>
        <InputText
          id="keyName"
          v-model="newKeyName"
          placeholder="e.g., Penpot Integration"
          class="w-full"
        />
        <small>Give your API key a descriptive name</small>
      </div>

      <template #footer>
        <Button
          label="Cancel"
          class="p-button-text"
          @click="showCreateDialog = false"
        />
        <Button
          label="Create Key"
          icon="pi pi-check"
          :loading="creating"
          @click="createKey"
        />
      </template>
    </Dialog>

    <!-- Success Dialog -->
    <Dialog
      v-model:visible="showSuccessDialog"
      header="API Key Created"
      :modal="true"
      :style="{ width: '500px' }"
    >
      <div class="success-content">
        <i class="pi pi-check-circle success-icon"/>
        <p>
          Your new API key has been created. Copy it now - you won't be able to
          see it again!
        </p>
        <div class="created-key">
          <code>{{ newCreatedKey }}</code>
          <Button icon="pi pi-copy" class="p-button-text" @click="copyKey" />
        </div>
      </div>

      <template #footer>
        <Button label="Done" @click="showSuccessDialog = false" />
      </template>
    </Dialog>

    <!-- Delete Confirmation -->
    <Dialog
      v-model:visible="showDeleteDialog"
      header="Revoke API Key"
      :modal="true"
      :style="{ width: '400px' }"
    >
      <p>
        Are you sure you want to revoke <strong>{{ deletingKey?.name }}</strong
        >? This action cannot be undone.
      </p>
      <p class="warning-text">
        Any applications using this key will lose access immediately.
      </p>

      <template #footer>
        <Button
          label="Cancel"
          class="p-button-text"
          @click="showDeleteDialog = false"
        />
        <Button
          label="Revoke Key"
          class="p-button-danger"
          :loading="deleting"
          @click="deleteKey"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";

definePageMeta({
  layout: "admin",
  middleware: "auth",
});

const toast = useToast();

const apiKeys = ref<any[]>([]);
const loading = ref(false);
const creating = ref(false);
const deleting = ref(false);
const showCreateDialog = ref(false);
const showSuccessDialog = ref(false);
const showDeleteDialog = ref(false);
const newKeyName = ref("");
const newCreatedKey = ref("");
const deletingKey = ref<any>(null);

async function fetchApiKeys() {
  loading.value = true;
  try {
    const response = await $fetch("/api/admin/api-keys", {
      headers: {
        Authorization: `Bearer ${useAuthStore().token}`,
      },
    });
    if (response.success && response.data) {
      apiKeys.value = response.data.keys || [];
    }
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to load API keys",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
}

async function createKey() {
  if (!newKeyName.value.trim()) {
    toast.add({
      severity: "warn",
      summary: "Warning",
      detail: "Please enter a name for the API key",
      life: 3000,
    });
    return;
  }

  creating.value = true;
  try {
    const response = await $fetch("/api/admin/api-keys", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${useAuthStore().token}`,
      },
      body: { name: newKeyName.value },
    });

    if (response.success && response.data) {
      newCreatedKey.value = response.data.key.key;
      showCreateDialog.value = false;
      showSuccessDialog.value = true;
      newKeyName.value = "";
      await fetchApiKeys();
    }
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to create API key",
      life: 3000,
    });
  } finally {
    creating.value = false;
  }
}

function confirmDelete(key: any) {
  deletingKey.value = key;
  showDeleteDialog.value = true;
}

async function deleteKey() {
  if (!deletingKey.value) return;

  deleting.value = true;
  try {
    await $fetch(`/api/admin/api-keys/${deletingKey.value.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${useAuthStore().token}`,
      },
    });

    toast.add({
      severity: "success",
      summary: "Success",
      detail: "API key revoked",
      life: 3000,
    });

    showDeleteDialog.value = false;
    deletingKey.value = null;
    await fetchApiKeys();
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to revoke API key",
      life: 3000,
    });
  } finally {
    deleting.value = false;
  }
}

function copyKey() {
  navigator.clipboard.writeText(newCreatedKey.value);
  toast.add({
    severity: "success",
    summary: "Copied",
    detail: "API key copied to clipboard",
    life: 2000,
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

.content-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
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

.key-name i {
  color: #64748b;
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

:deep(.p-datatable) {
  border: none;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background: #f8fafc;
  color: #64748b;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1rem 1.5rem;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 1rem 1.5rem;
  border-color: #f1f5f9;
}
</style>
