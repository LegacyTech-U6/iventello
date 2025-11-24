<template>
  <div class="w-full h-full bg-white p-6 rounded-lg">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10  rounded-lg flex items-center justify-center">
          <!-- icon -->
          <span class="material-icons">
            shopping_cart
          </span>

        </div>
        <h2 class="text-xl font-semibold text-gray-800">Sales & Purchase</h2>
      </div>

      <!-- Tabs -->
      <div class="flex gap-2 bg-gray-100 rounded-lg p-1">
        <button v-for="tab in tabs" :key="tab.value" @click="activeTab = tab.value" :class="[
          'px-4 py-1.5 rounded-md text-sm font-medium transition-colors',
          activeTab === tab.value
            ? 'bg-green-600 text-white'
            : 'text-gray-600 hover:text-gray-800',
        ]">
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="flex gap-6 mb-6">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <div class="w-3 h-3 rounded-full bg-blue-600"></div>
          <span class="text-sm text-gray-500">Total Purchase</span>
        </div>
        <div class="text-2xl font-bold text-gray-800">{{ totalPurchase.toLocaleString() }}</div>
      </div>
      <div>
        <div class="flex items-center gap-2 mb-1">
          <div class="w-3 h-3 rounded-full bg-[#0C333B]"></div>
          <span class="text-sm text-gray-500">Total Sales</span>
        </div>
        <div class="text-2xl font-bold text-gray-800">{{ totalSales.toLocaleString() }}</div>
      </div>
    </div>

    <!-- Chart -->
    <div class="relative" style="height: 320px">
      <svg :width="chartWidth" :height="chartHeight" class="w-full">
        <!-- Grid lines -->
        <g v-for="(tick, i) in yAxisTicks" :key="`grid-${i}`">
          <line :x1="chartPadding.left" :y1="getYPosition(tick)" :x2="chartWidth - chartPadding.right"
            :y2="getYPosition(tick)" stroke="#f0f0f0" stroke-width="1" stroke-dasharray="3,3" />
        </g>

        <!-- Y-axis labels -->
        <g v-for="(tick, i) in yAxisTicks" :key="`y-label-${i}`">
          <text :x="chartPadding.left - 10" :y="getYPosition(tick) + 4" text-anchor="end" class="text-xs fill-gray-400">
            {{ formatYAxis(tick) }}
          </text>
        </g>

        <!-- Bars -->
        <g v-for="(item, i) in chartData" :key="`bar-${i}`">
          <!-- Purchase -->
          <rect :x="getXPosition(i)" :y="getYPosition(item.purchase)" :width="barWidth"
            :height="getBarHeight(item.purchase)" fill="#fed7aa" rx="4" ry="4"
            @mouseenter="showTooltip(item, i, $event)" @mouseleave="hideTooltip" />
          <!-- Sales -->
          <rect :x="getXPosition(i)" :y="getYPosition(item.sales)" :width="barWidth" :height="getBarHeight(item.sales)"
            fill="#0C333B" rx="4" ry="4" @mouseenter="showTooltip(item, i, $event)" @mouseleave="hideTooltip" />
        </g>

        <!-- X-axis labels -->
        <g v-for="(item, i) in chartData" :key="`x-label-${i}`">
          <text :x="getXPosition(i) + barWidth / 2" :y="chartHeight - chartPadding.bottom + 20" text-anchor="middle"
            class="text-xs fill-gray-400">
            {{ item.time }}
          </text>
        </g>
      </svg>

      <!-- Tooltip -->
      <div v-if="tooltip.visible" :style="{
        position: 'absolute',
        left: tooltip.x + 'px',
        top: tooltip.y + 'px',
        transform: 'translate(-50%, -100%)',
        marginTop: '-10px',
      }" class="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs pointer-events-none">
        <div class="font-semibold mb-1">{{ tooltip.data.time }}</div>
        <div class="flex items-center gap-2 mb-1">
          <div class="w-2 h-2 rounded-full bg-[#0C333B]"></div>
          <span>Total Sales: {{ tooltip.data.sales?.toLocaleString() }}</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-orange-200"></div>
          <span>Total Purchase: {{ tooltip.data.purchase?.toLocaleString() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useStatisticsStore } from '@/stores/statisticStore'
import { ShoppingCart } from "lucide-vue-next";
const store = useStatisticsStore()
const tabs = [
  { label: 'This week', value: 'day' },
  { label: 'This month', value: 'week' },
  { label: 'This year', value: 'month' },
]

const activeTab = ref('month')
const chartData = ref([])

const totalSales = computed(() => chartData.value.reduce((acc, i) => acc + (i.sales || 0), 0))
const totalPurchase = computed(() => chartData.value.reduce((acc, i) => acc + (i.purchase || 0), 0))

const chartWidth = 1000
const chartHeight = 320
const chartPadding = { top: 20, right: 30, bottom: 40, left: 50 }

const maxValue = computed(() => {
  const all = chartData.value.flatMap((i) => [i.sales || 0, i.purchase || 0])
  return Math.max(...all, 100)
})

const yAxisTicks = computed(() => {
  const step = Math.ceil(maxValue.value / 5)
  return Array.from({ length: 6 }, (_, i) => i * step)
})

const barWidth = computed(() => {
  const available = chartWidth - chartPadding.left - chartPadding.right
  const gap = 20
  return (available - gap * (chartData.value.length - 1)) / chartData.value.length
})

const getYPosition = (value) => {
  const available = chartHeight - chartPadding.top - chartPadding.bottom
  const ratio = value / maxValue.value
  return chartHeight - chartPadding.bottom - ratio * available
}

const getBarHeight = (value) => {
  const available = chartHeight - chartPadding.top - chartPadding.bottom
  return (value / maxValue.value) * available
}

const getXPosition = (index) => {
  const available = chartWidth - chartPadding.left - chartPadding.right
  const gap = 20
  const total = barWidth.value * chartData.value.length + gap * (chartData.value.length - 1)
  const start = chartPadding.left + (available - total) / 2
  return start + index * (barWidth.value + gap)
}

const formatYAxis = (v) => (v >= 1000 ? `${v / 1000}K` : v)

const showTooltip = (item, i, e) => {
  const rect = e.target.getBoundingClientRect()
  const container = e.target.closest('.relative')
  const containerRect = container.getBoundingClientRect()
  tooltip.value = {
    visible: true,
    x: rect.left - containerRect.left + rect.width / 2,
    y: rect.top - containerRect.top,
    data: item,
  }
}

const hideTooltip = () => (tooltip.value.visible = false)
const tooltip = ref({ visible: false, x: 0, y: 0, data: {} })

// --- Fetch & map data from store ---
import { startOfWeek, addDays, format, getWeek, getWeeksInMonth, startOfMonth, addWeeks, getMonth, formatISO } from 'date-fns'

async function fetchData(period) {
  await store.fetchProductSales(period)
  const history = store.topProducts?.sales?.history || []

  const today = new Date()

  if (period === 'day') {
    // 🗓️ Semaine actuelle (Lundi → Dimanche)
    const start = startOfWeek(today, { weekStartsOn: 1 })
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = addDays(start, i)
      const key = format(date, 'yyyy-MM-dd')
      const match = history.find((h) => h.period === key)
      return {
        time: format(date, 'EEE'), // Mon, Tue, ...
        sales: match?.value || 0,
        purchase: match?.total || 0,
      }
    })
    chartData.value = days

  } else if (period === 'week') {
    // 📅 Toutes les semaines du mois courant
    const year = today.getFullYear()
    const month = getMonth(today)
    const start = startOfMonth(today)
    const weekCount = getWeeksInMonth(today, { weekStartsOn: 1 })

    const weeks = Array.from({ length: weekCount }, (_, i) => {
      const weekStart = addWeeks(start, i)
      const weekNum = getWeek(weekStart, { weekStartsOn: 1 })
      const key = `${year}-${weekNum}`
      const match = history.find((h) => h.period === key)
      return {
        time: `Week ${weekNum}`,
        sales: match?.value || 0,
        purchase: match?.total || 0,
      }
    })
    chartData.value = weeks

  } else if (period === 'month') {
    // 📆 Les 12 mois de l'année actuelle
    const year = today.getFullYear()
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    chartData.value = monthNames.map((name, i) => {
      const key = `${year}-${String(i + 1).padStart(2, '0')}`
      const match = history.find((h) => h.period === key)
      return {
        time: name,
        sales: match?.value || 0,
        purchase: match?.total || 0,
      }
    })
  }
}



onMounted(() => fetchData(activeTab.value))
watch(activeTab, (t) => fetchData(t))
</script>
