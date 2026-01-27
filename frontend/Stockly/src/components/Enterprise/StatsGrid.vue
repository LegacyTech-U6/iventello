<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
    <n-card v-for="(stat, idx) in stats" :key="idx"
      class="rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 bg-white"
      :content-style="{ padding: '1.25rem 1.5rem' }">
      <div class="flex items-center justify-between">
        <!-- Left section -->
        <div class="flex items-center gap-3">
          <div :class="[
            'w-12 h-12 flex items-center justify-center rounded-lg text-white shadow-sm',
            stat.bg,
          ]">
            <n-icon :size="22">
              <component :is="stat.icon" />
            </n-icon>
          </div>
          <div>
            <p class="text-gray-500 text-sm font-medium">{{ stat.label }}</p>
            <p class="text-2xl font-semibold text-gray-800">{{ stat.value }}</p>
          </div>
        </div>

        <!-- Tiny chart -->
        <svg class="w-20 h-10 opacity-70" viewBox="0 0 80 40">
          <defs>
            <linearGradient :id="`gradient-${idx}`" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color: #ff7b54; stop-opacity: 0.3" />
              <stop offset="100%" style="stop-color: #ff7b54; stop-opacity: 0" />
            </linearGradient>
          </defs>
          <polyline fill="none" stroke="#ff7b54" stroke-width="2.5" points="0,25 15,20 30,23 45,15 60,17 75,12"
            stroke-linecap="round" stroke-linejoin="round" />
          <polyline :fill="`url(#gradient-${idx})`" points="0,25 15,20 30,23 45,15 60,17 75,12 75,40 0,40" />
        </svg>
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { BuildingOfficeIcon, MapPinIcon } from '@heroicons/vue/24/outline'

defineProps({
  stats: {
    type: Array,
    required: true,
  },
})
</script>
