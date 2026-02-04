<template>
  <div id="app" :class="{ dark: isDark }">
    <NuxtLayout>
      <template #default>
        <NuxtPage />
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";

const { data: settingsData } = await useFetch("/api/settings/public").catch(() => ({ data: ref(null) }));
const settings = computed(() => settingsData.value?.settings || {});

const isDark = ref(false);

const applyThemeSettings = (themeSettings: any) => {
  if (!themeSettings) return;

  if (typeof window === "undefined") return;
  const root = document.documentElement;

  if (themeSettings.primaryColor) {
    root.style.setProperty("--color-primary-500", themeSettings.primaryColor);
  }
  if (themeSettings.secondaryColor) {
    root.style.setProperty(
      "--color-secondary-500",
      themeSettings.secondaryColor,
    );
  }
  if (themeSettings.borderRadius) {
    root.style.setProperty("--radius-lg", themeSettings.borderRadius);
  }
  if (themeSettings.headingFont) {
    root.style.setProperty("--font-heading", themeSettings.headingFont);
  }
  if (themeSettings.bodyFont) {
    root.style.setProperty("--font-body", themeSettings.bodyFont);
  }

  if (themeSettings.presetTheme) {
    root.setAttribute("data-theme-preset", themeSettings.presetTheme);
  }
};

const checkSystemTheme = () => {
  if (typeof window === "undefined") return;

  const savedTheme = localStorage.getItem("theme");
  if (
    savedTheme === "dark" ||
    (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    isDark.value = true;
  } else {
    isDark.value = false;
  }
};

const handleThemeChange = (e: MediaQueryListEvent) => {
  if (!localStorage.getItem("theme")) {
    isDark.value = e.matches;
  }
};

watch(
  () => settings.value.appearance,
  (newVal) => {
    applyThemeSettings(newVal);
  },
  { deep: true },
);

watch(isDark, (newVal) => {
  if (newVal) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
});

onMounted(() => {
  applyThemeSettings(settings.value.appearance);
  checkSystemTheme();

  if (typeof window !== "undefined") {
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    darkModeQuery.addEventListener("change", handleThemeChange);
  }
});

onBeforeUnmount(() => {
  if (typeof window !== "undefined") {
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    darkModeQuery.removeEventListener("change", handleThemeChange);
  }
});

useHead(() => {
  const orgName = settings.value.organization_name || "OpenDS";
  const appearance = settings.value.appearance || {};

  const fonts = [];
  if (appearance.headingFont) {
    const heading = appearance.headingFont
      .split(",")[0]
      .replace(/'/g, "")
      .replace(/ /g, "+");
    fonts.push(`family=${heading}:wght@400;500;600;700`);
  }
  if (appearance.bodyFont) {
    const body = appearance.bodyFont
      .split(",")[0]
      .replace(/'/g, "")
      .replace(/ /g, "+");
    fonts.push(`family=${body}:wght@400;500;600`);
  }

  const googleFontsUrl =
    fonts.length > 0
      ? `https://fonts.googleapis.com/css2?${fonts.join("&")}&display=swap`
      : "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap";

  return {
    titleTemplate: (titleChunk) => {
      return titleChunk ? `${titleChunk} - ${orgName}` : orgName;
    },
    htmlAttrs: {
      class: isDark.value ? "dark" : "",
    },
    link: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
      { rel: "stylesheet", href: googleFontsUrl },
    ],
    style: [
      {
        children: `
          body { font-family: var(--font-body, 'Inter', sans-serif); }
          h1, h2, h3, h4, h5, h6 { font-family: var(--font-heading, 'Outfit', sans-serif); font-weight: 600; }
        `,
      },
    ],
  };
});
</script>

<style>
:root {
  --color-primary-500: #db3c24;
  --color-primary-400: #ea8a7b;
  --color-primary-300: #f5c4bd;
  --color-primary-200: #fbeae8;
  --color-primary-100: #fdf5f4;

  --color-secondary-500: #e7bd18;
  --color-secondary-400: #f2d670;
  --color-secondary-300: #f9ebac;
  --color-secondary-200: #fcf6e0;
  --color-secondary-100: #fefce9;

  --color-bg: #ffffff;
  --color-bg-50: #fefdfb;
  --color-bg-100: #fdf7f2;
  --color-bg-200: #faf0e6;
  --color-bg-300: #f6e6d4;
  --color-bg-surface: #ffffff;

  --color-text-primary: #0f172a;
  --color-text-secondary: #64748b;
  --color-text-400: #94a3b8;
  --color-text-300: #cbd5e1;

  --color-border: #e2e8f0;
  --color-border-light: #f1f5f9;

  --gradient-primary: linear-gradient(135deg, #db3c24 0%, #e7bd18 100%);
  --gradient-secondary: linear-gradient(135deg, #e7bd18 0%, #f2d670 100%);
  --gradient-hero: linear-gradient(
    135deg,
    #db3c24 0%,
    #ea8a7b 50%,
    #e7bd18 100%
  );
  --gradient-surface: linear-gradient(135deg, #f6e6d4 0%, #fefdfb 100%);

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
  --shadow-inner: inset 0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-glow-md: 0 0 20px rgba(219, 60, 36, 0.3);
  --shadow-glow-sm: 0 0 12px rgba(219, 60, 36, 0.2);

  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  --radius-full: 9999px;

  --font-family-body:
    "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-family-heading:
    "Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;

  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;

  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);

  --easing-out: cubic-bezier(0.4, 0, 0.2, 1);
  --easing-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.dark {
  --color-bg: #0f172a;
  --color-bg-50: #0c1222;
  --color-bg-100: #1e293b;
  --color-bg-200: #334155;
  --color-bg-300: #475569;
  --color-bg-surface: #1e293b;

  --color-text-primary: #f1f5f9;
  --color-text-secondary: #cbd5e1;
  --color-text-400: #94a3b8;
  --color-text-300: #64748b;

  --color-border: #334155;
  --color-border-light: #475569;

  --dark-color-bg: #0f172a;
  --dark-color-bg-900: #0c1222;
  --dark-color-bg-800: #1e293b;
  --dark-color-bg-200: #334155;
  --dark-color-bg-100: #475569;

  --dark-color-surface: #1e293b;
  --dark-color-border: #334155;
  --dark-color-border-200: #475569;

  --dark-color-text-primary: #f1f5f9;
  --dark-color-text-secondary: #cbd5e1;
  --dark-color-text-400: #94a3b8;
  --dark-color-text-300: #64748b;

  --dark-gradient-primary: linear-gradient(135deg, #ea8a7b 0%, #f2d670 100%);
  --dark-shadow-glow-sm: 0 0 12px rgba(234, 138, 123, 0.25);
  --dark-shadow-glow-md: 0 0 20px rgba(234, 138, 123, 0.35);
}

#app {
  min-height: 100vh;
  transition: background-color var(--transition-slow);
}

* {
  transition-property:
    background-color, border-color, color, box-shadow, fill, stroke;
  transition-timing-function: var(--easing-out);
  transition-duration: var(--transition-base);
}

.fade-up {
  animation: fade-up 0.6s var(--easing-out);
}

.scale-in {
  animation: scale-in 0.5s var(--easing-bounce);
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.hover-glow:hover {
  box-shadow: var(--shadow-glow-md);
}

.stagger-1 {
  animation-delay: 0.1s;
}

.stagger-2 {
  animation-delay: 0.2s;
}

.stagger-3 {
  animation-delay: 0.3s;
}

.stagger-4 {
  animation-delay: 0.4s;
}

.card-gradient-border {
  position: relative;
}

.card-gradient-border::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 2px;
  background: var(--gradient-primary);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity var(--transition-base);
}

.card-gradient-border:hover::before {
  opacity: 1;
}

.backdrop-blur {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scale-in {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
