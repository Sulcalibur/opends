<script setup lang="ts">
interface Props {
  width?: string;
  height?: string;
  radius?: "sm" | "md" | "lg" | "full";
  circle?: boolean;
}

withDefaults(defineProps<Props>(), {
  width: "100%",
  height: "16px",
  radius: "md",
  circle: false,
});

const radiusMap = {
  sm: "var(--radius-sm)",
  md: "var(--radius-md)",
  lg: "var(--radius-lg)",
  full: "var(--radius-full)",
};
</script>

<template>
  <div
    class="relative overflow-hidden bg-[var(--neutral-100)]"
    aria-busy="true"
    aria-label="Loading"
    :style="{
      width: width,
      height: height,
      borderRadius: circle ? '50%' : radiusMap[radius],
    }"
  >
    <div class="skeleton-pulse absolute inset-0" />
  </div>
</template>

<style scoped>
.skeleton-pulse {
  background-color: rgba(255, 255, 255, 0.4);
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

@keyframes skeleton-pulse {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}
</style>
