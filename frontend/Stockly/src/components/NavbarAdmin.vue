<template>
  <div class="flex h-screen bg-gray-50/50">
    <!-- Mobile Menu Button -->
    <div class="fixed top-4 left-4 z-50 lg:hidden">
      <button
        @click="sidebarOpen = !sidebarOpen"
        class="p-2 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/60 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
      >
        <Menu v-if="!sidebarOpen" class="w-5 h-5 text-gray-600" />
        <X v-else class="w-5 h-5 text-gray-600" />
      </button>
    </div>

    <!-- Overlay for mobile -->
    <div
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
    ></div>

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed lg:static top-0 left-0 h-screen bg-white/95 backdrop-blur-md border-r border-gray-200/60 transition-all duration-500 z-40 flex flex-col',
        'w-72 lg:w-72',
        sidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full lg:translate-x-0 lg:shadow-sm',
      ]"
    >
      <!-- Logo -->
      <div class=" border-gray-200/50 p-5">
        <img :src="Iventello" alt="Logo" class="w-42" />
      </div>

      <!-- Navigation Menu -->
      <nav class="px-3 py-6 space-y-1 flex-1 overflow-y-auto">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50/80 transition-all duration-300"
          @click="closeSidebarOnMobile"
        >
          <span class="material-icons text-gray-700">{{ link.icon }}</span>
          <span class="text-gray-900 font-medium">{{ link.label }}</span>
        </RouterLink>
      </nav>

      <!-- User Profile Section -->
      <div class="mt-auto border-t border-gray-200/50 px-4 py-4">
        <div
          class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50/80 transition-all duration-300 cursor-pointer group"
        >
          <div
            class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0 shadow-sm"
          >
            {{ userInitials }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-900 truncate">{{ userName }}</p>
            <p class="text-xs text-gray-500 truncate">{{ userEmail }}</p>
          </div>
          <ChevronDown class="w-4 h-4 text-gray-400 flex-shrink-0 transition-transform group-hover:rotate-180 duration-300" />
        </div>
        <ValidationButton
        text="Sign Out"
        color="#0C333B"
        :asyncClick="logout"
        width="100%"
        class="rounded-xl hover:green-950"
         />
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <header
        class="bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-6 py-4  flex items-center"
      >
        <div class="flex items-center justify-between w-full">
          <h2 class="text-lg font-semibold text-gray-900 hidden sm:block">
            Welcome back, <span class="text-blue-600">{{ userFirstName }}!</span>
          </h2>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Menu, X, ChevronDown } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/authStore.js'
import Iventello from '@/assets/iventello.png'
import { RouterLink } from 'vue-router'
import ValidationButton from './ui/buttons/ValidationButton.vue'

const authStore = useAuthStore()
const sidebarOpen = ref(false)

const logout = () => {
  authStore.logout()
}

const navLinks = [
  { to: '/ad/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/ad/workers', icon: 'group', label: 'Workers' },
  { to: '/ad/admin', icon: 'business', label: 'Companies' },
  { to: '/ad/settings', icon: 'settings', label: 'Settings' },
]

// Computed user data
const userName = computed(() => authStore.user ? `${authStore.user.username || ''} ${authStore.user.Last_name || ''}`.trim() : 'Demo User')
const userFirstName = computed(() => authStore.user?.username || 'User')
const userEmail = computed(() => authStore.user?.email || 'demo@demo.com')
const userInitials = computed(() => {
  if (!authStore.user) return 'DU'
  const first = authStore.user.username?.[0] || ''
  const last = authStore.user.Last_name?.[0] || ''
  return `${first}${last}`.toUpperCase()
})

const closeSidebarOnMobile = () => {
  if (window.innerWidth < 1024) sidebarOpen.value = false
}

if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) sidebarOpen.value = false
  })
}
</script>
