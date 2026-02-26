<template>
  <div class="settings-page">
    <div class="page-header">
      <h1 class="page-title">Settings</h1>
      <p class="page-subtitle">Manage workspace configuration</p>
    </div>

    <div class="settings-grid">
      <div class="settings-nav">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['nav-item', { active: currentTab === tab.id }]"
          @click="currentTab = tab.id"
        >
          <i :class="tab.icon" />
          {{ tab.label }}
        </button>
      </div>

      <div class="settings-content">
        <Card class="content-card">
          <template #content>
            <!-- General Settings -->
            <div v-if="currentTab === 'general'" class="space-y-6">
              <h3 class="section-title">General Information</h3>

              <div class="form-field">
                <label>Organization Name</label>
                <InputText
                  v-model="settings.organization_name"
                  class="w-full"
                />
                <small class="help-text"
                  >Used in headers, footers and page titles</small
                >
              </div>

              <div class="form-field mt-4">
                <label>Service Phase</label>
                <Dropdown
                  v-model="settings.general.phase"
                  :options="['Alpha', 'Beta', 'Live', 'None']"
                  class="w-full"
                />
                <small class="help-text"
                  >Displays a banner at the top of all pages (e.g. ALPHA)</small
                >
              </div>

              <Divider />

              <h3 class="section-title">Localization</h3>
              <div class="grid grid-cols-2 gap-4">
                <div class="form-field">
                  <label>Language</label>
                  <Dropdown
                    v-model="settings.general.language"
                    :options="languages"
                    option-label="name"
                    option-value="code"
                    class="w-full"
                  />
                </div>
                <div class="form-field">
                  <label>Timezone</label>
                  <Dropdown
                    v-model="settings.general.timezone"
                    :options="timezones"
                    class="w-full"
                  />
                </div>
              </div>
            </div>

            <!-- Homepage Settings -->
            <div v-else-if="currentTab === 'homepage'" class="space-y-6">
              <h3 class="section-title">Hero Section</h3>
              <p class="text-sm text-gray-500 mb-4">
                Configure the main landing page hero area.
              </p>

              <div class="form-field">
                <label>Hero Title</label>
                <InputText
                  v-model="settings.home_hero.title"
                  class="w-full"
                  placeholder="e.g. OpenDS Design System"
                />
              </div>

              <div class="form-field">
                <label>Hero Subtitle</label>
                <Textarea
                  v-model="settings.home_hero.subtitle"
                  rows="2"
                  class="w-full"
                  placeholder="e.g. Establishing quality and inclusivity across our digital experiences."
                />
              </div>

              <div class="form-field">
                <label>Hero Image URL</label>
                <InputText
                  v-model="settings.home_hero.image_url"
                  class="w-full"
                  placeholder="https://example.com/hero.png"
                />
                <small class="help-text"
                  >Direct link to a high-quality background image or
                  illustration</small
                >
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="form-field">
                  <label>CTA Button Text</label>
                  <InputText
                    v-model="settings.home_hero.cta_text"
                    class="w-full"
                    placeholder="Get Started"
                  />
                </div>
                <div class="form-field">
                  <label>CTA Button Link</label>
                  <InputText
                    v-model="settings.home_hero.cta_link"
                    class="w-full"
                    placeholder="/docs"
                  />
                </div>
              </div>

              <div
                v-if="settings.home_hero.image_url"
                class="p-4 bg-gray-50 rounded-lg border border-dashed flex items-center gap-4"
              >
                <div
                  class="w-24 h-16 rounded overflow-hidden border shadow-sm flex-shrink-0"
                >
                  <img
                    :src="settings.home_hero.image_url"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p class="text-sm font-medium">Hero Preview</p>
                  <p class="text-xs text-gray-500">Image successfully linked</p>
                </div>
              </div>
            </div>

            <!-- Appearance Settings -->
            <div v-else-if="currentTab === 'appearance'" class="space-y-6">
              <h3 class="section-title">Theme</h3>
              <div class="grid grid-cols-3 gap-4">
                <div
                  class="theme-option"
                  :class="{ active: settings.appearance.theme === 'light' }"
                  @click="settings.appearance.theme = 'light'"
                >
                  <div class="bg-white border rounded h-24 mb-2" />
                  <span>Light</span>
                </div>
                <div
                  class="theme-option"
                  :class="{ active: settings.appearance.theme === 'dark' }"
                  @click="settings.appearance.theme = 'dark'"
                >
                  <div
                    class="bg-gray-900 border border-gray-700 rounded h-24 mb-2"
                  />
                  <span>Dark</span>
                </div>
                <div
                  class="theme-option"
                  :class="{ active: settings.appearance.theme === 'system' }"
                  @click="settings.appearance.theme = 'system'"
                >
                  <div
                    class="bg-gradient-to-br from-white to-gray-900 border rounded h-24 mb-2"
                  />
                  <span>System</span>
                </div>
              </div>

              <Divider />

              <h3 class="section-title">Brand Colors</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-4">
                  <label class="block text-sm font-medium text-gray-700"
                    >Primary Color</label
                  >
                  <div class="flex flex-wrap gap-2 mb-2">
                    <div
                      v-for="color in brandColors"
                      :key="'p-' + color"
                      class="w-8 h-8 rounded-full cursor-pointer transition-transform hover:scale-110 border border-gray-200"
                      :style="{ backgroundColor: color }"
                      :class="{
                        'ring-2 ring-offset-2 ring-blue-500':
                          settings.appearance.primaryColor === color,
                      }"
                      @click="settings.appearance.primaryColor = color"
                    />
                  </div>
                  <div class="flex items-center gap-3">
                    <input
                      v-model="settings.appearance.primaryColor"
                      type="color"
                      class="h-10 w-20 p-1 rounded border border-gray-300 cursor-pointer"
                    />
                    <InputText
                      v-model="settings.appearance.primaryColor"
                      class="w-full"
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>

                <div class="space-y-4">
                  <label class="block text-sm font-medium text-gray-700"
                    >Secondary Color</label
                  >
                  <div class="flex flex-wrap gap-2 mb-2">
                    <div
                      v-for="color in secondaryColors"
                      :key="'s-' + color"
                      class="w-8 h-8 rounded-full cursor-pointer transition-transform hover:scale-110 border border-gray-200"
                      :style="{ backgroundColor: color }"
                      :class="{
                        'ring-2 ring-offset-2 ring-blue-500':
                          settings.appearance.secondaryColor === color,
                      }"
                      @click="settings.appearance.secondaryColor = color"
                    />
                  </div>
                  <div class="flex items-center gap-3">
                    <input
                      v-model="settings.appearance.secondaryColor"
                      type="color"
                      class="h-10 w-20 p-1 rounded border border-gray-300 cursor-pointer"
                    />
                    <InputText
                      v-model="settings.appearance.secondaryColor"
                      class="w-full"
                      placeholder="#10b981"
                    />
                  </div>
                </div>
              </div>

              <Divider />

              <h3 class="section-title">Typography</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-field">
                  <label>Heading Font</label>
                  <Dropdown
                    v-model="settings.appearance.headingFont"
                    :options="headingFonts"
                    option-label="label"
                    option-value="value"
                    class="w-full"
                  />
                  <div
                    class="mt-2 text-2xl"
                    :style="{ fontFamily: settings.appearance.headingFont }"
                  >
                    Example Heading
                  </div>
                </div>
                <div class="form-field">
                  <label>Body Font</label>
                  <Dropdown
                    v-model="settings.appearance.bodyFont"
                    :options="bodyFonts"
                    option-label="label"
                    option-value="value"
                    class="w-full"
                  />
                  <div
                    class="mt-2 text-sm"
                    :style="{ fontFamily: settings.appearance.bodyFont }"
                  >
                    The quick brown fox jumps over the lazy dog. This is how
                    your body text will look.
                  </div>
                </div>
              </div>

              <div class="form-field mt-6">
                <label>Corner Roundness</label>
                <div class="flex gap-4">
                  <div
                    v-for="opt in radiusOptions"
                    :key="opt.value"
                    class="flex-1 p-3 border rounded-lg text-center cursor-pointer hover:bg-gray-50 transition-all"
                    :class="{
                      'border-blue-500 bg-blue-50 text-blue-700':
                        settings.appearance.borderRadius === opt.value,
                    }"
                    @click="settings.appearance.borderRadius = opt.value"
                  >
                    <div class="text-sm font-bold">{{ opt.label }}</div>
                    <div class="text-xs text-gray-400">{{ opt.value }}</div>
                  </div>
                </div>
              </div>

              <Divider />

              <h3 class="section-title">Theme Presets</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  v-for="preset in themePresets"
                  :key="preset.id"
                  class="p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-all text-center"
                  :class="{
                    'border-blue-500 bg-blue-50':
                      settings.appearance.presetTheme === preset.id,
                  }"
                  @click="applyPreset(preset)"
                >
                  <div class="text-sm font-bold mb-1">{{ preset.label }}</div>
                  <div class="flex justify-center gap-1 mb-2">
                    <div
                      class="w-4 h-4 rounded-full"
                      :style="{ backgroundColor: preset.primary }"
                    />
                    <div
                      class="w-4 h-4 rounded-full"
                      :style="{ backgroundColor: preset.secondary }"
                    />
                  </div>
                  <div class="text-[10px] text-gray-500">
                    {{ preset.description }}
                  </div>
                </div>
              </div>

              <Divider />
            </div>

            <!-- Security Settings -->
            <div v-else-if="currentTab === 'security'" class="space-y-6">
              <h3 class="section-title">Access Control</h3>

              <div class="field-checkbox">
                <Checkbox
                  v-model="settings.security.publicAccess"
                  :binary="true"
                  input-id="public-access"
                />
                <label for="public-access" class="ml-2 font-medium"
                  >Allow public access to documentation</label
                >
              </div>
              <p class="text-sm text-gray-500 ml-8">
                If unchecked, only authenticated users can view the
                documentation.
              </p>

              <div class="field-checkbox mt-4">
                <Checkbox
                  v-model="settings.security.allowRegistration"
                  :binary="true"
                  input-id="allow-registration"
                />
                <label for="allow-registration" class="ml-2 font-medium"
                  >Allow new user registration</label
                >
              </div>
            </div>

            <div class="mt-8 flex justify-end">
              <Button
                label="Save Changes"
                icon="pi pi-check"
                :loading="saving"
                @click="saveSettings"
              />
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useApi } from "~/composables/useApi";

definePageMeta({
  layout: "admin",
  middleware: "auth",
});

const tabs = [
  { id: "general", label: "General", icon: "pi pi-cog" },
  { id: "homepage", label: "Homepage", icon: "pi pi-home" },
  { id: "appearance", label: "Appearance", icon: "pi pi-palette" },
  { id: "security", label: "Security", icon: "pi pi-lock" },
];

const currentTab = ref("general");
const saving = ref(false);
const api = useApi();
const toast = useToast();

const brandColors = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#1d70b8",
  "#003078",
];

const secondaryColors = [
  "#64748b",
  "#10b981",
  "#f59e0b",
  "#3b82f6",
  "#8b5cf6",
  "#0b0c0c",
  "#1d70b8",
];

const headingFonts = [
  { label: "IBM Plex Sans (GDS Style)", value: "IBM Plex Sans, sans-serif" },
  { label: "Outfit (Modern)", value: "Outfit, sans-serif" },
  { label: "Inter (Clean)", value: "Inter, sans-serif" },
  { label: "Space Grotesk (Tech)", value: "Space Grotesk, sans-serif" },
  { label: "Playfair Display (Elegant)", value: "Playfair Display, serif" },
  { label: "Montserrat (Bold)", value: "Montserrat, sans-serif" },
];

const bodyFonts = [
  { label: "Inter (System)", value: "Inter, sans-serif" },
  { label: "IBM Plex Sans (Precise)", value: "IBM Plex Sans, sans-serif" },
  { label: "Open Sans (Friendly)", value: "Open Sans, sans-serif" },
  { label: "Roboto (Standard)", value: "Roboto, sans-serif" },
  { label: "Lora (Classic)", value: "Lora, serif" },
];

const themePresets = [
  {
    id: "modern",
    label: "Modern Blue",
    primary: "#3b82f6",
    secondary: "#64748b",
    radius: "8px",
    heading: "Outfit, sans-serif",
    body: "Inter, sans-serif",
    description: "Clean and professional default.",
  },
  {
    id: "govuk",
    label: "GOV.UK",
    primary: "#1d70b8",
    secondary: "#0b0c0c",
    radius: "0px",
    heading: "IBM Plex Sans, sans-serif",
    body: "Inter, sans-serif",
    description: "Public sector accessibility first.",
  },
  {
    id: "moj",
    label: "MOJ Digital",
    primary: "#003078",
    secondary: "#1d70b8",
    radius: "0px",
    heading: "IBM Plex Sans, sans-serif",
    body: "Inter, sans-serif",
    description: "Ministry of Justice patterns.",
  },
  {
    id: "soft",
    label: "Soft Mint",
    primary: "#10b981",
    secondary: "#334155",
    radius: "16px",
    heading: "Montserrat, sans-serif",
    body: "Open Sans, sans-serif",
    description: "Friendly and approachable.",
  },
  {
    id: "tech",
    label: "Cyber Green",
    primary: "#22c55e",
    secondary: "#0f172a",
    radius: "4px",
    heading: "Space Grotesk, sans-serif",
    body: "IBM Plex Sans, sans-serif",
    description: "High-tech and precise feel.",
  },
  {
    id: "elegant",
    label: "Classic Noir",
    primary: "#0f172a",
    secondary: "#64748b",
    radius: "0px",
    heading: "Playfair Display, serif",
    body: "Lora, serif",
    description: "Sophisticated and sharp.",
  },
];

const radiusOptions = [
  { label: "None", value: "0px" },
  { label: "Small", value: "4px" },
  { label: "Medium", value: "8px" },
  { label: "Large", value: "16px" },
];

const settings = ref({
  organization_name: "OpenDS",
  home_hero: {
    title: "OpenDS - Design System",
    subtitle: "Simplified design system documentation for modern teams.",
    image_url: "",
    cta_text: "Get Started",
    cta_link: "/docs",
  },
  general: {
    language: "en",
    timezone: "UTC",
    phase: "Alpha",
  },
  appearance: {
    theme: "light",
    presetTheme: "modern",
    primaryColor: "#3b82f6",
    secondaryColor: "#64748b",
    borderRadius: "8px",
    headingFont: "Outfit, sans-serif",
    bodyFont: "Inter, sans-serif",
  },
  security: {
    publicAccess: true,
    allowRegistration: false,
  },
});

function applyPreset(preset: any) {
  settings.value.appearance.presetTheme = preset.id;
  settings.value.appearance.primaryColor = preset.primary;
  settings.value.appearance.secondaryColor = preset.secondary;
  settings.value.appearance.borderRadius = preset.radius;
  settings.value.appearance.headingFont = preset.heading;
  settings.value.appearance.bodyFont = preset.body;
}

// Real-time preview
watch(
  () => settings.value.appearance,
  (newVal) => {
    if (typeof window !== "undefined") {
      const root = document.documentElement;

      // Apply primary/secondary colors
      if (newVal.primaryColor) {
        root.style.setProperty("--primary-color", newVal.primaryColor);
        root.style.setProperty(
          "--primary-color-hover",
          `${newVal.primaryColor}ee`,
        );
      }
      if (newVal.secondaryColor) {
        root.style.setProperty("--secondary-color", newVal.secondaryColor);
      }
      if (newVal.borderRadius) {
        root.style.setProperty("--border-radius", newVal.borderRadius);
      }
      if (newVal.headingFont) {
        root.style.setProperty("--font-heading", newVal.headingFont);
      }
      if (newVal.bodyFont) {
        root.style.setProperty("--font-body", newVal.bodyFont);
      }

      // Apply dark mode class
      if (newVal.theme === "dark") {
        root.classList.add("dark");
      } else if (newVal.theme === "light") {
        root.classList.remove("dark");
      } else if (newVal.theme === "system") {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    }
  },
  { deep: true },
);

// Transform flat settings to nested structure
function transformFlatToNested(flatSettings: Record<string, any>) {
  const nested: any = {};

  // Map known flat keys to nested structure
  if (flatSettings["app.theme"] !== undefined) {
    if (!nested.appearance) nested.appearance = {};
    nested.appearance.theme = flatSettings["app.theme"];
  }
  if (flatSettings["app.name"] !== undefined) {
    nested.organization_name = flatSettings["app.name"];
  }
  if (flatSettings["auth.allow_registration"] !== undefined) {
    if (!nested.security) nested.security = {};
    nested.security.allowRegistration = flatSettings["auth.allow_registration"];
  }
  if (flatSettings["auth.require_email_verification"] !== undefined) {
    if (!nested.security) nested.security = {};
    nested.security.requireEmailVerification =
      flatSettings["auth.require_email_verification"];
  }
  if (flatSettings["design_system.name"] !== undefined) {
    if (!nested.designSystem) nested.designSystem = {};
    nested.designSystem.name = flatSettings["design_system.name"];
  }
  if (flatSettings["design_system.version"] !== undefined) {
    if (!nested.designSystem) nested.designSystem = {};
    nested.designSystem.version = flatSettings["design_system.version"];
  }
  if (flatSettings["design_system.repository_url"] !== undefined) {
    if (!nested.designSystem) nested.designSystem = {};
    nested.designSystem.repositoryUrl =
      flatSettings["design_system.repository_url"];
  }

  return nested;
}

// Transform nested structure to flat settings for API
function transformNestedToFlat(nestedSettings: any) {
  const flat: Record<string, any> = {};

  // Appearance
  if (nestedSettings.appearance?.theme !== undefined) {
    flat["app.theme"] = nestedSettings.appearance.theme;
  }
  if (nestedSettings.appearance?.primaryColor !== undefined) {
    flat["app.primary_color"] = nestedSettings.appearance.primaryColor;
  }
  if (nestedSettings.appearance?.secondaryColor !== undefined) {
    flat["app.secondary_color"] = nestedSettings.appearance.secondaryColor;
  }
  if (nestedSettings.appearance?.borderRadius !== undefined) {
    flat["app.border_radius"] = nestedSettings.appearance.borderRadius;
  }
  if (nestedSettings.appearance?.headingFont !== undefined) {
    flat["app.heading_font"] = nestedSettings.appearance.headingFont;
  }
  if (nestedSettings.appearance?.bodyFont !== undefined) {
    flat["app.body_font"] = nestedSettings.appearance.bodyFont;
  }
  if (nestedSettings.appearance?.presetTheme !== undefined) {
    flat["app.preset_theme"] = nestedSettings.appearance.presetTheme;
  }

  // Organization
  if (nestedSettings.organization_name !== undefined) {
    flat["app.name"] = nestedSettings.organization_name;
  }

  // Home hero (store as JSON string)
  if (nestedSettings.home_hero) {
    flat["app.home_hero"] = JSON.stringify(nestedSettings.home_hero);
  }

  // General
  if (nestedSettings.general) {
    flat["app.general"] = JSON.stringify(nestedSettings.general);
  }

  // Security
  if (nestedSettings.security?.allowRegistration !== undefined) {
    flat["auth.allow_registration"] = nestedSettings.security.allowRegistration;
  }
  if (nestedSettings.security?.publicAccess !== undefined) {
    flat["auth.public_access"] = nestedSettings.security.publicAccess;
  }
  if (nestedSettings.security?.requireEmailVerification !== undefined) {
    flat["auth.require_email_verification"] =
      nestedSettings.security.requireEmailVerification;
  }

  // Design system
  if (nestedSettings.designSystem) {
    if (nestedSettings.designSystem.name !== undefined) {
      flat["design_system.name"] = nestedSettings.designSystem.name;
    }
    if (nestedSettings.designSystem.version !== undefined) {
      flat["design_system.version"] = nestedSettings.designSystem.version;
    }
    if (nestedSettings.designSystem.repositoryUrl !== undefined) {
      flat["design_system.repository_url"] =
        nestedSettings.designSystem.repositoryUrl;
    }
  }

  return flat;
}

// Load settings
onMounted(async () => {
  try {
    const response = await api.get("/settings");
    if (response.success && response.settings) {
      // Transform flat settings to nested
      const nestedSettings = transformFlatToNested(response.settings);

      // Merge with defaults
      settings.value = {
        ...settings.value,
        ...nestedSettings,
      };
    }
  } catch (error) {
    toast.add({
      color: "error",
      title: "Error",
      description: "Failed to load settings",
    });
  }
});
const languages = [
  { name: "English", code: "en" },
  { name: "Spanish", code: "es" },
  { name: "French", code: "fr" },
];

const timezones = ["UTC", "America/New_York", "Europe/London", "Asia/Tokyo"];

async function saveSettings() {
  saving.value = true
  try {
    // Transform nested settings to flat for API
    const flatSettings = transformNestedToFlat(settings.value)
    await api.put('/settings', flatSettings)
    toast.add({ color: 'success', title: 'Success', description: 'Settings updated successfully' })

    // Force reload settings to ensure UI is in sync
    const response = await api.get('/settings')
    if (response.success && response.settings) {
      const nestedSettings = transformFlatToNested(response.settings)
      settings.value = {
        ...settings.value,
        ...nestedSettings
      }
    }
  } catch (error: any) {
    toast.add({ color: 'error', title: 'Error', description: error.message || 'Failed to save settings' })
  } finally {
    saving.value = false
  }
}

</script>

<style scoped>
.settings-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.page-subtitle {
  color: #64748b;
  margin-top: 0.5rem;
}

.settings-grid {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 2rem;
  align-items: start;
}

.settings-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  color: #64748b;
  font-weight: 500;
  transition: all 0.2s;
  text-align: left;
}

.nav-item:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.nav-item.active {
  background: #eff6ff;
  color: #3b82f6;
}

.content-card {
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-field label {
  font-weight: 500;
  color: #334155;
}

.theme-option {
  cursor: pointer;
  text-align: center;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 2px solid transparent;
}

.theme-option.active {
  border-color: #3b82f6;
  background: #eff6ff;
}

.theme-option span {
  font-weight: 500;
  color: #334155;
}

@media (max-width: 768px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }

  .settings-nav {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 1rem;
  }

  .nav-item {
    white-space: nowrap;
  }
}
</style>
