<template>
  <div :class="[
    displayMode === 'grid'
      ? 'group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 overflow-hidden cursor-pointer'
      : 'group hover:bg-blue-50/50 transition-colors border-b border-gray-100 last:border-b-0 px-4 py-3 flex items-center gap-3 sm:gap-4 cursor-pointer'
  ]" @click="handleView">
    <template v-if="displayMode === 'grid'">
      <div class="relative aspect-[4/3] bg-gray-50 overflow-hidden">
        <img v-if="product.Prod_image" :src="product.Prod_image" :alt="product.Prod_name"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div v-else class="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
          <CubeIcon class="w-8 h-8" stroke-width="1.5" />
        </div>

        <div
          class="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div
            class="scale-90 group-hover:scale-100 transition-transform px-4 py-2 bg-white/90 backdrop-blur text-blue-600 font-bold rounded-xl shadow-lg flex items-center gap-2">
            <EyeIcon class="w-5 h-5" />
            Voir détails
          </div>
        </div>

        <div class="absolute top-2 left-2 px-2 py-1 text-[10px] font-bold rounded-lg shadow-sm backdrop-blur-md z-10"
          :class="stockBadgeClass">
          {{ stockStatus }}
        </div>
      </div>

      <div class="p-4 space-y-3">
        <h3
          class="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[2.5rem]">
          {{ product.Prod_name }}
        </h3>

        <div class="grid grid-cols-2 gap-2 py-2 border-y border-gray-50">
          <div>
            <p class="text-[10px] text-gray-400 uppercase tracking-tighter">Stock</p>
            <p class="text-xs font-bold text-gray-700">{{ product.quantity }} unités</p>
          </div>
          <div class="text-right">
            <p class="text-[10px] text-gray-400 uppercase tracking-tighter">Prix</p>
            <p class="text-xs font-bold text-blue-600">{{ format(product.selling_price) }}</p>
          </div>
        </div>

        <div class="space-y-1">
          <div class="flex justify-between text-[10px] font-medium text-gray-500">
            <span>{{ Math.round(quantityRatio * 100) }}% du max</span>
            <span :class="quantityBarColor.replace('bg-', 'text-')">{{ product.quantity }}</span>
          </div>
          <div class="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full transition-all duration-700" :class="quantityBarColor"
              :style="{ width: `${quantityRatio * 100}%` }"></div>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div
        class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-100">
        <img v-if="product.Prod_image" :src="product.Prod_image" class="w-full h-full object-cover" />
        <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
          <CubeIcon class="w-4 h-4" />
        </div>
      </div>

      <div class="flex-1 min-w-0">
        <p class="text-xs sm:text-sm font-bold text-gray-900 truncate group-hover:text-blue-600">
          {{ product.Prod_name }}
        </p>
        <p class="text-[10px] text-gray-400 sm:hidden">
          {{ product.category?.name || 'Sans catégorie' }}
        </p>
      </div>

      <div class="w-32 hidden sm:block">
        <span
          class="px-2 py-1 bg-gray-50 text-gray-600 rounded-md text-[10px] font-medium truncate inline-block max-w-full border border-gray-100">
          {{ product.category?.name || 'N/A' }}
        </span>
      </div>

      <div class="w-32 hidden md:block text-gray-400">
        <p class="text-[10px] font-mono truncate tracking-tighter">{{ product.code_bar }}</p>
      </div>

      <div class="w-16 sm:w-24 text-center">
        <span class="text-[10px] font-bold px-2.5 py-1 rounded-full inline-block" :class="stockBadgeClass">
          {{ product.quantity }}
        </span>
      </div>

      <div class="w-24 sm:w-32 text-right hidden sm:block">
        <p class="text-xs sm:text-sm font-medium text-gray-500">{{ format(product.cost_price) }}</p>
      </div>

      <div class="w-24 sm:w-32 text-right">
        <p class="text-xs sm:text-sm font-bold text-gray-900">{{ format(product.selling_price) }}</p>
      </div>

      <div class="w-8 sm:w-12 flex justify-end">
        <div class="p-2 text-gray-300 group-hover:text-blue-500 group-hover:bg-blue-50 rounded-xl transition-all">
          <ChevronRightIcon class="w-5 h-5" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { EyeIcon, CubeIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import { useCurrency } from '@/composable/useCurrency'

const { format } = useCurrency()

interface Product {
  id?: string | number
  Prod_name: string
  quantity: number
  min_stock_level?: number
  max_stock_level?: number
  cost_price: number
  selling_price: number
  category?: { id: number; name: string }
  code_bar: string
  Prod_image?: string
}

const props = defineProps<{ product: Product; displayMode?: 'grid' | 'list' }>()
const emit = defineEmits<{ view: [product: Product] }>()

// Calculs réactifs
const quantityRatio = computed(() => {
  const min = props.product.min_stock_level ?? 0
  const max = props.product.max_stock_level ?? (props.product.quantity > 100 ? props.product.quantity : 100)
  const qty = props.product.quantity
  return Math.min(Math.max((qty - min) / (max - min), 0), 1) || 0
})

const stockStatus = computed(() => {
  const qty = props.product.quantity
  if (qty <= 0) return 'Rupture'
  if (qty <= 10) return 'Faible'
  return 'En stock'
})

const stockBadgeClass = computed(() => {
  const qty = props.product.quantity
  if (qty <= 0) return 'bg-red-50 text-red-600 border border-red-100'
  if (qty <= 10) return 'bg-orange-50 text-orange-600 border border-orange-100'
  return 'bg-green-50 text-green-600 border border-green-100'
})

const quantityBarColor = computed(() => {
  const ratio = quantityRatio.value
  if (ratio < 0.2) return 'bg-red-500'
  if (ratio < 0.5) return 'bg-orange-500'
  return 'bg-green-500'
})

const handleView = () => {
  emit('view', props.product)
}
</script>