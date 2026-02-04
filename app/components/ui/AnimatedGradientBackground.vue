<template>
  <div class="animated-gradient-bg">
    <slot />
  </div>
</template>

<style scoped>
.animated-gradient-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.animated-gradient-bg::before {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--gradient-hero);
  opacity: 1;
  animation: gradient-shift 15s ease-in-out infinite alternate;
}

@keyframes gradient-shift {
  0%,
  100% {
    background-position: 0% 50%;
    opacity: 0.8;
  }
  50% {
    background-position: 100% 50%;
    opacity: 1;
  }
}
</style>
