<template>
  <div class="p-4 lg:p-8 space-y-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-black text-gray-900 tracking-tight">Tableau de Bord Global</h1>
        <p class="text-gray-500 font-medium">Vue d'ensemble de toutes les activités de la plateforme.</p>
      </div>
      <div class="flex gap-3">
        <n-button secondary size="large" @click="exportGlobalReport">
          <template #icon><n-icon>
              <ArrowDownTrayIcon />
            </n-icon></template>
          Exporter Rapport
        </n-button>
        <n-button circle secondary size="large" @click="refreshData">
          <template #icon><n-icon>
              <ArrowPathIcon />
            </n-icon></template>
        </n-button>
      </div>
    </div>

    <!-- Stats Grid -->
    <n-grid x-gap="24" y-gap="24" cols="1 s:2 l:4" responsive="screen">
      <n-gi>
        <n-card :bordered="false" class="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <n-statistic label="Revenu Total">
            <template #prefix> <n-icon class="text-orange-500">
                <CurrencyDollarIcon />
              </n-icon> </template>
            <template #default> {{ format(statsStore.adminStats.totalRevenue) }} </template>
          </n-statistic>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card :bordered="false" class="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <n-statistic label="Bénéfice Net">
            <template #prefix> <n-icon class="text-green-500">
                <BanknotesIcon />
              </n-icon> </template>
            <template #default> {{ format(statsStore.adminStats.totalProfit) }} </template>
          </n-statistic>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card :bordered="false" class="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <n-statistic label="Entreprises" :value="statsStore.adminStats.totalEnterprises">
            <template #prefix> <n-icon class="text-blue-500">
                <BuildingOfficeIcon />
              </n-icon> </template>
          </n-statistic>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card :bordered="false" class="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <n-statistic label="Utilisateurs" :value="statsStore.adminStats.totalWorkers">
            <template #prefix> <n-icon class="text-indigo-500">
                <UsersIcon />
              </n-icon> </template>
          </n-statistic>
        </n-card>
      </n-gi>
    </n-grid>

    <n-grid x-gap="24" y-gap="24" cols="1 l:3" responsive="screen">
      <!-- Top Enterprise Performance Table -->
      <n-gi span="2">
        <n-card title="Performance par Entreprise" :bordered="false" class="rounded-2xl shadow-sm h-full"
          content-style="padding: 0;">
          <template #header-extra>
            <n-tag type="warning" round size="small" :bordered="false">TOP PERFORMERS</n-tag>
          </template>
          <n-data-table :columns="columns" :data="statsStore.enterprisePerformance" :bordered="false"
            :row-props="rowProps" :pagination="{ pageSize: 5 }" />
        </n-card>
      </n-gi>

      <!-- Right Side: Health & Audit -->
      <n-gi>
        <n-space vertical size="large">
        

          <!-- Audit Trail -->
          <n-card title="Audit Trail" :bordered="false" class="rounded-2xl shadow-sm">
            <template #header-extra>
              <n-button text type="primary" size="tiny" @click="router.push('/ad/activities')">VOIR TOUT</n-button>
            </template>
            <n-timeline>
              <n-timeline-item v-for="log in statsStore.globalActivities.slice(0, 5)" :key="log.id" type="info"
                :title="log.user?.username || log.worker?.name || 'System'" :content="log.action"
                :time="formatDate(log.createdAt)" />
            </n-timeline>
          </n-card>
        </n-space>
      </n-gi>
    </n-grid>
  </div>
</template>

<script setup>
import { onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import { useStatisticsStore } from '@/stores/statisticStore'
import { useCurrency } from '@/composable/useCurrency'
import {
  CurrencyDollarIcon,
  BanknotesIcon,
  BuildingOfficeIcon,
  UsersIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  SparklesIcon,
  ArrowUpRightIcon
} from '@heroicons/vue/24/outline'
import {
  NButton, NIcon, NGrid, NGi, NCard, NStatistic, NDataTable, NTag, NSpace, NTimeline, NTimelineItem, NAvatar
} from 'naive-ui'

const statsStore = useStatisticsStore()
const router = useRouter()
const { format, getDynamicStyle } = useCurrency()

const formatDate = (date) => {
  return new Date(date).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const refreshData = async () => {
  await statsStore.fetchAdminDashboard()
}

const exportGlobalReport = () => {
  console.log('Exporting global report...')
}

const rowProps = (row) => {
  return {
    style: 'cursor: pointer;',
    onClick: () => router.push(`/${row.uuid}/dashboard`)
  }
}

const columns = [
  {
    title: 'Entreprise',
    key: 'name',
    render(row) {
      const logoUrl = row.logo_url 
        ? (row.logo_url.startsWith('http') ? row.logo_url : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002'}/uploads/${row.logo_url}`)
        : null
      return h('div', { class: 'flex items-center gap-3' }, [
        h('div', { class: 'w-10 h-10 rounded-xl bg-gray-100 border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center' }, [
          logoUrl
            ? h('img', { src: logoUrl, class: 'w-full h-full object-contain', alt: row.name })
            : h(NIcon, { class: 'text-gray-400' }, { default: () => h(BuildingOfficeIcon) })
        ]),
        h('div', null, [
          h('p', { class: 'text-sm font-bold text-gray-900' }, row.name),
          h('p', { class: 'text-[10px] text-gray-400 font-medium' }, row.uuid.split('-')[0])
        ])
      ])
    }
  },
  {
    title: 'Ventes',
    key: 'sales_count',
    render(row) {
      return h('span', { class: 'text-sm font-bold text-gray-700' }, `${row.sales_count} sales`)
    }
  },
  {
    title: 'Revenu',
    key: 'revenue',
    render(row) {
      return h('span', { class: 'text-sm font-bold text-gray-900' }, format(row.revenue))
    }
  },
  {
    title: 'Profit',
    key: 'profit',
    render(row) {
      return h('div', { class: 'flex items-center gap-1.5' }, [
        h('span', { class: 'text-sm font-bold text-green-600' }, format(row.profit)),
        h(NIcon, { class: 'text-green-500', size: 12 }, { default: () => h(ArrowUpRightIcon) })
      ])
    }
  }
]

onMounted(async () => {
  await statsStore.fetchAdminDashboard()
})
</script>
