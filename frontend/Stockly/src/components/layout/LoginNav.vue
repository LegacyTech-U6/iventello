<template>
  <n-layout class="h-screen bg-gray-50" has-sider>

    <!-- Mobile Sidebar (Drawer) -->
    <n-drawer v-model:show="mobileMenuOpen" :width="260" placement="left" class="lg:hidden">
      <n-drawer-content body-content-style="padding: 0;" :native-scrollbar="false">
        <div class="h-full flex flex-col bg-white">
          <div class="h-16 flex items-center justify-center border-b border-gray-100 gap-3">
            <div class="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <img :src="Iventello" alt="Logo" class="w-6 h-6 object-contain" />
            </div>
            <span class="font-bold text-lg tracking-tight text-gray-800">Iventello</span>
          </div>

          <n-menu :options="menuOptions" @update:value="handleMenuClick" class="mt-4" />

          <div class="mt-auto border-t border-gray-100 p-4">
            <n-dropdown trigger="click" :options="userOptions" @select="handleUserAction" placement="top">
              <div
                class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                <n-avatar round size="small" :style="{ backgroundColor: '#10b981', color: 'white' }">
                  {{ userInitials }}
                </n-avatar>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ userName }}</p>
                  <p class="text-xs text-gray-500 truncate">{{ userRoleDisplay }}</p>
                </div>
                <n-icon class="text-gray-400">
                  <ChevronUpIcon />
                </n-icon>
              </div>
            </n-dropdown>
          </div>
        </div>
      </n-drawer-content>
    </n-drawer>

    <!-- Desktop Sidebar -->
    <n-layout-sider v-if="isDesktop" bordered collapse-mode="width" :collapsed-width="64" :width="260"
      show-trigger="bar" :collapsed="collapsed" @update:collapsed="collapsed = $event"
      class="bg-white z-20 h-full shadow-sm">
      <div class="h-full flex flex-col bg-white">
        <div class="h-16 flex items-center justify-center border-b border-gray-100 gap-3 transition-all duration-300">
          <div class="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <img :src="Iventello" alt="Logo" class="w-6 h-6 object-contain" />
          </div>
          <span v-if="!collapsed"
            class="font-bold text-lg tracking-tight text-gray-800 transition-opacity duration-300">Iventello</span>
        </div>

        <n-menu :options="menuOptions" :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="22"
          @update:value="handleMenuClick" class="mt-4" />

        <div class="mt-auto border-t border-gray-100" :class="collapsed ? 'p-2' : 'p-4'">
          <n-dropdown trigger="click" :options="userOptions" @select="handleUserAction"
            :placement="collapsed ? 'right-end' : 'top'">
            <div
              class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-transparent"
              :class="{ 'justify-center': collapsed, 'hover:border-gray-200': !collapsed }">
              <n-avatar round size="small" :style="{ backgroundColor: '#10b981', color: 'white' }">
                {{ userInitials }}
              </n-avatar>
              <template v-if="!collapsed">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ userName }}</p>
                  <p class="text-xs text-gray-500 truncate">{{ userRoleDisplay }}</p>
                </div>
                <n-icon class="text-gray-400">
                  <ChevronUpIcon />
                </n-icon>
              </template>
            </div>
          </n-dropdown>
        </div>
      </div>
    </n-layout-sider>

    <!-- Main Content -->
    <n-layout class="bg-gray-50 h-full flex-1" :native-scrollbar="false"
      content-style="display: flex; flex-direction: column; height: 100%;">
      <n-layout-header
        class="h-16 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-4 lg:px-8 flex items-center justify-between shrink-0 z-30 transition-all duration-300">
        <div class="flex items-center gap-4">
          <n-button v-if="!isDesktop" text @click="mobileMenuOpen = true" class="lg:hidden text-gray-600">
            <template #icon><n-icon size="24">
                <Bars3Icon />
              </n-icon></template>
          </n-button>
          <div>
            <h1 class="text-xl font-bold text-gray-800 tracking-tight">{{ pageTitle }}</h1>
            <p class="text-xs text-gray-500 hidden sm:block">{{ formattedDate }}</p>
          </div>
        </div>

        <div class="flex items-center gap-4 md:gap-6">
          <LanguageSwitcher />

          <n-badge :value="unreadCount" :max="99">
            <n-button circle quaternary @click="toggleNotificationPanel">
              <template #icon><n-icon size="24" class="text-gray-500">
                  <BellIcon />
                </n-icon></template>
            </n-button>
          </n-badge>

          <!-- User Profile -->
          <div class="flex items-center gap-3 pl-6 border-l border-gray-100">
            <div class="text-right hidden md:block">
              <p class="text-sm font-semibold text-gray-800 leading-tight">{{ userName }}</p>
              <p
                class="text-[11px] font-medium text-emerald-600 uppercase tracking-wide bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                {{ userRoleDisplay }}</p>
            </div>
            <n-avatar round
              :style="{ backgroundColor: '#f3f4f6', color: '#4b5563', border: '2px solid white', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }">
              {{ userInitials }}
            </n-avatar>
          </div>
        </div>
      </n-layout-header>

      <n-layout-content class="flex-1" content-style="padding: 1rem;" :native-scrollbar="false">
        <div class="w-full h-full flex flex-col mx-auto animate-fade-in-up lg:p-2">
          <slot></slot>
        </div>
      </n-layout-content>
    </n-layout>

    <!-- Notification Drawer -->
    <n-drawer v-model:show="notificationOpen" :width="isDesktop ? 400 : '100%'" placement="right">
      <n-drawer-content title="Notifications" closable :native-scrollbar="false">
        <NotificationPanelContent />
      </n-drawer-content>
    </n-drawer>

    <!-- Global Loading Overlay -->
    <n-spin v-if="entrepriseStore.isSwitching" description="Chargement de l'entreprise..."
      class="fixed inset-0 z-[100] bg-white/80 flex items-center justify-center" size="large">
      <template #icon>
        <div class="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
      </template>
    </n-spin>
  </n-layout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useEntrepriseStore } from '@/stores/entrepriseStore'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { useInvoiceStore } from '@/stores/FactureStore'
import { useProductStore } from '@/stores/productStore'
import { useCategoryStore } from '@/stores/CategoryStore'
import { useStatisticsStore } from '@/stores/statisticStore'
import { useClientStore } from '@/stores/clientStore'
import NotificationPanelContent from '@/components/ui/NotificationPanel.vue'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher.vue'
import Iventello from '@/assets/iventello.png'
import { useI18n } from 'vue-i18n'

import { NLayout, NLayoutSider, NLayoutHeader, NLayoutContent, NMenu, NButton, NIcon, NBadge, NAvatar, NDrawer, NDrawerContent, NSpin, NDropdown, NTooltip } from 'naive-ui'
import {
  Squares2X2Icon, CubeIcon, RectangleGroupIcon, ArrowTrendingDownIcon, TagIcon, ShoppingCartIcon, DocumentTextIcon,
  UsersIcon, ChartBarIcon, Bars3Icon, BellIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon, BanknotesIcon, ChevronUpIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const entrepriseStore = useEntrepriseStore()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const { t } = useI18n()

const collapsed = ref(false)
const mobileMenuOpen = ref(false)
const notificationOpen = ref(false)
const isDesktop = ref(window.innerWidth >= 1024)
const formattedDate = ref(new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }))
const activeKey = ref(null)

const currentUuid = computed(() => route.params.uuid || authStore.user?.entrepriseUuid)
const getPath = (suffix) => `/${currentUuid.value}/${suffix}`

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions = computed(() => {
  const list = []
  if (authStore.can('canViewDashboard')) {
    list.push({ label: t('sidebar.dashboard'), key: getPath('dashboard'), icon: renderIcon(Squares2X2Icon) })
  }

  // Inventory Items (Flattened)
  list.push(...[
    authStore.can('canManageStock') ? { label: t('sidebar.products'), key: getPath('products'), icon: renderIcon(CubeIcon) } : null,
    authStore.can('canManageStock') ? { label: t('sidebar.categories'), key: getPath('categories'), icon: renderIcon(RectangleGroupIcon) } : null,
    authStore.can('canManageStock') ? { label: t('sidebar.low_stock'), key: getPath('lowStock'), icon: renderIcon(ArrowTrendingDownIcon) } : null,
    authStore.can('canManageStock') ? { label: t('sidebar.out_of_stock'), key: getPath('outOfStock'), icon: renderIcon(TagIcon) } : null,
  ].filter(Boolean))

  // Commercial Items (Flattened)
  list.push(...[
    authStore.can('canMakeSales') ? { label: t('sidebar.sales'), key: getPath('sales'), icon: renderIcon(ShoppingCartIcon) } : null,
    authStore.can('canViewInvoices') ? { label: t('sidebar.invoices'), key: getPath('invoices'), icon: renderIcon(DocumentTextIcon) } : null,
    authStore.can('canViewDashboard') ? { label: t('sidebar.expenses'), key: getPath('expenses'), icon: renderIcon(BanknotesIcon) } : null,
    authStore.can('canMakeSales') ? { label: t('sidebar.clients'), key: getPath('clients'), icon: renderIcon(UsersIcon) } : null,
    authStore.can('canViewDashboard') ? { label: t('sidebar.reports'), key: getPath('reports'), icon: renderIcon(ChartBarIcon) } : null,
    authStore.can('canAccessSettings') ? { label: t('sidebar.audit_trail'), key: getPath('AuditTrail'), icon: renderIcon(ChartBarIcon) } : null,
  ].filter(Boolean))

  return list
})

const userOptions = computed(() => [
  authStore.can('canAccessSettings') ? { label: t('sidebar.settings'), key: getPath('EntrepriseSettings'), icon: renderIcon(Cog6ToothIcon) } : null,
  { label: t('sidebar.logout'), key: 'logout', icon: renderIcon(ArrowRightOnRectangleIcon) }
].filter(Boolean))

const handleMenuClick = (key) => {
  if (key) router.push(key)
  mobileMenuOpen.value = false
}

const handleUserAction = (key) => {
  if (key === 'logout') logoutEntreprise()
  else {
    router.push(key)
    mobileMenuOpen.value = false
  }
}

const logoutEntreprise = () => {
  entrepriseStore.clearActiveEntreprise()
  useInvoiceStore().clearInvoices()
  useProductStore().clearProducts()
  useCategoryStore().clearCategories()
  useStatisticsStore().clearStats()
  useClientStore().clearClients()
  authStore.user?.type === 'admin' ? authStore.logout('backToAdmin') : authStore.logout()
}

const toggleNotificationPanel = () => {
  notificationOpen.value = !notificationOpen.value
  if (notificationOpen.value) notificationStore.fetchNotifications()
}

watch(() => route.path, (path) => { activeKey.value = path }, { immediate: true })

const handleResize = () => {
  isDesktop.value = window.innerWidth >= 1024
  if (isDesktop.value) mobileMenuOpen.value = false
}

const unreadCount = computed(() => notificationStore.unreadCount)
const userName = computed(() => `${authStore.user?.username || ''} ${authStore.user?.Last_name || ''}`.trim() || 'Utilisateur')
const userInitials = computed(() => ((authStore.user?.username?.[0] || '') + (authStore.user?.Last_name?.[0] || '')).toUpperCase() || 'U')
const userRoleDisplay = computed(() => authStore.isAdmin ? 'Administrateur' : (authStore.user?.roleName || 'Membre'))

const pageTitle = computed(() => {
  const titles = {
    dashboard: t('sidebar.dashboard'),
    products: t('sidebar.products'),
    categories: t('sidebar.categories'),
    sales: t('sidebar.sales'),
    invoices: t('sidebar.invoices'),
    clients: t('sidebar.clients'),
    reports: t('sidebar.reports'),
    lowStock: t('sidebar.low_stock'),
    outOfStock: t('sidebar.out_of_stock'),
    AuditTrail: t('sidebar.audit_trail'),
    expenses: t('sidebar.expenses'),
    EntrepriseSettings: t('sidebar.settings')
  }
  const key = route.path.split('/').pop()
  return titles[key] || 'Iventello'
})

onMounted(async () => {
  window.addEventListener('resize', handleResize)
  handleResize()
  if (authStore.token && !authStore.user) await authStore.getAccount()
  if (authStore.user) {
    notificationStore.connectSocket(authStore.user.id, authStore.user.entreprise_id)
    notificationStore.fetchNotifications()
  }
})

onUnmounted(() => window.removeEventListener('resize', handleResize))
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.4s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>