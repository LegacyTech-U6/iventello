<template>
  <div class="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4" @click.self="$emit('close')">
    <div class="bg-white w-full max-w-6xl rounded-xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
      <!-- Header -->
      <div class="bg-gradient-to-r from-[#004E5B] to-[#006879] px-6 py-4 flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-white">Sales Report Details</h2>
          <p class="text-blue-100 text-sm mt-1">{{ formatDisplayDate(report.date) }}</p>
        </div>
        <button @click="$emit('close')" class="text-white hover:bg-white/20 rounded-lg p-2 transition">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <p class="text-sm text-green-700 font-medium">Total Sales</p>
            <p class="text-2xl font-bold text-green-900 mt-1" :style="getDynamicStyle(report.total_sales)">
              {{ format(report.total_sales) }}
            </p>
          </div>
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <p class="text-sm text-blue-700 font-medium">Items Sold</p>
            <p class="text-2xl font-bold text-blue-900 mt-1">{{ report.total_items_sold }}</p>
          </div>
          <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <p class="text-sm text-purple-700 font-medium">Transactions</p>
            <p class="text-2xl font-bold text-purple-900 mt-1">{{ report.transactions }}</p>
          </div>
          <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <p class="text-sm text-orange-700 font-medium">Average Sale</p>
            <p class="text-2xl font-bold text-orange-900 mt-1" :style="getDynamicStyle(report.average_sale)">
              {{ format(report.average_sale) }}
            </p>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- Sales by Category -->
          <div class="bg-white rounded-lg border border-gray-200 p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Sales by Category</h3>
            <div v-if="report.sales_by_category && report.sales_by_category.length > 0" class="h-64">
              <Chart type="pie" :data="categoryChartData" :options="pieChartOptions" />
            </div>
            <div v-else class="h-64 flex items-center justify-center text-gray-500">
              No category data available
            </div>
          </div>

          <!-- Top Products -->
          <div class="bg-white rounded-lg border border-gray-200 p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
            <div v-if="report.top_products && report.top_products.length > 0" class="h-64">
              <Chart type="bar" :data="topProductsChartData" :options="barChartOptions" />
            </div>
            <div v-else class="h-64 flex items-center justify-center text-gray-500">
              No product data available
            </div>
          </div>
        </div>

        <!-- Top Products Table -->
        <div v-if="report.top_products && report.top_products.length > 0"
          class="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
          <div class="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Top Products Breakdown</h3>
          </div>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Product
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Quantity Sold
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total Amount
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="product in report.top_products" :key="product.product_id" class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm font-medium text-gray-900">
                  {{ product.product_name }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ product.quantity_sold }} pcs</td>
                <td class="px-6 py-4 text-sm font-semibold text-green-600"
                  :style="getDynamicStyle(product.total_amount)">
                  {{ format(product.total_amount) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Sales by Category Table -->
        <div v-if="report.sales_by_category && report.sales_by_category.length > 0"
          class="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
          <div class="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Sales by Category</h3>
          </div>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Category
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total Sales
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="cat in report.sales_by_category" :key="cat.category" class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm font-medium text-gray-900 capitalize">
                  {{ cat.category }}
                </td>
                <td class="px-6 py-4 text-sm font-semibold text-green-600" :style="getDynamicStyle(cat.total)">
                  {{ format(cat.total) }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  {{ calculatePercentage(cat.total) }}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Transactions Table -->
        <div v-if="report.details && report.details.length > 0"
          class="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div class="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Transaction Details</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Invoice ID
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date & Time
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Payment Method
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="tx in report.details" :key="tx.invoice_id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 text-sm font-medium text-gray-900">#{{ tx.invoice_id }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ formatDateTime(tx.date) }}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{{ tx.customer_name }}</td>
                  <td class="px-6 py-4 text-sm font-semibold text-green-600" :style="getDynamicStyle(tx.amount)">
                    {{ format(tx.amount) }}
                  </td>
                  <td class="px-6 py-4">
                    <span
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                      {{ tx.payment_method }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
        <button @click="$emit('close')"
          class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

ChartJS.register(
  ArcElement,        // pour les pie/doughnut
  BarElement,        // pour les barres
  BarController,     // pour le type 'bar'
  CategoryScale,     // axe X
  LinearScale,       // axe Y
  Tooltip,
  Legend,
  Title
);
import { useCurrency } from '@/composable/useCurrency';

import { Chart } from 'vue-chartjs'


const { format, getDynamicStyle } = useCurrency()
const props = defineProps({
  report: { type: Object, required: true },
})



const formatDateTime = (value) => {
  if (!value) return ''
  const date = new Date(value)
  return (
    date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }) +
    ' ' +
    date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  )
}

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const calculatePercentage = (value) => {
  if (!props.report.total_sales) return 0
  return ((value / props.report.total_sales) * 100).toFixed(1)
}

const categoryChartData = computed(() => {
  if (!props.report.sales_by_category || props.report.sales_by_category.length === 0) {
    return { labels: [], datasets: [] }
  }
  return {
    labels: props.report.sales_by_category.map((c) => c.category),
    datasets: [
      {
        label: 'Sales Amount',
        data: props.report.sales_by_category.map((c) => c.total),
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#EC4899',
          '#14B8A6',
          '#F97316',
          '#06B6D4',
          '#84CC16',
        ],
      },
    ],
  }
})

const topProductsChartData = computed(() => {
  if (!props.report.top_products || props.report.top_products.length === 0) {
    return { labels: [], datasets: [] }
  }
  return {
    labels: props.report.top_products.map((p) => p.product_name),
    datasets: [
      {
        label: 'Revenue',
        data: props.report.top_products.map((p) => p.total_amount),
        backgroundColor: '#3B82F6',
      },
    ],
  }
})

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 10,
        font: {
          size: 11,
        },
      },
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const value = context.parsed || 0
          const total = context.dataset.data.reduce((a, b) => a + b, 0)
          const percentage = ((value / total) * 100).toFixed(1)
          return `${context.label}: ${format(value)} (${percentage}%)`
        },
      },
    },
  },
}

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return `Revenue: ${format(context.parsed.y)}`
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (value) {
          return format(value)
        },
      },
    },
  },
}
</script>

<style scoped>
/* Custom scrollbar for modal content */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
