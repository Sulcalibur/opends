<template>
  <div class="empty-state">
    <div class="empty-icon" :style="{ '--icon-color': iconColor }">
      <slot name="icon">
        <i v-if="icon" :class="icon"/>
      </slot>
    </div>

    <div class="empty-content">
      <h3 v-if="title" class="empty-title">{{ title }}</h3>
      <p v-if="description" class="empty-description">{{ description }}</p>

      <div v-if="$slots.default" class="empty-message">
        <slot/>
      </div>

      <PremiumButton
        v-if="action"
        :variant="buttonVariant"
        :size="buttonSize"
        class="empty-action"
        @click="$emit('action')"
      >
        <template v-if="actionIcon" #icon>
          <i :class="actionIcon"/>
        </template>
        {{ action }}
      </PremiumButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import PremiumButton from "./PremiumButton.vue";

interface Props {
  icon?: string;
  title?: string;
  description?: string;
  action?: string;
  actionIcon?: string;
  buttonVariant?: "primary" | "secondary" | "ghost";
  buttonSize?: "sm" | "md" | "lg";
  iconColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  buttonVariant: "primary",
  buttonSize: "md",
  iconColor: "var(--color-text-400)",
});

const emit = defineEmits<{
  action: [];
}>();
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: var(--space-12) var(--space-6);
  animation: fade-up 0.6s var(--easing-out);
}

.empty-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto var(--space-6);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  background: linear-gradient(
    135deg,
    var(--icon-color) 0%,
    var(--color-primary-200) 100%
  );
  animation: float 3s ease-in-out infinite;
}

.empty-icon i {
  color: var(--color-text-primary);
}

.empty-content {
  max-width: 500px;
  margin: 0 auto;
}

.empty-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-3);
  animation: slide-up 0.5s var(--easing-out) 0.2s both;
}

.empty-description {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
  margin: 0 0 var(--space-6);
  animation: slide-up 0.5s var(--easing-out) 0.3s both;
}

.empty-message {
  margin: var(--space-6) 0 var(--space-8);
}

.empty-action {
  animation: bounce 1s var(--easing-bounce) 0.5s both;
}

/* Dark Mode */
.dark .empty-icon {
  background: linear-gradient(
    135deg,
    var(--dark-color-text-400) 0%,
    var(--dark-color-bg-200) 100%
  );
}

.dark .empty-title {
  color: var(--dark-color-text-primary);
}

.dark .empty-description {
  color: var(--dark-color-text-secondary);
}

/* Animations */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
  animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
}
</style>
