<template>
  <Transition name="toast" appear>
    <div
      v-if="visible"
      class="toast"
      :class="[`toast-${type}`, { 'is-persistent': persistent }]"
      @click="handleClick"
    >
      <div class="toast-icon">
        <i v-if="icon" :class="icon"/>
      </div>

      <div class="toast-content">
        <h4 v-if="title" class="toast-title">{{ title }}</h4>
        <p class="toast-message">{{ message }}</p>
      </div>

      <button
        v-if="!persistent"
        class="toast-close"
        :aria-label="'Close notification'"
        @click.stop="dismiss"
      >
        <i class="pi pi-times"/>
      </button>

      <div v-if="showProgress && progress" class="toast-progress">
        <div
          class="toast-progress-bar"
          :style="{ width: `${progress}%` }"
        />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

interface Props {
  type?: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  icon?: string;
  duration?: number;
  persistent?: boolean;
  showProgress?: boolean;
  progress?: number;
}

const props = withDefaults(defineProps<Props>(), {
  type: "info",
  duration: 5000,
  persistent: false,
  showProgress: false,
});

const emit = defineEmits<{
  close: [];
  click: [];
}>();

const visible = ref(true);

const icons = {
  success: "pi pi-check-circle",
  error: "pi pi-times-circle",
  warning: "pi pi-exclamation-triangle",
  info: "pi pi-info-circle",
};

const icon = computed(
  () => props.icon || icons[props.type as keyof typeof icons],
);

let timeoutId: number | null = null;

onMounted(() => {
  if (!props.persistent && props.duration > 0) {
    timeoutId = window.setTimeout(() => {
      dismiss();
    }, props.duration);
  }
});

function dismiss() {
  visible.value = false;
  emit("close");

  if (timeoutId !== null) {
    clearTimeout(timeoutId);
  }
}

function handleClick() {
  emit("click");
}
</script>

<style scoped>
.toast {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--color-border);
  margin-bottom: var(--space-4);
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.toast:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-2xl);
}

/* Types */
.toast-success {
  border-left: 4px solid var(--color-success-500);
}

.toast-success .toast-icon {
  color: var(--color-success-500);
}

.toast-error {
  border-left: 4px solid var(--color-error-500);
}

.toast-error .toast-icon {
  color: var(--color-error-500);
}

.toast-warning {
  border-left: 4px solid var(--color-warning-500);
}

.toast-warning .toast-icon {
  color: var(--color-warning-500);
}

.toast-info {
  border-left: 4px solid var(--color-info-500);
}

.toast-info .toast-icon {
  color: var(--color-info-500);
}

.toast-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-1);
  line-height: var(--line-height-tight);
}

.toast-message {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
  margin: 0;
}

.toast-close {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--color-text-400);
  cursor: pointer;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  padding: 0;
}

.toast-close:hover {
  background: var(--color-bg-200);
  color: var(--color-text-primary);
}

.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--color-bg-200);
}

.toast-progress-bar {
  height: 100%;
  background: var(--color-primary-500);
  transition: width var(--transition-slow);
}

.is-persistent {
  cursor: default;
}

.is-persistent:hover {
  transform: none;
}

/* Dark Mode */
.dark .toast {
  background: var(--dark-color-surface);
  border-color: var(--dark-color-border);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
}

.dark .toast-success {
  border-left-color: var(--color-success-400);
}

.dark .toast-error {
  border-left-color: var(--color-error-400);
}

.dark .toast-warning {
  border-left-color: var(--color-warning-400);
}

.dark .toast-info {
  border-left-color: var(--color-info-400);
}

.dark .toast-title {
  color: var(--dark-color-text-primary);
}

.dark .toast-message {
  color: var(--dark-color-text-secondary);
}

.dark .toast-close {
  color: var(--dark-color-text-400);
}

.dark .toast-close:hover {
  background: var(--dark-color-bg-200);
  color: var(--dark-color-text-primary);
}

.dark .toast-progress {
  background: var(--dark-color-bg-200);
}

.dark .toast-progress-bar {
  background: var(--color-primary-400);
}

/* Transitions */
.toast-enter-active {
  transition: all 0.3s var(--easing-out);
}

.toast-leave-active {
  transition: all 0.3s var(--easing-in);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-enter-to,
.toast-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
