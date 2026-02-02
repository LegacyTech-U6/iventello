<template>
  <n-card class="bg-white dark:bg-gray-800 w-full rounded-lg shadow-sm" :bordered="false"
    content-style="padding: 1.5rem;">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Top Categories</h2>
      </div>

      <!-- Period Selector -->
      <div class="w-32">
        <n-select v-model:value="selectedPeriod" :options="periodOptions" size="small" @update:value="fetchData" />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <n-spin size="medium" />
    </div>

    <!-- Content -->
    <div v-else-if="topCategories.length > 0" class="space-y-6">
      <!-- Donut Chart & Legend -->
      <div class="flex items-center justify-between gap-8">
        <!-- Donut Chart -->
        <div class="relative w-48 h-48">
          <svg viewBox="0 0 200 200" class="transform -rotate-90">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#f3f4f6" stroke-width="40"
              class="dark:stroke-gray-700" />
            <circle v-for="(segment, index) in chartSegments" :key="index" cx="100" cy="100" r="80" fill="none"
              :stroke="segment.color" stroke-width="40" :stroke-dasharray="`${segment.length} ${circumference}`"
              :stroke-dashoffset="-segment.offset" class="transition-all duration-500" />
          </svg>
        </div>

        <!-- Legend -->
        <div class="flex-1 space-y-4">
          <div v-for="(category, index) in topCategories" :key="category.category"
            class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: colors[index] }"></div>
              <span class="text-sm text-gray-600 dark:text-gray-300">{{ category.category }}</span>
            </div>
            <div class="text-right">
              <div class="text-sm font-semibold text-gray-800 dark:text-gray-100"
                :style="getDynamicStyle(category.total_revenue)">
                {{ format(category.total_revenue) }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Sales</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Category Statistics -->
      <div class="pt-6 border-t border-gray-100 dark:border-gray-700">
        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Category Statistics</h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-blue-900"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400">Total Number Of Categories</span>
            </div>
            <span class="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {{ topCategories.length }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-orange-500"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400">Total Number Of Products</span>
            </div>
            <span class="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {{ totalProducts }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <n-empty v-else description="No category data available" class="py-12" />
  </n-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStatisticsStore } from '@/stores/statisticStore'
import { useCurrency } from '@/composable/useCurrency'
import { NCard, NSelect, NSpin, NEmpty } from 'naive-ui'

const { format, getDynamicStyle } = useCurrency()

const statisticsStore = useStatisticsStore()

// State
const selectedPeriod = ref('week')
const loading = ref(false)

// Period options
const periods = ['day', 'week', 'month', 'year']
const periodLabels = {
  day: 'Daily',
  week: 'Weekly',
  month: 'Monthly',
  year: 'Yearly',
}
const periodOptions = periods.map(p => ({ label: periodLabels[p], value: p }))

// Colors for the donut chart
const colors = [
  '#1e3a5f', // Dark blue for first category
  '#f97316', // Orange for second category
  '#fb923c', // Light orange for third category
  '#fdba74', // Lighter orange for fourth category
  '#fed7aa', // Lightest orange for fifth category
]

// Computed properties
const topCategories = computed(() => {
  return statisticsStore.revenueByCategory?.slice(0, 5) || []
})

const totalProducts = computed(() => {
  return topCategories.value.reduce((sum, cat) => sum + (cat.product_count || 0), 0)
})

const totalRevenue = computed(() => {
  return topCategories.value.reduce((sum, cat) => sum + cat.total_revenue, 0)
})

const circumference = computed(() => 2 * Math.PI * 80)

const chartSegments = computed(() => {
  const total = totalRevenue.value
  let currentOffset = 0

  return topCategories.value.map((category, index) => {
    const percentage = category.total_revenue / total
    const length = circumference.value * percentage
    const segment = {
      length,
      offset: currentOffset,
      color: colors[index],
    }
    currentOffset += length
    return segment
  })
})

const fetchData = async () => {
  loading.value = true
  try {
    await statisticsStore.fetchRevenueByCategory(selectedPeriod.value)
  } catch (error) {
    console.error('Error fetching revenue by category:', error)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchData()
})
</script>
