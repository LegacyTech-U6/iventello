<template>
  <div class="bg-white rounded-xl border border-gray-200 flex flex-col h-full">
    <div class="flex items-center justify-between border-b border-gray-200 p-4 sm:p-6">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 sm:w-10 sm:h-10 bg-red-50 rounded-lg sm:rounded-xl flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-5 sm:h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <h2 class="text-sm sm:text-lg font-semibold text-gray-800">Low Stock</h2>
      </div>
      <button class="text-xs sm:text-sm text-purple-600 hover:text-purple-700 font-medium">Voir tout</button>
    </div>

    <div v-if="!products || products.length === 0" class="flex flex-col items-center justify-center py-10 px-4 text-center">
      <div class="text-gray-400 mb-2">📦</div>
      <h3 class="text-sm font-medium text-gray-500">No low stock products</h3>
    </div>

    <div v-else class="flex-1 overflow-y-auto max-h-[400px] custom-scrollbar">
      <div class="divide-y divide-gray-100 px-4 sm:px-6">
        <div
          v-for="(product, index) in products"
          :key="product.id || index"
          class="flex items-center gap-3 sm:gap-4 py-4 hover:bg-gray-50/50 transition-colors"
        >
          <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100">
            <img
              v-if="product.Prod_image"
              :src="sanitizeUrl(product.Prod_image)"
              :alt="product.Prod_name"
              class="w-full h-full object-cover"
              @error="(e) => e.target.src = '/placeholder-product.png'"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400 uppercase">
              {{ product.Prod_name ? product.Prod_name.charAt(0) : '?' }}
            </div>
          </div>

          <div class="flex-1 min-w-0">
            <h3 class="font-medium text-gray-900 text-xs sm:text-sm truncate">
              {{ product.Prod_name || 'Produit sans nom' }}
            </h3>
            <p class="text-[10px] sm:text-xs text-gray-400 truncate">ID: #{{ product.id }}</p>
          </div>

          <div class="text-right flex-shrink-0">
            <p class="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Stock</p>
            <span :class="['px-2 py-1 rounded-full text-xs font-bold', getStockBadgeClass(product.quantity)]">
              {{ product.quantity }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useProductStore } from '@/stores/productStore'

const productStore = useProductStore()
const products = computed(() => productStore.lowProducts || [])

// Correction de l'URL pour éviter les doublons de domaine
const sanitizeUrl = (url) => {
  if (!url) return null;
  // Si l'URL contient deux fois http, on nettoie
  if (url.includes('https://') && url.lastIndexOf('https://') > 0) {
    return url.substring(url.lastIndexOf('https://'));
  }
  return url;
}

const getStockBadgeClass = (stock) => {
  if (stock <= 0) return 'bg-red-100 text-red-600'
  if (stock < 10) return 'bg-orange-100 text-orange-600'
  return 'bg-yellow-100 text-yellow-700'
}
</script>