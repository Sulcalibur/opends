<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: "auth",
});

interface DesignToken {
  id: string;
  name: string;
  category: string;
  value: any;
  description?: string;
}

const fileInput = useTemplateRef<HTMLInputElement>("fileInput");
const showCreateModal = ref(false);
const editingToken = ref<DesignToken | null>(null);
const saving = ref(false);
const selectedTokenCategory = ref("all");
const loading = ref(false);
const exporting = ref(false);
const importing = ref(false);

const tokenForm = ref({
  name: "",
  category: "",
  colorValue: "#3b82f6",
  numericValue: 16,
  stringValue: "",
  description: "",
});

const tokenCategories = [
  { label: "All", value: "all", icon: "i-lucide-layout-grid" },
  { label: "Colors", value: "color", icon: "i-lucide-palette" },
  { label: "Spacing", value: "spacing", icon: "i-lucide-move" },
  { label: "Typography", value: "fontSize", icon: "i-lucide-type" },
  { label: "Font Family", value: "fontFamily", icon: "i-lucide-align-left" },
  { label: "Border Radius", value: "borderRadius", icon: "i-lucide-circle" },
  { label: "Shadow", value: "shadow", icon: "i-lucide-sun" },
];

const tokens = ref<DesignToken[]>([]);
const api = useApi();

const filteredTokens = computed(() => {
  if (selectedTokenCategory.value === "all") {
    return tokens.value;
  }
  return tokens.value.filter((t) => t.category === selectedTokenCategory.value);
});

const tokenColumns = [
  { key: "name", label: "Name", sortable: true },
  { key: "value", label: "Value" },
  { key: "category", label: "Category" },
  { key: "description", label: "Description" },
  { key: "actions", label: "Actions" },
];

function getTokenCount(category: string) {
  if (category === "all") return tokens.value.length;
  return tokens.value.filter((t) => t.category === category).length;
}

function getColorValue(value: any): string {
  return value?.hex || value?.rgb || value || "#000000";
}

function formatTokenValue(value: any): string {
  if (typeof value === "object") {
    if (value.px) return `${value.px}px`;
    if (value.rem) return `${value.rem}rem`;
    return JSON.stringify(value);
  }
  return String(value);
}

function getCategoryColor(category: string): string {
  const map: Record<string, string> = {
    color: "blue",
    spacing: "green",
    fontSize: "amber",
    fontFamily: "neutral",
    borderRadius: "purple",
    shadow: "orange",
  };
  return map[category] || "blue";
}

function isLightColor(hex: string): boolean {
  const rgb = parseInt(hex.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma > 128;
}

function editToken(token: DesignToken) {
  editingToken.value = token;
  tokenForm.value = {
    name: token.name,
    category: token.category,
    colorValue: getColorValue(token.value),
    numericValue: token.value?.px || 16,
    stringValue: typeof token.value === "string" ? token.value : "",
    description: token.description || "",
  };
  showCreateModal.value = true;
}

async function deleteToken(token: DesignToken) {
  if (confirm(`Delete ${token.name}?`)) {
    try {
      await api.delete(`/tokens/${token.id}`);
      tokens.value = tokens.value.filter((t) => t.id !== token.id);
    } catch (error: any) {
      alert("Failed to delete token: " + error.message);
    }
  }
}

async function saveToken() {
  saving.value = true;
  try {
    let value: any;

    if (tokenForm.value.category === "color") {
      value = { hex: tokenForm.value.colorValue };
    } else if (
      ["spacing", "fontSize", "borderRadius"].includes(tokenForm.value.category)
    ) {
      value = { px: tokenForm.value.numericValue };
    } else {
      value = tokenForm.value.stringValue;
    }

    const tokenData = {
      name: tokenForm.value.name,
      category: tokenForm.value.category,
      value,
      description: tokenForm.value.description,
    };

    if (editingToken.value) {
      const updated = await api.put(
        `/tokens/${editingToken.value.id}`,
        tokenData,
      );
      const index = tokens.value.findIndex(
        (t) => t.id === editingToken.value!.id,
      );
      if (index !== -1) tokens.value[index] = updated.token;
    } else {
      const created = await api.post("/tokens", tokenData);
      tokens.value.unshift(created.token);
    }

    closeModal();
  } catch (error: any) {
    alert("Failed to save token: " + error.message);
  } finally {
    saving.value = false;
  }
}

function closeModal() {
  showCreateModal.value = false;
  editingToken.value = null;
  tokenForm.value = {
    name: "",
    category: "",
    colorValue: "#3b82f6",
    numericValue: 16,
    stringValue: "",
    description: "",
  };
}

async function loadTokens() {
  loading.value = true;
  try {
    const response = await api.get("/tokens");
    tokens.value = response.tokens || [];
  } catch (error: any) {
    console.error("Failed to load tokens:", error);
  } finally {
    loading.value = false;
  }
}

async function exportTokens() {
  exporting.value = true;
  try {
    const response = await api.get("/tokens/export");
    const dataStr = JSON.stringify(response.tokens, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `design-tokens-${Date.now()}.json`;
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  } catch (error: any) {
    alert("Failed to export tokens: " + error.message);
  } finally {
    exporting.value = false;
  }
}

async function importTokens(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || !input.files[0]) return;

  importing.value = true;
  try {
    const file = input.files[0];
    const text = await file.text();
    const tokensData = JSON.parse(text);

    const result = await api.post("/tokens/import", { tokens: tokensData });

    alert(
      `Import complete!\nImported: ${result.imported}\nSkipped: ${result.skipped}\nErrors: ${result.errors.length}`,
    );

    await loadTokens();
  } catch (error: any) {
    alert("Failed to import tokens: " + error.message);
  } finally {
    importing.value = false;
    input.value = "";
  }
}

onMounted(async () => {
  await loadTokens();
});
</script>

<template>
  <div class="max-w-[1400px] mx-auto p-6 space-y-6">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Design Tokens
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">
          Manage colors, typography, spacing, and more
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <input
          ref="fileInput"
          type="file"
          accept=".json"
          class="hidden"
          @change="importTokens"
        />
        <UButton
          icon="i-lucide-download"
          label="Export"
          color="neutral"
          variant="outline"
          :loading="exporting"
          @click="exportTokens"
        />
        <UButton
          icon="i-lucide-upload"
          label="Import"
          color="neutral"
          variant="outline"
          :loading="importing"
          @click="fileInput?.click()"
        />
        <UButton
          icon="i-lucide-plus"
          label="New Token"
          @click="showCreateModal = true"
        />
      </div>
    </div>

    <!-- Token Categories -->
    <div class="flex gap-2 overflow-x-auto pb-2">
      <UButton
        v-for="cat in tokenCategories"
        :key="cat.value"
        :icon="cat.icon"
        :label="cat.label"
        :color="selectedTokenCategory === cat.value ? 'primary' : 'neutral'"
        :variant="selectedTokenCategory === cat.value ? 'solid' : 'outline'"
        class="whitespace-nowrap"
        @click="selectedTokenCategory = cat.value"
      >
        <template #trailing>
          <UBadge
            :color="selectedTokenCategory === cat.value ? 'neutral' : 'neutral'"
            variant="soft"
            size="sm"
            class="ml-1"
          >
            {{ getTokenCount(cat.value) }}
          </UBadge>
        </template>
      </UButton>
    </div>

    <!-- Tokens Table -->
    <UCard>
      <UTable :rows="filteredTokens" :columns="tokenColumns" :loading="loading">
        <template #name-data="{ row }">
          <code
            class="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm text-blue-600 dark:text-blue-400"
          >
            {{ row.name }}
          </code>
        </template>

        <template #value-data="{ row }">
          <div class="flex items-center gap-3">
            <div
              v-if="row.category === 'color'"
              class="w-8 h-8 rounded-lg border-2 border-gray-200 dark:border-gray-600"
              :style="{ background: getColorValue(row.value) }"
            />
            <span
              v-if="row.category === 'color'"
              class="text-sm text-gray-700 dark:text-gray-300"
            >
              {{ getColorValue(row.value) }}
            </span>
            <span v-else class="text-sm text-gray-700 dark:text-gray-300">
              {{ formatTokenValue(row.value) }}
            </span>
          </div>
        </template>

        <template #category-data="{ row }">
          <UBadge :color="getCategoryColor(row.category)" variant="soft">
            {{ row.category }}
          </UBadge>
        </template>

        <template #description-data="{ row }">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ row.description || "-" }}
          </span>
        </template>

        <template #actions-data="{ row }">
          <div class="flex gap-1">
            <UButton
              icon="i-lucide-pencil"
              color="neutral"
              variant="ghost"
              size="xs"
              @click="editToken(row)"
            />
            <UButton
              icon="i-lucide-trash"
              color="error"
              variant="ghost"
              size="xs"
              @click="deleteToken(row)"
            />
          </div>
        </template>

        <template #empty>
          <div class="text-center py-8 text-gray-500 dark:text-gray-400">
            <UIcon
              name="i-lucide-palette"
              class="text-3xl mx-auto mb-2 opacity-50"
            />
            <p>No tokens found</p>
          </div>
        </template>
      </UTable>
    </UCard>

    <!-- Create/Edit Modal -->
    <UModal
      v-model="showCreateModal"
      :title="editingToken ? 'Edit Token' : 'New Design Token'"
    >
      <div class="space-y-5 p-1">
        <UFormField label="Token Name" required>
          <UInput
            v-model="tokenForm.name"
            placeholder="e.g., primary-500"
            class="w-full"
          />
          <template #hint>
            <span class="text-xs text-gray-500"
              >Use kebab-case for token names</span
            >
          </template>
        </UFormField>

        <UFormField label="Category" required>
          <USelect
            v-model="tokenForm.category"
            :items="
              tokenCategories
                .filter((c) => c.value !== 'all')
                .map((c) => ({ label: c.label, value: c.value }))
            "
            placeholder="Select category"
            class="w-full"
          />
        </UFormField>

        <!-- Color Input -->
        <UFormField
          v-if="tokenForm.category === 'color'"
          label="Color Value"
          required
        >
          <div class="flex items-center gap-3">
            <input
              v-model="tokenForm.colorValue"
              type="color"
              class="w-12 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
            />
            <UInput
              v-model="tokenForm.colorValue"
              placeholder="#000000"
              class="flex-1"
            />
          </div>
        </UFormField>

        <!-- Spacing Input -->
        <UFormField
          v-else-if="tokenForm.category === 'spacing'"
          label="Spacing Value"
          required
        >
          <UInput
            v-model="tokenForm.numericValue"
            type="number"
            :min="0"
            :max="1000"
            suffix="px"
            class="w-full"
          />
        </UFormField>

        <!-- Font Size Input -->
        <UFormField
          v-else-if="tokenForm.category === 'fontSize'"
          label="Font Size"
          required
        >
          <UInput
            v-model="tokenForm.numericValue"
            type="number"
            :min="8"
            :max="128"
            suffix="px"
            class="w-full"
          />
        </UFormField>

        <!-- Font Family Input -->
        <UFormField
          v-else-if="tokenForm.category === 'fontFamily'"
          label="Font Family"
          required
        >
          <UInput
            v-model="tokenForm.stringValue"
            placeholder="e.g., Inter, sans-serif"
            class="w-full"
          />
        </UFormField>

        <!-- Default Value Input -->
        <UFormField v-else label="Value" required>
          <UTextarea
            v-model="tokenForm.stringValue"
            :rows="3"
            placeholder="Enter token value..."
            class="w-full"
          />
        </UFormField>

        <UFormField label="Description">
          <UTextarea
            v-model="tokenForm.description"
            :rows="2"
            placeholder="Describe this token..."
            class="w-full"
          />
        </UFormField>

        <!-- Preview -->
        <div v-if="tokenForm.category === 'color' && tokenForm.colorValue">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >Preview</label
          >
          <div
            class="w-full h-28 rounded-xl flex items-center justify-center border-2 border-gray-200 dark:border-gray-600"
            :style="{ background: tokenForm.colorValue }"
          >
            <span
              class="text-4xl font-bold"
              :style="{
                color: isLightColor(tokenForm.colorValue) ? '#000' : '#fff',
              }"
            >
              Aa
            </span>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            label="Cancel"
            color="neutral"
            variant="ghost"
            @click="closeModal"
          />
          <UButton
            :label="editingToken ? 'Update' : 'Create'"
            :loading="saving"
            @click="saveToken"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
