<template>
  <div class="skeleton-loader" :class="[variant, size]">
    <div v-if="variant === 'card'" class="skeleton-card">
      <div class="skeleton-header">
        <div class="skeleton-avatar"/>
        <div class="skeleton-title"/>
      </div>
      <div class="skeleton-body">
        <div v-for="i in lines" :key="i" class="skeleton-line"/>
      </div>
    </div>

    <div v-else-if="variant === 'text'" class="skeleton-text">
      <div v-for="i in lines" :key="i" class="skeleton-line"/>
    </div>

    <div v-else-if="variant === 'avatar'" class="skeleton-avatar-circle"/>

    <div v-else-if="variant === 'button'" class="skeleton-button"/>
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: "card" | "text" | "avatar" | "button";
  size?: "sm" | "md" | "lg";
  lines?: number;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "text",
  size: "md",
  lines: 3,
});
</script>

<style scoped>
.skeleton-loader {
  width: 100%;
}

/* Shimmer Effect */
.skeleton-card,
.skeleton-avatar-circle,
.skeleton-button,
.skeleton-line,
.skeleton-title,
.skeleton-header .skeleton-avatar {
  background: linear-gradient(
    90deg,
    var(--color-bg-200) 25%,
    var(--color-bg-100) 50%,
    var(--color-bg-200) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s linear infinite;
}

/* Card Skeleton */
.skeleton-card {
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  box-shadow: var(--shadow-sm);
}

.skeleton-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.skeleton-header .skeleton-avatar {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.skeleton-title {
  height: 24px;
  width: 200px;
  border-radius: var(--radius-sm);
}

.skeleton-body {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

/* Text Skeleton */
.skeleton-line {
  height: 16px;
  border-radius: var(--radius-sm);
  animation-delay: calc(var(--index, 0) * 0.1s);
}

.skeleton-line:last-child {
  width: 60%;
}

/* Avatar Skeleton */
.skeleton-avatar-circle {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-full);
}

.skeleton-avatar-circle.size-sm {
  width: 32px;
  height: 32px;
}

.skeleton-avatar-circle.size-lg {
  width: 96px;
  height: 96px;
}

/* Button Skeleton */
.skeleton-button {
  height: 44px;
  width: 120px;
  border-radius: var(--radius-lg);
}

/* Dark Mode */
.dark .skeleton-card {
  background: var(--dark-color-surface);
  box-shadow: var(--shadow-md);
}

.dark .skeleton-line,
.dark .skeleton-title,
.dark .skeleton-avatar-circle,
.dark .skeleton-button {
  background: linear-gradient(
    90deg,
    var(--dark-color-bg-200) 25%,
    var(--dark-color-bg-100) 50%,
    var(--dark-color-bg-200) 75%
  );
}

/* Animation */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
