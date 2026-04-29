<script setup lang="ts">
interface Props {
  title?: string;
  message?: string;
  showRetry?: boolean;
  showHelp?: boolean;
  helpLink?: string;
  role?: string;
}

withDefaults(defineProps<Props>(), {
  title: "Something went wrong",
  message: "",
  showRetry: true,
  showHelp: false,
  helpLink: "/help",
});

const emit = defineEmits<{
  retry: [];
}>();

function handleRetry() {
  emit("retry");
}
</script>

<template>
  <div
    :role="role || 'alert'"
    class="bg-[var(--color-error-subtle)] rounded-[var(--radius-md)] p-4 flex gap-3"
  >
    <Icon
      name="i-lucide-alert-circle"
      class="w-6 h-6 text-[var(--color-error)] flex-shrink-0 mt-0.5"
    />
    <div class="flex-1 min-w-0">
      <h4
        class="text-base font-semibold text-[var(--color-error)] font-[family-name:var(--font-heading)] mb-1"
      >
        {{ title }}
      </h4>
      <p
        v-if="message"
        class="text-sm text-[var(--color-text-secondary)] font-[family-name:var(--font-body)] leading-normal"
      >
        {{ message }}
      </p>
      <div v-if="showRetry || showHelp" class="mt-3 flex gap-3">
        <BaseButton
          v-if="showRetry"
          variant="secondary"
          size="compact"
          @click="handleRetry"
        >
          Try again
        </BaseButton>
        <slot name="help" :href="helpLink">
          <a
            v-if="showHelp"
            :href="helpLink"
            class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
          >
            Get help
          </a>
        </slot>
      </div>
    </div>
  </div>
</template>
