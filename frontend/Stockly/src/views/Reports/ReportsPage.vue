<template>
  <div class="p-4 lg:p-8 space-y-8">
    <!-- Header avec sélecteur de période -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-black text-gray-900 tracking-tight">Rapports</h1>
        <p class="text-gray-500 font-medium">Analyse détaillée de vos performances commerciales.</p>
      </div>
      <div class="flex gap-3">
        <n-select v-model:value="selectedPeriod" :options="periodOptions" style="width: 200px"
          @update:value="refreshReport" />
        <input v-model="reportDate" type="date" class="border rounded-lg px-3 py-2 text-sm" @change="refreshReport" />
        <n-button circle secondary size="large" @click="refreshReport">
          <template #icon><n-icon>
              <ArrowPathIcon />
            </n-icon></template>
        </n-button>
        <n-button type="primary" size="large" @click="handleExportPDF">
          <template #icon>
            <n-icon>
              <ArrowDownTrayIcon />
            </n-icon>
          </template>
          Exporter PDF
        </n-button>
      </div>
    </div>

    <!-- Loading State -->
    <n-spin v-if="loading" size="large" />

    <!-- Content -->
    <template v-else>
      <div id="report-content" class="space-y-8">
        <!-- Stats Grid: Ventes, Dépenses, Profits -->
        <n-grid x-gap="24" y-gap="24" cols="1 s:2 l:4" responsive="screen">
          <!-- Total Ventes -->
          <n-gi>
            <GenericStatCard label="Ventes Totales" :value="reportData.totalSales" :icon="ShoppingCartIcon"
              color="orange" />
          </n-gi>

          <!-- Total Dépenses -->
          <n-gi>
            <GenericStatCard label="Dépenses Totales" :value="reportData.totalExpenses" :icon="XCircleIcon"
              color="red" />
          </n-gi>

          <!-- Profit Net -->
          <n-gi>
            <GenericStatCard label="Profit Net" :value="reportData.netProfit" :icon="BanknotesIcon" color="green" />
          </n-gi>

          <!-- Remises -->
          <n-gi>
            <GenericStatCard label="Total Remises" :value="reportData.totalDiscount" :icon="TicketIcon"
              color="purple" />
          </n-gi>
        </n-grid>

        <!-- Ventes par Catégorie & Produit le plus vendu -->
        <n-grid x-gap="24" y-gap="24" cols="1 l:2" responsive="screen">
          <n-gi>
            <SalesByCategoryReport :data="reportData.salesByCategory" />
          </n-gi>

          <n-gi>
            <BestSellingProductReport :product="reportData.bestProduct" />
          </n-gi>
        </n-grid>

        <!-- Profits & Dépenses -->
        <n-grid x-gap="24" y-gap="24" cols="1 l:2" responsive="screen">
          <n-gi>
            <ProfitAnalysisReport :totalProfit="reportData.totalProfit" :averageProfit="reportData.averageProfit" />
          </n-gi>

          <n-gi>
            <ExpensesDetailReport :expenses="reportData.expenses" />
          </n-gi>
        </n-grid>

        <!-- Remises Détaillées -->
        <n-grid x-gap="24" y-gap="24" cols="1" responsive="screen">
          <n-gi>
            <DiscountReport :discounts="reportData.discountsList" />
          </n-gi>
        </n-grid>

        <!-- Rapport Dynamique (Tableau) -->
        <n-grid x-gap="24" y-gap="24" cols="1" responsive="screen">
          <n-gi>
            <n-card title="Rapport Dynamique">
              <div class="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                <n-select v-model:value="selectedReportType" :options="reportTypeOptions" style="width: 180px" />
                <n-select v-model:value="selectedGroupBy" :options="groupByOptions" style="width: 180px" />
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-600">Détails</span>
                  <n-switch v-model:value="includeDetails" />
                </div>
                <n-button type="primary" @click="refreshReport">Générer</n-button>
              </div>
              <n-data-table :columns="dynamicColumns" :data="reportTableRows" :bordered="false"
                :pagination="{ pageSize: 10 }" />
            </n-card>
          </n-gi>
        </n-grid>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  ShoppingCartIcon,
  XCircleIcon,
  BanknotesIcon,
  ArrowPathIcon,
  TicketIcon,
  ArrowDownTrayIcon,
} from '@heroicons/vue/24/outline'
import {
  NButton, NIcon, NGrid, NGi, NSelect, NSpin, NDataTable, NCard, NSwitch
} from 'naive-ui'
import {
  getReportSummary,
  getSalesByCategory,
  getReportExpenses,
  getReportProfits,
  getBestSellingProductReport,
  getReportDiscounts,
  getReportTable,
} from '@/service/api'
import { generateEnterpriseReport } from '@/utils/reportPdfGenerator'
import { groupByPeriod } from '@/utils/dataGrouping'
import { useCurrency } from '@/composable/useCurrency'
import { useClientStore } from '@/stores/clientStore'
import { useEntrepriseStore } from '@/stores/entrepriseStore'

// Import Components
import GenericStatCard from '@/components/reports/GenericStatCard.vue'
import SalesByCategoryReport from '@/components/reports/SalesByCategoryReport.vue'
import BestSellingProductReport from '@/components/reports/BestSellingProductReport.vue'
import ProfitAnalysisReport from '@/components/reports/ProfitAnalysisReport.vue'
import ExpensesDetailReport from '@/components/reports/ExpensesDetailReport.vue'
import DiscountReport from '@/components/reports/DiscountReport.vue'

const entrepriseStore = useEntrepriseStore()
const { format } = useCurrency()

const selectedPeriod = ref('month')
const loading = ref(false)
const reportDate = ref(new Date().toISOString().split('T')[0])
const selectedReportType = ref('expenses')
const selectedGroupBy = ref('auto')
const includeDetails = ref(false)
const reportTableRows = ref([])

const periodOptions = [
  { label: 'Aujourd\'hui', value: 'day' },
  { label: 'Cette semaine', value: 'week' },
  { label: 'Ce mois', value: 'month' },
  { label: 'Ce semestre', value: 'semester' },
  { label: 'Cette année', value: 'year' },
]

const reportTypeOptions = [
  { label: 'Dépenses', value: 'expenses' },
  { label: 'Ventes', value: 'sales' },
]

const groupByOptions = [
  { label: 'Auto', value: 'auto' },
  { label: 'Jour', value: 'day' },
  { label: 'Semaine', value: 'week' },
  { label: 'Mois', value: 'month' },
]



const reportData = ref({
  totalSales: 0,
  totalExpenses: 0,
  totalProfit: 0,
  averageProfit: 0,
  netProfit: 0,
  totalDiscount: 0,
  salesByCategory: [],
  expenses: [],
  discountsList: [],
  bestProduct: null,
})

const dynamicColumns = computed(() => {
  const isExpenses = selectedReportType.value === 'expenses'
  const detailLabel = isExpenses ? 'Détails Dépenses' : 'Détails Ventes'
  return [
    { title: 'Période', key: 'label' },
    {
      title: 'Total',
      key: 'total',
      render: (row) => format(row.total || 0),
    },
    {
      title: 'Nombre',
      key: 'count',
    },
    {
      title: detailLabel,
      key: 'details',
      render: (row) => {
        if (!includeDetails.value || !row.details) {
          return '-'
        }
        const items = row.details.slice(0, 3).map((item) => {
          if (isExpenses) {
            return `${format(item.amount || 0)} - ${item.description || 'Sans description'}`
          }
          return `${item.quantity_sold || 0} x ${format(item.total_price || 0)}`
        })
        const extra = row.details.length > 3 ? ` (+${row.details.length - 3})` : ''
        return `${items.join(' | ')}${extra}`
      },
    },
  ]
})

const refreshReport = async () => {
  loading.value = true

  // Ensure enterprise info is loaded
  if (!entrepriseStore.currentEntreprise?.uuid) {
    await entrepriseStore.fetchEntreprises() // Assuming this loads user enterprises
    // Or a specific fetchActiveEntreprise if available
  }

  try {
    const period = selectedPeriod.value

    const [summary, categories, expenses, profits, bestProduct, discounts, tableData] = await Promise.all([
      getReportSummary(period),
      getSalesByCategory(period),
      getReportExpenses(period),
      getReportProfits(period),
      getBestSellingProductReport(period),
      getReportDiscounts(period),
      getReportTable({
        period,
        reportType: selectedReportType.value,
        groupBy: selectedGroupBy.value,
        date: reportDate.value,
        includeDetails: includeDetails.value,
      }),
    ])

    reportData.value = {
      totalSales: summary.data.totalSales,
      salesByCategory: categories.data,
      expenses: expenses.data.expenses,
      totalExpenses: expenses.data.total,
      totalProfit: profits.data.totalProfit,
      averageProfit: profits.data.averageProfit,
      netProfit: profits.data.netProfit,
      bestProduct: bestProduct.data,
      totalDiscount: discounts.data.totalDiscount,
      discountsList: discounts.data.discounts || [],
    }

    reportTableRows.value = tableData.data
  } catch (error) {
    console.error('Erreur chargement rapport:', error)
  } finally {
    loading.value = false
  }
}

const handleExportPDF = () => {
  const enterprise = entrepriseStore.currentEntreprise || { name: 'Mon Entreprise' }
  const period = selectedPeriod.value
  const sections = []

  // Define if we are in "Summary Mode" (grouped by month) or "Detailed Mode" (grouped by day)
  const isSummaryMode = ['year', 'semester'].includes(period);

  // 1. Global Stats
  sections.push({
    title: 'Résumé Global',
    type: 'stats',
    stats: [
      { label: 'Ventes Totales', value: format(reportData.value.totalSales) },
      { label: 'Dépenses Totales', value: format(reportData.value.totalExpenses) },
      { label: 'Profit Net', value: format(reportData.value.netProfit) },
      { label: 'Total Remises', value: format(reportData.value.totalDiscount) },
    ]
  })

  // 2. Performance Produit
  if (reportData.value.bestProduct) {
    sections.push({
      title: 'Performance Produit',
      type: 'text',
      content: `Le produit le plus vendu est "${reportData.value.bestProduct.name}" avec ${reportData.value.bestProduct.totalQuantity} unités vendues pour un revenu total de ${format(reportData.value.bestProduct.totalRevenue)}.`
    })
  }

  // 3. Ventes par Catégorie
  if (reportData.value.salesByCategory?.length) {
    sections.push({
      title: 'Ventes par Catégorie',
      type: 'table',
      columns: ['Catégorie', 'Ventes (Qté)', 'Revenu Total'],
      data: reportData.value.salesByCategory.map(c => [
        c.name,
        c.salesCount,
        format(c.totalSales)
      ])
    })
  }

  // 4. Dépenses (Dynamique)
  if (reportData.value.expenses?.length) {
    const groupedExpenses = groupByPeriod(reportData.value.expenses, period, 'createdAt', 'amount');

    sections.push({
      title: isSummaryMode ? 'Dépenses Mensuelles' : 'Dépenses Journalières',
      type: 'table',
      columns: [isSummaryMode ? 'Mois' : 'Date', 'Nombre', 'Montant Total'],
      data: groupedExpenses.map(g => [g.label, g.count, format(g.total)])
    });

    // Optional: Add detailed table if in detailed mode? 
    // User requested: "Une ligne par jour du mois... avec colonnes Date | Total | Détails (optionnel)"
    // The `groupByPeriod` above does exactly that: One row per day (or month).
  }

  // 5. Remises (Dynamique)
  if (reportData.value.discountsList?.length) {
    const groupedDiscounts = groupByPeriod(reportData.value.discountsList, period, 'createdAt', 'discount');

    sections.push({
      title: isSummaryMode ? 'Remises Mensuelles' : 'Remises Journalières',
      type: 'table',
      columns: [isSummaryMode ? 'Mois' : 'Date', 'Nombre', 'Montant Remisé'],
      data: groupedDiscounts.map(g => [g.label, g.count, format(g.total)])
    });
  }

  generateEnterpriseReport({
    enterprise,
    title: 'Rapport d\'Activité',
    period: selectedPeriod.value === 'month' ? 'Mensuel' :
      selectedPeriod.value === 'year' ? 'Annuel' :
        selectedPeriod.value === 'week' ? 'Hebdomadaire' :
          selectedPeriod.value === 'semester' ? 'Semestriel' : 'Journalier',
    sections,
    fileName: `Rapport_${selectedPeriod.value}_${new Date().toISOString().split('T')[0]}.pdf`
  })
}

onMounted(() => {
  refreshReport()
})
</script>
