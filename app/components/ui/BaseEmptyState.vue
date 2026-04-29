<script setup lang="ts">
interface Props {
  icon?: string;
  title?: string;
  description?: string;
  actionLabel?: string;
}

withDefaults(defineProps<Props>(), {
  icon: "inbox",
  title: "Nothing here yet",
  description: "",
  actionLabel: "",
});

const emit = defineEmits<{
  action: [];
}>();

function handleAction() {
  emit("action");
}
</script>

<template>
  <div class="text-center py-12 px-6">
    <Icon
      :name="`i-lucide-${icon}`"
      class="w-12 h-12 mx-auto mb-4 text-[var(--neutral-400)]"
      aria-hidden="true"
    />
    <h3
      class="text-base font-semibold text-[var(--color-text-primary)] font-[family-name:var(--font-heading)] mb-2"
    >
      {{ title }}
    </h3>
    <p
      v-if="description"
      class="text-sm text-[var(--color-text-secondary)] font-[family-name:var(--font-body)] leading-normal max-w-[320px] mx-auto mb-4"
    >
      {{ description }}
    </p>
    <BaseButton v-if="actionLabel" variant="primary" @click="handleAction">
      {{ actionLabel }}
    </BaseButton>
  </div>
</template>
