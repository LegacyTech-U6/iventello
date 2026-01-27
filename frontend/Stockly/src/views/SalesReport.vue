<template>
  <div class="h-full bg-gray-50 p-6">
    <div class="max-w-8xl mx-auto">
      <!-- Header -->
      <div class="mb-6">

        <p class="text-gray-600 mt-1">View and analyze your daily sales performance</p>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-gray-700">Date:</label>
            <input type="date" v-model="selectedDate"
              class="border border-gray-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <button @click="filterByDate"
            class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
            Apply Filter
          </button>
          <button @click="resetFilter"
            class="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition">
            Reset
          </button>
          <div class="ml-auto text-sm text-gray-600">
            Total Reports: <span class="font-semibold">{{ activityStore.salesReport.count }}</span>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="loader"></div>
      </div>

      <!-- Reports Table -->
      <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div v-if="filteredReports.length === 0" class="text-center py-12">
          <DocumentMagnifyingGlassIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
          <p class="mt-1 text-sm text-gray-500">Try adjusting your filters</p>
        </div>

        <table v-else class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transactions
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items Sold
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Sales
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg Sale
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="report in filteredReports" :key="report.id" class="hover:bg-gray-50 transition cursor-pointer"
              @click="openDetail(report)">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ formatDisplayDate(report.date) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ report.transactions }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ report.total_items_sold }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-semibold text-green-600">
                  {{ format(report.total_sales) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ format(report.average_sale) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click.stop="openDetail(report)" class="text-blue-600 hover:text-blue-900">
                  View Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Summary Cards -->
      <div v-if="filteredReports.length > 0" class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div class="bg-white rounded-lg shadow-sm p-4">
          <p class="text-sm text-gray-600">Total Sales</p>
          <p class="text-2xl font-bold text-green-600 mt-1">{{ format(totalSales) }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm p-4">
          <p class="text-sm text-gray-600">Total Items Sold</p>
          <p class="text-2xl font-bold text-blue-600 mt-1">{{ totalItemsSold }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm p-4">
          <p class="text-sm text-gray-600">Total Transactions</p>
          <p class="text-2xl font-bold text-purple-600 mt-1">{{ totalTransactions }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm p-4">
          <p class="text-sm text-gray-600">Average per Day</p>
          <p class="text-2xl font-bold text-orange-600 mt-1">{{ format(averagePerDay) }}</p>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <SalesReportDetailModal v-if="selectedReport" :report="selectedReport" @close="selectedReport = null" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useActivityStore } from '@/stores/activityStore'
import SalesReportDetailModal from '@/components/reports/SalesReportDetailModal.vue'
import { useCurrency } from '@/composable/useCurrency'

const { format } = useCurrency()
const activityStore = useActivityStore()
const reports = ref([])
const filteredReports = ref([])
const selectedDate = ref('')
const selectedReport = ref(null)
const loading = ref(true)

const formatCurrency = (value) => {
  if (typeof value !== 'number') return value
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const totalSales = computed(() => {
  return filteredReports.value.reduce((sum, report) => sum + (report.total_sales || 0), 0)
})

const totalItemsSold = computed(() => {
  return filteredReports.value.reduce((sum, report) => sum + (report.total_items_sold || 0), 0)
})

const totalTransactions = computed(() => {
  return filteredReports.value.reduce((sum, report) => sum + (report.transactions || 0), 0)
})

const averagePerDay = computed(() => {
  return filteredReports.value.length > 0 ? totalSales.value / filteredReports.value.length : 0
})

onMounted(async () => {
  try {
    await activityStore.fetchSalesReports()
    // Handle the response structure: {count: 2, data: Array(2)}
    filteredReports.value = activityStore.salesReport.data
  } catch (err) {
    console.error('Error fetching sales reports:', err)
  } finally {
    loading.value = false
  }
})

const filterByDate = () => {
  if (selectedDate.value) {
    filteredReports.value = reports.value.filter((r) => r.date === selectedDate.value)
  }
}

const resetFilter = () => {
  filteredReports.value = reports.value
  selectedDate.value = ''
}

const openDetail = (report) => {
  selectedReport.value = report
}
</script>

<style scoped>
.loader {
  border: 6px solid #f3f3f3;
  border-top: 6px solid #3b82f6;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
