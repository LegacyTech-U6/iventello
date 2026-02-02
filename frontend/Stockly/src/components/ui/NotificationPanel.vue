<template>
  <div class="h-full">
    <div v-if="notifications.length > 0" class="mb-4 flex justify-between items-center px-1">
      <span class="text-xs font-bold text-gray-400 uppercase">Récents</span>
      <n-button text type="primary" size="tiny" @click="markAllAsRead">
        Tout marquer comme lu
      </n-button>
    </div>

    <div v-if="notifications.length === 0" class="flex flex-col items-center justify-center py-10 text-center">
      <n-empty description="Vous n'avez aucune nouvelle notification." size="large" />
    </div>

    <n-list v-else hoverable clickable>
      <n-list-item v-for="notif in sortedNotifications" :key="notif.id" :class="{ 'bg-emerald-50/40': !notif.read }">
        <template #prefix>
          <div :class="['p-2 rounded-lg flex items-center justify-center', getNotifStyle(notif.type).bg]">
            <n-icon size="20" :class="getNotifStyle(notif.type).text" :component="getNotifStyle(notif.type).icon" />
          </div>
        </template>
        <n-thing content-style="margin-top: 0;">
          <template #header>
            <span class="text-xs font-bold uppercase tracking-wide">{{ notif.type || 'Alerte' }}</span>
            <span class="text-[10px] text-gray-400 ml-2 font-normal">{{ formatTime(notif.date || notif.createdAt)
              }}</span>
          </template>
          <div class="text-sm text-gray-800 leading-snug mt-1 font-medium">{{ notif.message }}</div>
        </n-thing>
        <template #suffix>
          <n-button v-if="!notif.read" circle size="small" quaternary type="success" @click.stop="markAsRead(notif.id)">
            <template #icon><n-icon :component="CheckIcon" /></template>
          </n-button>
        </template>
      </n-list-item>
    </n-list>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { NList, NListItem, NThing, NButton, NIcon, NEmpty } from 'naive-ui'
import {
  BellIcon, ShoppingCartIcon, ExclamationTriangleIcon,
  CubeIcon, RectangleGroupIcon, CheckIcon
} from '@heroicons/vue/24/outline'

const notificationStore = useNotificationStore()
const notifications = computed(() => notificationStore.notifications)

const sortedNotifications = computed(() => {
  return [...notifications.value].sort((a, b) => {
    const dateA = new Date(a.date || a.createdAt)
    const dateB = new Date(b.date || b.createdAt)
    return dateB - dateA
  })
})

const markAsRead = (id) => notificationStore.markAsRead(id)
const markAllAsRead = () => notificationStore.markAllAsRead()

const formatTime = (date) => {
  if (!date) return 'À l\'instant'
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr })
  } catch (e) {
    return 'Récemment'
  }
}

const getNotifStyle = (type) => {
  const styles = {
    sale: {
      icon: ShoppingCartIcon,
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
    },
    stock: {
      icon: ExclamationTriangleIcon,
      bg: 'bg-amber-50',
      text: 'text-amber-600',
    },
    product: {
      icon: CubeIcon,
      bg: 'bg-blue-50',
      text: 'text-blue-600',
    },
    category: {
      icon: RectangleGroupIcon,
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
    }
  }
  return styles[type] || {
    icon: BellIcon,
    bg: 'bg-gray-50',
    text: 'text-gray-600',
  }
}
</script>
