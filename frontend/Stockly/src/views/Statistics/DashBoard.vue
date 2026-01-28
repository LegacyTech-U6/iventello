<template>
  <div class="min-h-screen bg-gray-50/50 p-4 lg:p-8">
    <div class="max-w-7xl mx-auto space-y-8">

      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-black text-gray-900 tracking-tight">Tableau de Bord Global</h1>
          <p class="text-gray-500 font-medium">Vue d'ensemble de toutes les activités de la plateforme.</p>
        </div>
        <div class="flex items-center gap-3">
          <button @click="exportGlobalReport"
            class="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2">
            <ArrowDownTrayIcon class="w-5 h-5 text-gray-400" />
            Exporter Rapport
          </button>
          <button @click="refreshData"
            class="p-2.5 bg-white border border-gray-200 rounded-xl hover:rotate-180 transition-all">
            <ArrowPathIcon class="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <GridCard title="Revenu Total" :value="formatCurrency(statsStore.adminStats.totalRevenue)"
          :icon="CurrencyDollarIcon" gradientFrom="orange-500" gradientTo="orange-600" />
        <GridCard title="Bénéfice Net" :value="formatCurrency(statsStore.adminStats.totalProfit)" :icon="BanknotesIcon"
          gradientFrom="green-500" gradientTo="green-600" />
        <GridCard title="Entreprises" :value="statsStore.adminStats.totalEnterprises" :icon="BuildingOfficeIcon"
          gradientFrom="blue-500" gradientTo="blue-600" />
        <GridCard title="Utilisateurs" :value="statsStore.adminStats.totalWorkers" :icon="UsersIcon"
          gradientFrom="indigo-500" gradientTo="indigo-600" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Top Enterprise Performance -->
        <div class="lg:col-span-8 space-y-6">
          <div class="bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden">
            <div class="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 class="text-lg font-black text-gray-900">Performance par Entreprise</h3>
              <span class="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-[10px] font-black uppercase">Top
                Performers</span>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left">
                <thead>
                  <tr class="bg-gray-50/50">
                    <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Entreprise</th>
                    <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ventes</th>
                    <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Revenu</th>
                    <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Profit</th>
                    <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Poste</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                  <tr v-for="(ent, idx) in statsStore.enterprisePerformance" :key="ent.uuid"
                    class="hover:bg-gray-50/50 transition-colors cursor-pointer" @click="viewEnterpriseDetail(ent)">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div
                          class="w-10 h-10 rounded-xl bg-gray-100 border border-gray-100 overflow-hidden flex-shrink-0">
                          <img v-if="ent.logo_url" :src="ent.logo_url" class="w-full h-full object-contain" />
                          <BuildingOfficeIcon v-else class="w-5 h-5 m-2.5 text-gray-400" />
                        </div>
                        <div>
                          <p class="text-sm font-bold text-gray-900">{{ ent.name }}</p>
                          <p class="text-[10px] text-gray-400 font-medium">{{ ent.uuid.split('-')[0] }}...</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span class="text-sm font-bold text-gray-700">{{ ent.sales_count }} sales</span>
                    </td>
                    <td class="px-6 py-4 text-sm font-bold text-gray-900">
                      {{ formatCurrency(ent.revenue, ent.currency) }}
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-1.5">
                        <span class="text-sm font-bold text-green-600">{{ formatCurrency(ent.profit, ent.currency)
                          }}</span>
                        <ArrowUpRightIcon class="w-3 h-3 text-green-500" />
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span :class="[
                        'px-3 py-1 rounded-lg text-[10px] font-black uppercase',
                        idx === 0 ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'
                      ]">
                        #{{ idx + 1 }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Sidebar Actions & Audit Trail -->
        <div class="lg:col-span-4 space-y-6">
          <!-- Quick Actions -->
          <div class="bg-indigo-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
            <SparklesIcon class="absolute -right-6 -bottom-6 w-32 h-32 text-white/10" />
            <h4 class="text-xl font-black mb-2">Platform Health</h4>
            <p class="text-indigo-100 text-xs font-medium mb-6 leading-relaxed">
              Toutes les entreprises sont actives et synchronisées. Aucune anomalie détectée sur les serveurs.
            </p>
            <div class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-200">
              <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Système Opérationnel
            </div>
          </div>

          <!-- Audit Trail Peek -->
          <div class="bg-white rounded-[2rem] border border-gray-200 shadow-sm p-6 overflow-hidden">
            <div class="flex items-center justify-between mb-6 px-2">
              <h4 class="text-sm font-black text-gray-900 uppercase tracking-widest">Audit Trail</h4>
              <button @click="router.push('/ad/activities')"
                class="text-[10px] font-black text-orange-500 uppercase hover:underline">Voir tout</button>
            </div>

            <div
              class="space-y-6 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-50">
              <div v-for="log in statsStore.globalActivities" :key="log.id" class="relative pl-10">
                <div
                  class="absolute left-0 top-0 w-9 h-9 bg-white border border-gray-200 rounded-xl flex items-center justify-center z-10 shadow-sm">
                  <UserIcon class="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p class="text-xs font-bold text-gray-900 mb-0.5">
                    {{ log.user?.username || log.worker?.name || 'System' }}
                  </p>
                  <p class="text-[11px] text-gray-500 leading-snug mb-1">
                    {{ log.action }} <span class="text-orange-500 font-bold">@{{ log.entreprise?.name }}</span>
                  </p>
                  <p class="text-[9px] text-gray-400 font-bold tracking-tight">{{ formatDate(log.created_at) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStatisticsStore } from '@/stores/statisticStore'
import GridCard from '@/components/ui/cards/GridCard.vue'
import {
  CurrencyDollarIcon,
  BanknotesIcon,
  BuildingOfficeIcon,
  UsersIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  ArrowUpRightIcon,
  SparklesIcon,
  UserIcon
} from '@heroicons/vue/24/outline'

const statsStore = useStatisticsStore()
const router = useRouter()

const formatCurrency = (val, currency = 'XAF') => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(val)
}

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
  // logic to export PDF
  console.log('Exporting global report...')
}

const viewEnterpriseDetail = (ent) => {
  router.push(`/${ent.uuid}/dashboard`)
}

onMounted(async () => {
  await statsStore.fetchAdminDashboard()
})
</script>
