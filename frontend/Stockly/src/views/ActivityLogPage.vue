<template>
  <div class="p-6 space-y-6 bg-gray-50 h-full">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex space-x-2">
        <ArrowsRightLeftIcon class="w-6 h-6 text-gray-400" />

        <h1 class="text-2xl font-bold text-gray-900">Transactions</h1>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm">
      <div class="flex-1 relative">
        <MagnifyingGlassIcon class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input v-model="search" type="text" placeholder="Search Transactions"
          class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
      </div>


      <button
        class="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
        <CalendarIcon class="w-4 h-4" />
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
              <td
                :class="activity.action === 'Vente' || activity.action === 'Sale' ? 'text-red-600' : 'text-green-600'">
                {{ activity.action === 'Vente' || activity.action === 'Sale' ? '-' : '+' }}{{ activity.quantity || 0 }}
                units
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
                {{ format(activity.amount) || 0 }}
              </td>
              <td class="px-6 py-4 text-gray-900">{{ format(calculateValue(activity)) }}</td>
            </tr>

            <tr v-if="filteredActivities.length === 0">
              <td colspan="10" class="py-8">
                <div class="flex flex-col items-center justify-center space-y-4">
                  <img :src="multitasking" alt="recent activity" class="max-w-xs" />
                  <span class="text-gray-500 text-center">Aucune activité trouvée.</span>
                </div>
              </td>
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
import { ArrowsRightLeftIcon, MagnifyingGlassIcon, CalendarIcon } from '@heroicons/vue/24/outline'
import { useActivityStore } from '@/stores/activityStore'
import { useCurrency } from '@/composable/useCurrency'
import multitasking from '@/assets/image/multitasking.png'
const { format } = useCurrency()
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
  if (!action) return 'Update Quantity'

  const a = action.toLowerCase() // tout en minuscules

  if (a.includes('sale') || a.includes('vente')) return 'Sale of Goods'
  if (a.includes('create ')) return 'Created products'
  if (a.includes('update')) return 'Update Quantity'
  if (a.includes('delete')) return 'Delete'
  if (a.includes('achat') || a.includes('purchase')) return 'Purchase of Goods'

  return 'Update Quantity'
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
