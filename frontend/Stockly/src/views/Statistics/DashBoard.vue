[file name]: DashBoard.vue [file content begin]
<template>
  <div class="px-10">
    <div v-if="loadingClients">
      <LazyLoader :loading="loadingClients" :skeleton-count="6">
        <template #icon>
          <n-spin size="40" />
        </template>
        <template #message>
          <p class="text-lg font-semibold text-gray-800">Loading clients...</p>
        </template>
      </LazyLoader>
    </div>
    <div v-else>
      <div class="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- 🔹 Loop through stats array -->
        <GridCard
          v-for="stat in topStats"
          :key="stat.id"
          :title="stat.label"
          :value="stat.value"
          :icon="stat.icon"
          :gradientFrom="stat.gradientFrom"
          :gradientTo="stat.gradientTo"
          :trend="stat.trend"
        />
      </div>

      <div>
        <div class="grid grid-cols-4 gap-4 p-4">
          <div class="col-span-3 bg-white rounded-xl border-2 border-gray-300 p-10">
            <!-- <SalesPerformanceChart /> -->
            <SalesChart />
          </div>
          <div class="p-5 bg-white rounded-xl border-2 border-gray-300">
            <RevenueCatgeory />
          </div>
        </div>
        <!-- Sales Chart -->

        <TopSellingProducts />
        <ChartRevenue />
      </div>
    </div>
  </div>
</template>

<script setup >
import LazyLoader from '@/components/ui/LazyLoader.vue'
import { ref, computed, onMounted } from 'vue'

import { useStatisticsStore } from '@/stores/statisticStore'
import SalesPerformanceChart from '@/components/statistics/SalesPerformanceChart.vue'
import RevenueCatgeory from '@/components/statistics/RevenueCatgeory.vue'
import TopSellingProducts from '@/components/statistics/TopSellingProducts.vue'
import ChartRevenue from '@/components/statistics/ChartRevenue.vue'
import SalesChart from '@/components/ui/charts/SalesChart.vue'
import GridCard from '@/components/ui/cards/GridCard.vue'
import { useProductStore } from '@/stores/productOfflineStore'
import {
  Package,
  DollarSign,
  Users,
  PieChart,
  Clock,
  Tag,
  Layers,
  RotateCcw,
  Wallet,
} from 'lucide-vue-next'
const productStore = useProductStore()

// 🔹 Store
const statsStore = useStatisticsStore()

// 🔹 Reactive stats
const totalSales = ref(0)
const avgRevenue = ref(0)
const profit = ref(0)
const margin = ref(0)
const loadingClients = ref(true)
// 🔹 Trend percentages from backend
const revenueTrendPercent = ref(0)
const profitTrendPercent = ref(0)
const salesTrendPercent = ref(0)

// 🔹 Fetch stats from backend
onMounted(async () => {
  loadingClients.value = true
  await statsStore.fetchProductSales('day')

  await statsStore.fetchSalesReport('month')
  await statsStore.fetchRevenue('day')
  await statsStore.fetchProfit('day')
  loadingClients.value = false
})
const totalProductsValue = computed(() =>
  productStore.products.reduce((sum, product) => {
    const productTotal = product.selling_price * (product.quantity ?? 1)
    return sum + productTotal
  }, 0),
)
const topStats = computed(() => [
  {
    id: 1,
    icon: Users,
    label: 'Total products',
    value: productStore.totalProducts,
    subtext: 'Under this enterprise',
    gradientFrom: '#0E9384',
    gradientTo: '#0E9384',
  },
  {
    id: 2,
    icon: Package,
    label: 'Total Products Value',
    value: totalProductsValue,
    gradientFrom: '#FE9F43',
    gradientTo: '#FE9F43',
  },
  {
    id: 3,
    icon: DollarSign,
    label: 'Total Sales',
    value:statsStore.topProducts.sales?.total,

    trend: statsStore.topProducts.sales?.history.at(-1)?.growth_percent,
    gradientFrom: '#092C4C',
    gradientTo: '#092C4C',
  },
  {
    id: 4,
    icon: DollarSign,
    label: 'Total Purchase',
    value: avgRevenue.value,
    gradientFrom: '#155EEF',
    gradientTo: '#155EEF',
    trendPercentage: revenueTrendPercent.value,
  },
])
</script>
