<template>
  <div class="users-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Users</h1>
        <p class="page-subtitle">Manage team members and permissions</p>
      </div>
      <Button icon="pi pi-user-plus" label="Invite User" @click="showInviteDialog = true" />
    </div>

    <!-- Stats -->
    <div class="user-stats">
      <Card class="stat-card">
        <template #content>
          <div class="stat-item">
            <i class="pi pi-users stat-icon"></i>
            <div>
              <p class="stat-value">{{ users.length }}</p>
              <p class="stat-label">Total Users</p>
            </div>
          </div>
        </template>
      </Card>

      <Card class="stat-card">
        <template #content>
          <div class="stat-item">
            <i class="pi pi-check-circle stat-icon" style="color: #10b981"></i>
            <div>
              <p class="stat-value">{{ users.filter(u => u.is_active).length }}</p>
              <p class="stat-label">Active</p>
            </div>
          </div>
        </template>
      </Card>

      <Card class="stat-card">
        <template #content>
          <div class="stat-item">
            <i class="pi pi-shield stat-icon" style="color: #f59e0b"></i>
            <div>
              <p class="stat-value">{{ users.filter(u => u.role === 'admin').length }}</p>
              <p class="stat-label">Admins</p>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Users Table -->
    <Card class="users-table-card">
      <template #content>
        <DataTable 
          :value="users" 
          :rows="15"
          :paginator="users.length > 15"
          responsive-layout="scroll"
          striped-rows
        >
          <Column header="User">
            <template #body="{ data }">
              <div class="user-cell">
                <div class="user-avatar">
                  {{ getUserInitials(data.name) }}
                </div>
                <div class="user-info">
                  <p class="user-name">{{ data.name }}</p>
                  <p class="user-email">{{ data.email }}</p>
                </div>
              </div>
            </template>
          </Column>

          <Column field="role" header="Role">
            <template #body="{ data }">
              <Select 
                v-model="data.role" 
                :options="roles"
                :disabled="data.id === authStore.user?.id"
                @change="updateUserRole(data)"
                class="role-select"
              />
            </template>
          </Column>

          <Column field="is_active" header="Status">
            <template #body="{ data }">
              <Tag 
                :value="data.is_active ? 'Active' : 'Inactive'" 
                :severity="data.is_active ? 'success' : 'secondary'"
              />
            </template>
          </Column>

          <Column field="last_login_at" header="Last Login">
            <template #body="{ data }">
              <span class="date-text">
                {{ data.last_login_at ? formatDate(data.last_login_at) : 'Never' }}
              </span>
            </template>
          </Column>

          <Column field="created_at" header="Joined">
            <template #body="{ data }">
              <span class="date-text">{{ formatDate(data.created_at) }}</span>
            </template>
          </Column>

          <Column header="Actions" :style="{ width: '160px' }">
            <template #body="{ data }">
              <div class="table-actions" v-if="data.id !== authStore.user?.id">
                <Button 
                  :icon="data.is_active ? 'pi pi-ban' : 'pi pi-check'" 
                  :label="data.is_active ? 'Deactivate' : 'Activate'"
                  text 
                  size="small"
                  :severity="data.is_active ? 'danger' : 'success'"
                  @click="toggleUserStatus(data)" 
                />
                <Button 
                  icon="pi pi-trash" 
                  text 
                  size="small"
                  severity="danger" 
                  @click="deleteUser(data)" 
                />
              </div>
              <Tag v-else value="You" severity="info" />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Invite Dialog -->
    <Dialog 
      v-model:visible="showInviteDialog" 
      header="Invite User"
      :style="{ width: '500px' }"
      modal
    >
      <div class="dialog-form">
        <Message severity="info" :closable="false">
          An invitation email will be sent to the user with a registration link.
        </Message>

        <div class="form-field">
          <label for="invite-email">Email Address *</label>
          <InputText 
            id="invite-email" 
            v-model="inviteForm.email" 
            type="email"
            placeholder="user@example.com" 
          />
        </div>

        <div class="form-field">
          <label for="invite-name">Name *</label>
          <InputText 
            id="invite-name" 
            v-model="inviteForm.name" 
            placeholder="John Doe" 
          />
        </div>

        <div class="form-field">
          <label for="invite-role">Role *</label>
          <Select 
            id="invite-role" 
            v-model="inviteForm.role" 
            :options="roles"
            placeholder="Select a role"
          />
          <small class="role-description">{{ getRoleDescription(inviteForm.role) }}</small>
        </div>
      </div>

      <template #footer>
        <Button label="Cancel" text @click="closeInviteDialog" />
        <Button 
          label="Send Invitation" 
          icon="pi pi-send"
          :loading="sending"
          @click="sendInvite" 
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const authStore = useAuthStore()
const api = useApi()

interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'editor' | 'viewer'
  is_active: boolean
  last_login_at: string | null
  created_at: string
}

const showInviteDialog = ref(false)
const sending = ref(false)
const loading = ref(false)

const inviteForm = ref({
  email: '',
  name: '',
  role: 'viewer'
})

const roles = ['admin', 'editor', 'viewer']

const users = ref<User[]>([])

function getUserInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function getRoleDescription(role: string): string {
  const descriptions: Record<string, string> = {
    admin: 'Full access to all features and settings',
    editor: 'Can create and edit components and tokens',
    viewer: 'Read-only access to the design system'
  }
  return descriptions[role] || ''
}

async function updateUserRole(user: User) {
  try {
    await api.put(`/users/${user.id}`, { role: user.role })
  } catch (error: any) {
    alert('Failed to update role: ' + error.message)
    await loadUsers() // Reload to revert
  }
}

async function toggleUserStatus(user: User) {
  const action = user.is_active ? 'deactivate' : 'activate'
  if (confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} ${user.name}?`)) {
    try {
      await api.put(`/users/${user.id}`, { is_active: !user.is_active })
      user.is_active = !user.is_active
    } catch (error: any) {
      alert('Failed to update status: ' + error.message)
    }
  }
}

async function deleteUser(user: User) {
  if (confirm(`Permanently delete ${user.name}? This action cannot be undone.`)) {
    try {
      await api.delete(`/users/${user.id}`)
      users.value = users.value.filter(u => u.id !== user.id)
    } catch (error: any) {
      alert('Failed to delete user: ' + error.message)
    }
  }
}

async function sendInvite() {
  sending.value = true
  try {
    await api.post('/auth/invite', inviteForm.value)
    alert(`Invitation sent to ${inviteForm.value.email}`)
    await loadUsers()
    closeInviteDialog()
  } catch (error: any) {
    alert('Failed to send invitation: ' + error.message)
  } finally {
    sending.value = false
  }
}

function closeInviteDialog() {
  showInviteDialog.value = false
  inviteForm.value = {
    email: '',
    name: '',
    role: 'viewer'
  }
}

async function loadUsers() {
  loading.value = true
  try {
    const response = await api.get('/users')
    users.value = response.users || response || []
  } catch (error: any) {
    console.error('Failed to load users:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadUsers()
})
</script>

<style scoped>
.users-page {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: #0f172a;
}

.page-subtitle {
  color: #64748b;
  margin: 0.5rem 0 0 0;
}

.user-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1rem;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: 600;
  margin: 0;
  color: #0f172a;
}

.user-email {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0.25rem 0 0 0;
}

.role-description {
  display: block;
  margin-top: 0.5rem;
  color: #64748b;
  font-size: 0.75rem;
  line-height: 1.4;
}

.users-table-card {
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.role-select {
  min-width: 120px;
}

.date-text {
  color: #64748b;
  font-size: 0.875rem;
}

.table-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.stat-icon {
  font-size: 2.5rem;
  color: #3b82f6;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: #0f172a;
}

.stat-label {
  color: #64748b;
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
}

.dialog-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1rem 0;
}

.form-field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #0f172a;
}

:deep(.p-datatable-thead > tr > th) {
  background: #f8fafc;
  color: #475569;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  padding: 1rem 1.5rem;
}

:deep(.p-datatable-tbody > tr > td) {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

:deep(.p-datatable-tbody > tr:last-child > td) {
  border-bottom: none;
}

:deep(.p-dialog-content),
:deep(.p-dialog-header),
:deep(.p-dialog-footer) {
  background: white !important;
}

:deep(.p-dialog-header) {
  border-bottom: 1px solid #e2e8f0;
  padding: 1.5rem;
}

:deep(.p-dialog-content) {
  padding: 1.5rem;
}

:deep(.p-dialog-footer) {
  border-top: 1px solid #e2e8f0;
  padding: 1rem 1.5rem;
}
</style>
