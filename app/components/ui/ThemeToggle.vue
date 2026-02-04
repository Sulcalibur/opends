<template>
  <button
    class="theme-toggle"
    :class="{ 'is-dark': isDark }"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="toggleTheme"
  >
    <span class="icon-wrapper">
      <i v-if="isDark" class="pi pi-moon"/>
      <i v-else class="pi pi-sun"/>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";

const isDark = ref(false);

onMounted(() => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("theme");
    if (saved) {
      isDark.value = saved === "dark";
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      isDark.value = true;
    }
    applyTheme();
  }
});

function toggleTheme() {
  isDark.value = !isDark.value;
  applyTheme();
  if (typeof window !== "undefined") {
    localStorage.setItem("theme", isDark.value ? "dark" : "light");
  }
}

function applyTheme() {
  if (typeof document === "undefined") return;

  const html = document.documentElement;

  if (isDark.value) {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }
}
</script>

<style scoped>
.theme-toggle {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  background: var(--color-bg-200);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.theme-toggle:hover {
  background: var(--color-bg-300);
  border-color: var(--color-primary-300);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.theme-toggle:active {
  transform: scale(0.95);
}

.icon-wrapper {
  font-size: 1.25rem;
  transition: transform 0.3s var(--easing-bounce);
}

.theme-toggle:hover .icon-wrapper {
  transform: rotate(180deg) scale(1.1);
}

.theme-toggle.is-dark {
  background: var(--color-shadow-grey-800);
  border-color: var(--color-shadow-grey-700);
  color: var(--color-light-gold-400);
}

.theme-toggle.is-dark:hover {
  background: var(--color-shadow-grey-700);
  border-color: var(--color-light-gold-300);
  box-shadow: 0 4px 12px rgba(234, 138, 123, 0.3);
}

/* Glow Effect */
.theme-toggle::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    circle at center,
    rgba(231, 189, 24, 0) 0%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity var(--transition-base);
  pointer-events: none;
}

.theme-toggle:hover::before {
  opacity: 1;
}

.theme-toggle.is-dark:hover::before {
  background: radial-gradient(
    circle at center,
    rgba(234, 138, 123, 0.4) 0%,
    transparent 70%
  );
}
</style>
