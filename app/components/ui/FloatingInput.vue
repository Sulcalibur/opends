<template>
  <div
    class="floating-input"
    :class="{
      'is-focused': isFocused,
      'has-value': hasValue,
      'has-error': !!error,
      'has-icon': !!icon,
    }"
  >
    <div v-if="icon" class="input-icon">
      <i :class="['pi', icon]" aria-hidden="true" />
    </div>

    <input
      :id="id"
      ref="inputRef"
      v-model="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :autocomplete="autocomplete"
      :required="required"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${id}-error` : undefined"
      class="input-field"
      @focus="handleFocus"
      @blur="handleBlur"
    >
    <label v-if="label" :for="id" class="floating-label">
      {{ label }}
    </label>

    <div
      v-if="error"
      :id="`${id}-error`"
      class="error-message"
      role="alert"
    >
      {{ error }}
    </div>

    <div
      v-if="showCharacterCount && maxLength"
      class="char-count"
      aria-hidden="true"
    >
      {{ characterCount }} / {{ maxLength }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string | number;
  label?: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  id: string; // Made required for accessibility
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  maxLength?: number;
  showCharacterCount?: boolean;
  autocomplete?: string;
  icon?: string;
  required?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  placeholder: " ", // Space to ensure placeholder-shown works if needed, though we use JS logic
  disabled: false,
  showCharacterCount: false,
  autocomplete: "off",
  required: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: string | number];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();

const isFocused = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const hasValue = computed(
  () =>
    props.modelValue !== "" &&
    props.modelValue !== null &&
    props.modelValue !== undefined,
);

const characterCount = computed(() => String(props.modelValue).length);

function handleFocus(event: FocusEvent) {
  isFocused.value = true;
  emit("focus", event);
}

function handleBlur(event: FocusEvent) {
  isFocused.value = false;
  emit("blur", event);
}
</script>

<style scoped>
.floating-input {
  position: relative;
  margin-bottom: var(--space-4);
  isolation: isolate;
}

.floating-input .input-field {
  width: 100%;
  padding: var(--space-3) var(--space-3);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  color: var(--color-text-primary);
  background-color: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

/* Adjust padding when icon is present */
.floating-input.has-icon .input-field {
  padding-left: var(--space-10);
}

.floating-input .input-icon {
  position: absolute;
  left: var(--space-3);
  top: 14px; /* Align with input text visually */
  color: var(--color-text-400);
  pointer-events: none;
  z-index: 2;
  font-size: 1.25rem;
  transition: color var(--transition-base);
}

.floating-input.is-focused .input-icon {
  color: var(--color-primary-500);
}

.floating-input .input-field::placeholder {
  color: transparent;
}

.floating-input .input-field:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow:
    0 0 0 2px var(--color-bg-primary),
    0 0 0 4px var(--color-primary-500);
}

.floating-input .floating-label {
  position: absolute;
  left: var(--space-3);
  top: 14px; /* Align with input text visually */
  font-size: var(--font-size-base);
  color: var(--color-text-400);
  pointer-events: none;
  transition: all 0.2s var(--easing-out);
  background: transparent; /* Changed from opaque to handle overlap better */
  padding: 0 var(--space-1);
  white-space: nowrap;
  transform-origin: left top;
  z-index: 1;
}

.floating-input.has-icon .floating-label {
  left: var(--space-10);
}

/* Floating Label Animation */
.floating-input.is-focused .floating-label,
.floating-input.has-value .floating-label {
  top: -10px;
  left: var(--space-2); /* Move label to start regardless of icon */
  transform: scale(0.85);
  font-size: var(--font-size-sm);
  color: var(--color-primary-500);
  background: var(--color-bg-primary); /* Add background only when floating to cover border */
  padding: 0 var(--space-1);
}

/* High contrast for accessibility */
.floating-input.has-error .input-field {
  border-color: var(--color-error-600); /* Darker for contrast */
  box-shadow: 0 0 0 1px var(--color-error-600);
}

.floating-input.has-error .input-field:focus {
  box-shadow:
    0 0 0 2px var(--color-bg-primary),
    0 0 0 4px var(--color-error-600);
}

.floating-input.has-error .floating-label {
  color: var(--color-error-600);
}

.floating-input .error-message {
  margin-top: var(--space-1);
  font-size: var(--font-size-sm);
  color: var(--color-error-600);
  font-weight: var(--font-weight-medium); /* Ensure readability */
  animation: slide-down 0.3s var(--easing-out);
}

.floating-input .char-count {
  position: absolute;
  right: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  font-size: var(--font-size-xs);
  color: var(--color-text-500); /* Darker for contrast */
  pointer-events: none;
}

/* Disabled State */
.floating-input .input-field:disabled {
  opacity: 1; /* Keep opacity 1 for text readability */
  background-color: var(--color-bg-200);
  color: var(--color-text-500);
  cursor: not-allowed;
  border-color: var(--color-border-dark);
}

.floating-input .input-field:disabled + .floating-label {
  color: var(--color-text-500);
}

/* Dark Mode overrides */
.dark .floating-input .input-field {
  background-color: var(--dark-color-bg-100);
  border-color: var(--dark-color-border);
  color: var(--dark-color-text-primary);
}

.dark .floating-input.is-focused .floating-label,
.dark .floating-input.has-value .floating-label {
   background: var(--dark-color-bg-900); /* Match card background */
}

.dark .floating-input .input-field:focus {
  border-color: var(--color-primary-400);
  box-shadow:
    0 0 0 2px var(--dark-color-bg-900),
    0 0 0 4px var(--color-primary-400);
}

.dark .floating-input .error-message {
  color: var(--color-error-400);
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
