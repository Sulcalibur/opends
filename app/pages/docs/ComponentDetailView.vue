<script setup lang="ts">
// Screen 02: Component detail page — live preview + props + multi-framework code
// Route: /docs/components?id=xxx or /docs/components/:id

// Route — support both query param and path param for component id
const route = useRoute();
const componentId = computed(
  () => (route.params.id as string) || (route.query.id as string),
);

// Fetch component
const { data: componentData, pending } = await useFetch<{
  success: boolean;
  data: {
    id: string;
    name: string;
    description?: string;
    category?: string;
    version?: string;
  };
}>(() => (componentId.value ? `/api/components/${componentId.value}` : null), {
  query: route.query,
});

const component = computed(() => componentData.value?.data);

// Active framework for code toggle
const activeFramework = ref<"vue" | "react" | "svelte">("vue");

// Active tab in sandbox
const activeTab = ref<"preview" | "code" | "anatomy">("preview");

// Preview state (props for the live UButton preview)
const previewState = ref({
  variant: "primary",
  size: "lg",
  label: "Generate suggestions",
  icon: true,
  loading: false,
  disabled: false,
  block: false,
});

// Computed code snippets per framework
const codeSnippets = computed(() => {
  const label = previewState.value.label;
  const iconAttr = previewState.value.icon
    ? '\n  icon="i-lucide-sparkles"'
    : "";
  const sizeAttr =
    previewState.value.size !== "md"
      ? `\n  size="${previewState.value.size}"`
      : "";
  const variantAttr =
    previewState.value.variant !== "primary"
      ? `\n  variant="${previewState.value.variant}"`
      : "";
  const loadingAttr = previewState.value.loading ? "\n  loading" : "";
  const disabledAttr = previewState.value.disabled ? "\n  disabled" : "";
  const blockAttr = previewState.value.block ? "\n  block" : "";

  const vueCode = `<UButton${iconAttr}${sizeAttr}${variantAttr}${loadingAttr}${disabledAttr}${blockAttr}>
  ${label}
</UButton>`;

  const reactCode = `import { Button } from '@opendsui/react'

function Example() {
  return (
    <Button${iconAttr.replace("icon=", "icon=").replace("i-lucide-sparkles", "<SparklesIcon />")}${sizeAttr}${variantAttr}${loadingAttr}${disabledAttr}${blockAttr}>
      ${label}
    </Button>
  )
}`;

  const svelteCode =
    `<script>\n  import { Button } from '@opendsui/svelte'\n<` +
    `/script>\n\n<Button${iconAttr.includes("icon") ? " icon={<SparklesIcon />}" : ""}${sizeAttr}${variantAttr}${loadingAttr}${disabledAttr}${blockAttr}>\n  ${label}\n</Button>`;

  return { vue: vueCode, react: reactCode, svelte: svelteCode };
});

// Props table rows
const propsTable = [
  {
    name: "label",
    type: "string",
    default: "—",
    desc: "Visible text. Required if no icon-only.",
  },
  {
    name: "variant",
    type: '"primary" | "secondary" | "soft" | "ghost" | "danger" | "link"',
    default: '"primary"',
    desc: "Visual emphasis level.",
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    desc: "Affects height, padding, font size.",
  },
  {
    name: "icon",
    type: "string | Component",
    default: "—",
    desc: "Lucide name or icon component.",
  },
  {
    name: "trailing-icon",
    type: "string | Component",
    default: "—",
    desc: "Icon on the right side.",
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    desc: "Shows spinner, disables interaction.",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    desc: "Fully disables and removes from tab order.",
  },
  {
    name: "block",
    type: "boolean",
    default: "false",
    desc: "Fills available width.",
  },
];

// Accessibility items
const a11yItems = [
  {
    ok: true,
    title: "WCAG 2.2 AA — 5.4:1 contrast",
    body: "Primary on white passes for both 14px and 12px text.",
  },
  {
    ok: true,
    title: "Visible focus ring",
    body: "3px solid var(--color-primary) with 30% opacity, never relies on color alone.",
  },
  {
    ok: true,
    title: "Keyboard support",
    body: "Enter and Space activate. Disabled buttons are removed from tab order via aria-disabled.",
  },
  {
    ok: true,
    title: "Reduced motion respected",
    body: "Transitions collapse to 0ms when prefers-reduced-motion is set.",
  },
];

// Variants grid data
const variants = [
  {
    name: "Primary",
    variant: "primary",
    label: "Save changes",
    desc: "The single most important action on a page.",
  },
  {
    name: "Secondary",
    variant: "secondary",
    label: "Cancel",
    desc: "Lower-emphasis action paired with primary.",
  },
  {
    name: "Soft",
    variant: "soft",
    label: "Filter",
    desc: "Tinted action for repeat actions in toolbars.",
  },
  {
    name: "Ghost",
    variant: "ghost",
    label: "Skip",
    desc: "Minimal weight, no chrome.",
  },
  {
    name: "Danger",
    variant: "danger",
    label: "Delete",
    desc: "Destructive action, always paired with a confirm.",
  },
  {
    name: "Link",
    variant: "link",
    label: "Open docs",
    desc: "Inline navigation that looks like a link.",
  },
];

// TOC items
const tocItems = ["Overview", "Variants", "Props", "Accessibility", "Code"];
const activeToc = ref("Variants");

useHead({
  title: computed(() =>
    component.value
      ? `${component.value.name} — Component`
      : "Component Not Found",
  ),
  meta: [
    {
      name: "description",
      content: computed(
        () => component.value?.description || "Component documentation",
      ),
    },
  ],
});
</script>

<template>
  <div
    class="min-h-screen flex flex-col"
    style="background: var(--color-bg, #f8f9fa)"
  >
    <!-- ========== HEADER ========== -->
    <header
      class="h-14 flex items-center gap-4 px-6 flex-shrink-0 border-b"
      style="
        border-color: var(--color-border, #e2e4e9);
        background: var(--color-surface, #ffffff);
      "
    >
      <!-- Team brand -->
      <div class="flex items-center gap-2.5 w-60 flex-shrink-0">
        <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
          <rect x="2" y="2" width="28" height="28" rx="7" fill="#1A1D21" />
          <circle
            cx="16"
            cy="16"
            r="7"
            fill="none"
            stroke="#FF6B4A"
            stroke-width="2.4"
          />
          <circle cx="16" cy="16" r="2.5" fill="#FF6B4A" />
        </svg>
        <span
          class="font-extrabold text-lg"
          style="
            font-family: var(--font-heading, &quot;Outfit&quot;, sans-serif);
            letter-spacing: -0.01em;
            color: var(--color-text-primary, #1a1d21);
          "
          >Lumen</span
        >
        <UBadge color="neutral" variant="soft" size="sm">v2.4</UBadge>
      </div>

      <!-- Search -->
      <div class="flex-1 max-w-lg">
        <UInput
          size="sm"
          placeholder="Search components, tokens, docs…"
          leading-icon="i-lucide-search"
          trailing-icon="i-lucide-command"
          class="w-full"
        />
      </div>

      <div class="flex-1" />

      <!-- Nav -->
      <nav
        class="flex items-center gap-1 text-sm font-medium"
        style="color: var(--color-text-secondary, #5c6270)"
      >
        <NuxtLink
          to="/docs/components"
          class="px-2.5 py-1.5 rounded-md transition-colors hover:bg-gray-100"
          >Components</NuxtLink
        >
        <NuxtLink
          to="/tokens"
          class="px-2.5 py-1.5 rounded-md transition-colors hover:bg-gray-100"
          >Tokens</NuxtLink
        >
        <NuxtLink
          to="/docs"
          class="px-2.5 py-1.5 rounded-md transition-colors hover:bg-gray-100"
          >Guidelines</NuxtLink
        >
        <span class="flex items-center gap-1.5 px-2.5 py-1.5">
          Changelog
          <UBadge
            color="primary"
            variant="soft"
            size="sm"
            class="px-1.5 py-0.5 text-[10px]"
            >3</UBadge
          >
        </span>
      </nav>

      <div class="flex items-center gap-0.5">
        <UButton variant="ghost" size="sm" square
          ><UIcon name="i-lucide-sun" class="w-4 h-4"
        /></UButton>
        <UButton variant="ghost" size="sm" square
          ><UIcon name="i-lucide-github" class="w-4 h-4"
        /></UButton>
      </div>
    </header>

    <div class="flex flex-1 min-h-0">
      <!-- ========== SIDEBAR ========== -->
      <aside
        class="w-64 flex-shrink-0 border-r overflow-y-auto py-3 px-2"
        style="
          border-color: var(--color-border, #e2e4e9);
          background: var(--color-bg, #f8f9fa);
        "
      >
        <div
          class="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider"
          style="color: var(--color-text-tertiary, #8a91a0)"
        >
          Getting Started
        </div>
        <div class="space-y-0.5">
          <div
            class="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer hover:bg-gray-100 transition-colors"
            style="color: var(--color-text-secondary, #5c6270)"
          >
            <UIcon
              name="i-lucide-sparkles"
              class="w-4 h-4 flex-shrink-0"
            />Introduction
          </div>
          <div
            class="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer hover:bg-gray-100 transition-colors"
            style="color: var(--color-text-secondary, #5c6270)"
          >
            <UIcon
              name="i-lucide-zap"
              class="w-4 h-4 flex-shrink-0"
            />Installation
          </div>
          <div
            class="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer hover:bg-gray-100 transition-colors"
            style="color: var(--color-text-secondary, #5c6270)"
          >
            <UIcon name="i-lucide-book" class="w-4 h-4 flex-shrink-0" />Theming
          </div>
          <div
            class="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer hover:bg-gray-100 transition-colors"
            style="color: var(--color-text-secondary, #5c6270)"
          >
            <UIcon
              name="i-lucide-layers"
              class="w-4 h-4 flex-shrink-0"
            />Contributing
          </div>
        </div>

        <div
          class="px-3 pt-4 pb-2 text-[11px] font-semibold uppercase tracking-wider"
          style="color: var(--color-text-tertiary, #8a91a0)"
        >
          Foundations
        </div>
        <div class="space-y-0.5">
          <NuxtLink
            to="/tokens"
            class="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer hover:bg-gray-100 transition-colors"
            style="color: var(--color-text-secondary, #5c6270)"
          >
            <UIcon name="i-lucide-palette" class="w-4 h-4 flex-shrink-0" />Color
          </NuxtLink>
          <div
            class="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer hover:bg-gray-100 transition-colors"
            style="color: var(--color-text-secondary, #5c6270)"
          >
            <UIcon
              name="i-lucide-type"
              class="w-4 h-4 flex-shrink-0"
            />Typography
          </div>
          <div
            class="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer hover:bg-gray-100 transition-colors"
            style="color: var(--color-text-secondary, #5c6270)"
          >
            <UIcon name="i-lucide-ruler" class="w-4 h-4 flex-shrink-0" />Spacing
          </div>
        </div>

        <div
          class="px-3 pt-4 pb-2 text-[11px] font-semibold uppercase tracking-wider"
          style="color: var(--color-text-tertiary, #8a91a0)"
        >
          Components
        </div>
        <div class="space-y-0.5">
          <NuxtLink
            to="/docs/components"
            class="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer hover:bg-gray-100 transition-colors"
            style="color: var(--color-text-secondary, #5c6270)"
            >Overview</NuxtLink
          >
          <div class="pl-3">
            <div
              class="text-[11px] font-semibold uppercase tracking-wider mb-1"
              style="
                color: var(--color-text-tertiary, #8a91a0);
                padding-left: 12px;
              "
            >
              Inputs
            </div>
            <NuxtLink
              to="/docs/components"
              class="flex items-center gap-2.5 pl-4 pr-3 py-1 rounded-md text-sm font-semibold cursor-pointer transition-colors"
              style="
                color: var(--color-primary, #ff6b4a);
                background: var(--color-primary-soft, rgba(255, 107, 74, 0.1));
              "
            >
              Button
            </NuxtLink>
            <div
              class="flex items-center gap-2.5 pl-4 pr-3 py-1 rounded-md text-sm font-medium cursor-pointer hover:bg-gray-100 transition-colors"
              style="color: var(--color-text-secondary, #5c6270)"
            >
              Checkbox
            </div>
            <div
              class="flex items-center gap-2.5 pl-4 pr-3 py-1 rounded-md text-sm font-medium cursor-pointer hover:bg-gray-100 transition-colors"
              style="color: var(--color-text-secondary, #5c6270)"
            >
              Input
            </div>
            <div
              class="flex items-center gap-2.5 pl-4 pr-3 py-1 rounded-md text-sm font-medium cursor-pointer hover:bg-gray-100 transition-colors"
              style="color: var(--color-text-secondary, #5c6270)"
            >
              Radio Group
            </div>
            <div
              class="flex items-center gap-2.5 pl-4 pr-3 py-1 rounded-md text-sm font-medium cursor-pointer hover:bg-gray-100 transition-colors"
              style="color: var(--color-text-secondary, #5c6270)"
            >
              Select
            </div>
            <div
              class="flex items-center gap-2.5 pl-4 pr-3 py-1 rounded-md text-sm font-medium cursor-pointer hover:bg-gray-100 transition-colors"
              style="color: var(--color-text-secondary, #5c6270)"
            >
              Switch
            </div>
            <div
              class="flex items-center gap-2.5 pl-4 pr-3 py-1 rounded-md text-sm font-medium cursor-pointer hover:bg-gray-100 transition-colors"
              style="color: var(--color-text-secondary, #5c6270)"
            >
              Textarea
            </div>
          </div>
          <div class="pl-3">
            <div
              class="text-[11px] font-semibold uppercase tracking-wider mb-1"
              style="
                color: var(--color-text-tertiary, #8a91a0);
                padding-left: 12px;
                padding-top: 12px;
              "
            >
              Display
            </div>
            <div
              class="flex items-center gap-2.5 pl-4 pr-3 py-1 rounded-md text-sm font-medium cursor-pointer hover:bg-gray-100 transition-colors"
              style="color: var(--color-text-secondary, #5c6270)"
            >
              Avatar
            </div>
            <div
              class="flex items-center gap-2.5 pl-4 pr-3 py-1 rounded-md text-sm font-medium cursor-pointer hover:bg-gray-100 transition-colors"
              style="color: var(--color-text-secondary, #5c6270)"
            >
              Badge
            </div>
            <div
              class="flex items-center gap-2.5 pl-4 pr-3 py-1 rounded-md text-sm font-medium cursor-pointer hover:bg-gray-100 transition-colors"
              style="color: var(--color-text-secondary, #5c6270)"
            >
              Card
            </div>
            <div
              class="flex items-center gap-2.5 pl-4 pr-3 py-1 rounded-md text-sm font-medium cursor-pointer hover:bg-gray-100 transition-colors"
              style="color: var(--color-text-secondary, #5c6270)"
            >
              Table
            </div>
            <div
              class="flex items-center gap-2.5 pl-4 pr-3 py-1 rounded-md text-sm font-medium cursor-pointer hover:bg-gray-100 transition-colors"
              style="color: var(--color-text-secondary, #5c6270)"
            >
              Tooltip
            </div>
          </div>
        </div>

        <div
          class="px-3 pt-4 pb-2 text-[11px] font-semibold uppercase tracking-wider"
          style="color: var(--color-text-tertiary, #8a91a0)"
        >
          Internal · Team
        </div>
        <div class="space-y-0.5">
          <div
            class="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer"
            style="color: var(--color-text-tertiary, #8a91a0)"
          >
            <UIcon name="i-lucide-lock" class="w-4 h-4 flex-shrink-0" />Brand
            voice
          </div>
          <div
            class="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer"
            style="color: var(--color-text-tertiary, #8a91a0)"
          >
            <UIcon
              name="i-lucide-lock"
              class="w-4 h-4 flex-shrink-0"
            />Contributor playbook
          </div>
          <div
            class="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer"
            style="color: var(--color-text-tertiary, #8a91a0)"
          >
            <UIcon name="i-lucide-lock" class="w-4 h-4 flex-shrink-0" />Token
            roadmap
          </div>
          <div
            class="px-3 py-2 rounded-md text-xs leading-relaxed mt-1"
            style="
              background: var(--color-surface-2, #f3f4f6);
              color: var(--color-text-tertiary, #8a91a0);
            "
          >
            3 pages need sign-in.
            <NuxtLink
              to="/login"
              class="font-semibold"
              style="color: var(--color-primary, #ff6b4a)"
              >Sign in →</NuxtLink
            >
          </div>
        </div>
      </aside>

      <!-- ========== MAIN CONTENT ========== -->
      <main class="flex-1 overflow-y-auto px-14 py-10 min-w-0">
        <!-- Loading -->
        <div v-if="pending" align="center" class="py-24">
          <UIcon
            name="i-lucide-loader-2"
            class="w-8 h-8 animate-spin"
            style="color: var(--color-text-tertiary, #8a91a0)"
          />
        </div>

        <!-- Not found -->
        <div v-else-if="!component" class="text-center py-24">
          <div
            class="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style="background: var(--color-surface-2, #f3f4f6)"
          >
            <UIcon
              name="i-lucide-box"
              class="w-8 h-8"
              style="color: var(--color-text-tertiary, #8a91a0)"
            />
          </div>
          <h2
            class="text-xl font-extrabold mb-2"
            style="
              font-family: var(--font-heading, &quot;Outfit&quot;, sans-serif);
              color: var(--color-text-primary, #1a1d21);
            "
          >
            Component not found
          </h2>
          <p
            class="text-sm mb-6"
            style="color: var(--color-text-secondary, #5c6270)"
          >
            This component doesn't exist or hasn't been published yet.
          </p>
          <UButton
            to="/docs/components"
            color="primary"
            leading-icon="i-lucide-arrow-left"
            >Browse components</UButton
          >
        </div>

        <!-- Content -->
        <div v-else class="max-w-4xl">
          <!-- Breadcrumbs -->
          <div
            class="flex items-center gap-1.5 text-xs font-medium mb-5"
            style="color: var(--color-text-tertiary, #8a91a0)"
          >
            <span>Components</span
            ><UIcon name="i-lucide-chevron-right" class="w-3 h-3" /><span
              >Inputs</span
            ><UIcon name="i-lucide-chevron-right" class="w-3 h-3" /><span
              style="color: var(--color-text-secondary, #5c6270)"
              >{{ component.name }}</span
            >
          </div>

          <!-- Title row -->
          <div class="flex items-start gap-4 mb-3">
            <h1
              class="text-5xl font-extrabold leading-tight flex-1"
              style="
                font-family: var(
                  --font-heading,
                  &quot;Outfit&quot;,
                  sans-serif
                );
                letter-spacing: -0.03em;
                color: var(--color-text-primary, #1a1d21);
              "
            >
              {{ component.name }}
            </h1>
            <UBadge color="success" variant="soft" class="mt-2"
              >Approved</UBadge
            >
            <UBadge
              color="neutral"
              variant="soft"
              class="mt-2 font-mono"
              style="font-size: 11px"
              >v1.4.0</UBadge
            >
          </div>

          <!-- Description -->
          <p
            class="text-lg leading-relaxed mb-6 max-w-xl"
            style="color: var(--color-text-secondary, #5c6270)"
          >
            {{
              component.description ||
              "No description available for this component."
            }}
          </p>

          <!-- Tags -->
          <div class="flex items-center gap-2 mb-9 flex-wrap">
            <UBadge color="neutral" variant="soft"
              ><UIcon name="i-lucide-tag" class="w-3 h-3 mr-1" />inputs</UBadge
            >
            <UBadge color="neutral" variant="soft"
              ><UIcon name="i-lucide-tag" class="w-3 h-3 mr-1" />action</UBadge
            >
            <UBadge color="neutral" variant="soft"
              ><UIcon name="i-lucide-tag" class="w-3 h-3 mr-1" />a11y-aa</UBadge
            >
            <div
              class="w-px h-4 mx-1"
              style="background: var(--color-border, #e2e4e9)"
            />
            <span
              class="text-xs"
              style="color: var(--color-text-tertiary, #8a91a0)"
            >
              Source:
              <code
                class="font-mono text-xs"
                style="color: var(--color-text-secondary, #5c6270)"
                >app/components/UButton.vue</code
              >
            </span>
          </div>

          <!-- ========== LIVE PREVIEW SANDBOX ========== -->
          <div
            class="rounded-lg border mb-12 overflow-hidden"
            style="
              border-color: var(--color-border, #e2e4e9);
              box-shadow: var(--shadow-card);
              background: var(--color-surface, #ffffff);
            "
          >
            <!-- Tab bar -->
            <div
              class="flex items-center gap-1 px-3 border-b"
              style="
                border-color: var(--color-border, #e2e4e9);
                background: var(--color-bg, #f8f9fa);
              "
            >
              <button
                v-for="tab in ['Preview', 'Code', 'Anatomy']"
                :key="tab"
                class="px-3 py-3 text-sm font-semibold border-b-2 transition-colors"
                :style="
                  activeTab === tab.toLowerCase()
                    ? {
                        borderColor: 'var(--color-primary, #FF6B4A)',
                        color: 'var(--color-primary, #FF6B4A)',
                      }
                    : {
                        borderColor: 'transparent',
                        color: 'var(--color-text-secondary, #5C6270)',
                      }
                "
                @click="activeTab = tab.toLowerCase()"
              >
                {{ tab }}
              </button>
              <div class="flex-1" />

              <!-- Framework switcher -->
              <div
                class="flex items-center rounded-md border px-0.5 py-0.5 gap-0.5"
                style="
                  border-color: var(--color-border, #e2e4e9);
                  background: var(--color-surface, #ffffff);
                "
              >
                <button
                  v-for="fw in ['Vue', 'React', 'Svelte']"
                  :key="fw"
                  class="px-2.5 py-1 text-xs font-bold rounded transition-colors"
                  :style="
                    activeFramework === fw.toLowerCase()
                      ? {
                          background: 'var(--color-primary, #FF6B4A)',
                          color: 'white',
                        }
                      : {
                          background: 'transparent',
                          color: 'var(--color-text-secondary, #5C6270)',
                        }
                  "
                  @click="activeFramework = fw.toLowerCase()"
                >
                  {{ fw }}
                </button>
              </div>

              <div
                class="w-px h-5 mx-2"
                style="background: var(--color-border, #e2e4e9)"
              />
              <UButton variant="ghost" size="sm" square
                ><UIcon name="i-lucide-moon" class="w-4 h-4"
              /></UButton>
              <UButton variant="ghost" size="sm" square
                ><UIcon name="i-lucide-sliders" class="w-4 h-4"
              /></UButton>
              <UButton variant="ghost" size="sm" square
                ><UIcon name="i-lucide-arrow-up-right" class="w-4 h-4"
              /></UButton>
            </div>

            <!-- Stage + Controls -->
            <div class="grid grid-cols-[1fr_280px]">
              <!-- Stage -->
              <div
                class="min-h-[280px] flex items-center justify-center relative"
                :style="{
                  backgroundImage:
                    'radial-gradient(circle at 1px 1px, var(--color-border, #E2E4E9) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                  borderRight: '1px solid var(--color-border, #E2E4E9)',
                }"
              >
                <!-- Preview tab -->
                <div
                  v-if="activeTab === 'preview'"
                  class="flex flex-col items-center gap-6"
                >
                  <UButton
                    :variant="previewState.variant as any"
                    :size="previewState.size as any"
                    :loading="previewState.loading"
                    :disabled="previewState.disabled"
                    :block="previewState.block"
                    :icon="previewState.icon ? 'i-lucide-sparkles' : undefined"
                    >{{ previewState.label }}</UButton
                  >
                  <p
                    class="text-xs"
                    style="color: var(--color-text-tertiary, #8a91a0)"
                  >
                    Live preview — edit props on the right panel
                  </p>
                </div>

                <!-- Code tab -->
                <div v-else-if="activeTab === 'code'" class="w-full p-8">
                  <div
                    class="rounded-md border overflow-hidden"
                    style="border-color: var(--color-border, #e2e4e9)"
                  >
                    <div
                      class="flex items-center justify-between px-4 py-2 border-b text-xs font-mono uppercase tracking-wider"
                      style="
                        border-color: var(--color-border, #e2e4e9);
                        background: var(--color-surface-2, #f3f4f6);
                        color: var(--color-text-tertiary, #8a91a0);
                      "
                    >
                      <span>{{
                        activeFramework === "vue"
                          ? "Vue · UButton"
                          : activeFramework === "react"
                            ? "React · Button"
                            : "Svelte · Button"
                      }}</span>
                      <UButton
                        variant="ghost"
                        size="sm"
                        leading-icon="i-lucide-copy"
                        >Copy</UButton
                      >
                    </div>
                    <pre
                      class="p-4 text-sm font-mono overflow-x-auto"
                      style="
                        background: var(--color-surface-2, #f3f4f6);
                        color: var(--color-text-primary, #1a1d21);
                        line-height: 1.7;
                      "
                      >{{ codeSnippets[activeFramework] }}</pre
                    >
                  </div>
                </div>

                <!-- Anatomy tab -->
                <div v-else-if="activeTab === 'anatomy'" class="w-full p-8">
                  <div class="space-y-3">
                    <div class="flex items-center gap-3">
                      <div
                        class="w-4 h-4 rounded flex-shrink-0"
                        style="background: var(--color-primary, #ff6b4a)"
                      />
                      <span class="text-sm font-mono">UButton</span>
                      <span
                        class="text-xs"
                        style="color: var(--color-text-tertiary, #8a91a0)"
                        >— root element</span
                      >
                    </div>
                    <div class="flex items-center gap-3 pl-6">
                      <div
                        class="w-4 h-4 rounded flex-shrink-0"
                        style="background: var(--color-text-secondary, #5c6270)"
                      />
                      <span class="text-sm font-mono">Icon (optional)</span>
                      <span
                        class="text-xs"
                        style="color: var(--color-text-tertiary, #8a91a0)"
                        >— leading icon slot</span
                      >
                    </div>
                    <div class="flex items-center gap-3 pl-6">
                      <div
                        class="w-4 h-4 rounded flex-shrink-0"
                        style="background: var(--color-text-secondary, #5c6270)"
                      />
                      <span class="text-sm font-mono">Label</span>
                      <span
                        class="text-xs"
                        style="color: var(--color-text-tertiary, #8a91a0)"
                        >— text content</span
                      >
                    </div>
                    <div class="flex items-center gap-3 pl-6">
                      <div
                        class="w-4 h-4 rounded flex-shrink-0"
                        style="background: var(--color-text-secondary, #5c6270)"
                      />
                      <span class="text-sm font-mono"
                        >TrailingIcon (optional)</span
                      >
                      <span
                        class="text-xs"
                        style="color: var(--color-text-tertiary, #8a91a0)"
                        >— trailing slot</span
                      >
                    </div>
                  </div>
                </div>

                <!-- Corner labels -->
                <div
                  class="absolute bottom-3 left-4 text-[11px] font-mono"
                  style="color: var(--color-text-tertiary, #8a91a0)"
                >
                  1440 × 320
                </div>
                <div
                  class="absolute bottom-3 right-4 text-[11px] font-mono flex items-center gap-1"
                  style="color: var(--color-text-tertiary, #8a91a0)"
                >
                  <UIcon
                    name="i-lucide-check-circle"
                    class="w-3.5 h-3.5"
                    style="color: var(--color-success, #1f8a5b)"
                  />
                  AAA · 14.2:1
                </div>
              </div>

              <!-- Controls panel -->
              <div
                class="p-4 space-y-4"
                style="background: var(--color-surface, #ffffff)"
              >
                <div
                  class="text-[11px] font-bold uppercase tracking-wider"
                  style="color: var(--color-text-tertiary, #8a91a0)"
                >
                  Props
                </div>

                <!-- variant -->
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span
                      class="text-xs font-mono font-semibold"
                      style="color: var(--color-text-secondary, #5c6270)"
                      >variant</span
                    >
                  </div>
                  <div
                    class="flex flex-wrap gap-1 p-1 rounded-md"
                    style="background: var(--color-surface-2, #f3f4f6)"
                  >
                    <button
                      v-for="v in [
                        'primary',
                        'secondary',
                        'soft',
                        'ghost',
                        'danger',
                      ]"
                      :key="v"
                      class="px-2 py-1 text-[11px] font-bold rounded transition-all flex-1 text-center"
                      :style="
                        previewState.variant === v
                          ? {
                              background: 'var(--color-surface, #FFFFFF)',
                              color: 'var(--color-text-primary, #1A1D21)',
                              boxShadow: 'var(--shadow-card)',
                            }
                          : {
                              background: 'transparent',
                              color: 'var(--color-text-secondary, #5C6270)',
                            }
                      "
                      @click="previewState.variant = v"
                    >
                      {{ v }}
                    </button>
                  </div>
                </div>

                <!-- size -->
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span
                      class="text-xs font-mono font-semibold"
                      style="color: var(--color-text-secondary, #5c6270)"
                      >size</span
                    >
                  </div>
                  <div
                    class="flex flex-wrap gap-1 p-1 rounded-md"
                    style="background: var(--color-surface-2, #f3f4f6)"
                  >
                    <button
                      v-for="s in ['sm', 'md', 'lg']"
                      :key="s"
                      class="px-2 py-1 text-[11px] font-bold rounded transition-all flex-1 text-center"
                      :style="
                        previewState.size === s
                          ? {
                              background: 'var(--color-surface, #FFFFFF)',
                              color: 'var(--color-text-primary, #1A1D21)',
                              boxShadow: 'var(--shadow-card)',
                            }
                          : {
                              background: 'transparent',
                              color: 'var(--color-text-secondary, #5C6270)',
                            }
                      "
                      @click="previewState.size = s"
                    >
                      {{ s }}
                    </button>
                  </div>
                </div>

                <!-- icon toggle -->
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span
                      class="text-xs font-mono font-semibold"
                      style="color: var(--color-text-secondary, #5c6270)"
                      >icon</span
                    >
                    <div
                      class="w-8 h-4 rounded-full relative cursor-pointer transition-colors"
                      :style="{
                        background: previewState.icon
                          ? 'var(--color-primary, #FF6B4A)'
                          : 'var(--color-border, #E2E4E9)',
                      }"
                      @click="previewState.icon = !previewState.icon"
                    >
                      <div
                        class="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all"
                        :style="{
                          right: previewState.icon ? '2px' : 'unset',
                          left: previewState.icon ? 'unset' : '2px',
                        }"
                      />
                    </div>
                  </div>
                </div>

                <!-- loading toggle -->
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span
                      class="text-xs font-mono font-semibold"
                      style="color: var(--color-text-secondary, #5c6270)"
                      >loading</span
                    >
                    <div
                      class="w-8 h-4 rounded-full relative cursor-pointer transition-colors"
                      :style="{
                        background: previewState.loading
                          ? 'var(--color-primary, #FF6B4A)'
                          : 'var(--color-border, #E2E4E9)',
                      }"
                      @click="previewState.loading = !previewState.loading"
                    >
                      <div
                        class="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all"
                        :style="{
                          right: previewState.loading ? '2px' : 'unset',
                          left: previewState.loading ? 'unset' : '2px',
                        }"
                      />
                    </div>
                  </div>
                </div>

                <!-- label -->
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span
                      class="text-xs font-mono font-semibold"
                      style="color: var(--color-text-secondary, #5c6270)"
                      >label</span
                    >
                  </div>
                  <UInput v-model="previewState.label" size="sm" />
                </div>
              </div>
            </div>

            <!-- Code panel below sandbox -->
            <div
              class="border-t px-5 py-4"
              style="
                border-color: var(--color-border, #e2e4e9);
                background: var(--color-bg, #f8f9fa);
              "
            >
              <div
                class="rounded-md border overflow-hidden"
                style="border-color: var(--color-border, #e2e4e9)"
              >
                <div
                  class="flex items-center justify-between px-4 py-2 border-b text-xs font-mono uppercase tracking-wider"
                  style="
                    border-color: var(--color-border, #e2e4e9);
                    background: var(--color-surface-2, #f3f4f6);
                    color: var(--color-text-tertiary, #8a91a0);
                  "
                >
                  <span>{{
                    activeFramework === "vue"
                      ? "Vue · UButton"
                      : activeFramework === "react"
                        ? "React · Button"
                        : "Svelte · Button"
                  }}</span>
                  <UButton
                    variant="ghost"
                    size="sm"
                    leading-icon="i-lucide-copy"
                    >Copy</UButton
                  >
                </div>
                <pre
                  class="p-4 text-sm font-mono overflow-x-auto whitespace-pre"
                  style="
                    background: var(--color-surface-2, #f3f4f6);
                    color: var(--color-text-primary, #1a1d21);
                    line-height: 1.7;
                  "
                  >{{ codeSnippets[activeFramework] }}</pre
                >
              </div>
            </div>
          </div>

          <!-- ========== VARIANTS GRID ========== -->
          <section id="variants" class="mb-14">
            <h2
              class="text-3xl font-bold mb-2"
              style="
                font-family: var(
                  --font-heading,
                  &quot;Outfit&quot;,
                  sans-serif
                );
                letter-spacing: -0.02em;
                color: var(--color-text-primary, #1a1d21);
              "
            >
              Variants
            </h2>
            <p
              class="text-base mb-5"
              style="color: var(--color-text-secondary, #5c6270)"
            >
              Six variants cover the action hierarchy from primary CTA down to
              inline link. Use one per area.
            </p>

            <div
              class="rounded-lg border overflow-hidden"
              style="border-color: var(--color-border, #e2e4e9)"
            >
              <div class="grid grid-cols-3">
                <div
                  v-for="(v, i) in variants"
                  :key="v.name"
                  class="p-7 pb-5 flex flex-col items-center gap-4"
                  :style="{
                    'border-right':
                      i % 3 !== 2
                        ? '1px solid var(--color-border, #e2e4e9)'
                        : 'none',
                    'border-bottom':
                      i < 3 ? '1px solid var(--color-border, #e2e4e9)' : 'none',
                  }"
                >
                  <div
                    class="h-[76px] w-full rounded-md flex items-center justify-center"
                    style="
                      background: repeating-linear-gradient(
                        45deg,
                        var(--color-bg, #f8f9fa),
                        var(--color-bg, #f8f9fa) 6px,
                        transparent 6px,
                        transparent 12px
                      );
                      border: 1px dashed var(--color-border, #e2e4e9);
                    "
                  >
                    <UButton :variant="v.variant as any" size="md">{{
                      v.label
                    }}</UButton>
                  </div>
                  <div
                    class="text-sm font-semibold text-center"
                    style="color: var(--color-text-primary, #1a1d21)"
                  >
                    {{ v.name }}
                  </div>
                  <div
                    class="text-xs text-center leading-relaxed"
                    style="color: var(--color-text-secondary, #5c6270)"
                  >
                    {{ v.desc }}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- ========== PROPS TABLE ========== -->
          <section id="props" class="mb-14">
            <h2
              class="text-3xl font-bold mb-4"
              style="
                font-family: var(
                  --font-heading,
                  &quot;Outfit&quot;,
                  sans-serif
                );
                letter-spacing: -0.02em;
                color: var(--color-text-primary, #1a1d21);
              "
            >
              Props
            </h2>

            <div
              class="rounded-lg border overflow-hidden"
              style="border-color: var(--color-border, #e2e4e9)"
            >
              <div
                class="grid grid-cols-[180px_1fr_140px_1.4fr] gap-4 px-5 py-3 text-[11px] font-bold uppercase tracking-wider"
                style="
                  background: var(--color-surface-2, #f3f4f6);
                  color: var(--color-text-tertiary, #8a91a0);
                  border-bottom: 1px solid var(--color-border, #e2e4e9);
                "
              >
                <span>Name</span><span>Type</span><span>Default</span
                ><span>Description</span>
              </div>
              <div
                v-for="(row, i) in propsTable"
                :key="row.name"
                class="grid grid-cols-[180px_1fr_140px_1.4fr] gap-4 px-5 py-3.5 items-center text-sm"
                :style="
                  i < propsTable.length - 1
                    ? 'border-bottom: 1px solid var(--color-border, #E2E4E9)'
                    : ''
                "
              >
                <span
                  class="font-mono font-semibold"
                  style="color: var(--color-text-primary, #1a1d21)"
                  >{{ row.name }}</span
                >
                <span
                  class="font-mono text-xs"
                  style="color: var(--color-info, #2a6fdb)"
                  >{{ row.type }}</span
                >
                <span
                  class="font-mono text-xs"
                  style="color: var(--color-text-secondary, #5c6270)"
                  >{{ row.default }}</span
                >
                <span
                  class="text-xs"
                  style="color: var(--color-text-secondary, #5c6270)"
                  >{{ row.desc }}</span
                >
              </div>
            </div>
          </section>

          <!-- ========== ACCESSIBILITY ========== -->
          <section id="accessibility" class="mb-14">
            <h2
              class="text-3xl font-bold mb-4"
              style="
                font-family: var(
                  --font-heading,
                  &quot;Outfit&quot;,
                  sans-serif
                );
                letter-spacing: -0.02em;
                color: var(--color-text-primary, #1a1d21);
              "
            >
              Accessibility
            </h2>

            <div class="grid grid-cols-2 gap-4">
              <div
                v-for="item in a11yItems"
                :key="item.title"
                class="flex items-start gap-3 p-4 rounded-lg border"
                style="
                  border-color: var(--color-border, #e2e4e9);
                  background: var(--color-surface, #ffffff);
                "
              >
                <div
                  class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  :style="{
                    background: 'rgba(31,138,91,0.10)',
                    color: 'var(--color-success, #1F8A5B)',
                  }"
                >
                  <UIcon name="i-lucide-check" class="w-4 h-4" />
                </div>
                <div>
                  <div
                    class="font-semibold text-sm mb-1"
                    style="color: var(--color-text-primary, #1a1d21)"
                  >
                    {{ item.title }}
                  </div>
                  <div
                    class="text-xs leading-relaxed"
                    style="color: var(--color-text-secondary, #5c6270)"
                  >
                    {{ item.body }}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <!-- ========== RIGHT TOC ========== -->
      <aside
        class="w-56 flex-shrink-0 border-l overflow-y-auto py-8 px-4"
        style="border-color: var(--color-border, #e2e4e9)"
      >
        <div
          class="text-[11px] font-bold uppercase tracking-wider mb-3"
          style="color: var(--color-text-tertiary, #8a91a0)"
        >
          On this page
        </div>
        <div class="space-y-1">
          <div
            v-for="item in tocItems"
            :key="item"
            class="px-2.5 py-1.5 text-sm font-medium cursor-pointer rounded transition-all"
            :style="
              activeToc === item
                ? {
                    color: 'var(--color-primary, #FF6B4A)',
                    borderLeft: '2px solid var(--color-primary, #FF6B4A)',
                    marginLeft: '-2px',
                    paddingLeft: '10px',
                  }
                : {
                    color: 'var(--color-text-secondary, #5C6270)',
                    borderLeft: '2px solid transparent',
                    marginLeft: '-2px',
                    paddingLeft: '10px',
                  }
            "
            @click="activeToc = item"
          >
            {{ item }}
          </div>
        </div>

        <div
          class="h-px my-5"
          style="background: var(--color-border, #e2e4e9)"
        />

        <div
          class="space-y-2 text-xs"
          style="color: var(--color-text-tertiary, #8a91a0)"
        >
          <div class="flex items-center gap-1.5">
            <UIcon name="i-lucide-edit" class="w-3.5 h-3.5" />
            <span style="color: var(--color-text-secondary, #5c6270)"
              >Edit on GitHub</span
            >
          </div>
          <div class="flex items-center gap-1.5">
            <UIcon name="i-lucide-clock" class="w-3.5 h-3.5" />
            <span>Updated 2 days ago</span>
          </div>
        </div>
      </aside>
    </div>

    <!-- ========== FOOTER ========== -->
    <footer
      class="flex items-center justify-between px-8 py-6 border-t flex-shrink-0"
      style="
        border-color: var(--color-border, #e2e4e9);
        background: var(--color-bg, #f8f9fa);
      "
    >
      <div
        class="flex items-center gap-4 text-sm"
        style="color: var(--color-text-tertiary, #8a91a0)"
      >
        <span>© 2026 Lumen</span>
        <span
          class="w-1 h-1 rounded-full"
          style="background: var(--color-text-tertiary, #8a91a0)"
        />
        <span>Privacy</span>
        <span>Terms</span>
        <span>Contact</span>
      </div>
      <div
        class="flex items-center gap-2 text-xs"
        style="color: var(--color-text-tertiary, #8a91a0)"
      >
        <span>Powered by</span>
        <span
          class="font-semibold"
          style="color: var(--color-text-secondary, #5c6270)"
          >OpenDS</span
        >
        <span class="font-mono">v2.4.0</span>
      </div>
    </footer>
  </div>
</template>
