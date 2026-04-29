<script setup lang="ts">
interface Props {
  show?: boolean;
  message?: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  message: "",
  type: "info",
  duration: 4000,
});

const emit = defineEmits<{
  "update:show": [value: boolean];
  close: [];
}>();

const showModel = defineModel<boolean>("show", { default: false });

const iconMap = {
  success: "check-circle",
  error: "alert-circle",
  warning: "alert-triangle",
  info: "info",
};

const iconColorMap = {
  success: "text-[var(--color-success)]",
  error: "text-[var(--color-error)]",
  warning: "text-[var(--color-warning)]",
  info: "text-[var(--color-text-inverse)]",
};

let timer: ReturnType<typeof setTimeout> | null = null;

function clearDismissTimer() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

function startDismissTimer() {
  clearDismissTimer();
  if (props.duration > 0) {
    timer = setTimeout(() => {
      showModel.value = false;
      emit("close");
    }, props.duration);
  }
}

function handleClose() {
  clearDismissTimer();
  showModel.value = false;
  emit("close");
}

watch(
  () => showModel.value,
  (isShown) => {
    if (isShown) {
      startDismissTimer();
    } else {
      clearDismissTimer();
    }
  },
);

onUnmounted(() => {
  clearDismissTimer();
});
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-[var(--duration-structural)] ease-[var(--ease-out-quart)]"
    enter-from-class="translate-y-5 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition-all duration-[var(--duration-structural)] ease-[var(--ease-out-quart)]"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-5 opacity-0"
  >
    <div
      v-if="showModel"
      class="toast-container"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        class="bg-[var(--neutral-800)] text-[var(--color-text-inverse)] rounded-[var(--radius-md)] shadow-[var(--shadow-modal)] px-4 py-3 flex items-center gap-3"
      >
        <Icon
          :name="`i-lucide-${iconMap[type]}`"
          class="w-5 h-5 flex-shrink-0"
          :class="iconColorMap[type]"
        />
        <span
          class="text-sm font-medium font-[family-name:var(--font-body)] flex-1"
        >
          {{ message }}
        </span>
        <button
          class="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          @click="handleClose"
        >
          <Icon name="i-lucide-x" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </Transition>
</template>
