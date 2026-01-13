<template>
  <div class="w-full bg-white p-3 rounded-xl border border-gray-100 shadow-sm transition-all duration-300">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
      <div>
        <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
          <div class="p-2 bg-gray-50 rounded-lg">
            <ShoppingCart class="text-gray-700" :size="20" />
          </div>
          Ventes & Achats
        </h2>
        <div class="flex gap-6 mt-3">
          <div class="flex flex-col border-l-2 border-red-500 pl-3">
            <span class="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Total Achats</span>
            <span class="text-lg font-bold text-red-500 transition-all">
              {{ isLoading ? '...' : totalPurchase.toLocaleString() }}
            </span>
          </div>
          <div class="flex flex-col border-l-2 border-emerald-500 pl-3">
            <span class="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Total Ventes</span>
            <span class="text-lg font-bold text-emerald-600 transition-all">
              {{ isLoading ? '...' : totalSales.toLocaleString() }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex bg-gray-100 p-1 rounded-xl self-start border border-gray-200">
        <button 
          v-for="tab in tabs" :key="tab.value"
          @click="activeTab = tab.value"
          :disabled="isLoading"
          :class="['px-5 py-2 text-xs font-bold rounded-lg transition-all', 
            activeTab === tab.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700 disabled:opacity-50']"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <div class="relative w-full overflow-hidden" :style="{ height: chartHeight + 60 + 'px' }">
      
      <div v-if="isLoading" class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[1px] transition-all">
        <div class="w-10 h-10 border-4 border-gray-100 border-t-emerald-500 rounded-full animate-spin mb-2"></div>
        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Analyse en cours...</span>
      </div>

      <svg :viewBox="`0 0 ${chartWidth} ${chartHeight + 40}`" 
           class="w-full h-full overflow-visible transition-opacity duration-500"
           :class="isLoading ? 'opacity-20' : 'opacity-100'">
        
        <g v-for="(tick, i) in yAxisTicks" :key="`y-${i}`">
          <line :x1="padding.left" :y1="getY(tick)" :x2="chartWidth" :y2="getY(tick)" stroke="#f1f5f9" stroke-width="1" />
          <text :x="padding.left - 15" :y="getY(tick) + 4" text-anchor="end" class="text-[11px] fill-gray-400 font-medium font-mono">
            {{ formatYAxis(tick) }}
          </text>
        </g>

        <g v-for="(item, i) in chartData" :key="`group-${i}`">
          <rect 
            :x="getX(i)" :y="getY(item.purchase)" 
            :width="barWidth" :height="getH(item.purchase)" 
            fill="#ef4444" rx="4" 
            class="cursor-pointer hover:fill-red-600 transition-all duration-300 opacity-80 hover:opacity-100"
            @mouseenter="showTooltip(item, 'Achats', item.purchase, $event)" @mouseleave="hideTooltip"
          />
          <rect 
            :x="getX(i) + barWidth + 3" :y="getY(item.sales)" 
            :width="barWidth" :height="getH(item.sales)" 
            fill="#10b981" rx="4" 
            class="cursor-pointer hover:fill-emerald-600 transition-all duration-300 opacity-80 hover:opacity-100"
            @mouseenter="showTooltip(item, 'Ventes', item.sales, $event)" @mouseleave="hideTooltip"
          />
          <text v-if="shouldShowLabel(i)" :x="getX(i) + barWidth" :y="chartHeight + 30" text-anchor="middle" class="text-[11px] fill-gray-400 font-bold uppercase">
            {{ item.time }}
          </text>
        </g>
      </svg>

      <div v-if="tooltip.visible && !isLoading" 
        :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
        class="absolute -translate-x-1/2 -translate-y-full mt-[-15px] z-50 bg-gray-900 text-white p-3 rounded-xl shadow-2xl pointer-events-none border border-white/10"
      >
        <div class="text-[10px] uppercase tracking-widest opacity-50 border-b border-white/10 mb-2 pb-1">{{ tooltip.time }}</div>
        <div class="flex justify-between items-center gap-6">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full" :class="tooltip.label === 'Ventes' ? 'bg-emerald-400' : 'bg-red-400'"></div>
            <span class="text-xs font-medium">{{ tooltip.label }}</span>
          </div>
          <span class="text-xs font-black">{{ tooltip.value.toLocaleString() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useStatisticsStore } from '@/stores/statisticStore'
import { ShoppingCart } from "lucide-vue-next"
import { startOfWeek, addDays, format, getWeek, getWeeksInMonth, startOfMonth, addWeeks } from 'date-fns'

const store = useStatisticsStore()
const activeTab = ref('month')
const chartData = ref([])
const isLoading = ref(true)
const tooltip = ref({ visible: false, x: 0, y: 0, label: '', value: 0, time: '' })

const tabs = [
  { label: 'Semaine', value: 'day' },
  { label: 'Mois', value: 'week' },
  { label: 'Année', value: 'month' },
]

// --- Configuration Graphe ---
const chartWidth = 1000
const chartHeight = 320
const padding = { top: 40, right: 20, bottom: 40, left: 60 }

const barWidth = computed(() => {
  const count = chartData.value.length || 1
  if (count <= 7) return 25
  if (count <= 12) return 18
  return 8
})

const totalSales = computed(() => chartData.value.reduce((acc, i) => acc + i.sales, 0))
const totalPurchase = computed(() => chartData.value.reduce((acc, i) => acc + i.purchase, 0))

const maxValue = computed(() => {
  const all = chartData.value.flatMap(i => [i.sales, i.purchase])
  return Math.max(...all, 100) * 1.2
})

const yAxisTicks = computed(() => Array.from({ length: 6 }, (_, i) => Math.ceil(maxValue.value / 5) * i))
const getY = (val) => chartHeight - (val / maxValue.value * (chartHeight - padding.top))
const getH = (val) => Math.max((val / maxValue.value * (chartHeight - padding.top)), 4)
const getX = (i) => {
  const spacing = (chartWidth - padding.left - padding.right) / (chartData.value.length || 1)
  return padding.left + (i * spacing) + (spacing - ((barWidth.value * 2) + 3)) / 2
}

const formatYAxis = (v) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v
const shouldShowLabel = (i) => activeTab.value === 'month' ? i % 2 === 0 : true

// --- Fetch Data ---
async function fetchData(period) {
  isLoading.value = true
  try {
    await store.fetchProductSales(period)
    const history = store.topProducts?.sales?.history || []
    const today = new Date()

    if (period === 'day') {
      const start = startOfWeek(today, { weekStartsOn: 1 })
      chartData.value = Array.from({ length: 7 }, (_, i) => {
        const d = addDays(start, i)
        const match = history.find(h => h.period === format(d, 'yyyy-MM-dd'))
        return { time: format(d, 'EEE'), sales: match?.value || 0, purchase: match?.total || 0 }
      })
    } else if (period === 'week') {
      const start = startOfMonth(today)
      chartData.value = Array.from({ length: getWeeksInMonth(today, { weekStartsOn: 1 }) }, (_, i) => {
        const wDate = addWeeks(start, i)
        const wNum = getWeek(wDate, { weekStartsOn: 1 })
        const match = history.find(h => h.period === `${today.getFullYear()}-${wNum}`)
        return { time: `S${wNum}`, sales: match?.value || 0, purchase: match?.total || 0 }
      })
    } else {
      const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
      chartData.value = months.map((name, i) => {
        const match = history.find(h => h.period === `${today.getFullYear()}-${String(i + 1).padStart(2, '0')}`)
        return { time: name, sales: match?.value || 0, purchase: match?.total || 0 }
      })
    }
  } catch (e) {
    console.error("Store error:", e)
  } finally {
    setTimeout(() => { isLoading.value = false }, 400)
  }
}

const showTooltip = (item, label, value, e) => {
  const rect = e.target.closest('.relative').getBoundingClientRect()
  tooltip.value = { visible: true, x: e.clientX - rect.left, y: e.clientY - rect.top, label, value, time: item.time }
}
const hideTooltip = () => tooltip.value.visible = false

onMounted(() => fetchData(activeTab.value))
watch(activeTab, (t) => fetchData(t))
</script>

<style scoped>
.animate-spin {
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>