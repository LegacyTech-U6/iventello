<template>
    <div class="min-h-screen bg-gray-50/50 p-4 lg:p-8">
        <div class="max-w-7xl mx-auto space-y-6">
            <!-- Header -->
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-black text-gray-900 tracking-tight">Audit Trail Global</h1>
                    <p class="text-sm text-gray-500 font-medium">Historique de toutes les activités sur la plateforme.
                    </p>
                </div>
                <button @click="refreshData"
                    class="p-2.5 bg-white border border-gray-200 rounded-xl hover:rotate-180 transition-all">
                    <ArrowPathIcon class="w-5 h-5 text-gray-400" />
                </button>
            </div>

            <!-- Filters -->
            <div class="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap gap-4 items-center">
                <div class="relative flex-1 min-w-[200px]">
                    <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input v-model="search" type="text" placeholder="Rechercher une action, un utilisateur..."
                        class="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all bg-gray-50/30" />
                </div>
                <select v-model="selectedEnterprise"
                    class="px-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50/30 outline-none">
                    <option value="">Toutes les entreprises</option>
                    <option v-for="ent in entreprises" :key="ent.id" :value="ent.id">{{ ent.name }}</option>
                </select>
            </div>

            <!-- Activities List -->
            <div class="bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="bg-gray-50/50 border-b border-gray-100">
                                <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Utilisateur</th>
                                <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Action</th>
                                <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Entreprise</th>
                                <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Date</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="log in filteredActivities" :key="log.id"
                                class="hover:bg-gray-50/30 transition-colors">
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-3">
                                        <div class="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                            <UserIcon class="w-4 h-4 text-orange-600" />
                                        </div>
                                        <span class="text-sm font-bold text-gray-900">{{ log.user?.username ||
                                            log.worker?.name || 'System' }}</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="text-xs font-medium text-gray-600">{{ log.action }}</span>
                                </td>
                                <td class="px-6 py-4">
                                    <span
                                        class="px-2 py-1 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-black uppercase">{{
                                        log.entreprise?.name || 'Global' }}</span>
                                </td>
                                <td class="px-6 py-4 text-xs font-bold text-gray-400">
                                    {{ formatDate(log.created_at) }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStatisticsStore } from '@/stores/statisticStore'
import { useEntrepriseStore } from '@/stores/entrepriseStore'
import { MagnifyingGlassIcon, ArrowPathIcon, UserIcon } from '@heroicons/vue/24/outline'

const statsStore = useStatisticsStore()
const enterpriseStore = useEntrepriseStore()

const search = ref('')
const selectedEnterprise = ref('')

const filteredActivities = computed(() => {
    let logs = statsStore.globalActivities
    if (search.value) {
        const q = search.value.toLowerCase()
        logs = logs.filter(l =>
            l.action.toLowerCase().includes(q) ||
            l.user?.username?.toLowerCase().includes(q) ||
            l.worker?.name?.toLowerCase().includes(q)
        )
    }
    if (selectedEnterprise.value) {
        logs = logs.filter(l => l.entreprise_id === Number(selectedEnterprise.value))
    }
    return logs
})

const entreprises = computed(() => enterpriseStore.entreprises)

const formatDate = (date) => {
    return new Date(date).toLocaleString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const refreshData = async () => {
    await statsStore.fetchAdminDashboard()
}

onMounted(async () => {
    await statsStore.fetchAdminDashboard()
    if (!enterpriseStore.entreprises.length) {
        await enterpriseStore.fetchEntreprises()
    }
})
</script>
