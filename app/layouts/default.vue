<template>
  <div class="default-layout">
    <NavBar />
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.default-layout {
  min-height: 100vh;
  background: var(--color-bg);
  transition: background var(--transition-slow);
}

.main-content {
  min-height: calc(100vh - 80px);
}

.dark .default-layout {
  background: var(--dark-color-bg);
}
</style>
