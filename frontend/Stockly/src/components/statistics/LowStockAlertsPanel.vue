<template>
  <div class="bg-white rounded-xl border border-gray-200">
    <div class="flex items-center justify-between border-b border-gray-200 p-6 mb-6">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 text-red-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
            ></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <h2 class="text-lg font-semibold text-gray-800">Low Stock Products</h2>
      </div>
      <button class="text-sm text-purple-600 hover:text-purple-700 font-medium">View All</button>
    </div>
    <div v-if="products?.length <= 0" class="flex flex-col items-center justify-center py-16">
      <h3 class="text-lg font-semibold text-gray-900 mb-2">No low Stock Products</h3>
    </div>

    <div v-else class="space-y-3 px-6">
      <div
        v-for="(product, index) in products"
        :key="index"
        class="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors"
      >
        <!-- Product image -->
        <div
          class="w-20 h-20 rounded-xl overflow-hidden shadow-sm flex items-center justify-center"
        >
          <img
            v-if="product.Prod_image"
            :src="product.Prod_image"
            :alt="product.Prod_name"
            class="w-full h-full object-cover transition-transform duration-300 transform hover:scale-110"
          />
          <div
            v-else
            :class="`w-full h-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-600`"
          >
            {{ product.Prod_name[0] }}
          </div>
        </div>

        <!-- Product info -->
        <div class="flex-1 min-w-0">
          <h3 class="font-medium text-gray-800 text-sm truncate">{{ product.Prod_name }}</h3>
          <p class="text-xs text-gray-500">ID : {{ product.id }}</p>
        </div>

        <!-- Stock -->
        <div class="text-right">
          <p class="text-xs text-gray-400 mb-1">Instock</p>
          <p :class="`text-lg font-semibold ${getStockColor(product.quantity)}`">
            {{ product.quantity }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useStatisticsStore } from '@/stores/statisticStore'
import { useProductStore } from '@/stores/productOfflineStore'

const productStore = useProductStore()

const products = computed(() => productStore.lowProducts)

const getStockColor = (stock) => {
  if (stock < 10) return 'text-red-500'
  if (stock < 15) return 'text-orange-500'
  return 'text-yellow-600'
}

onMounted(async () => {
  productStore.fetchLowStockProducts()
})
</script>

<style scoped>
/* Add Tailwind CSS or custom styles */
</style>
