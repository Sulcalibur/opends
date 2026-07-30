<template>
  <div class="min-h-screen flex flex-col" style="background: var(--color-bg)">
    <!-- Header -->
    <header
      class="h-14 flex items-center gap-4 px-6 flex-shrink-0 border-b"
      style="
        border-color: var(--color-border, #e2e4e9);
        background: var(--color-surface, #ffffff);
      "
    >
      <div class="flex items-center gap-2.5 w-60 flex-shrink-0">
        <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
          <rect x="2" y="2" width="28" height="28" rx="7" fill="#1A1D21" />
          <circle
            cx="16"
            cy="16"
            r="7"
            fill="none"
            stroke="#CC4128"
            stroke-width="2.4"
          />
          <circle cx="16" cy="16" r="2.5" fill="#CC4128" />
        </svg>
        <span
          class="font-extrabold text-lg"
          style="
            font-family: var(--font-heading);
            letter-spacing: -0.01em;
            color: var(--color-text-primary);
          "
          >OpenDS</span
        >
      </div>
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
      <nav
        class="flex items-center gap-1 text-sm font-medium"
        style="color: var(--color-text-secondary)"
      >
        <NuxtLink
          to="/docs/components"
          class="px-2.5 py-1.5 rounded-md transition-colors hover:bg-gray-100"
          >Components</NuxtLink
        >
        <NuxtLink
          to="/tokens"
          class="px-2.5 py-1.5 rounded-md transition-colors hover:bg-gray-100"
          style="color: var(--color-primary)"
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

    <div class="flex flex-1" style="height: calc(100vh - 56px)">
      <DocsSidebar active="color" />

      <main
        class="flex-1 overflow-auto"
        style="padding: 40px 56px; min-width: 0"
      >
        <!-- Breadcrumb -->
        <div
          class="flex items-center gap-2 mb-5"
          style="
            font-size: 12.5px;
            font-weight: 500;
            color: var(--color-text-tertiary);
          "
        >
          <span>Foundations</span>
          <UIcon
            name="i-lucide-chevron-right"
            style="width: 12px; height: 12px"
          />
          <span style="color: var(--color-text-secondary)">Color</span>
        </div>

        <!-- Title + export buttons -->
        <div class="flex items-center justify-between mb-3">
          <h1
            class="text-[44px] font-extrabold tracking-tight leading-tight"
            style="letter-spacing: -0.03em; font-family: var(--font-display)"
          >
            Color
          </h1>
          <div class="flex gap-3">
            <UButton variant="outline" size="sm" icon="i-lucide-download">
              CSS
            </UButton>
            <UButton variant="outline" size="sm" icon="i-lucide-download">
              JSON
            </UButton>
            <UButton variant="outline" size="sm" icon="i-lucide-download">
              SCSS
            </UButton>
          </div>
        </div>

        <p
          class="mb-8"
          style="
            font-size: 17px;
            line-height: 1.55;
            color: var(--color-text-secondary);
            max-width: 720px;
          "
        >
          Seven semantic ramps (50 → 900) plus four semantic aliases for status.
          Every value is paired with a guaranteed contrast partner.
        </p>

        <!-- Featured swatches: Primary -->
        <div
          class="mb-6 rounded-xl border overflow-hidden"
          style="
            display: grid;
            grid-template-columns: 320px 1fr;
            border-color: var(--color-border);
            box-shadow: var(--shadow-card);
          "
        >
          <div
            style="
              background: #cc4128;
              padding: 24px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              color: white;
              min-height: 200px;
            "
          >
            <div
              style="
                font-family: var(--font-mono);
                font-size: 11px;
                opacity: 0.7;
                letter-spacing: 0.06em;
                text-transform: uppercase;
              "
            >
              color/primary/500
            </div>
            <div
              style="
                font-family: var(--font-display);
                font-weight: 800;
                font-size: 32px;
                letter-spacing: -0.02em;
                line-height: 1.1;
              "
            >
              Sweet Salmon
            </div>
          </div>
          <div style="padding: 20px 24px 20px 0">
            <div class="flex gap-6 mb-4 flex-wrap">
              <div>
                <div
                  style="
                    font-size: 10.5px;
                    font-weight: 600;
                    color: var(--color-text-tertiary);
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    margin-bottom: 4px;
                  "
                >
                  HEX
                </div>
                <div
                  style="
                    font-family: var(--font-mono);
                    font-size: 13px;
                    font-weight: 500;
                  "
                >
                  #CC4128
                </div>
              </div>
              <div>
                <div
                  style="
                    font-size: 10.5px;
                    font-weight: 600;
                    color: var(--color-text-tertiary);
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    margin-bottom: 4px;
                  "
                >
                  RGB
                </div>
                <div
                  style="
                    font-family: var(--font-mono);
                    font-size: 13px;
                    font-weight: 500;
                  "
                >
                  rgb(255 107 74)
                </div>
              </div>
              <div>
                <div
                  style="
                    font-size: 10.5px;
                    font-weight: 600;
                    color: var(--color-text-tertiary);
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    margin-bottom: 4px;
                  "
                >
                  HSL
                </div>
                <div
                  style="
                    font-family: var(--font-mono);
                    font-size: 13px;
                    font-weight: 500;
                  "
                >
                  hsl(11 100% 65%)
                </div>
              </div>
              <div>
                <div
                  style="
                    font-size: 10.5px;
                    font-weight: 600;
                    color: var(--color-text-tertiary);
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    margin-bottom: 4px;
                  "
                >
                  Token
                </div>
                <div
                  style="
                    font-family: var(--font-mono);
                    font-size: 13px;
                    font-weight: 500;
                  "
                >
                  --color-primary
                </div>
              </div>
            </div>
            <p
              class="mb-4"
              style="
                font-size: 14px;
                color: var(--color-text-secondary);
                line-height: 1.55;
                max-width: 520px;
              "
            >
              Sweet Salmon — primary actions, focus rings, active navigation.
              Use sparingly; one CTA per screen.
            </p>
            <div class="flex gap-3 items-center">
              <UBadge tone="success" dot>AA · 4.7:1 on white</UBadge>
              <UBadge tone="success" dot>AAA · 11.3:1 on text</UBadge>
            </div>
          </div>
        </div>

        <!-- Featured swatches: Secondary -->
        <div
          class="mb-12 rounded-xl border overflow-hidden"
          style="
            display: grid;
            grid-template-columns: 320px 1fr;
            border-color: var(--color-border);
            box-shadow: var(--shadow-card);
          "
        >
          <div
            style="
              background: #ffd166;
              padding: 24px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              min-height: 200px;
            "
          >
            <div
              style="
                font-family: var(--font-mono);
                font-size: 11px;
                opacity: 0.7;
                letter-spacing: 0.06em;
                text-transform: uppercase;
                color: #1a1d21;
              "
            >
              color/secondary/500
            </div>
            <div
              style="
                font-family: var(--font-display);
                font-weight: 800;
                font-size: 32px;
                letter-spacing: -0.02em;
                line-height: 1.1;
                color: #1a1d21;
              "
            >
              Light Gold
            </div>
          </div>
          <div style="padding: 20px 24px 20px 0">
            <div class="flex gap-6 mb-4 flex-wrap">
              <div>
                <div
                  style="
                    font-size: 10.5px;
                    font-weight: 600;
                    color: var(--color-text-tertiary);
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    margin-bottom: 4px;
                  "
                >
                  HEX
                </div>
                <div
                  style="
                    font-family: var(--font-mono);
                    font-size: 13px;
                    font-weight: 500;
                  "
                >
                  #FFD166
                </div>
              </div>
              <div>
                <div
                  style="
                    font-size: 10.5px;
                    font-weight: 600;
                    color: var(--color-text-tertiary);
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    margin-bottom: 4px;
                  "
                >
                  RGB
                </div>
                <div
                  style="
                    font-family: var(--font-mono);
                    font-size: 13px;
                    font-weight: 500;
                  "
                >
                  rgb(255 209 102)
                </div>
              </div>
              <div>
                <div
                  style="
                    font-size: 10.5px;
                    font-weight: 600;
                    color: var(--color-text-tertiary);
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    margin-bottom: 4px;
                  "
                >
                  HSL
                </div>
                <div
                  style="
                    font-family: var(--font-mono);
                    font-size: 13px;
                    font-weight: 500;
                  "
                >
                  hsl(43 100% 70%)
                </div>
              </div>
              <div>
                <div
                  style="
                    font-size: 10.5px;
                    font-weight: 600;
                    color: var(--color-text-tertiary);
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    margin-bottom: 4px;
                  "
                >
                  Token
                </div>
                <div
                  style="
                    font-family: var(--font-mono);
                    font-size: 13px;
                    font-weight: 500;
                  "
                >
                  --color-secondary
                </div>
              </div>
            </div>
            <p
              class="mb-4"
              style="
                font-size: 14px;
                color: var(--color-text-secondary);
                line-height: 1.55;
                max-width: 520px;
              "
            >
              Light Gold — badges, highlights, decorative accents. Never used as
              a CTA alone.
            </p>
            <div class="flex gap-3 items-center">
              <UBadge tone="success" dot>AA · 12.4:1 on text</UBadge>
              <UBadge tone="success" dot>AAA · 4.7:1 on white</UBadge>
            </div>
          </div>
        </div>

        <!-- Primary ramp -->
        <h2
          class="mb-4"
          style="font-size: 22px; font-weight: 700; letter-spacing: -0.02em"
        >
          Primary ramp
        </h2>
        <div
          class="rounded-xl overflow-hidden mb-12 flex"
          style="border: 1px solid var(--color-border)"
        >
          <div
            v-for="shade in primaryRamp"
            :key="shade[0]"
            class="flex-1 py-5 px-3 flex flex-col justify-between"
            :style="{
              background: shade[1],
              color: shade[0] >= 400 ? 'white' : '#1a1d21',
              minHeight: 132,
            }"
          >
            <div
              style="
                font-family: var(--font-display);
                font-weight: 700;
                font-size: 22px;
                letter-spacing: -0.02em;
              "
            >
              {{ shade[0] }}
            </div>
            <div>
              <div
                style="
                  font-family: var(--font-mono);
                  font-size: 11px;
                  font-weight: 500;
                  opacity: 0.85;
                "
              >
                {{ shade[1] }}
              </div>
            </div>
          </div>
        </div>

        <!-- Semantic statuses -->
        <h2
          class="mb-4"
          style="font-size: 22px; font-weight: 700; letter-spacing: -0.02em"
        >
          Semantic
        </h2>
        <div class="grid grid-cols-4 gap-4 mb-12">
          <div
            v-for="sem in semantics"
            :key="sem.name"
            class="rounded-xl border overflow-hidden"
            style="
              background: var(--color-surface);
              border-color: var(--color-border);
            "
          >
            <div :style="{ height: 72, background: sem.hex }" />
            <div class="p-4">
              <div class="flex items-baseline justify-between mb-1">
                <div
                  style="
                    font-family: var(--font-mono);
                    font-size: 13px;
                    font-weight: 600;
                  "
                >
                  {{ sem.name }}
                </div>
                <div
                  style="
                    font-family: var(--font-mono);
                    font-size: 11px;
                    color: var(--color-text-tertiary);
                  "
                >
                  {{ sem.hex }}
                </div>
              </div>
              <div
                style="
                  font-size: 12.5px;
                  color: var(--color-text-secondary);
                  line-height: 1.5;
                "
              >
                {{ sem.desc }}
              </div>
            </div>
          </div>
        </div>

        <!-- Contrast table -->
        <h2
          class="mb-4"
          style="font-size: 22px; font-weight: 700; letter-spacing: -0.02em"
        >
          Contrast pairs
        </h2>
        <div
          class="rounded-xl border overflow-hidden"
          style="border-color: var(--color-border)"
        >
          <div
            class="grid py-3 px-5"
            style="
              grid-template-columns: 1.5fr 2fr 1fr 100px;
              background: var(--color-surface-2);
              font-size: 11.5px;
              font-weight: 700;
              color: var(--color-text-tertiary);
              letter-spacing: 0.06em;
              text-transform: uppercase;
              border-bottom: 1px solid var(--color-border);
            "
          >
            <span>Pair</span>
            <span>Values</span>
            <span>Ratio</span>
            <span>Rating</span>
          </div>
          <div
            v-for="(row, i) in contrastRows"
            :key="i"
            class="grid py-3 px-5 items-center"
            :style="{
              'grid-template-columns': '1.5fr 2fr 1fr 100px',
              'border-bottom':
                i < contrastRows.length - 1
                  ? '1px solid var(--color-border)'
                  : 'none',
              fontSize: 13,
            }"
          >
            <span style="font-weight: 500; color: var(--color-text)">{{
              row.pair
            }}</span>
            <span
              style="
                font-family: var(--font-mono);
                font-size: 12px;
                color: var(--color-text-secondary);
              "
              >{{ row.values }}</span
            >
            <span style="font-family: var(--font-mono); font-weight: 600">{{
              row.ratio
            }}</span>
            <span>
              <UBadge :tone="row.rating === 'AAA' ? 'success' : 'info'" dot>{{
                row.rating
              }}</UBadge>
            </span>
          </div>
        </div>
      </main>

      <!-- TOC -->
      <div
        class="w-56 flex-shrink-0 hidden xl:block pl-8 py-8 border-l"
        style="border-color: var(--color-border)"
      >
        <div
          class="sticky top-8"
          style="
            font-size: 12px;
            color: var(--color-text-tertiary);
            font-weight: 600;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            margin-bottom: 12px;
          "
        >
          On this page
        </div>
        <div class="flex flex-col gap-2">
          <a
            v-for="item in tocItems"
            :key="item"
            href="#"
            class="transition-colors"
            :class="item === 'Ramp' ? 'font-semibold' : 'font-normal'"
            :style="{
              color:
                item === 'Ramp'
                  ? 'var(--color-text)'
                  : 'var(--color-text-secondary)',
              fontSize: 13,
            }"
            @click.prevent
          >
            {{ item }}
          </a>
        </div>
        <div
          class="mt-8 pt-6 border-t"
          style="border-color: var(--color-border)"
        >
          <div
            class="mb-3"
            style="
              font-size: 11px;
              color: var(--color-text-tertiary);
              font-weight: 600;
              letter-spacing: 0.06em;
              text-transform: uppercase;
            "
          >
            Quick links
          </div>
          <div class="flex flex-col gap-2">
            <a
              href="#"
              style="
                font-size: 12.5px;
                color: var(--color-primary);
                font-weight: 500;
              "
              @click.prevent
              >Download CSS</a
            >
            <a
              href="#"
              style="
                font-size: 12.5px;
                color: var(--color-primary);
                font-weight: 500;
              "
              @click.prevent
              >Download JSON</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DocsSidebar from "~/components/DocsSidebar.vue";

const primaryRamp: [number, string][] = [
  [50, "#FFF1ED"],
  [100, "#FFD9CE"],
  [200, "#FFB8A3"],
  [300, "#FF9978"],
  [400, "#FF834F"],
  [500, "#CC4128"],
  [600, "#E85A3A"],
  [700, "#B8442B"],
  [800, "#8A311F"],
  [900, "#5E2014"],
];

const semantics = [
  { name: "success", hex: "#1F8A5B", desc: "Approvals, confirmations" },
  { name: "warning", hex: "#FFD166", desc: "Caution, draft, pending" },
  { name: "danger", hex: "#D14343", desc: "Destructive, errors" },
  { name: "info", hex: "#2A6FDB", desc: "Neutral information" },
];

const contrastRows = [
  {
    pair: "text on bg",
    values: "#1A1D21 / #F8F9FA",
    ratio: "15.9 : 1",
    rating: "AAA",
  },
  {
    pair: "white on primary",
    values: "#FFF / #CC4128",
    ratio: "4.7 : 1",
    rating: "AA",
  },
  {
    pair: "text on secondary",
    values: "#1A1D21 / #FFD166",
    ratio: "12.4 : 1",
    rating: "AAA",
  },
  {
    pair: "text-secondary on bg",
    values: "#5C6270 / #F8F9FA",
    ratio: "7.2 : 1",
    rating: "AAA",
  },
  {
    pair: "white on info",
    values: "#FFF / #2A6FDB",
    ratio: "5.1 : 1",
    rating: "AA",
  },
  {
    pair: "white on danger",
    values: "#FFF / #D14343",
    ratio: "4.6 : 1",
    rating: "AA",
  },
];

const tocItems = [
  "Overview",
  "Primary",
  "Secondary",
  "Ramp",
  "Semantic",
  "Contrast",
  "Code",
];

useHead({
  title: "Color — Design Tokens",
  meta: [
    { name: "description", content: "Design token color palette for OpenDS" },
  ],
});
</script>

<style scoped>
a:hover {
  color: var(--color-primary);
}
</style>
