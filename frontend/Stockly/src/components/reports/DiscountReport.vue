<template>
    <n-card title="Rapport des Remises" :bordered="false" class="rounded-2xl shadow-sm h-full"
        content-style="padding: 0;">
        <n-data-table :columns="columns" :data="discounts" :bordered="false" :pagination="{ pageSize: 5 }"
            v-if="discounts.length > 0" />
        <div v-else class="text-center py-8 text-gray-500">
            Aucune remise accordée
        </div>
    </n-card>
</template>

<script setup>
import { h } from 'vue'
import { NCard, NDataTable } from 'naive-ui'
import { useCurrency } from '@/composable/useCurrency'

const props = defineProps({
    discounts: {
        type: Array,
        default: () => []
    }
})

const { format } = useCurrency()

const columns = [
    {
        title: 'Client',
        key: 'client.name',
        render(row) {
            return h('span', { class: 'text-sm font-bold text-gray-900' }, row.client?.name || 'Client Inconnu')
        }
    },
    {
        title: 'Montant Facture',
        key: 'total_amount',
        render(row) {
            return h('span', { class: 'text-sm text-gray-700' }, format(row.total_amount))
        }
    },
    {
        title: 'Remise',
        key: 'discount',
        render(row) {
            return h('span', { class: 'text-sm font-bold text-purple-600' }, format(row.discount))
        }
    },
    {
        title: 'Date',
        key: 'createdAt',
        render(row) {
            const date = new Date(row.createdAt).toLocaleDateString('fr-FR')
            return h('span', { class: 'text-sm text-gray-500' }, date)
        }
    },
]
</script>
