<template>
  <div class="bg-white w-full rounded-lg shadow-sm p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
        <h2 class="text-lg font-semibold text-gray-800">Top Categories</h2>
      </div>

      <!-- Period Selector -->
      <div class="relative">
        <button
          @click="toggleDropdown"
          class="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {{ periodLabels[selectedPeriod] }}
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <!-- Dropdown -->
        <div
          v-if="showDropdown"
          class="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
        >
          <button
            v-for="period in periods"
            :key="period"
            @click="selectPeriod(period)"
            class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
            :class="{ 'bg-orange-50 text-orange-600': selectedPeriod === period }"
          >
            {{ periodLabels[period] }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
    </div>

    <!-- Content -->
    <div v-else-if="topCategories.length > 0" class="space-y-6">
      <!-- Donut Chart & Legend -->
      <div class="flex items-center justify-between gap-8">
        <!-- Donut Chart -->
        <div class="relative w-48 h-48">
          <svg viewBox="0 0 200 200" class="transform -rotate-90">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#f3f4f6" stroke-width="40" />
            <circle
              v-for="(segment, index) in chartSegments"
              :key="index"
              cx="100"
              cy="100"
              r="80"
              fill="none"
              :stroke="segment.color"
              stroke-width="40"
              :stroke-dasharray="`${segment.length} ${circumference}`"
              :stroke-dashoffset="-segment.offset"
              class="transition-all duration-500"
            />
          </svg>
        </div>

        <!-- Legend -->
        <div class="flex-1 space-y-4">
          <div
            v-for="(category, index) in topCategories"
            :key="category.category"
            class="flex items-center justify-between"
          >
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: colors[index] }"></div>
              <span class="text-sm text-gray-600">{{ category.category }}</span>
            </div>
            <div class="text-right">
              <div class="text-lg font-semibold text-gray-800">
                {{ category.total_revenue.toLocaleString() }}
              </div>
              <div class="text-xs text-gray-500">Sales</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Category Statistics -->
      <div class="pt-6 border-t border-gray-100">
        <h3 class="text-sm font-medium text-gray-700 mb-4">Category Statistics</h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-blue-900"></div>
              <span class="text-sm text-gray-600">Total Number Of Categories</span>
            </div>
            <span class="text-lg font-semibold text-gray-800">
              {{ topCategories.length }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-orange-500"></div>
              <span class="text-sm text-gray-600">Total Number Of Products</span>
            </div>
            <span class="text-lg font-semibold text-gray-800">
              {{ totalProducts }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <svg
        class="w-12 h-12 text-gray-300 mx-auto mb-3"
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
      <p class="text-gray-500 text-sm">No category data available</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useStatisticsStore } from '@/stores/statisticStore'

const statisticsStore = useStatisticsStore()

// State
const selectedPeriod = ref('week')
const showDropdown = ref(false)
const loading = ref(false)

// Period options
const periods = ['day', 'week', 'month', 'year']
const periodLabels = {
  day: 'Daily',
  week: 'Weekly',
  month: 'Monthly',
  year: 'Yearly',
}

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

// Methods
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const selectPeriod = async (period) => {
  selectedPeriod.value = period
  showDropdown.value = false
  await fetchData()
}

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

// Close dropdown when clicking outside
if (typeof window !== 'undefined') {
  window.addEventListener('click', (e) => {
    if (!e.target.closest('button')) {
      showDropdown.value = false
    }
  })
}
</script>
