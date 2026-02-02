<template>
    <div class="p-4 lg:p-8">
        <div class="mb-6 flex justify-between items-center">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">{{ $t('reports.title') }}</h1>
                <p class="text-sm text-gray-500">{{ $t('reports.subtitle') }}</p>
            </div>
        </div>

        <n-grid x-gap="24" y-gap="24" cols="1 s:1 m:2 l:3" responsive="screen">
            <n-gi v-for="ent in statsStore.enterprisePerformance" :key="ent.uuid">
                <n-card :bordered="false" class="rounded-2xl shadow-sm hover:shadow-md transition-shadow h-full">

                    <div class="flex items-start justify-between mb-6">
                        <div class="flex items-center gap-4">
                            <div
                                class="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden p-2 flex items-center justify-center">
                                <img v-if="ent.logo_url" :src="ent.logo_url"
                                    class="max-h-full max-w-full object-contain" />
                                <BuildingOfficeIcon v-else class="w-6 h-6 text-gray-300" />
                            </div>
                            <div>
                                <h3 class="font-bold text-gray-900 leading-tight">{{ ent.name }}</h3>
                                <n-tag size="small" :bordered="false"
                                    class="text-[10px] font-bold uppercase tracking-widest bg-gray-100 text-gray-500 mt-1">
                                    {{ ent.currency }}
                                </n-tag>
                            </div>
                        </div>
                        <n-button circle secondary size="small" @click="downloadReport(ent)">
                            <template #icon>
                                <n-icon>
                                    <ArrowDownTrayIcon />
                                </n-icon>
                            </template>
                        </n-button>
                    </div>

                    <!-- Quick Stats -->
                    <div class="grid grid-cols-2 gap-4 mb-6">
                        <div class="bg-gray-50 rounded-2xl p-4">
                            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{{
                                $t('reports.revenue') }}</p>
                            <p class="text-sm font-black text-gray-900">{{ formatCurrency(ent.revenue, ent.currency) }}
                            </p>
                        </div>
                        <div class="bg-gray-50 rounded-2xl p-4">
                            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{{
                                $t('reports.profit') }}</p>
                            <p class="text-sm font-black text-green-600">{{ formatCurrency(ent.profit, ent.currency) }}
                            </p>
                        </div>
                    </div>

                    <!-- Details -->
                    <div class="space-y-3 mb-6">
                        <div class="flex items-center justify-between text-xs font-bold">
                            <span class="text-gray-400">{{ $t('reports.total_sales') }}</span>
                            <span class="text-gray-900">{{ ent.sales_count }}</span>
                        </div>
                        <n-progress type="line"
                            :percentage="Math.min(100, (ent.revenue / (statsStore.adminStats.totalRevenue || 1)) * 100)"
                            :show-indicator="false" color="#f97316" rail-color="#f3f4f6" height="6" border-radius="4" />
                    </div>

                    <n-button block secondary type="default" @click="router.push(`/${ent.uuid}/dashboard`)"
                        class="rounded-xl">
                        {{ $t('reports.view_dashboard') }}
                        <template #icon>
                            <n-icon>
                                <ArrowRightIcon />
                            </n-icon>
                        </template>
                    </n-button>

                </n-card>
            </n-gi>
        </n-grid>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStatisticsStore } from '@/stores/statisticStore'
import { BuildingOfficeIcon, ArrowDownTrayIcon, ArrowRightIcon } from '@heroicons/vue/24/outline'
import { NGrid, NGi, NCard, NButton, NIcon, NTag, NProgress } from 'naive-ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
