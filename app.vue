<template>
  <div id="app">
    <NuxtLayout>
      <template #default>
        <NuxtPage />
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, provide, inject } from 'vue'
import { useFetch, useHead, definePageMeta, useRouter, useToast } from '#app'

const { data: settingsData } = await useFetch('/api/settings/public')
const settings = computed(() => settingsData.value?.settings || {})

// Apply theme settings globally
const applyThemeSettings = (themeSettings: any) => {
  if (!themeSettings) return
  
  if (typeof window === 'undefined') return
  const root = document.documentElement
  
  if (themeSettings.primaryColor) {
    root.style.setProperty('--primary-color', themeSettings.primaryColor)
    root.style.setProperty('--primary-color-hover', `${themeSettings.primaryColor}ee`)
  }
  if (themeSettings.secondaryColor) {
    root.style.setProperty('--secondary-color', themeSettings.secondaryColor)
  }
  if (themeSettings.borderRadius) {
    root.style.setProperty('--border-radius', themeSettings.borderRadius)
  }
  if (themeSettings.headingFont) {
    root.style.setProperty('--font-heading', themeSettings.headingFont)
  }
  if (themeSettings.bodyFont) {
    root.style.setProperty('--font-body', themeSettings.bodyFont)
  }
  
  // Set the theme preset data attribute for specific CSS scoping
  if (themeSettings.presetTheme) {
    root.setAttribute('data-theme-preset', themeSettings.presetTheme)
  }
}

watch(() => settings.value.appearance, (newVal) => {
  applyThemeSettings(newVal)
}, { deep: true })

onMounted(() => {
  applyThemeSettings(settings.value.appearance)
})

useHead(() => {
  const orgName = settings.value.organization_name || 'OpenDS'
  const appearance = settings.value.appearance || {}
  
  // Extract font families and prepare Google Fonts URL
  const fonts = []
  if (appearance.headingFont) {
    const heading = appearance.headingFont.split(',')[0].replace(/'/g, '').replace(/ /g, '+')
    fonts.push(`family=${heading}:wght@400;500;600;700`)
  }
  if (appearance.bodyFont) {
    const body = appearance.bodyFont.split(',')[0].replace(/'/g, '').replace(/ /g, '+')
    fonts.push(`family=${body}:wght@400;500;600`)
  }
  
  const googleFontsUrl = fonts.length > 0 
    ? `https://fonts.googleapis.com/css2?${fonts.join('&')}&display=swap`
    : 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap'

  return {
    titleTemplate: (titleChunk) => {
      return titleChunk ? `${titleChunk} - ${orgName}` : orgName
    },
    link: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      { rel: 'stylesheet', href: googleFontsUrl }
    ],
    style: [
      {
        children: `
          body { font-family: var(--font-body, 'Inter', sans-serif); }
          h1, h2, h3, h4, h5, h6 { font-family: var(--font-heading, 'Outfit', sans-serif); font-weight: 600; }
        `
      }
    ]
  }
})
</script>

<style>
#app {
  min-height: 100vh;
}
</style>
