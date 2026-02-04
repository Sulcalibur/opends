<template>
  <div class="animated-card" :class="[variant, hoverClass]">
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>

    <div class="card-content">
      <slot />
    </div>

    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: "default" | "elevated" | "flat" | "gradient";
  hover?: "none" | "lift" | "glow" | "float";
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "default",
  hover: "lift",
  loading: false,
});

const hoverClass = computed(() => {
  if (props.hover === "none") return "";
  return `hover-${props.hover}`;
});
</script>

<style scoped>
.animated-card {
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-slow);
  position: relative;
  overflow: hidden;
}

/* Variants */
.animated-card.elevated {
  box-shadow: var(--shadow-lg);
}

.animated-card.flat {
  box-shadow: none;
  border: 1px solid var(--color-border-light);
}

.animated-card.gradient {
  background: var(--gradient-surface);
  border: none;
}

/* Hover Effects */
.animated-card.hover-lift:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
  border-color: var(--color-primary-200);
}

.animated-card.hover-glow:hover {
  box-shadow: var(--shadow-glow-md);
}

.animated-card.hover-float:hover {
  animation: float 3s ease-in-out infinite;
}

/* Loading State */
.animated-card.loading {
  pointer-events: none;
  opacity: 0.6;
}

/* Header */
.card-header {
  padding: var(--space-5);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-secondary);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

/* Content */
.card-content {
  padding: var(--space-5);
}

/* Footer */
.card-footer {
  padding: var(--space-4) var(--space-5);
  border-top: 1px solid var(--color-border);
  background: var(--color-bg-secondary);
}

/* Dark Mode */
.dark .animated-card {
  background: var(--dark-color-surface);
  border-color: var(--dark-color-border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.dark .animated-card.elevated {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
}

.dark .animated-card:hover {
  border-color: var(--color-primary-400);
  box-shadow: var(--shadow-xl), var(--dark-shadow-glow-sm);
}

.dark .animated-card.hover-glow:hover {
  box-shadow: var(--dark-shadow-glow-md);
}

.dark .card-header,
.dark .card-footer {
  background: var(--dark-color-bg-100);
  border-color: var(--dark-color-border-200);
}

/* Gradient Border Animation */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-6px);
  }
}
</style>
