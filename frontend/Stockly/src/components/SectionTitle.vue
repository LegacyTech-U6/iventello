<template>
  <div class="flex justify-between items-center mb-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
        <div class="w-5 h-5 bg-gray-300 rounded"></div>
        {{ title }}
      </h2>
      <p class="text-sm text-gray-600">Performance overview and insights</p>
    </div>
    <div class="flex gap-3">
      <span class="text-sm text-gray-600">Last 30 days</span>
      <button class="text-sm font-medium text-gray-900 flex items-center gap-1 hover:text-gray-700">
        <ArrowDownTrayIcon class="w-4 h-4" /> Export
      </button>
    </div>
  </div>
</template>

<script setup>
import { ArrowDownTrayIcon } from '@heroicons/vue/24/outline'

defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>
