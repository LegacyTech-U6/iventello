<template>
  <div :class="[
    'bg-white border rounded-2xl p-5 transition-all duration-300 flex justify-between items-center',
    disabled ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-70' : 'border-gray-200'
  ]">
    <!-- Left section -->
    <div class="w-full">
      <div class="border-b border-gray-200 grid grid-cols-8 pb-3">
        <div class="col-span-7">
          <p class="text-2xl font-semibold text-gray-900" :style="isCurrency ? getDynamicStyle(Number(value)) : {}">{{
            displayValue }}</p>
          <p class="text-gray-500 text-sm">{{ label }}</p>
        </div>

        <!-- Right section (icon) -->
        <div class="w-12 h-12 flex items-center justify-center rounded-xl" :style="{
          backgroundColor: iconBg || (disabled ? '#F0F0F0' : '#E6F4F0'),
          color: iconColor || (disabled ? '#A0A0A0' : '#16a34a'),
        }">
          <component :is="icon" class="w-6 h-6" />
        </div>
      </div>

      <div class="flex items-center gap-2 mt-3">
        <span :class="trend >= 0 ? 'text-green-500' : 'text-red-600'" class="text-sm font-semibold">
          {{ trend >= 0 ? '+' : '' }}{{ formatedValue }}%
        </span>

        <span class="text-gray-400 text-sm">vs Last {{ period }}</span>
        <a v-if="viewLink && !disabled" :href="viewLink"
          class="ml-4 text-sm font-medium text-black underline hover:text-green-400">
          View All
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCurrency } from '@/composable/useCurrency'

const { format, getDynamicStyle } = useCurrency()
const props = defineProps({
  icon: [Object, Function],
  value: [String, Number],
  label: String,
  trend: Number,
  viewLink: String,
  iconBg: String,
  iconColor: String,
  period: String,
  isCurrency: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }, // <-- ajout
})

const formatedValue = computed(() => {
  return props.trend != null ? props.trend.toFixed(2) : '0.00'
})

const displayValue = computed(() => {
  if (props.value == null) return '-'
  return props.isCurrency
    ? format(Number(props.value))
    : Number(props.value).toLocaleString('fr-FR')
})
</script>
