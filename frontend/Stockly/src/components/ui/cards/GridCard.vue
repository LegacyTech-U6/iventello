<template>
  <div class="rounded-xl p-5 text-white shadow-sm transition-transform duration-200 hover:scale-[1.02]"
    :class="isTailwind ? `bg-linear-to-br from-${gradientFrom} to-${gradientTo}` : ''" :style="!isTailwind
        ? { background: `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})` }
        : {}
      ">
    <div class="flex items-center justify-between mb-3">
      <span class="text-sm font-medium opacity-90">{{ title }}</span>
      <component :is="icon" class="w-5 h-5 opacity-80" />
    </div>

    <div class="flex items-end justify-between">
      <div class="text-3xl font-bold">
        {{ displayValue }}
      </div>
      <div v-if="trend !== null" class="flex items-center text-sm">
        <span :class="{
          'text-green-400': trend > 0,
          'text-red-400': trend < 0,
          'text-gray-300': trend === 0,
        }">
          <span v-if="trend > 0">▲</span>
          <span v-else-if="trend < 0">▼</span>
          {{ Math.abs(trend).toFixed(1) }}%
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCurrency } from '@/composable/useCurrency'

const { format } = useCurrency()

const props = defineProps({
  title: String,
  value: [String, Number],
  trend: { type: Number, default: null },
  icon: [Object, Function],
  gradientFrom: { type: String, default: 'blue-500' },
  gradientTo: { type: String, default: 'blue-600' },
  isCurrency: { type: Boolean, default: false }, // <-- ajout
})

const isTailwind = computed(
  () => props.gradientFrom.includes('-') && props.gradientTo.includes('-'),
)

// Computed pour gérer les nombres simples vs les montants en currency
const displayValue = computed(() => {
  if (props.value == null) return '-'
  return props.isCurrency ? format(Number(props.value)) : Number(props.value).toLocaleString('fr-FR')
})
</script>
