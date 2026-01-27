<template>
  <div class="bg-white rounded-xl shadow p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold text-gray-800">Recent Activity</h2>
      <button @click="loadActivities" class="text-sm text-blue-600 hover:underline">Refresh</button>
    </div>

    <div v-if="loading" class="text-gray-500 text-sm">Loading...</div>

    <div v-else-if="activities.length === 0" class="text-gray-500 text-sm">
      No recent activity found.
    </div>

    <ul v-else class="divide-y divide-gray-100">
      <li v-for="(activity, index) in recentActivities" :key="index" class="flex justify-between items-center py-3">
        <div class="flex items-center space-x-3">
          <!-- 🔹 Petite icône selon le type -->
          <div :class="[
            'w-10 h-10 rounded-full flex items-center justify-center',
            activity.action === 'sale'
              ? 'bg-green-100 text-green-600'
              : activity.action === 'purchase'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-yellow-100 text-yellow-600',
          ]">
            <ArrowUpRightIcon v-if="activity.action === 'Vente'" class="w-5 h-5" />
            <ArrowDownLeftIcon v-else-if="activity.action === 'purchase'" class="w-5 h-5" />
            <BellIcon v-else class="w-5 h-5" />
          </div>

          <!-- 🔹 Détails -->
          <div>
            <p class="font-medium text-gray-800">
              {{ activity.description || 'Transaction' }}
            </p>
            <p class="text-sm text-gray-500">
              {{ formatDate(activity.createdAt) }}
            </p>
          </div>
        </div>

        <!-- 🔹 Montant -->
        <p class="font-semibold" :class="activity.type === 'sale' ? 'text-green-600' : 'text-blue-600'">
          {{ activity.amount ? format(activity.amount) : '-' }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useActivityStore } from '@/stores/activityStore'
import { storeToRefs } from 'pinia'
import { ArrowUpRightIcon, ArrowDownLeftIcon, BellIcon } from '@heroicons/vue/24/outline'
const activityStore = useActivityStore()
const { activities, loading } = storeToRefs(activityStore)
import { useCurrency } from '@/composable/useCurrency'

const { format } = useCurrency()

const loadActivities = async () => {
  await activityStore.fetchActivities()
}

// 🧮 Garder uniquement les 5 dernières activités
const recentActivities = computed(() =>
  activities.value.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5),
)

// 🕓 Formatage de la date
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 🔄 Charger à l’ouverture
onMounted(loadActivities)
</script>

<style scoped>
.fa-solid {
  font-size: 1rem;
}
</style>
