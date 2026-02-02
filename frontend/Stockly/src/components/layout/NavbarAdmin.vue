<template>
  <n-layout has-sider class="h-screen">
    <n-layout-sider bordered collapse-mode="width" :collapsed-width="64" :width="250" :collapsed="collapsed"
      show-trigger @collapse="collapsed = true" @expand="collapsed = false" class="bg-white">
      <div class="h-16 flex items-center justify-center p-4 border-b border-gray-100">
        <img :src="Iventello" alt="Logo" class="max-h-8" v-if="!collapsed" />
        <img :src="Iventello" alt="Logo" class="max-h-6" v-else />
      </div>

      <n-menu v-model:value="activeKey" :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="22"
        :options="menuOptions" />

      <div class="absolute bottom-4 left-0 w-full px-4" v-if="!collapsed">
        <div class="border-t border-gray-100 pt-4">
          <n-dropdown trigger="click" :options="userOptions" @select="handleUserAction">
            <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <n-avatar round size="small" :style="{ backgroundColor: 'var(--n-primary-color)' }">
                {{ userInitials }}
              </n-avatar>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ userName }}</p>
                <p class="text-xs text-gray-500 truncate">{{ userEmail }}</p>
              </div>
            </div>
          </n-dropdown>
        </div>
      </div>
      <div class="absolute bottom-4 left-0 w-full flex justify-center" v-else>
        <n-dropdown trigger="click" :options="userOptions" @select="handleUserAction">
          <n-avatar round size="small" class="cursor-pointer" :style="{ backgroundColor: 'var(--n-primary-color)' }">
            {{ userInitials }}
          </n-avatar>
        </n-dropdown>
      </div>
    </n-layout-sider>

    <n-layout class="bg-gray-50">
      <n-layout-header bordered class="h-16 flex items-center justify-between px-6 bg-white/80 backdrop-blur-sm z-10">
        <div>
          <h2 class="text-lg font-semibold text-gray-800">
            Welcome back, <span class="text-orange-500">{{ userFirstName }}!</span>
          </h2>
        </div>

        <div class="flex items-center gap-4">
          <n-button circle quaternary>
            <template #icon>
              <n-icon>
                <BellIcon />
              </n-icon>
            </template>
          </n-button>
          <n-button circle quaternary>
            <template #icon>
              <n-icon>
                <Cog6ToothIcon />
              </n-icon>
            </template>
          </n-button>
        </div>
      </n-layout-header>

      <n-layout-content content-style="padding: 24px; min-height: calc(100vh - 64px);" :native-scrollbar="false">
        <slot></slot>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup>
import { ref, computed, h, watchEffect } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'
import Iventello from '@/assets/iventello.png'
import {
  NLayout,
  NLayoutSider,
  NLayoutHeader,
  NLayoutContent,
  NMenu,
  NDropdown,
  NAvatar,
  NButton,
  NIcon
} from 'naive-ui'
import {
  Squares2X2Icon,
  ClipboardDocumentListIcon,
  ListBulletIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  BellIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const collapsed = ref(false)
const activeKey = ref(null)

// Sync active menu item with route
watchEffect(() => {
  activeKey.value = route.path
})

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions = [
  {
    label: () => h(RouterLink, { to: '/ad/dashboard' }, { default: () => 'Tableau de Bord' }),
    key: '/ad/dashboard',
    icon: renderIcon(Squares2X2Icon)
  },
  {
    label: () => h(RouterLink, { to: '/ad/reports' }, { default: () => 'Rapports' }),
    key: '/ad/reports',
    icon: renderIcon(ClipboardDocumentListIcon)
  },
  {
    label: () => h(RouterLink, { to: '/ad/activities' }, { default: () => 'Audit Trail' }),
    key: '/ad/activities',
    icon: renderIcon(ListBulletIcon)
  },
  {
    label: () => h(RouterLink, { to: '/ad/admin' }, { default: () => 'Compagnies' }),
    key: '/ad/admin',
    icon: renderIcon(BuildingOfficeIcon)
  },
  {
    label: () => h(RouterLink, { to: '/ad/workers' }, { default: () => 'Employés' }),
    key: '/ad/workers',
    icon: renderIcon(UserGroupIcon)
  },
  {
    label: () => h(RouterLink, { to: '/ad/settings' }, { default: () => 'Paramètres' }),
    key: '/ad/settings',
    icon: renderIcon(Cog6ToothIcon)
  }
]

const userOptions = [
  {
    label: 'Sign Out',
    key: 'logout',
    icon: renderIcon(ArrowRightOnRectangleIcon)
  }
]

const handleUserAction = (key) => {
  if (key === 'logout') {
    authStore.logout()
    router.push('/login')
  }
}

// User data
const userName = computed(() => authStore.user ? `${authStore.user.username || ''} ${authStore.user.Last_name || ''}`.trim() : 'Demo User')
const userFirstName = computed(() => authStore.user?.username || 'User')
const userEmail = computed(() => authStore.user?.email || 'demo@demo.com')
const userInitials = computed(() => {
  if (!authStore.user) return 'DU'
  const first = authStore.user.username?.[0] || ''
  const last = authStore.user.Last_name?.[0] || ''
  return `${first}${last}`.toUpperCase()
})
</script>
