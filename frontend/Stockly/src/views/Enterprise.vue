<template>
  <div class="p-8 space-y-8">
    <div class="flex space-x-5">
      <WelcomeCard :user="authStore.user?.username || 'User'" :enterprise="entrepriseStore.activeEntreprise.name"
        :image=mascot />
      <Logo :logo="entrepriseStore.activeEntreprise.logo_url"/>
    </div>

    <!-- Stat Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <GridCard v-for="stat in topStats" :key="stat.id" :title="stat.label" :value="stat.value" :icon="stat.icon"
        :gradientFrom="stat.gradientFrom" :is-currency="stat.isCurrency" :gradientTo="stat.gradientTo" :trend="stat.trend" />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard v-for="stat in statsTable" :disabled="stat.disabled"  :is-currency="stat.isCurrency" :key="stat.id" :icon="stat.icon" :value="stat.value" :label="stat.label"
        :trend="stat.trend" :viewLink="stat.viewLink" :icon-bg="stat.iconBg" :icon-color="stat.iconColor"
        :period="stat.period" />
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-8">
        <!-- Sales & Orders Overview -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <!-- <SalesPerformanceChart /> -->
          <SalesChart />
        </div>
      </div>
      <!-- Product Distribution -->

      <RevenueCatgeory />
    </div>

    <!-- Rest of your dashboard content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <TopSellingProducts />
      <LowStockAlertsPanel />
      <RecentSales />
    </div>

  </div>
</template>

<script setup>
import { useEntrepriseStore } from '@/stores/entrepriseStore'
import { computed, ref, onMounted } from 'vue'
import { useProductStore } from '@/stores/productStore'
import { useAuthStore } from '@/stores/authStore'
import NotificationsPanel from '@/components/main/NotificationsPanel.vue'
import LowStockAlertsPanel from '@/components/statistics/LowStockAlertsPanel.vue'
import SalesChart from '@/components/ui/charts/SalesChart.vue'
import { useStatisticsStore } from '@/stores/statisticStore'
import { LowStock, OutOfStock } from '@/service/api'
import GridCard from '@/components/ui/cards/GridCard.vue'
import MetricCard from '@/components/ui/cards/MetricCard.vue'
import TopSellingProducts from '@/components/statistics/TopSellingProducts.vue'
import RecentSales from '@/components/statistics/RecentSales.vue'
// Lucide Vue Next icons
import { useActionMessage } from '@/composable/useActionMessage'
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
import mascot from '@/assets/image/professional.png'
import RevenueCatgeory from '@/components/statistics/RevenueCatgeory.vue'
import WelcomeCard from '@/components/ui/WelcomeCard.vue'
import Logo from '@/components/ui/Logo.vue'

const authStore = useAuthStore()

const enterpriseStore = useEntrepriseStore()

const handleQuickAction = (action) => {
  console.log('Selected action:', action.value)
  // Example: navigate or open modal
}

const entrepriseStore = useEntrepriseStore()
const productStore = useProductStore()
const loading = ref(false)
const avgRevenue = ref(0)
const revenueTrendPercent = ref(0)
const statisticStore = useStatisticsStore()
const finishedProducts = ref([])
const message = ref('')
const { showSuccess, showError } = useActionMessage()
// Remove the old handleLowStock function since we're using handleAlertAction now
const statsTable = computed(() => [
  {
    id: 1,
    label: 'Total profit',
    value: statisticStore.profit.profit?.total,
    trend: statisticStore.profit.profit?.history.at(-1)?.growth_percent,
    icon: Layers,
    iconBg: '#E6F4F0',
    iconColor: '#16a34a',
    viewLink: '/sales',
    period: statisticStore.profit.period,
    isCurrency: true,
  },
   {
    id: 2,
    label: 'Total Customers',
    value: statisticStore.client.clients?.total,
    trend: statisticStore.client.clients?.history?.at(-1)?.growth_percent,
    icon: Users,
    iconBg: '#E6F0FF',
    iconColor: '#2563eb',
    viewLink: '/customers',
    period: statisticStore.client.period,
    isCurrency:false
  },
  {
    id: 3,
    label: 'Total Returns',
    value: '$156,000',
    trend: -8,
    icon: RotateCcw,
    iconBg: '#FDEDEE',
    iconColor: '#dc2626',
    viewLink: '/returns',
    period: 'Month',
    isCurrency: true,
    disabled:true
  },
  {
    id: 4,
    label: 'Total Expenses',
    value: '$2,780,000',
    trend: -3,
    icon: Wallet,
    iconBg: '#FFF7E6',
    iconColor: '#f59e0b',
    viewLink: '/expenses',
    period: statisticStore.client.period,
    isCurrency: true,
    disabled:true
  },
 
])
onMounted(async () => {
  loading.value = true
  await productStore.fetchProducts()
  await statisticStore.fetchProductSales('day')
  await statisticStore.fetchProfit('day')
  await statisticStore.fetclient('day')
  productStore.fetchFinishedProducts()
  await fetchLowStockProducts()

  loading.value = false
})

const totalProductsValue = computed(() =>
  productStore.products.reduce((sum, product) => {
    const price = Number(product.selling_price) || 0
    const qty = Number(product.quantity) || 1
    return sum + price * qty
  }, 0)
)

const lowStockProducts = ref([])

async function fetchLowStockProducts() {
  try {
    const data = await LowStock()
    lowStockProducts.value = Array.isArray(data.products) ? data.products : []
    console.log('✅ Low products loaded:', lowStockProducts.value.length)
  } catch (err) {
    console.error('❌ Error fetching low stock:', err)
    lowStockProducts.value = []
  }
}

async function fetchFinishedProducts() {
  try {
    const orders = null
    const data = await OutOfStock()
    console.log('✅ API Response:', data)

    // ✅ Store data properly
    message.value = data.message
    orders.value = data.orders
    finishedProducts.value = data.products || [] // Important
  } catch (err) {
    showError('Failed to fetch out-of-stock products')
    console.error('❌ Error fetching out-of-stock products:', err)
  }
}

const topStats = computed(() => [
  {
    id: 1,
    icon: Users,
    label: 'Total products',
    value: productStore.totalProducts,
    subtext: 'Under this enterprise',
    gradientFrom: '#0E9384',
    gradientTo: '#0E9384',
    isCurrency: false, // nombre simple
  },
  {
    id: 2,
    icon: Package,
    label: 'Total Products Value',
    value: totalProductsValue.value,
    gradientFrom: '#FE9F43',
    gradientTo: '#FE9F43',
    isCurrency: true, // montant en monnaie
  },
  {
    id: 3,
    icon: DollarSign,
    label: 'Total Sales',
    value: statisticStore.topProducts.sales?.total,
    gradientFrom: '#092C4C',
    gradientTo: '#092C4C',
    trend: statisticStore.topProducts.sales?.history.at(-1)?.growth_percent,
    isCurrency: true, // montant en monnaie
  },
  {
    id: 4,
    icon: DollarSign,
    label: 'Total Purchase',
    value: avgRevenue.value,
    gradientFrom: '#155EEF',
    gradientTo: '#155EEF',
    trendPercentage: revenueTrendPercent.value,
    isCurrency: true, // montant en monnaie
  },
])

const alerts = computed(() => [
  {
    id: 1,
    title: 'Out of Stock',
    count: finishedProducts.value.length,
    color: 'border-red-300 bg-red-50',
    action: { label: 'Restock', color: 'border-red-400 text-red-600' },
  },
])

const notifications = computed(() => [
  {
    id: 1,
    type: 'low-stock',
    title: 'Low Stock Alert',
    description: '4 products are running low on stock',
    timestamp: '5 minutes ago',
  },
  {
    id: 2,
    type: 'restock',
    title: 'Restock Complete',
    description: 'Gaming Laptop Pro successfully restocked',
    timestamp: '1 hour ago',
  },
  {
    id: 3,
    type: 'supplier',
    title: 'New Supplier Added',
    description: 'Mobile Solutions Ltd has been added to suppliers',
    timestamp: '3 hours ago',
  },
])

const lowStockItems = ref([
  { id: 1, name: 'Premium Smartphone', stock: 8, minStock: 10, critical: true },
  { id: 2, name: 'Wireless Earbuds', stock: 5, minStock: 15, critical: false },
  { id: 3, name: 'Smart Watch', stock: 3, minStock: 8, critical: true },
  { id: 4, name: 'Tablet Stand', stock: 7, minStock: 12, critical: false },
])

const stockLevels = ref([
  { name: 'Audio Equipment', current: 145, total: 200 },
  { name: 'Mobile Devices', current: 89, total: 150 },
  { name: 'Computers', current: 67, total: 100 },
  { name: 'Peripherals', current: 234, total: 300 },
  { name: 'Accessories', current: 156, total: 200 },
])
</script>

<style scoped>
/* Smooth transitions */
button {
  transition: all 0.2s ease;
}

button:hover {
  transform: translateY(-1px);
}
</style>
