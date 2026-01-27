<template>
  <div class="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9">
            </path>
          </svg>
        </div>
        <h2 class="text-lg font-semibold text-gray-900">Notifications</h2>
      </div>
      <span class="bg-gray-900 text-white rounded-lg px-2.5 py-1 text-xs font-semibold">
        {{ notifications.length }}
      </span>
    </div>

    <!-- Notifications List -->
    <div class="space-y-3">
      <div v-if="notifications.length > 0" class="space-y-3">
        <div v-for="notif in notifications" :key="notif.id"
          class="p-4 border rounded-lg hover:border-gray-300 transition-all duration-200 group"
          :class="getNotificationBgClass(notif.type)">
          <div class="flex items-start gap-3">
            <!-- Icon -->
            <div class="flex-shrink-0 mt-0.5">
              <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                :class="getNotificationIconBgClass(notif.type)">
                <component :is="getNotificationIcon(notif.type)" class="w-4 h-4"
                  :class="getNotificationIconColor(notif.type)" />
              </div>
            </div>
            <!-- Content -->
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-gray-900 text-sm">{{ notif.title }}</p>
              <p class="text-xs text-gray-600 mt-1 line-clamp-2">{{ notif.description }}</p>
              <p class="text-xs text-gray-500 mt-2">{{ notif.timestamp }}</p>
            </div>
            <!-- Close Button -->
            <button @click="$emit('remove', notif.id)"
              class="flex-shrink-0 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-8">
        <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
          <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
          </svg>
        </div>
        <p class="text-gray-500 text-sm font-medium">No notifications</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { BellIcon, ExclamationTriangleIcon, CheckCircleIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { defineProps, defineEmits } from 'vue'

defineProps({
  notifications: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['remove'])

const getNotificationIcon = (type) => {
  const icons = {
    'low-stock': ExclamationTriangleIcon,
    restock: CheckCircleIcon,
    supplier: PlusIcon,
  }
  return icons[type] || BellIcon
}

const getNotificationIconColor = (type) => {
  const colors = {
    'low-stock': 'text-yellow-600',
    restock: 'text-emerald-600',
    supplier: 'text-blue-600',
  }
  return colors[type] || 'text-gray-600'
}

const getNotificationIconBgClass = (type) => {
  const bgClasses = {
    'low-stock': 'bg-yellow-100',
    restock: 'bg-emerald-100',
    supplier: 'bg-blue-100',
  }
  return bgClasses[type] || 'bg-gray-100'
}

const getNotificationBgClass = (type) => {
  const bgClasses = {
    'low-stock': 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100/40',
    restock: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100/40',
    supplier: 'bg-blue-50 border-blue-200 hover:bg-blue-100/40',
  }
  return bgClasses[type] || 'bg-gray-50 border-gray-200'
}
</script>
