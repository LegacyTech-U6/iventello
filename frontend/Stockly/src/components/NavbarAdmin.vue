<template>
  <div class="flex h-screen bg-gray-50/50">
    <!-- Mobile Header -->
    <div class="fixed top-0 left-0 right-0 z-50 lg:hidden bg-surface/80 backdrop-blur-md border-b border-outline-variant">
      <div class="flex items-center justify-between px-4 h-16">
        <!-- Mobile Menu Button -->
        <button
          @click="sidebarOpen = !sidebarOpen"
          class="p-2 -ml-2"
        >
          <span class="material-symbols-rounded w-6 h-6 text-on-surface">menu</span>
        </button>

        <!-- Mobile Logo -->
        <img :src="Iventello" alt="Logo" class="h-8" />

        <!-- Placeholder for alignment -->
        <div class="w-6"></div>

      </div>
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
        'w-72',
        sidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full lg:translate-x-0 lg:shadow-sm',
      ]"
    >
      <!-- Logo -->
      <div class=" border-gray-200/50 p-5">
        <img :src="Iventello" alt="Logo" class="w-42" />
      </div>
      
      <!-- Close button for mobile inside sidebar -->
      <button
        @click="sidebarOpen = false"
        class="absolute top-4 right-4 lg:hidden p-2"
      >
        <span class="material-symbols-rounded w-6 h-6 text-on-surface-variant">close</span>
      </button>


      <!-- Navigation Menu -->
      <nav class="px-3 py-6 space-y-1 flex-1 overflow-y-auto">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          :class="isActive(link.to) ? 'bg-primary-container text-primary' : 'text-on-surface-variant hover:bg-primary-container/50'"
          class="flex items-center gap-3 p-3 rounded-xl transition-all duration-200"
          @click="closeSidebarOnMobile"
        >
          <span class="material-symbols-rounded">{{ link.icon }}</span>
          <span class="font-medium text-sm">{{ link.label }}</span>
        </RouterLink>
      </nav>

      <!-- User Profile Section -->
      <div class="relative mt-auto border-t border-outline-variant px-4 py-3">
        <!-- User Menu Dropdown -->
        <div v-if="userMenuOpen" class="absolute bottom-full left-4 right-4 mb-2 bg-surface rounded-xl shadow-lg border border-outline-variant p-2">
          <ValidationButton
            text="Sign Out"
            :color="'var(--md-error-container)'"
            :customTextColor="'var(--md-on-error-container)'"
            :asyncClick="logout"
            width="100%"
            class="!justify-start"
          >
            <template #icon>
              <span class="material-symbols-rounded">logout</span>
            </template>
          </ValidationButton>
        </div>

        <!-- User Profile Clickable Area -->
        <div
          @click="userMenuOpen = !userMenuOpen"
          class="flex items-center gap-3 p-2 rounded-xl hover:bg-primary-container/50 transition-all duration-300 cursor-pointer group"
        >
          <div
            class="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center text-on-primary-container font-medium flex-shrink-0"
          >
            {{ userInitials }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-on-surface truncate">{{ userName }}</p>
            <p class="text-xs text-on-surface-variant truncate">{{ userEmail }}</p>
          </div>
          <span :class="userMenuOpen ? 'rotate-180' : ''" class="material-symbols-rounded w-5 h-5 text-on-surface-variant flex-shrink-0 transition-transform duration-300">expand_less</span>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <header 
        class="bg-surface/80 backdrop-blur-md border-b border-outline-variant px-6 py-4 flex items-center justify-between"
      >
        <!-- This h2 is part of the desktop header, but we need a placeholder on mobile for the flexbox to work -->
        <div class="lg:hidden"></div>

        <h2 class="text-lg font-semibold text-on-surface hidden lg:block">
          Welcome back, <span class="text-primary">{{ userFirstName }}!</span>
        </h2>
        <div class="flex items-center gap-4">
          <button class="p-2 rounded-full hover:bg-primary-container/50 text-on-surface-variant hover:text-primary transition-colors">
            <span class="material-symbols-rounded">notifications</span>
          </button>
          <button class="p-2 rounded-full hover:bg-primary-container/50 text-on-surface-variant hover:text-primary transition-colors">
            <span class="material-symbols-rounded">settings</span>
          </button>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto pt-16 lg:pt-0">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'
import Iventello from '@/assets/iventello.png'
import { RouterLink } from 'vue-router'
import ValidationButton from './ui/buttons/ValidationButton.vue'

const authStore = useAuthStore()
const route = useRoute()
const sidebarOpen = ref(false)
const userMenuOpen = ref(false)

const logout = () => {
  authStore.logout()
}

const navLinks = [
  { to: '/ad/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/ad/workers', icon: 'group', label: 'Workers' },
  { to: '/ad/admin', icon: 'business', label: 'Companies' },
  { to: '/ad/adminsettings', icon: 'settings', label: 'Settings' },
]

const isActive = (path) => {
  return route.path.startsWith(path)
}

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
