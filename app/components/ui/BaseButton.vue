<script setup lang="ts">
interface Props {
  variant?: "primary" | "secondary" | "ghost";
  size?: "compact" | "standard" | "large";
  disabled?: boolean;
  loading?: boolean;
  iconLeft?: string;
  iconRight?: string;
  type?: "button" | "submit" | "reset";
  to?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "standard",
  disabled: false,
  loading: false,
  iconLeft: "",
  iconRight: "",
  type: "button",
  to: "",
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

function handleClick(event: MouseEvent) {
  if (props.disabled || props.loading) return;
  emit("click", event);
}

const sizeClasses = {
  compact: "h-8 px-3 text-[13px]",
  standard: "h-10 px-5 text-sm",
  large: "h-12 px-6 text-[15px]",
};

const variantClasses = {
  primary:
    "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-active)]",
  secondary:
    "bg-transparent border-[1.5px] border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-subtle)]",
  ghost:
    "bg-transparent border-none text-[var(--color-text-secondary)] hover:bg-[var(--neutral-100)]",
};
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="inline-flex items-center justify-center gap-2 font-semibold tracking-wide rounded-[var(--radius-md)] transition-all"
    :class="[
      sizeClasses[size],
      variantClasses[variant],
      (disabled || loading) &&
        'opacity-50 pointer-events-none cursor-not-allowed',
    ]"
    @click="handleClick"
  >
    <Icon
      v-if="loading"
      name="i-lucide-loader-2"
      class="animate-spin"
      :class="
        size === 'compact'
          ? 'w-4 h-4'
          : size === 'large'
            ? 'w-5 h-5'
            : 'w-[18px] h-[18px]'
      "
    />
    <Icon
      v-else-if="iconLeft"
      :name="`i-lucide-${iconLeft}`"
      :class="
        size === 'compact'
          ? 'w-4 h-4'
          : size === 'large'
            ? 'w-5 h-5'
            : 'w-[18px] h-[18px]'
      "
    />
    <span v-if="$slots.default">
      <slot />
    </span>
    <Icon
      v-if="iconRight && !loading"
      :name="`i-lucide-${iconRight}`"
      :class="
        size === 'compact'
          ? 'w-4 h-4'
          : size === 'large'
            ? 'w-5 h-5'
            : 'w-[18px] h-[18px]'
      "
    />
  </NuxtLink>
  <button
    v-else
    :type="type"
    class="inline-flex items-center justify-center gap-2 font-semibold tracking-wide rounded-[var(--radius-md)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
    :class="[sizeClasses[size], variantClasses[variant]]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <Icon
      v-if="loading"
      name="i-lucide-loader-2"
      class="animate-spin"
      :class="
        size === 'compact'
          ? 'w-4 h-4'
          : size === 'large'
            ? 'w-5 h-5'
            : 'w-[18px] h-[18px]'
      "
    />
    <Icon
      v-else-if="iconLeft"
      :name="`i-lucide-${iconLeft}`"
      :class="
        size === 'compact'
          ? 'w-4 h-4'
          : size === 'large'
            ? 'w-5 h-5'
            : 'w-[18px] h-[18px]'
      "
    />
    <span v-if="$slots.default">
      <slot />
    </span>
    <Icon
      v-if="iconRight && !loading"
      :name="`i-lucide-${iconRight}`"
      :class="
        size === 'compact'
          ? 'w-4 h-4'
          : size === 'large'
            ? 'w-5 h-5'
            : 'w-[18px] h-[18px]'
      "
    />
  </button>
</template>

<style scoped>
button:focus-visible,
a:focus-visible {
  box-shadow: var(--shadow-focus);
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

button:not(:disabled):active,
a:not(.pointer-events-none):active {
  transform: scale(0.98);
}
</style>
