<template>
  <div class="p-6 space-y-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <p class="text-gray-400 text-xs mb-1">← Default Report</p>
        <h1 class="text-2xl font-bold text-gray-900">Transactions</h1>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm">
      <div class="flex-1 relative">
        <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none"
          stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input v-model="search" type="text" placeholder="Search Transactions"
          class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
      </div>

      <button
        class="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        Any transaction
      </button>

      <button
        class="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        This Month <span class="text-gray-400">01/10/2025 - 31/10/2025</span>
      </button>
    </div>

    <!-- Table Section -->
    <div v-if="loading" class="flex justify-center items-center h-64 bg-white rounded-lg text-gray-500">
      Chargement...
    </div>

    <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction Date ↓
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                QTY Change
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction Type
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction Notes
              </th>

              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-200">
            <tr v-for="activity in filteredActivities" :key="activity.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 text-gray-600">
                {{ formatDate(activity.createdAt) }}
              </td>
              <td class="px-6 py-4 text-gray-900 font-medium">
                {{ activity.product.Prod_name || 'banana' }}
              </td>
              <td :class="activity.action === 'Vente' || 'sale' ? 'text-red-600' : 'text-green-600'">
                {{ activity.action === 'Vente' || 'sale' ? '-' : '+' }}{{ activity.quantity || 0 }} units
              </td>

              <td class="px-6 py-4 text-gray-600">
                {{ getTransactionType(activity.action) }}
              </td>
              <td class="px-6 py-4 text-gray-400">
                {{ activity.description || '—' }}
              </td>

              <td class="px-6 py-4 text-gray-600">
                {{ activity.performed_by?.username || activity.performed_by?.name || '—' }}
              </td>

              <td class="px-6 py-4 text-gray-900">
                {{ activity.amount ? activity.amount.toFixed(2) : '200.00' }} FCFA
              </td>
              <td class="px-6 py-4 text-gray-900">{{ calculateValue(activity) }} FCFA</td>
            </tr>

            <tr v-if="filteredActivities.length === 0">
              <td colspan="10" class="text-center py-8 text-gray-500">Aucune activité trouvée.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <span>Show:</span>
          <select
            class="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
            <option>20</option>
            <option>50</option>
            <option>100</option>
          </select>
          <span>per page</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useActivityStore } from '@/stores/activityStore'

const activityStore = useActivityStore()
const loading = ref(true)
const search = ref('')

onMounted(async () => {
  await activityStore.fetchActivities()
  await activityStore.fetchDailySalesReport()
  loading.value = false
})

const activities = computed(() => activityStore.activities)

const filteredActivities = computed(() => {
  if (!search.value) return activities.value
  return activities.value.filter((a) =>
    Object.values(a).some((v) => String(v).toLowerCase().includes(search.value.toLowerCase())),
  )
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  const dateStr = d.toLocaleDateString('en-GB')
  return `${dateStr} ${time}`
}

const getTransactionType = (action) => {
  const types = {
    Sale: 'Sale of Goods',
    Vente: 'Sale of Goods',
    CREATE: 'Create',
    UPDATE: 'Update Quantity',
    DELETE: 'Delete',
    Achat: 'Purchase of Goods',
  }
  return types[action] || 'Update Quantity'
}

const calculateValue = (activity) => {
  const quantity = activity.quantity || 0
  const amount = activity.amount || 200
  return (Math.abs(quantity) * amount).toFixed(2)
}
</script>

<style scoped>
::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
