<template>
  <button
    type="button"
    class="theme-toggle inline-flex items-center justify-center rounded-md p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="toggleTheme"
  >
    <Icon :name="isDark ? 'i-lucide-sun' : 'i-lucide-moon'" class="size-5" />
  </button>
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
