<script setup lang="ts">
interface Props {
  hoverable?: boolean;
  padding?: "none" | "compact" | "default" | "large";
  loading?: boolean;
  empty?: boolean;
  error?: string;
}

withDefaults(defineProps<Props>(), {
  hoverable: false,
  padding: "default",
  loading: false,
  empty: false,
  error: "",
});

const paddingClasses = {
  none: "p-0",
  compact: "p-4",
  default: "p-6",
  large: "p-8",
};
</script>

<template>
  <div
    class="bg-[var(--color-surface)] rounded-[var(--radius-lg)] overflow-hidden"
    :class="[
      paddingClasses[padding],
      hoverable
        ? 'cursor-pointer transition-all duration-[var(--duration-structural)] ease-[var(--ease-out-quart)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] hover:-translate-y-0.5'
        : 'shadow-[var(--shadow-card)]',
    ]"
  >
    <div v-if="$slots.header" class="mb-4">
      <slot name="header" />
    </div>

    <div v-if="loading" class="space-y-3">
      <BaseSkeleton width="60%" height="20px" />
      <BaseSkeleton width="100%" height="12px" />
      <BaseSkeleton width="80%" height="12px" />
    </div>

    <div v-else-if="error">
      <slot name="error">
        <BaseError :message="error" show-retry @retry="$emit('retry')" />
      </slot>
    </div>

    <div v-else-if="empty">
      <slot name="empty">
        <BaseEmptyState />
      </slot>
    </div>

    <slot v-else />

    <div v-if="$slots.footer" class="mt-4">
      <slot name="footer" />
    </div>
  </div>
</template>
