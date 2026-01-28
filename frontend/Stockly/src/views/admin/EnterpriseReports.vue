<template>
    <div class="min-h-screen bg-gray-50/50 p-4 lg:p-8">
        <div class="max-w-7xl mx-auto space-y-6">

            <!-- Header -->
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-black text-gray-900 tracking-tight">Rapports par Entreprise</h1>
                    <p class="text-sm text-gray-500 font-medium">Analyse détaillée de la performance de chaque entité.
                    </p>
                </div>
            </div>

            <!-- Enterprise Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="ent in statsStore.enterprisePerformance" :key="ent.uuid"
                    class="bg-white rounded-[2rem] border border-gray-200 shadow-sm p-6 hover:shadow-xl hover:shadow-gray-200/50 transition-all group">

                    <div class="flex items-start justify-between mb-6">
                        <div class="flex items-center gap-4">
                            <div
                                class="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden p-2 flex items-center justify-center">
                                <img v-if="ent.logo_url" :src="ent.logo_url"
                                    class="max-h-full max-w-full object-contain" />
                                <BuildingOfficeIcon v-else class="w-6 h-6 text-gray-300" />
                            </div>
                            <div>
                                <h3 class="font-black text-gray-900 leading-tight">{{ ent.name }}</h3>
                                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{{ ent.currency
                                }}</p>
                            </div>
                        </div>
                        <button @click="downloadReport(ent)"
                            class="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-orange-500 hover:text-white transition-all shadow-sm group-hover:bg-orange-600 group-hover:text-white">
                            <ArrowDownTrayIcon class="w-5 h-5" />
                        </button>
                    </div>

                    <!-- Quick Stats -->
                    <div class="grid grid-cols-2 gap-4 mb-6">
                        <div class="bg-gray-50 rounded-2xl p-4">
                            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Revenu</p>
                            <p class="text-sm font-black text-gray-900">{{ formatCurrency(ent.revenue, ent.currency) }}
                            </p>
                        </div>
                        <div class="bg-gray-50 rounded-2xl p-4">
                            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Profit</p>
                            <p class="text-sm font-black text-green-600">{{ formatCurrency(ent.profit, ent.currency) }}
                            </p>
                        </div>
                    </div>

                    <!-- Details -->
                    <div class="space-y-3">
                        <div class="flex items-center justify-between text-xs font-bold">
                            <span class="text-gray-400">Total Ventes</span>
                            <span class="text-gray-900">{{ ent.sales_count }}</span>
                        </div>
                        <div class="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div class="bg-orange-500 h-full transition-all"
                                :style="{ width: `${Math.min(100, (ent.revenue / statsStore.adminStats.totalRevenue) * 100)}%` }">
                            </div>
                        </div>
                    </div>

                    <div class="mt-8">
                        <button @click="router.push(`/${ent.uuid}/dashboard`)"
                            class="w-full py-3 bg-white border border-gray-200 text-gray-700 font-black text-xs rounded-2xl hover:bg-gray-50 transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                            Voir Dashboard
                            <ArrowRightIcon class="w-4 h-4" />
                        </button>
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
import { BuildingOfficeIcon, ArrowDownTrayIcon, ArrowRightIcon } from '@heroicons/vue/24/outline'

const statsStore = useStatisticsStore()
const router = useRouter()

const formatCurrency = (val, currency = 'XAF') => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(val)
}

const downloadReport = (ent) => {
    const data = [
        ['Entreprise', 'Revenu', 'Profit', 'Ventes'],
        [ent.name, ent.revenue, ent.profit, ent.sales_count]
    ]
    const csvContent = "data:text/csv;charset=utf-8," + data.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rapport_${ent.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
}

onMounted(async () => {
    await statsStore.fetchAdminDashboard()
})
</script>
