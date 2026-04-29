<script setup lang="ts">
interface Props {
  label?: string;
  placeholder?: string;
  type?: "text" | "password" | "email" | "number" | "search" | "tel" | "url";
  disabled?: boolean;
  error?: string;
  hint?: string;
  iconLeft?: string;
  iconRight?: string;
  required?: boolean;
}

withDefaults(defineProps<Props>(), {
  label: "",
  placeholder: "",
  type: "text",
  disabled: false,
  error: "",
  hint: "",
  iconLeft: "",
  iconRight: "",
  required: false,
});

const modelValue = defineModel<string>({ default: "" });
</script>

<template>
  <div class="w-full">
    <label
      v-if="label"
      class="block text-xs font-medium mb-1.5 text-[var(--color-text-secondary)]"
    >
      {{ label }}
      <span v-if="required" class="text-[var(--color-error)]">*</span>
    </label>
    <div class="relative">
      <Icon
        v-if="iconLeft"
        :name="`i-lucide-${iconLeft}`"
        class="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] w-[18px] h-[18px] pointer-events-none"
      />
      <input
        v-model="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        class="w-full h-10 text-sm font-[family-name:var(--font-body)] text-[var(--color-text-primary)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] transition-all placeholder:text-[var(--color-text-muted)] disabled:bg-[var(--neutral-100)] disabled:opacity-60 disabled:cursor-not-allowed"
        :class="[
          iconLeft ? 'pl-10' : 'pl-3',
          iconRight ? 'pr-10' : 'pr-3',
          error
            ? 'border-[var(--color-error)] bg-[var(--color-error-subtle)]'
            : 'focus:border-[var(--color-border-focus)]',
        ]"
      />
      <Icon
        v-if="iconRight"
        :name="`i-lucide-${iconRight}`"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] w-[18px] h-[18px] pointer-events-none"
      />
    </div>
    <p v-if="error" class="mt-1.5 text-xs text-[var(--color-error)]">
      {{ error }}
    </p>
    <p v-else-if="hint" class="mt-1.5 text-xs text-[var(--color-text-muted)]">
      {{ hint }}
    </p>
  </div>
</template>

<style scoped>
input:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
  box-shadow: var(--shadow-focus);
}

input:not(:disabled):hover {
  border-color: var(--color-border-subtle);
}
</style>
