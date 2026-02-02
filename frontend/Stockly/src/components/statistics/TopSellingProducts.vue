<template>
  <div class="bg-white rounded-xl border border-gray-200 h-full">
    <!-- Header -->
    <div class="flex items-center justify-between p-6 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-800">Best Seller</h2>
      <button class="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
        View All
      </button>
    </div>

    <!-- Carousel Section -->
    <div class="p-6">
      <n-carousel autoplay draggable :interval="3000" dot-type="line" class="h-full">
        <n-carousel-item v-for="(product, index) in products" :key="index">
          <div class="flex flex-col items-center justify-center p-4">
            <!-- Product Image -->
            <div class="w-32 h-32 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm mb-4">
              <img :src="product.image || `https://picsum.photos/seed/${product.id || index}/150`"
                :alt="product.name || 'Product'" class="w-full h-full object-cover" />
            </div>

            <!-- Product Info -->
            <div class="text-center w-full">
              <h3 class="font-bold text-gray-900 text-base mb-1 truncate px-4">
                {{ product.Prod_name || product.name }}
              </h3>

              <div class="flex items-center justify-center gap-2 mb-3">
                <p class="text-sm font-black text-primary uppercase tracking-widest"
                  :style="getDynamicStyle(product.selling_price)">
                  {{ format(product.selling_price) }}
                </p>
              </div>

              <!-- Sales Data -->
              <div
                class="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold ring-1 ring-green-600/20">
                <span>{{ product.total_sold }} Sales</span>
              </div>
            </div>
          </div>
        </n-carousel-item>
      </n-carousel>

      <!-- Empty State -->
      <div v-if="products.length === 0" class="text-center py-8 text-gray-400">
        No best sellers found
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useStatisticsStore } from '@/stores/statisticStore'
import { useCurrency } from '@/composable/useCurrency'
import { NCarousel, NCarouselItem } from 'naive-ui'

const { format, getDynamicStyle } = useCurrency()
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
:deep(.n-carousel .n-carousel__dots) {
  bottom: 0px;
}
</style>
