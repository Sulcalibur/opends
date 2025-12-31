<template>
  <div class="flex items-center gap-3 select-none">
    <div 
      class="logo-icon relative flex items-center justify-center"
      :class="[sizeClass]"
    >
      <svg 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        class="w-full h-full"
      >
        <rect width="40" height="40" rx="12" fill="url(#logo-gradient)" />
        <path d="M12 20C12 15.5817 15.5817 12 20 12H28V20C28 24.4183 24.4183 28 20 28H12V20Z" fill="white" fill-opacity="0.9"/>
        <circle cx="28" cy="12" r="4" fill="white" fill-opacity="0.3"/>
        <circle cx="12" cy="28" r="4" fill="white" fill-opacity="0.3"/>
        <defs>
          <linearGradient id="logo-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stop-color="var(--primary-color, #3b82f6)"/>
            <stop offset="1" stop-color="var(--primary-color-hover, #2563eb)"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
    <span 
      v-if="!iconOnly"
      class="font-bold tracking-tight text-slate-900 logo-text"
      :class="[textSizeClass]"
    >
      {{ text || 'OpenDS' }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md', // sm, md, lg, xl
    validator: (value: string) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  iconOnly: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: ''
  }
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'w-8 h-8'
    case 'md': return 'w-10 h-10'
    case 'lg': return 'w-12 h-12'
    case 'xl': return 'w-16 h-16'
    default: return 'w-10 h-10'
  }
})

const textSizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'text-lg'
    case 'md': return 'text-xl'
    case 'lg': return 'text-2xl'
    case 'xl': return 'text-3xl'
    default: return 'text-xl'
  }
})
</script>

<style scoped>
.logo-icon {
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.logo-icon:hover {
  transform: scale(1.05) rotate(-2deg);
}

[data-theme-preset="tech"] rect {
    rx: 0 !important;
}

[data-theme-preset="soft"] rect {
    rx: 20 !important;
}
</style>
