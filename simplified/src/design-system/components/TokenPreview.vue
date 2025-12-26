<template>
  <div class="flex items-center gap-2">
    <!-- Color preview -->
    <div
      v-if="token.category === 'color' || token.type === 'color'"
      class="w-6 h-6 rounded border border-gray-200 shadow-inner"
      :style="{ backgroundColor: token.value }"
    ></div>

    <!-- Border radius preview -->
    <div
      v-else-if="token.category === 'borderRadius' || token.type === 'borderRadius'"
      class="w-6 h-6 bg-indigo-500 rounded"
      :style="{ borderRadius: token.value }"
    ></div>

    <!-- Spacing preview -->
    <div
      v-else-if="token.category === 'spacing' || token.type === 'spacing'"
      class="h-2 bg-indigo-500 rounded"
      :style="{ width: token.value }"
    ></div>

    <!-- Typography preview -->
    <div
      v-else-if="token.category === 'typography' || token.type === 'typography' || token.type === 'fontSizes' || token.type === 'fontWeights'"
      class="text-xs font-bold text-indigo-600"
    >
      Aa
    </div>

    <!-- Default -->
    <div v-else class="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
      <i class="pi pi-tag text-xs text-gray-500"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { DesignToken } from '@/design-system/storage'

defineProps<{
  token: DesignToken
}>()
</script>