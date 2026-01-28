<template>
  <div class="bg-white rounded-xl border border-gray-200">
    <!-- Header -->
    <div class="flex items-center justify-between p-6 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-800">Best Seller</h2>
      <button class="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
        View All
      </button>
    </div>

    <!-- Filter Section -->

    <!-- Products List -->
    <div class="p-6 space-y-4">
      <div v-for="(product, index) in products" :key="index" class="flex items-center gap-4">
        <!-- Product Image -->
        <div class="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100">
          <img :src="product.image || `https://picsum.photos/seed/${product.id || index}/150`"
            :alt="product.name || 'No image'" class="w-full h-full object-cover" />
        </div>

        <!-- Product Info -->
        <div class="flex-1 min-w-0">
          <h3 class="font-bold text-gray-900 text-sm truncate mb-0.5">
            {{ product.Prod_name || product.name }}
          </h3>
          <p class="text-xs font-black text-primary uppercase tracking-widest">{{ format(product.selling_price) }}</p>
        </div>

        <!-- Sales Info -->
        <div class="text-right flex-shrink-0">
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Sales</p>
          <p class="font-bold text-gray-900 text-sm">{{ product.total_sold }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useStatisticsStore } from '@/stores/statisticStore'
import { useCurrency } from '@/composable/useCurrency'

const { format } = useCurrency()
const statisticStore = useStatisticsStore()
const selectedPeriod = ref('month')

const fetchData = async () => {
  await statisticStore.fetchBestSellingProduct(selectedPeriod.value)
}

onMounted(() => {
  fetchData()
})

const products = computed(() => statisticStore.bestSellingProduct?.products || [])
</script>

<style scoped>
/* Styles personnalisés si nécessaire */
</style>
