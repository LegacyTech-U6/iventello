// src/stores/notificationStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getNotifications, markNotificationAsRead } from '@/service/api'
import { io } from 'socket.io-client'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([])
  const loading = ref(false)
  const error = ref(null)
  const socket = ref(null)

  const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length)

  // 🔹 Fetch classique
  async function fetchNotifications() {
    loading.value = true
    error.value = null
    try {
      const data = await getNotifications()
      notifications.value = data
    } catch (err) {
      error.value = err.message || 'Failed to fetch notifications'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // 🔹 Marquer comme lu
  async function markAsRead(notificationId) {
    try {
      await markNotificationAsRead(notificationId)
      const notif = notifications.value.find((n) => n.id === notificationId)
      if (notif) notif.read = true
    } catch (err) {
      console.error('Failed to mark notification as read:', err)
    }
  }

  // 🔹 Connexion Socket.IO pour temps réel
  function connectSocket(userId, entrepriseId) {
    if (socket.value) return // déjà connecté

    const socketUrl = import.meta.env.VITE_API_URL.replace('/api', '')
    socket.value = io(socketUrl) // URL backend Socket.IO

    // Quand une nouvelle notification arrive
    socket.value.on('new-notification', (notif) => {
      console.log('🔔 Socket: New notification received:', notif)

      // Filtrage par entreprise pour le multi-tenant
      if (!notif.entreprise_id || notif.entreprise_id === entrepriseId) {
        notifications.value.unshift(notif)
      }
    })
  }

  function disconnectSocket() {
    socket.value?.disconnect()
    socket.value = null
  }

  return {
    notifications,
    loading,
    error,
    unreadCount,
    fetchNotifications,
    markAsRead,
    connectSocket,
    disconnectSocket,
  }
})
