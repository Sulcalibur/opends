<script setup lang="ts">
/**
 * Admin Users Management
 * Refactored to use NuxtUI v4 + Tailwind + Lucide icons
 */
definePageMeta({
  layout: "admin",
  middleware: "auth",
});

const authStore = useAuthStore();
const api = useApi();
const toast = useToast();

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "editor" | "viewer";
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
}

const showInviteModal = ref(false);
const sending = ref(false);
const loading = ref(false);

const inviteForm = ref({
  email: "",
  name: "",
  role: "viewer" as "admin" | "editor" | "viewer",
});

const roles = ["admin", "editor", "viewer"] as const;

const users = ref<User[]>([]);

function getUserInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getRoleDescription(role: string): string {
  const descriptions: Record<string, string> = {
    admin: "Full access to all features and settings",
    editor: "Can create and edit components and tokens",
    viewer: "Read-only access to the design system",
  };
  return descriptions[role] || "";
}

async function updateUserRole(user: User) {
  try {
    await api.put(`/users/${user.id}`, { role: user.role });
    toast.add({
      title: "Role Updated",
      description: `${user.name}'s role updated to ${user.role}`,
      color: "success",
    });
  } catch (error: any) {
    toast.add({
      title: "Failed to update role",
      description: error.message,
      color: "error",
    });
    await loadUsers(); // Reload to revert
  }
}

async function toggleUserStatus(user: User) {
  const action = user.is_active ? "deactivate" : "activate";
  if (
    confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} ${user.name}?`)
  ) {
    try {
      await api.put(`/users/${user.id}`, { is_active: !user.is_active });
      user.is_active = !user.is_active;
      toast.add({
        title: `User ${action}d`,
        description: `${user.name} has been ${action}d.`,
        color: "success",
      });
    } catch (error: any) {
      toast.add({
        title: "Failed to update status",
        description: error.message,
        color: "error",
      });
    }
  }
}

async function deleteUser(user: User) {
  if (
    confirm(`Permanently delete ${user.name}? This action cannot be undone.`)
  ) {
    try {
      await api.delete(`/users/${user.id}`);
      users.value = users.value.filter((u) => u.id !== user.id);
      toast.add({
        title: "User Deleted",
        description: `${user.name} has been deleted.`,
        color: "success",
      });
    } catch (error: any) {
      toast.add({
        title: "Failed to delete user",
        description: error.message,
        color: "error",
      });
    }
  }
}

async function sendInvite() {
  if (!inviteForm.value.email || !inviteForm.value.name) {
    toast.add({
      title: "Validation Error",
      description: "Email and name are required",
      color: "error",
    });
    return;
  }

  sending.value = true;
  try {
    const tempPassword = generateTempPassword();

    await api.post("/users", {
      email: inviteForm.value.email,
      name: inviteForm.value.name,
      password: tempPassword,
      role: inviteForm.value.role,
    });

    toast.add({
      title: "User created",
      description: `Account created for ${inviteForm.value.email}. Temporary password: ${tempPassword}`,
      color: "success",
    });

    await loadUsers();
    closeInviteDialog();
  } catch (error: any) {
    toast.add({
      title: "Failed to create user",
      description: error.message,
      color: "error",
    });
  } finally {
    sending.value = false;
  }
}

function generateTempPassword(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function closeInviteDialog() {
  showInviteModal.value = false;
  inviteForm.value = {
    email: "",
    name: "",
    role: "viewer",
  };
}

async function loadUsers() {
  loading.value = true;
  try {
    const response = await api.get("/users");
    users.value = response.users || response || [];
  } catch (error: any) {
    console.error("Failed to load users:", error);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await loadUsers();
});
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-8">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Users</h1>
        <p class="mt-2 text-gray-500 dark:text-gray-400">
          Manage team members and their access levels
        </p>
      </div>
      <UButton
        color="primary"
        icon="i-lucide-user-plus"
        @click="showInviteModal = true"
      >
        Invite User
      </UButton>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <UCard>
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-xl bg-blue-50 dark:bg-blue-950">
            <UIcon
              name="i-lucide-users"
              class="w-8 h-8 text-blue-600 dark:text-blue-400"
            />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ users.length }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950">
            <UIcon
              name="i-lucide-check-circle"
              class="w-8 h-8 text-emerald-600 dark:text-emerald-400"
            />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ users.filter((u) => u.is_active).length }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Active</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-xl bg-purple-50 dark:bg-purple-950">
            <UIcon
              name="i-lucide-shield"
              class="w-8 h-8 text-purple-600 dark:text-purple-400"
            />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ users.filter((u) => u.role === "admin").length }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Admins</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Users Table -->
    <UCard>
      <AdminTable
        :data="users"
        :columns="[
          { key: 'name', label: 'User' },
          { key: 'role', label: 'Role' },
          { key: 'is_active', label: 'Status' },
          { key: 'last_login_at', label: 'Last Login' },
          { key: 'created_at', label: 'Joined' },
          { key: 'actions', label: 'Actions' },
        ]"
        :loading="loading"
      >
        <template #name-cell="{ row }">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm"
            >
              {{ getUserInitials(row.name) }}
            </div>
            <div>
              <p class="font-semibold text-gray-900 dark:text-white">
                {{ row.name }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ row.email }}
              </p>
            </div>
          </div>
        </template>

        <template #role-cell="{ row }">
          <USelect
            v-model="row.role"
            :items="
              roles.map((r) => ({
                value: r,
                label: r.charAt(0).toUpperCase() + r.slice(1),
              }))
            "
            :disabled="row.id === authStore.user?.id"
            class="w-32"
            @update:model-value="updateUserRole(row)"
          />
        </template>

        <template #is_active-cell="{ row }">
          <UBadge
            :color="row.is_active ? 'success' : 'neutral'"
            variant="soft"
            size="sm"
          >
            {{ row.is_active ? "Active" : "Inactive" }}
          </UBadge>
        </template>

        <template #last_login_at-cell="{ row }">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ row.last_login_at ? formatDate(row.last_login_at) : "Never" }}
          </span>
        </template>

        <template #created_at-cell="{ row }">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ formatDate(row.created_at) }}
          </span>
        </template>

        <template #actions-cell="{ row }">
          <div
            v-if="row.id !== authStore.user?.id"
            class="flex items-center gap-2"
          >
            <UButton
              :color="row.is_active ? 'error' : 'success'"
              variant="ghost"
              size="xs"
              :icon="row.is_active ? 'i-lucide-ban' : 'i-lucide-check'"
              @click="toggleUserStatus(row)"
            >
              {{ row.is_active ? "Deactivate" : "Activate" }}
            </UButton>
            <UButton
              color="error"
              variant="ghost"
              size="xs"
              icon="i-lucide-trash"
              @click="deleteUser(row)"
            />
          </div>
          <UBadge v-else color="info" variant="soft" size="sm">You</UBadge>
        </template>
      </AdminTable>
    </UCard>

    <!-- Invite Modal -->
    <UModal :open="showInviteModal" @update:open="showInviteModal = $event">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Invite User</h3>
            <p class="text-sm text-gray-500">
              An invitation email will be sent to the user with a registration
              link.
            </p>
          </template>

          <div class="space-y-4">
            <UFormField label="Email Address" required>
              <UInput
                v-model="inviteForm.email"
                type="email"
                placeholder="user@example.com"
              />
            </UFormField>

            <UFormField label="Name" required>
              <UInput v-model="inviteForm.name" placeholder="John Doe" />
            </UFormField>

            <UFormField label="Role" required>
              <USelect
                v-model="inviteForm.role"
                :items="
                  roles.map((r) => ({
                    value: r,
                    label: r.charAt(0).toUpperCase() + r.slice(1),
                  }))
                "
                placeholder="Select a role"
              />
              <p class="text-xs text-gray-500 mt-1">
                {{ getRoleDescription(inviteForm.role) }}
              </p>
            </UFormField>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton
                color="neutral"
                variant="ghost"
                @click="closeInviteDialog"
              >
                Cancel
              </UButton>
              <UButton
                color="primary"
                icon="i-lucide-send"
                :loading="sending"
                @click="sendInvite"
              >
                Send Invitation
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>
