<template>
  <Transition name="slide-fade" appear>
    <div v-if="notificationOpen"
      class="fixed top-0 right-0 h-screen w-96 bg-white/95 backdrop-blur-md z-50 flex flex-col shadow-2xl border-l border-gray-200/60">
      <!-- Panel Header -->
      <div class="bg-gray-50/80 px-6 py-5 border-b border-gray-200/60 flex justify-between items-center">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Notifications</h2>
          <p class="text-sm text-gray-600 mt-1">
            You have {{ unreadCount }} unread notification{{ unreadCount !== 1 ? 's' : '' }}
          </p>
        </div>
        <button @click="$emit('update:notificationOpen', false)"
          class="p-1.5 hover:bg-gray-200/50 rounded-lg transition-all duration-300">
          <XMarkIcon class="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <!-- Notifications List -->
      <div class="flex-1 overflow-y-auto">
        <div v-if="notifications.length === 0" class="flex items-center justify-center h-full">
          <div class="text-center">
            <BellIcon class="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p class="text-gray-500 text-lg font-medium">No notifications</p>
            <p class="text-gray-400 text-sm mt-2">You're all caught up!</p>
          </div>
        </div>

        <div v-else>
          <div v-for="notification in notifications" :key="notification.id" @click="markAsRead(notification.id)" :class="[
            'px-6 py-4 border-b border-gray-100 hover:bg-gray-50/80 cursor-pointer transition-all duration-300',
            notification.read ? 'bg-white' : 'bg-blue-50/50',
          ]">
            <div class="flex items-start gap-4">
              <div class="mt-1 flex-shrink-0" v-html="getNotificationIcon(notification.icon)"></div>
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start gap-2">
                  <h3 class="font-semibold text-gray-900 text-sm">{{ notification.title }}</h3>
                  <div v-if="!notification.read"
                    class="w-2.5 h-2.5 bg-blue-500 rounded-full mt-1 flex-shrink-0 ring-2 ring-blue-100"></div>
                </div>
                <p class="text-gray-600 text-sm mt-2 leading-relaxed">{{ notification.message }}</p>
                <div class="flex items-center justify-between mt-3">
                  <p class="text-xs text-gray-500 font-medium">{{ notification.company }}</p>
                  <p class="text-xs text-gray-400">{{ notification.time }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="notifications.length > 0" class="bg-gray-50/80 px-6 py-4 border-t border-gray-200/60">
        <button @click="markAllAsRead"
          class="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-300 py-2.5 rounded-lg hover:bg-blue-50/50">
          Mark all as read
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'
import { XMarkIcon, BellIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  notificationOpen: Boolean,
})
const emit = defineEmits(['update:notificationOpen'])

const notificationStore = useNotificationStore()
const notifications = computed(() => notificationStore.notifications)
const unreadCount = computed(() => notificationStore.unreadCount)

const markAsRead = (id) => notificationStore.markAsRead(id)
const markAllAsRead = () => notificationStore.markAllAsRead()

const getNotificationIcon = (icon) =>
  icon || '<svg class="w-6 h-6 text-gray-400"><circle cx="12" cy="12" r="10" /></svg>'
</script>

<style scoped>
/* Transition slide + fade */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: transform 0.35s ease, opacity 0.35s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  transform: translateX(0%);
  opacity: 1;
}
</style>
