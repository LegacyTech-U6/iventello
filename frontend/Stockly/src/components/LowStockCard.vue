<!-- src/components/inventory/LowStockCard.vue -->
<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-2">
          <h3 class="text-lg font-semibold text-gray-900">{{ product.Prod_name }}</h3>
          <span
            v-if="product.stockLevel === 'critical'"
            class="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded"
          >
            CRITICAL
          </span>
          <span
            v-if="product.stockLevel === 'warning'"
            class="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded"
          >
            LOW STOCK
          </span>
        </div>
        <p class="text-sm text-gray-500">{{ product.category_name }}</p>
      </div>

      <div class="flex gap-2">
        <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </button>
        <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="space-y-4">
      <!-- Stock Progress Bar -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm text-gray-600">Current Stock</span>
          <span class="text-sm font-semibold text-gray-900">
            {{ product.quantity }} / {{ product.min_stock_level }}
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            :class="product.stockLevel === 'critical' ? 'bg-red-500' : 'bg-amber-500'"
            class="h-2 rounded-full transition-all"
            :style="{ width: Math.min(stockPercentage, 100) + '%' }"
          />
        </div>
      </div>

      <!-- Product Details -->
      <div class="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p class="text-gray-500 mb-1">SKU</p>
          <p class="text-gray-900 font-mono text-xs bg-gray-50 px-2 py-1 rounded inline-block">
            {{ product.code_bar }}
          </p>
        </div>
        <div>
          <p class="text-gray-500 mb-1">Supplier</p>
          <p class="text-gray-900">{{ product.supplier_name }}</p>
        </div>
        <div>
          <p class="text-gray-500 mb-1">Unit Price</p>
          <p class="text-gray-900 font-semibold">{{ format(product.cost_price) }}</p>
        </div>
        <div>
          <p class="text-gray-500 mb-1">Lead Time</p>
          <p class="text-gray-900">{{ product.leadTime }} days</p>
        </div>
      </div>

      <!-- Reorder Info -->
      <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm text-gray-600">Units Needed</span>
          <span class="text-sm font-semibold text-red-600">{{ unitsNeeded }} units</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">Est. Reorder Cost</span>
          <span class="text-lg font-bold text-gray-900">{{ format(reorderCost) }}</span>
        </div>
      </div>

      <div class="text-xs text-gray-500">Last sold: {{ formatDate(product.lastSold) }}</div>

      <!-- Action -->
      <button
        @click="$emit('restock', product)"
        class="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
        Order Now
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCurrency } from '@/composable/useCurrency'
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  reorderCost: Number,
})

const {format} = useCurrency()
const emit = defineEmits(['restock'])

const stockPercentage = computed(
  () => (props.product.quantity / props.product.min_stock_level) * 100,
)
const unitsNeeded = computed(() => props.product.min_stock_level - props.product.quantity)

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US')
}
</script>
