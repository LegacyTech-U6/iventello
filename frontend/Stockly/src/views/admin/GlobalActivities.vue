<template>
    <div class="p-4 lg:p-8">
        <n-card class="rounded-2xl shadow-sm" :bordered="false" content-style="padding: 0;">
            <template #header>
                <div class="flex items-center justify-between px-6 py-4">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900">{{ $t('activities.title') }}</h1>
                        <p class="text-sm text-gray-500">{{ $t('activities.subtitle') }}</p>
                    </div>
                    <n-button circle secondary type="primary" @click="refreshData">
                        <template #icon>
                            <n-icon>
                                <ArrowPathIcon />
                            </n-icon>
                        </template>
                    </n-button>
                </div>
            </template>

            <div class="px-6 pb-4 flex flex-wrap gap-4">
                <n-input v-model:value="search" :placeholder="$t('activities.search_placeholder')"
                    class="min-w-[250px]">
                    <template #prefix>
                        <n-icon>
                            <MagnifyingGlassIcon />
                        </n-icon>
                    </template>
                </n-input>
                <n-select v-model:value="selectedEnterprise" :options="enterpriseOptions"
                    :placeholder="$t('activities.filter_all')" clearable class="min-w-[200px]" />
            </div>

            <n-data-table :columns="columns" :data="filteredActivities" :pagination="{ pageSize: 15 }"
                :bordered="false" />
        </n-card>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue'
import { useStatisticsStore } from '@/stores/statisticStore'
import { useEntrepriseStore } from '@/stores/entrepriseStore'
import { MagnifyingGlassIcon, ArrowPathIcon, UserIcon } from '@heroicons/vue/24/outline'
import {
    NCard,
    NDataTable,
    NButton,
    NIcon,
    NInput,
    NSelect,
    NAvatar,
    NTag,
    NSpace
} from 'naive-ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()


const statsStore = useStatisticsStore()
const enterpriseStore = useEntrepriseStore()

const search = ref('')
const selectedEnterprise = ref(null)

const filteredActivities = computed(() => {
    let logs = statsStore.globalActivities || []
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

const enterpriseOptions = computed(() => {
    return entreprises.value.map(ent => ({
        label: ent.name,
        value: ent.id
    }))
})

const formatDate = (date) => {
    return new Date(date).toLocaleString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const columns = [
    {
        title: t('activities.table.user'),
        key: 'user',
        render(row) {
            const name = row.user?.username || row.worker?.name || 'System'
            return h(NSpace, { align: 'center', size: 'small' }, {
                default: () => [
                    h('div', { class: 'w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center' }, [
                        h(NIcon, { class: 'text-orange-600' }, { default: () => h(UserIcon) })
                    ]),
                    h('span', { class: 'font-bold text-gray-900' }, { default: () => name })
                ]
            })
        }
    },
    {
        title: t('activities.table.action'),
        key: 'action',
        render(row) {
            return h('span', { class: 'font-medium text-gray-600' }, { default: () => row.action })
        }
    },
    {
        title: t('activities.table.company'),
        key: 'entreprise',
        render(row) {
            return h(NTag, { type: 'default', bordered: false, class: 'bg-gray-100 text-gray-500 font-bold uppercase text-[10px]' }, {
                default: () => row.entreprise?.name || 'Global'
            })
        }
    },
    {
        title: t('activities.table.date'),
        key: 'createdAt',
        render(row) {
            return h('span', { class: 'text-xs font-bold text-gray-400' }, { default: () => formatDate(row.createdAt) })
        }
    }
]

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
