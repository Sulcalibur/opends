<template>
  <button
    class="premium-button"
    :class="[
      variant,
      sizeClass,
      { 'is-loading': loading, 'has-icon': $slots.icon },
    ]"
    :disabled="disabled || loading"
    :aria-busy="loading"
    type="button"
    @click="$emit('click', $event)"
  >
    <span v-if="$slots.icon" class="icon-wrapper" :aria-hidden="loading">
      <slot name="icon" />
    </span>

    <span class="content" :aria-hidden="loading">
      <slot />
    </span>

    <span v-if="loading" class="spinner" aria-hidden="true" />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
  loading: false,
  disabled: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const sizeClass = computed(() => `size-${props.size}`);
</script>

<style scoped>
.premium-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-family: var(--font-family-body);
  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-lg);
  border: none;
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
  white-space: nowrap;
}

.premium-button:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

.premium-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

/* Sizes */
.premium-button.size-sm {
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-sm);
}

.premium-button.size-md {
  padding: var(--space-3) var(--space-5);
  font-size: var(--font-size-base);
}

.premium-button.size-lg {
  padding: var(--space-4) var(--space-6);
  font-size: var(--font-size-lg);
}

.premium-button.size-xl {
  padding: var(--space-5) var(--space-8);
  font-size: var(--font-size-xl);
}

/* Primary Variant */
.premium-button.primary {
  background: var(--gradient-primary);
  color: white;
  box-shadow: 0 4px 12px rgba(219, 60, 36, 0.3);
}

.premium-button.primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(219, 60, 36, 0.4);
  filter: brightness(1.1);
}

.premium-button.primary:active {
  transform: translateY(1px);
  box-shadow: var(--shadow-inner);
}

.dark .premium-button.primary {
  background: var(--dark-gradient-primary);
  box-shadow: 0 4px 12px rgba(234, 138, 123, 0.3);
}

.dark .premium-button.primary:hover:not(:disabled) {
  box-shadow:
    0 6px 20px rgba(234, 138, 123, 0.4),
    var(--dark-shadow-glow-md);
}

/* Secondary Variant */
.premium-button.secondary {
  background: transparent;
  color: var(--color-secondary-600);
  border: 2px solid var(--color-secondary-500);
}

.premium-button.secondary:hover:not(:disabled) {
  background: var(--color-secondary-50);
  border-color: var(--color-secondary-400);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 189, 24, 0.2);
}

.dark .premium-button.secondary {
  color: var(--color-secondary-400);
  border-color: var(--dark-color-border-200);
}

.dark .premium-button.secondary:hover:not(:disabled) {
  background: var(--dark-color-bg-100);
  border-color: var(--color-secondary-300);
}

/* Ghost Variant */
.premium-button.ghost {
  background: transparent;
  color: var(--color-text-primary);
  border: none;
}

.premium-button.ghost:hover:not(:disabled) {
  background: var(--color-bg-200);
  color: var(--color-text-primary);
}

.dark .premium-button.ghost:hover:not(:disabled) {
  background: var(--dark-color-bg-200);
}

/* Danger Variant */
.premium-button.danger {
  background: var(--color-error-500);
  color: white;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.premium-button.danger:hover:not(:disabled) {
  background: var(--color-error-400);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
}

.dark .premium-button.danger:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(248, 113, 113, 0.4);
}

/* Icon */
.premium-button .icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s var(--easing-out);
}

.premium-button:hover .icon-wrapper {
  transform: translateX(-4px);
}

/* Content */
.premium-button .content {
  flex: 1;
}

/* Loading Spinner */
.premium-button .spinner {
  width: 1.25em;
  height: 1.25em;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.premium-button.is-loading .content,
.premium-button.is-loading .icon-wrapper {
  opacity: 0;
}

/* Ripple Effect */
@keyframes ripple {
  from {
    transform: scale(0);
    opacity: 1;
  }
  to {
    transform: scale(4);
    opacity: 0;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Active State */
.premium-button.button-press {
  transform: translateY(2px);
}

.premium-button.button-press.primary {
  box-shadow: var(--shadow-inner) !important;
}
</style>
