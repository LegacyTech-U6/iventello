// ProductSelector.vue const ProductSelector = `
<template>
  <div class="product-selector bg-gray-50 min-h-screen p-6">
    <!-- Header -->
  

    <!-- Search and Filters -->
    <div class="flex gap-3 mb-6">
      <div class="relative flex-1">
        <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          v-model="search"
          placeholder="Search Product"
          class="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
        />
      </div>
    </div>

    <!-- Products Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
        @add="() => emit('add-to-sale', product)"
      />
    </div>

    <!-- Empty State -->
    <div v-if="filteredProducts.length === 0" class="text-center py-16">
      <div class="w-20 h-20 rounded-3xl bg-white flex items-center justify-center mx-auto mb-4">
        <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <p class="text-base font-semibold text-gray-900 mb-1">No products found</p>
      <p class="text-sm text-gray-500">Try adjusting your search</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ProductCard from './ProductCard.vue'

const props = defineProps({
  products: Array,
})

const emit = defineEmits(['add-to-sale'])
const search = ref('')

const filteredProducts = computed(() =>
  props.products.filter((p) => p.Prod_name.toLowerCase().includes(search.value.toLowerCase())),
)
</script>
