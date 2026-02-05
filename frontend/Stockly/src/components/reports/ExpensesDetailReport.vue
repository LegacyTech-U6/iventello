<template>
    <n-card title="Détails des Dépenses" :bordered="false" class="rounded-2xl shadow-sm h-full"
        content-style="padding: 0;">
        <n-data-table :columns="columns" :data="expenses" :bordered="false" :pagination="{ pageSize: 5 }"
            v-if="expenses.length > 0" />
        <div v-else class="text-center py-8 text-gray-500">
            Aucune dépense enregistrée
        </div>
    </n-card>
</template>

<script setup>
import { h } from 'vue'
import { NCard, NDataTable } from 'naive-ui'
import { useCurrency } from '@/composable/useCurrency'

const props = defineProps({
    expenses: {
        type: Array,
        default: () => []
    }
})

const { format } = useCurrency()

const columns = [
    {
        title: 'Description',
        key: 'description',
        render(row) {
            return h('span', { class: 'text-sm text-gray-900' }, row.description)
        }
    },
    {
        title: 'Montant',
        key: 'amount',
        render(row) {
            return h('span', { class: 'text-sm font-bold text-red-600' }, format(row.amount))
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
