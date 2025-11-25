<template>
  <!-- Grid View Card -->
  <div
    v-if="displayMode === 'grid'"
    class="group sm:text-sm bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 w-full mx-auto transform scale-95"
  >
    <!-- Image Section -->
    <div class="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      <img
        v-if="product.Prod_image"
        :src="product.Prod_image"
        :alt="product.Prod_name"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <svg class="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      </div>

      <!-- Overlay on Hover -->
      <div
        class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
      >
        <button
          @click="handleView"
          class="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-gray-100"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          View Details
        </button>
      </div>

      <!-- Stock Badge -->
      <div class="absolute top-3 right-3">
        <span
          :class="stockBadgeClass"
          class="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm"
        >
          {{ stockStatus }}
        </span>
      </div>
    </div>

    <!-- Info Section -->
    <div class="p-5">
      <h3
        class="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors"
      >
        {{ product.Prod_name }}
      </h3>

      <div class="space-y-2 mb-4">
        <div class="flex items-center text-sm text-gray-600">
          <svg
            class="w-4 h-4 mr-2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
            />
          </svg>
          <span class="font-mono">{{ product.code_bar }}</span>
        </div>
        <div class="flex items-center text-sm text-gray-600">
          <svg
            class="w-4 h-4 mr-2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
          <span>{{ product.category.name }}</span>
        </div>
        <div class="flex items-center text-sm text-gray-600">
          <svg
            class="w-4 h-4 mr-2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <span class="font-semibold">{{ product.quantity }} units</span>
        </div>
      </div>

      <!-- Pricing -->
      <div class="flex items-center justify-between pt-4 border-t border-gray-100">
        <div>
          <div class="lg:text-xs text-sm text-gray-500 mb-1">Selling Price</div>
          <div class="lg:text-2xl text-sm font-bold text-gray-900">
          {{ format(product.selling_price)}}
          </div>
        </div>
        <div class="text-right">
          <div class="text-xs text-gray-500 mb-1">Cost</div>
          <div class="text-sm font-medium text-gray-600">
          {{ format(product.cost_price)}}
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- List View Row -->
  <div
    v-else
    class="bg-white hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
  >
    <div @click="handleView" class="px-6 py-4 flex items-center gap-4">
      <!-- Product Name -->
      <div class="flex-1 min-w-0">
        <button
          @click="handleView"
          class="text-left text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
        >
          {{ product.Prod_name }}
        </button>
      </div>
      <div class="w-36 hidden lg:block">
        <span
          class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
        >
          {{ formatDate(product.updatedAt) }}
        </span>
      </div>

      <!-- Category -->
      <div class="w-36 hidden lg:block">
        <span
          class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
        >
          {{ product.category.name }}
        </span>
      </div>

      <!-- Barcode -->
      <div class="w-32 hidden md:block">
        <span class="text-sm font-mono text-gray-600">{{ product.code_bar }}</span>
      </div>

      <!-- Quantity -->
      <div class="w-24 text-center hidden sm:block">
        <span
          :class="stockBadgeClass"
          class="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full"
        >
          {{ product.quantity }}
        </span>
      </div>

      <!-- Cost Price -->
      <div class="w-28 text-right hidden xl:block">
        <span class="text-sm text-gray-600">
          {{ format(product.cost_price) }}
        </span>
      </div>

      <!-- Selling Price -->
      <div class="w-32 text-right">
        <span class="text-sm font-bold text-gray-900">
          {{ format(product.selling_price)}}
        </span>
      </div>

      <!-- Action -->
      <div class="w-10">
        <button
          @click="handleView"
          class="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCurrency } from '@/composable/useCurrency'
const {format} = useCurrency()
interface Product {
  id?: string | number
  Prod_name: string
  quantity: string | number
  cost_price: string | number
  selling_price: string | number
  category: {
    id: number
    name: string
  }
  Prod_Description: string
  code_bar: string
  date_of_arrival: string
  supplier: string
  Prod_image?: string
  updatedAt?: string
}

const props = defineProps<{
  product: Product
  displayMode?: 'grid' | 'list'
}>()

const emit = defineEmits<{
  view: [product: Product]
}>()

const quantityNum = computed(() => {
  return typeof props.product.quantity === 'string'
    ? parseInt(props.product.quantity)
    : props.product.quantity
})

const stockStatus = computed(() => {
  const qty = quantityNum.value
  if (qty === 0) return 'Out of Stock'
  if (qty <= 10) return 'Low Stock'
  return 'In Stock'
})

const stockBadgeClass = computed(() => {
  const qty = quantityNum.value

  if (qty === 0) {
    return 'bg-red-100 text-red-700 border border-red-200'
  }
  if (qty <= 10) {
    return 'bg-amber-100 text-amber-700 border border-amber-200'
  }
  return 'bg-emerald-100 text-emerald-700 border border-emerald-200'
})

const handleView = () => {
  emit('view', props.product)
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
