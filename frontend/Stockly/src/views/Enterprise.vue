<template>
  <n-spin :show="loading" size="large">
    <div class="p-4 md:p-8 lg:p-7 space-y-8 min-h-screen bg-gray-50/50 dark:bg-gray-950">

      <div class="hidden md:block w-full  flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div class="flex flex-1 w-full sm:w-auto space-x-4">
          <WelcomeCard :user="authStore.user?.username || 'User'" :enterprise="entrepriseStore.activeEntreprise?.name"
            :image="mascot" />
          <Logo :logo="entrepriseStore.activeEntreprise?.logo_url" class="hidden sm:block" />
        </div>

        <!-- Toggle Advanced Analytics -->
        <div
          class="flex items-center gap-3 bg-white dark:bg-gray-900 px-4 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <span class="text-sm font-bold text-gray-600 dark:text-gray-300"
            :class="{ 'text-indigo-600': showAdvancedAnalytics }">{{
              $t('dashboard.advanced_analytics') }}</span>
          <button @click="showAdvancedAnalytics = !showAdvancedAnalytics"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            :class="showAdvancedAnalytics ? 'bg-indigo-600' : 'bg-gray-200'">
            <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              :class="showAdvancedAnalytics ? 'translate-x-6' : 'translate-x-1'" />
          </button>
        </div>
      </div>

      <!-- Advanced Analytics View -->
      <div v-if="showAdvancedAnalytics">
        <AdvancedAnalytics />
      </div>

      <!-- Default Dashboard View -->
      <div v-else class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <GridCard v-for="stat in topStats" :key="stat.id" :title="stat.label" :value="stat.value" :icon="stat.icon"
            :is-currency="stat.isCurrency" :bgColor="stat.bgColor" :trend="stat.trend" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <MetricCard v-for="stat in statsTable" :key="stat.id" :disabled="stat.disabled" :is-currency="stat.isCurrency"
            :icon="stat.icon" :value="stat.value" :label="stat.label" :trend="stat.trend" :viewLink="stat.viewLink"
            :icon-bg="stat.iconBg" :icon-color="stat.iconColor" :period="stat.period" />
        </div>

        <div class="w-full">
          <div
            class="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <SalesChart />
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          <TopSellingProducts class="xl:col-span-1" />
          <RevenueCatgeory class="xl:col-span-1" />
          <RecentSales class="lg:col-span-2 xl:col-span-3" />
        </div>
      </div>

    </div>
  </n-spin>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { NSpin } from 'naive-ui'
import { useHead } from '@unhead/vue' // Import pour le SEO
import { useEntrepriseStore } from '@/stores/entrepriseStore'
import { useProductStore } from '@/stores/productStore'
import { useAuthStore } from '@/stores/authStore'
import { useStatisticsStore } from '@/stores/statisticStore'

// Components
import WelcomeCard from '@/components/ui/WelcomeCard.vue'
import Logo from '@/components/ui/Logo.vue'
import GridCard from '@/components/ui/cards/GridCard.vue'
import MetricCard from '@/components/ui/cards/MetricCard.vue'
import SalesChart from '@/components/ui/charts/SalesChart.vue'
import TopSellingProducts from '@/components/statistics/TopSellingProducts.vue'
import RecentSales from '@/components/statistics/RecentSales.vue'
import RevenueCatgeory from '@/components/statistics/RevenueCatgeory.vue'

// Icons
import { CubeIcon, CurrencyDollarIcon, UsersIcon, Square3Stack3DIcon, ArrowPathIcon, WalletIcon, ChartBarSquareIcon } from '@heroicons/vue/24/outline'
import mascot from '@/assets/image/professional.png'
import AdvancedAnalytics from '@/components/statistics/AdvancedAnalytics.vue'

import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// SEO & Head
useHead({
  title: computed(() => `${t('dashboard.title')} | Gestion Enterprise`), // Dynamic title
  meta: [
    { name: 'description', content: computed(() => t('dashboard.meta_desc')) }
  ]
})

const authStore = useAuthStore()
const entrepriseStore = useEntrepriseStore()
const productStore = useProductStore()
const statisticStore = useStatisticsStore()
const loading = ref(false)
const showAdvancedAnalytics = ref(false)

// Lifecycle
onMounted(async () => {
  loading.value = true
  try {
    // Exécution parallèle pour gagner du temps au chargement
    await Promise.all([
      productStore.fetchProducts(),
      statisticStore.fetchProductSales('day'),
      statisticStore.fetchProfit('day'),
      statisticStore.fetclient('day'),
      statisticStore.fetchExpenseStats('day'),
    ])
  } finally {
    loading.value = false
  }
})

// Computed Data
const totalProductsValue = computed(() =>
  productStore.products.reduce((sum, p) => sum + (Number(p.selling_price) || 0) * (Number(p.quantity) || 0), 0)
)

const statsTable = computed(() => [
  {
    id: 1,
    label: t('dashboard.stats.total_profit'),
    value: statisticStore.profit.profit?.total || 0,
    trend: statisticStore.profit.profit?.history.at(-1)?.growth_percent || 0,
    icon: Square3Stack3DIcon,
    iconBg: '#E6F4F0',
    iconColor: '#16a34a',
    viewLink: '/sales',
    period: statisticStore.profit.period,
    isCurrency: true,
  },
  {
    id: 2,
    label: t('dashboard.stats.total_customers'),
    value: statisticStore.client.clients?.total || 0,
    trend: statisticStore.client.clients?.history?.at(-1)?.growth_percent || 0,
    icon: UsersIcon,
    iconBg: '#E6F0FF',
    iconColor: '#2563eb',
    viewLink: '/customers',
    period: statisticStore.client.period,
    isCurrency: false
  },
  {
    id: 3,
    label: t('dashboard.stats.total_returns'),
    value: 0,
    trend: 0,
    icon: ArrowPathIcon,
    iconBg: '#FDEDEE',
    iconColor: '#dc2626',
    viewLink: '/returns',
    period: 'Month',
    isCurrency: true,
    disabled: true
  },
  {
    id: 4,
    label: t('dashboard.stats.total_expenses'),
    value: statisticStore.expenses?.total || 0,
    trend: statisticStore.expenses?.history?.at(-1)?.growth_percent || 0,
    icon: WalletIcon,
    iconBg: '#FFF7E6',
    iconColor: '#f59e0b',
    viewLink: '/expenses',
    period: 'Month',
    isCurrency: true,
    disabled: false
  }
])

const topStats = computed(() => [
  {
    id: 1,
    icon: CubeIcon,
    label: t('dashboard.stats.total_products'),
    value: productStore.totalProducts,
    bgColor: "#006879",
    isCurrency: false,
  },
  {
    id: 2,
    icon: CurrencyDollarIcon,
    label: t('dashboard.stats.stock_value'),
    value: totalProductsValue.value,
    bgColor: "#3E4565",
    isCurrency: true,
  },
  {
    id: 3,
    icon: CurrencyDollarIcon,
    label: t('dashboard.stats.total_sales'),
    value: statisticStore.topProducts.sales?.total || 0,
    bgColor: "#565D7E",
    trend: statisticStore.topProducts.sales?.history.at(-1)?.growth_percent || 0,
    isCurrency: true,
  },
  {
    id: 4,
    icon: ArrowPathIcon,
    label: t('dashboard.stats.total_purchase'),
    value: 0, // À connecter au store achat si dispo
    bgColor: "#BA1A1A",
    isCurrency: true,
  },
])
</script>

<style scoped>
/* Mobile optimization for grid gaps */
@media (max-width: 640px) {
  .grid {
    gap: 1rem;
  }
}
</style>