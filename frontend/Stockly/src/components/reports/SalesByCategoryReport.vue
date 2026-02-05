<template>
  <n-card title="Ventes par Catégorie" :bordered="false" class="rounded-2xl shadow-sm h-full" content-style="padding: 0;">
    <n-data-table :columns="columns" :data="data" :bordered="false" :pagination="{ pageSize: 10 }" />
  </n-card>
</template>

<script setup>
import { h } from 'vue'
import { NCard, NDataTable } from 'naive-ui'
import { useCurrency } from '@/composable/useCurrency'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const { format } = useCurrency()

const columns = [
  {
    title: 'Catégorie',
    key: 'name',
    render(row) {
      return h('span', { class: 'text-sm font-bold text-gray-900' }, row.name)
    }
  },
  {
    title: 'Ventes',
    key: 'salesCount',
    render(row) {
      return h('span', { class: 'text-sm text-gray-700' }, row.salesCount)
    }
  },
  {
    title: 'Revenu',
    key: 'totalSales',
    render(row) {
      return h('span', { class: 'text-sm font-bold text-green-600' }, format(row.totalSales))
    }
  },
]
</script>
