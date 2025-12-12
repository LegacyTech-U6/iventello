[file name]: StartsCards.vue [file content begin]
<template>
  <div
    :class="['p-4 rounded-xl border shadow-sm flex justify-between items-center', containerClass]"
  >
    <!-- Left: Icon and info -->
    <div>
      <div class="flex items-center gap-2">
        <div :class="['p-2 rounded-full text-white', color]">
          <component :is="icon" class="w-5 h-5" />
        </div>
        <div>
          <p class="text-xs text-gray-500">{{ title }}</p>
          <p class="text-xl font-bold mt-1">{{ valueDisplay }}</p>
        </div>
      </div>
      <p v-if="subtitle" class="text-xs text-gray-400 mt-1">{{ subtitle }}</p>
    </div>

    <!-- Right: Trend -->
    <div class="flex flex-col items-end">
      <span
        :class="trend >= 0 ? 'text-green-500' : 'text-red-500'"
        class="text-sm font-semibold flex items-center gap-1"
      >
        <span v-if="trend >= 0">⬆</span>
        <span v-else>⬇</span>
        {{ Math.abs(trend).toFixed(1) }}%
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  value: { type: [Number, String], required: true },
  trend: { type: Number, default: 0 },
  subtitle: { type: String, default: '' },
  icon: { type: [Object, Function], required: true },
  color: { type: String, default: 'bg-blue-500' },
  containerClass: { type: String, default: '' },
})

const valueDisplay = computed(() => {
  if (typeof props.value === 'number') {
    if (
      props.title.toLowerCase().includes('revenue') ||
      props.title.toLowerCase().includes('profit')
    ) {
      return '$' + props.value.toLocaleString()
    } else if (props.title.toLowerCase().includes('margin')) {
      return props.value + '%'
    } else {
      return props.value.toLocaleString()
    }
  }
  return props.value
})
</script>
[file content end]
