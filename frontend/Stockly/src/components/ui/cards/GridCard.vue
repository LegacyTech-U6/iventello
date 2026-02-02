<template>
  <n-card :bordered="false" class="rounded-xl shadow-sm transition-transform duration-200 hover:scale-[1.02] h-full"
    :class="[
      bgColor && !isHexOrRgb ? bgColor : (isTailwind ? `bg-gradient-to-br from-${gradientFrom} to-${gradientTo}` : ''),
      'text-white'
    ]" :style="cardStyle" content-style="padding: 1.25rem;">

    <div class="flex items-center justify-between mb-2">
      <span class="text-sm font-medium opacity-90">{{ title }}</span>
      <n-icon :component="icon" size="20" class="opacity-80" />
    </div>

    <div class="flex items-end justify-between mt-2">
      <div class="text-3xl font-bold">
        {{ displayValue }}
      </div>
      <div v-if="trend !== null"
        class="flex items-center text-sm font-bold bg-white/20 px-2 py-0.5 rounded-lg backdrop-blur-sm">
        <span :class="trend > 0 ? 'text-green-300' : (trend < 0 ? 'text-red-300' : 'text-gray-300')">
          {{ trend > 0 ? '▲' : (trend < 0 ? '▼' : '') }} {{ Math.abs(trend).toFixed(1) }}% </span>
      </div>
    </div>
  </n-card>
</template>

<script setup>
import { computed } from 'vue'
import { useCurrency } from '@/composable/useCurrency'
import { NCard, NIcon } from 'naive-ui'

const { format } = useCurrency()

const props = defineProps({
  title: String,
  value: [String, Number],
  trend: { type: Number, default: null },
  icon: [Object, Function],
  gradientFrom: { type: String, default: 'blue-500' },
  gradientTo: { type: String, default: 'blue-600' },
  isCurrency: { type: Boolean, default: false },
  bgColor: { type: String, default: '' },
})

const isTailwind = computed(
  () => props.gradientFrom.includes('-') && props.gradientTo.includes('-'),
)

const isHexOrRgb = computed(() => {
  if (!props.bgColor) return false
  return (
    props.bgColor.startsWith('#') ||
    props.bgColor.startsWith('rgb') ||
    props.bgColor.startsWith('hsl')
  )
})

const cardStyle = computed(() => {
  if (props.bgColor && isHexOrRgb.value) return { background: props.bgColor }
  if (!isTailwind.value) return { background: `linear-gradient(to bottom right, ${props.gradientFrom}, ${props.gradientTo})` }
  return {}
})

const displayValue = computed(() => {
  if (props.value == null) return '-'
  return props.isCurrency ? format(Number(props.value)) : Number(props.value).toLocaleString('fr-FR')
})
</script>

<style scoped>
:deep(.n-card__content) {
  color: white;
  padding: 1.25rem;
}
</style>
