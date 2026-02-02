<template>
  <n-card class="h-full rounded-xl shadow-sm border-gray-100" :bordered="false" content-style="padding: 1.5rem;">
    <template #header>
      <span class="text-lg font-semibold text-gray-800 dark:text-gray-100">Recent Activity</span>
    </template>
    <template #header-extra>
      <n-button text type="primary" @click="loadActivities">Refresh</n-button>
    </template>

    <div v-if="loading" class="flex justify-center py-4">
      <n-spin size="small" />
    </div>

    <n-empty v-else-if="activities.length === 0" description="No recent activity found" class="py-8" />

    <n-list v-else hoverable clickable>
      <n-list-item v-for="(activity, index) in recentActivities" :key="index">
        <template #prefix>
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
        </template>
        <n-thing :title="activity.description || 'Transaction'" :title-extra="formatDate(activity.createdAt)">
          <template #description>
            <span class="font-semibold" :class="activity.type === 'sale' ? 'text-green-600' : 'text-blue-600'"
              :style="activity.amount ? getDynamicStyle(activity.amount) : {}">
              {{ activity.amount ? format(activity.amount) : '-' }}
            </span>
          </template>
        </n-thing>
      </n-list-item>
    </n-list>
  </n-card>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useActivityStore } from '@/stores/activityStore'
import { storeToRefs } from 'pinia'
import { ArrowUpRightIcon, ArrowDownLeftIcon, BellIcon } from '@heroicons/vue/24/outline'
import { NCard, NButton, NList, NListItem, NThing, NSpin, NEmpty } from 'naive-ui'
import { useCurrency } from '@/composable/useCurrency'

const activityStore = useActivityStore()
const { activities, loading } = storeToRefs(activityStore)

const { format, getDynamicStyle } = useCurrency()

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
