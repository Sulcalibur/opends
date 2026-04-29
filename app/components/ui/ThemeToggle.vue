<template>
  <UButton
    variant="ghost"
    color="neutral"
    size="sm"
    :icon="isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    class="theme-toggle"
    @click="toggleTheme"
  />
</template>

<script setup lang="ts">
const colorMode = useColorMode();

const isDark = computed(() => colorMode.value === "dark");

function toggleTheme() {
  colorMode.preference = isDark.value ? "light" : "dark";
}
</script>

<style scoped>
.theme-toggle {
  transition: transform 0.2s ease;
}

.theme-toggle:hover {
  transform: rotate(20deg);
}
</style>
