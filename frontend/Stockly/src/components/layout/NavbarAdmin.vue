<template>
  <n-layout has-sider class="h-screen">
    <n-layout-sider v-if="!isMobile" bordered collapse-mode="width" :collapsed-width="64" :width="250"
      :collapsed="collapsed" show-trigger @collapse="collapsed = true" @expand="collapsed = false"
      class="bg-white dark:bg-gray-900 dark:border-gray-700">
      <div class="h-16 flex items-center justify-center p-4 border-b border-gray-100 dark:border-gray-800">
        <img :src="Iventello" alt="Logo" class="max-h-8" v-if="!collapsed" />
        <img :src="Iventello" alt="Logo" class="max-h-6" v-else />
      </div>

      <n-menu v-model:value="activeKey" :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="22"
        :options="menuOptions" />

      <div class="absolute bottom-4 left-0 w-full px-4" v-if="!collapsed">
        <div class="border-t border-gray-100 pt-4">
          <n-dropdown trigger="click" :options="userOptions" @select="handleUserAction">
            <div
              class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
              <n-avatar round size="small" :style="{ backgroundColor: 'var(--n-primary-color)' }">
                {{ userInitials }}
              </n-avatar>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ userName }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ userEmail }}</p>
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

    <n-drawer v-model:show="showMobileMenu" :width="280" placement="left">
      <n-drawer-content title="Menu" closable>
        <div class="flex flex-col h-full">
          <n-menu v-model:value="activeKey" :options="menuOptions" @update:value="showMobileMenu = false" />

          <div class="mt-auto border-t border-gray-100 dark:border-gray-800 pt-4">
            <div class="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
              <n-avatar round size="small" :style="{ backgroundColor: 'var(--n-primary-color)' }">
                {{ userInitials }}
              </n-avatar>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ userName }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ userEmail }}</p>
              </div>
              <n-button circle size="small" quaternary @click="handleUserAction('logout')">
                <template #icon><n-icon>
                    <ArrowRightOnRectangleIcon />
                  </n-icon></template>
              </n-button>
            </div>
          </div>
        </div>
      </n-drawer-content>
    </n-drawer>

    <n-layout class="bg-gray-50 dark:bg-gray-950">
      <n-layout-header bordered
        class="h-16 flex items-center justify-between px-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 dark:border-gray-800">
        <div class="flex items-center gap-4">
          <n-button v-if="isMobile" circle quaternary @click="showMobileMenu = true">
            <template #icon>
              <n-icon>
                <Bars3Icon />
              </n-icon>
            </template>
          </n-button>
          <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {{ $t('common.welcome_back') }} <span class="text-orange-500">{{ userFirstName }}!</span>
          </h2>
        </div>

        <div class="flex items-center gap-4">
          <LanguageSwitcher />
          <n-button circle quaternary @click="themeStore.toggleTheme">
            <template #icon>
              <n-icon>
                <MoonIcon v-if="!themeStore.isDark" />
                <SunIcon v-else />
              </n-icon>
            </template>
          </n-button>
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
import { useRefHistory, useBreakpoints, breakpointsTailwind } from '@vueuse/core'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'
import Iventello from '@/assets/iventello.png'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher.vue'
import { useI18n } from 'vue-i18n'
import {
  NLayout,
  NLayoutSider,
  NLayoutHeader,
  NLayoutContent,
  NMenu,
  NDropdown,
  NAvatar,
  NButton,
  NIcon,
  NDrawer,
  NDrawerContent
} from 'naive-ui'
import {
  Squares2X2Icon,
  ClipboardDocumentListIcon,
  ListBulletIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  Bars3Icon,
  MoonIcon,
  SunIcon
} from '@heroicons/vue/24/outline'
import { useThemeStore } from '@/stores/themeStore'

const authStore = useAuthStore()
const themeStore = useThemeStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const collapsed = ref(false)
const activeKey = ref(null)

const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('lg')
const showMobileMenu = ref(false)

// Sync active menu item with route
watchEffect(() => {
  activeKey.value = route.path
})

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions = computed(() => [
  {
    label: () => h(RouterLink, { to: '/ad/dashboard' }, { default: () => t('sidebar.dashboard') }),
    key: '/ad/dashboard',
    icon: renderIcon(Squares2X2Icon)
  },
  {
    label: () => h(RouterLink, { to: '/ad/reports' }, { default: () => t('sidebar.reports') }),
    key: '/ad/reports',
    icon: renderIcon(ClipboardDocumentListIcon)
  },
  {
    label: () => h(RouterLink, { to: '/ad/activities' }, { default: () => t('sidebar.audit_trail') }),
    key: '/ad/activities',
    icon: renderIcon(ListBulletIcon)
  },
  {
    label: () => h(RouterLink, { to: '/ad/admin' }, { default: () => t('sidebar.companies') }),
    key: '/ad/admin',
    icon: renderIcon(BuildingOfficeIcon)
  },
  {
    label: () => h(RouterLink, { to: '/ad/workers' }, { default: () => t('sidebar.workers') }),
    key: '/ad/workers',
    icon: renderIcon(UserGroupIcon)
  },
  {
    label: () => h(RouterLink, { to: '/ad/settings' }, { default: () => t('sidebar.settings') }),
    key: '/ad/settings',
    icon: renderIcon(Cog6ToothIcon)
  }
])

const userOptions = computed(() => [
  {
    label: t('sidebar.logout'),
    key: 'logout',
    icon: renderIcon(ArrowRightOnRectangleIcon)
  }
])

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
