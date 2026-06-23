<template>
  <div class="public-layout">
    <DocsHeader />
    <main class="public-main">
      <slot />
    </main>
    <DocsFooter />
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.public-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--bg);
}

.public-main {
  flex: 1;
}
</style>
