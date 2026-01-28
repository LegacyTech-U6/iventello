<template>
  <Transition name="slide-fade">
    <div v-if="notificationOpen"
      class="fixed top-0 right-0 h-screen w-full sm:w-96 bg-white z-50 flex flex-col shadow-2xl border-l border-gray-100">

      <!-- Header -->
      <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
        <div>
          <h2 class="text-xl font-bold text-gray-900 tracking-tight">Notifications</h2>
          <div class="flex items-center gap-2 mt-1">
            <span class="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
            <p class="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              {{ unreadCount }} nouvelles alertes
            </p>
          </div>
        </div>
        <button @click="$emit('update:notificationOpen', false)"
          class="p-2 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-gray-600 transition-all active:scale-95">
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Filter/Actions -->
      <div v-if="notifications.length > 0"
        class="px-6 py-3 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
        <span class="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Récents</span>
        <button @click="markAllAsRead"
          class="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-all">
          Tout marquer comme lu
        </button>
      </div>

      <!-- List -->
      <div class="flex-1 overflow-y-auto custom-scrollbar bg-gray-50/30">
        <div v-if="notifications.length === 0" class="flex flex-col items-center justify-center h-full p-8 text-center">
          <div class="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mb-4 rotate-3">
            <BellIcon class="w-10 h-10 text-emerald-200" />
          </div>
          <h3 class="text-lg font-bold text-gray-800">Tout est calme</h3>
          <p class="text-sm text-gray-400 mt-2 max-w-[200px]">Vous n'avez aucune nouvelle notification pour le moment.
          </p>
        </div>

        <div v-else class="divide-y divide-gray-100/50">
          <TransitionGroup name="list">
            <div v-for="notif in sortedNotifications" :key="notif.id"
              class="group relative bg-white transition-all hover:bg-emerald-50/30"
              :class="{ 'border-l-4 border-emerald-500Shadow': !notif.read }">

              <div class="p-5 flex gap-4">
                <!-- Icon container -->
                <div :class="[
                  'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110',
                  getNotifStyle(notif.type).bg
                ]">
                  <component :is="getNotifStyle(notif.type).icon"
                    :class="['w-5 h-5', getNotifStyle(notif.type).text]" />
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-start mb-1">
                    <span :class="[
                      'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full',
                      getNotifStyle(notif.type).badge
                    ]">
                      {{ notif.type || 'Alerte' }}
                    </span>
                    <span class="text-[10px] font-medium text-gray-400 shrink-0">
                      {{ formatTime(notif.date || notif.createdAt) }}
                    </span>
                  </div>

                  <p class="text-sm leading-relaxed"
                    :class="notif.read ? 'text-gray-500 font-normal' : 'text-gray-900 font-semibold'">
                    {{ notif.message }}
                  </p>

                  <!-- Card Actions -->
                  <div class="mt-3 flex items-center gap-3">
                    <button v-if="!notif.read" @click.stop="markAsRead(notif.id)"
                      class="text-[11px] font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 group/btn transition-colors">
                      <CheckIcon class="w-3.5 h-3.5" />
                      Marquer comme lu
                    </button>
                  </div>
                </div>

                <!-- Unread indicator dot -->
                <div v-if="!notif.read" class="absolute top-5 right-5">
                  <span class="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="notifications.length > 5" class="p-4 border-t border-gray-100 bg-white">
        <p class="text-[10px] text-center text-gray-400 uppercase tracking-widest font-bold">
          Historique des 30 derniers jours
        </p>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  XMarkIcon, BellIcon, ShoppingCartIcon, ExclamationTriangleIcon,
  CubeIcon, RectangleGroupIcon, CheckIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  notificationOpen: Boolean,
})
const emit = defineEmits(['update:notificationOpen'])

const notificationStore = useNotificationStore()
const notifications = computed(() => notificationStore.notifications)
const unreadCount = computed(() => notificationStore.unreadCount)

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
      badge: 'bg-emerald-100 text-emerald-700'
    },
    stock: {
      icon: ExclamationTriangleIcon,
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      badge: 'bg-amber-100 text-amber-700'
    },
    product: {
      icon: CubeIcon,
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      badge: 'bg-blue-100 text-blue-700'
    },
    category: {
      icon: RectangleGroupIcon,
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      badge: 'bg-indigo-100 text-indigo-700'
    }
  }
  return styles[type] || {
    icon: BellIcon,
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    badge: 'bg-gray-100 text-gray-700'
  }
}
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Animations de liste */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

.border-l-4 {
  border-left-width: 4px;
}

.border-emerald-500Shadow {
  border-left-color: #10b981;
}
</style>
