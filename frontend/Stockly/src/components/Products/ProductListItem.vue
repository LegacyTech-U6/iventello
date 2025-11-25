<template>
  <div :class="displayMode === 'grid' ? 'bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-gray-200 overflow-hidden' : 'bg-white hover:bg-gray-50 transition-colors border-b border-gray-100 px-6 py-4 flex items-center gap-4'" @click="handleView">
    
    <!-- GRID VIEW -->
    <template v-if="displayMode === 'grid'">
      <div class="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100">
        <img v-if="product.Prod_image" :src="product.Prod_image" :alt="product.Prod_name" class="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
        <div v-else class="w-full h-full flex items-center justify-center">
          <svg class="w-8 h-8 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>

        <div class="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <button class="px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 flex items-center gap-2">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Voir le produit
          </button>
        </div>

        <div class="absolute top-3 right-3 px-3 py-1.5 text-xs font-semibold rounded-full shadow backdrop-blur-sm" :class="stockBadgeClass">
          {{ stockStatus }}
        </div>
      </div>

      <div class="p-4 space-y-2">
        <h3 class="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">{{ product.Prod_name }}</h3>

        <div class="text-sm text-gray-600 space-y-1">
          <p><strong>Code:</strong> {{ product.code_bar }}</p>
          <p><strong>Catégorie:</strong> {{ product.category.name }}</p>
          <p><strong>Quantité:</strong> {{ product.quantity }} unités</p>
        </div>

        <!-- Stock Progress Bar -->
        <div class="mt-2">
          <div class="flex justify-between text-xs text-gray-500 mb-1">
            <span>{{ product.quantity }} / {{ product.max_stock_level }}</span>
            <span>{{ Math.round(quantityRatio * 100) }}%</span>
          </div>
          <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div class="h-full transition-all duration-500" :class="quantityBarColor" :style="{ width: `${Math.round(quantityRatio * 100)}%` }"></div>
          </div>
        </div>

        <div class="flex justify-between items-center pt-4 border-t border-gray-100">
          <div>
            <small class="text-gray-500">Prix de vente</small>
            <div class="text-lg font-bold text-gray-900">{{ format(product.selling_price) }}</div>
          </div>
          <div>
            <small class="text-gray-500">Coût</small>
            <div class="text-sm font-medium text-gray-600">{{ format(product.cost_price) }}</div>
          </div>
        </div>
      </div>
    </template>

    <!-- LIST VIEW -->
    <template v-else>
      <div class="flex-1 text-sm font-medium text-gray-700">{{ product.Prod_name }}</div>
      <div class="w-32 text-sm text-gray-600">{{ product.category.name }}</div>
      <div class="w-32 text-sm font-mono text-gray-600">{{ product.code_bar }}</div>
      <div class="w-24 text-xs font-semibold px-2.5 py-1 rounded-full text-center" :class="stockBadgeClass">{{ product.quantity }}</div>
      <div class="w-28 text-sm text-right text-gray-600">{{ format(product.cost_price) }}</div>
      <div class="w-32 text-sm font-bold text-right text-gray-900">{{ format(product.selling_price) }}</div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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
  category: { id: number; name: string }
  Prod_Description: string
  code_bar: string
  date_of_arrival: string
  supplier: string
  Prod_image?: string
  updatedAt?: string
}

const props = defineProps<{ product: Product; displayMode?: 'grid' | 'list' }>()
const emit = defineEmits<{ view: [product: Product] }>()

const quantityNum = computed(() => props.product.quantity)
const quantityRatio = computed(() => {
  const min = props.product.min_stock_level ?? 0
  const max = props.product.max_stock_level ?? 1000
  return Math.min(Math.max((quantityNum.value - min) / (max - min), 0), 1)
})

const stockStatus = computed(() => {
  const qty = quantityNum.value
  if (qty === 0) return 'Rupture'
  if (qty <= 10) return 'Stock faible'
  return 'En stock'
})

const stockBadgeClass = computed(() => {
  const qty = quantityNum.value
  if (qty === 0) return 'bg-red-100 text-red-700 border border-red-200'
  if (qty <= 10) return 'bg-yellow-100 text-yellow-700 border border-yellow-200'
  return 'bg-green-100 text-green-700 border border-green-200'
})

const quantityBarColor = computed(() => {
  const ratio = quantityRatio.value
  if (ratio < 0.3) return 'bg-red-400'
  if (ratio < 0.7) return 'bg-yellow-400'
  return 'bg-green-500'
})

const handleView = () => emit('view', props.product)
</script>

<style scoped>
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
