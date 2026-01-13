<template>
  <div class="flex h-screen bg-gray-50">
    
    <div class="fixed top-0 left-0 right-0 z-50 lg:hidden bg-white border-b border-gray-100 shadow-sm">
      <div class="flex items-center justify-between px-4 h-16">
        <button @click="sidebarOpen = !sidebarOpen" class="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
          <Menu v-if="!sidebarOpen" :size="24" />
          <X v-else :size="24" />
        </button>
        <div class="flex items-center gap-2">
          <img :src="Iventello" alt="Logo" class="h-8 w-auto" />
        </div>
        <button @click="toggleNotificationPanel" class="relative p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
          <Bell :size="24" />
          <span v-if="unreadCount > 0" class="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="sidebarOpen && !isDesktop" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" @click="sidebarOpen = false"></div>
    </Transition>

    <aside 
      class="fixed lg:static top-0 left-0 h-screen z-50 flex flex-col transition-all duration-300 ease-in-out shadow-xl lg:shadow-none bg-emerald-700 text-white"
      :class="[
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0', // Gestion Mobile
        isExpanded ? 'w-64' : 'w-20' // Gestion Desktop (Large vs Fin)
      ]"
    >
      
      <div class="h-20 flex items-center justify-center border-b border-emerald-600/50 mx-2 relative">
        <div class="hidden lg:flex font-bold text-2xl italic tracking-tighter transition-all duration-300 overflow-hidden whitespace-nowrap">
          <span v-if="isExpanded">Iventello</span>
          <span v-else>I<span class="text-emerald-300">v</span></span>
        </div>
        <img :src="Iventello" alt="Logo" class="lg:hidden h-8 w-auto brightness-0 invert" />
      </div>

      <nav class="flex-1 overflow-y-auto overflow-x-visible custom-scrollbar py-4 px-3 space-y-2">
        
        <template v-for="group in groupedMenu" :key="group.id">
          <div v-if="isExpanded || !isDesktop" class="px-3 mt-6 mb-2 text-xs font-bold text-emerald-200/60 uppercase tracking-widest transition-opacity duration-300 delay-100">
            {{ group.label }}
          </div>
          <div v-else class="my-4 border-t border-emerald-600/50 mx-2"></div>

          <div v-for="item in group.items" :key="item.path">
            <router-link 
              v-if="!item.permission || authStore.can(item.permission)"
              :to="item.path"
              @click="closeSidebarOnMobile"
              class="group relative flex items-center rounded-xl transition-all duration-200"
              :class="[
                isActive(item.path) ? 'bg-white text-emerald-800 shadow-md' : 'text-emerald-50 hover:bg-emerald-600 hover:text-white',
                isExpanded ? 'px-4 py-3 gap-3' : 'justify-center py-3 px-2'
              ]"
            >
              <component :is="item.icon" :size="22" stroke-width="2" class="flex-shrink-0" />

              <span v-if="isExpanded" class="font-medium text-sm whitespace-nowrap overflow-hidden transition-all">
                {{ item.label }}
              </span>

              <span v-if="item.count > 0" 
                    class="bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-emerald-700 group-hover:border-emerald-600"
                    :class="isExpanded ? 'ml-auto px-2 py-0.5' : 'absolute top-1 right-1 w-4 h-4'">
                {{ item.count > 9 ? '9+' : item.count }}
              </span>

              <div v-if="!isExpanded && isDesktop"
                   class="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                {{ item.label }}
                <div class="absolute top-1/2 right-full -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
              </div>
            </router-link>
          </div>
        </template>
      </nav>

      <div class="p-3 border-t border-emerald-600/50 bg-emerald-800/30">
        
        <button @click="toggleSidebarSize" 
                class="hidden lg:flex w-full items-center justify-center p-2 rounded-lg hover:bg-emerald-600/50 text-emerald-200 transition-colors mb-2 group"
                :title="isExpanded ? 'Réduire le menu' : 'Agrandir le menu'">
          <PanelLeftClose v-if="isExpanded" :size="20" />
          <PanelLeftOpen v-else :size="20" />
        </button>

        <div class="flex flex-col gap-1">
           <router-link v-if="authStore.can('canAccessSettings')" :to="ActivityRoute"
             class="group relative flex items-center rounded-lg hover:bg-emerald-600/50 text-emerald-100 transition-colors"
             :class="isExpanded ? 'px-3 py-2 gap-3' : 'justify-center py-2'">
            <Settings :size="20" />
            <span v-if="isExpanded" class="text-sm">Paramètres</span>
             <div v-if="!isExpanded" class="absolute left-full ml-4 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 z-50 whitespace-nowrap">Paramètres</div>
          </router-link>

          <button @click="logoutEntreprise" 
                  class="group relative flex items-center rounded-lg hover:bg-red-500/20 hover:text-red-100 text-emerald-200 transition-colors"
                  :class="isExpanded ? 'px-3 py-2 gap-3' : 'justify-center py-2'">
            <LogOut :size="20" />
            <span v-if="isExpanded" class="text-sm">Déconnexion</span>
             <div v-if="!isExpanded" class="absolute left-full ml-4 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 z-50 whitespace-nowrap">Déconnexion</div>
          </button>
        </div>
      </div>

    </aside>

    <div class="flex-1 flex flex-col h-screen overflow-hidden relative transition-all duration-300">
      
      <header class="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">{{ pageTitle }}</h1>
          <p class="text-sm text-gray-400 mt-1 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span> {{ formattedDate }}
          </p>
        </div>
        <div class="flex items-center gap-6">
          <button @click="toggleNotificationPanel" class="relative group p-2 rounded-full hover:bg-gray-100">
            <Bell :size="22" class="text-gray-600 group-hover:text-emerald-600" />
            <span v-if="unreadCount > 0" class="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>
          <div class="flex items-center gap-3 pl-6 border-l border-gray-100">
            <div class="text-right">
              <p class="text-sm font-semibold text-gray-800">{{ userName }}</p>
              <p class="text-xs text-gray-500">{{ userRoleDisplay }}</p>
            </div>
            <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              {{ userInitials }}
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto bg-gray-50/50 p-4 lg:p-8 pt-20 lg:pt-8 custom-scrollbar">
        <div class="max-w-8xl mx-auto">
          <slot></slot>
        </div>
      </main>
    </div>

    <NotificationPanel v-model:notificationOpen="notificationOpen" @close="notificationOpen = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useEntrepriseStore } from '@/stores/entrepriseStore'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notificationStore'
import NotificationPanel from '@/components/ui/NotificationPanel.vue'
import Iventello from '@/assets/iventello.png'

// Lucide Icons
import {
  LayoutDashboard, Package, Shapes, TrendingDown, Tag, ShoppingCart, FileText,
  Users, BarChart3, Menu, X, Bell, Settings, LogOut,
  PanelLeftClose, PanelLeftOpen // Nouveaux icônes pour le toggle
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const entrepriseStore = useEntrepriseStore()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

// STATE
const sidebarOpen = ref(false) // Pour Mobile
const isExpanded = ref(false)  // Pour Desktop (Stretch state)
const notificationOpen = ref(false)
const isDesktop = ref(window.innerWidth >= 1024)
const formattedDate = ref(new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }))

// Mock Data
const lowStockCount = ref(0)
const outOfStockCount = ref(0)
const unreadCount = computed(() => notificationStore.unreadCount)

// Helper Route & Menu Logic
const currentUuid = computed(() => route.params.uuid || authStore.user?.entrepriseUuid)
const getPath = (suffix) => `/${currentUuid.value}/${suffix}`

const menuStructure = computed(() => [
  {
    id: 'main', label: 'Principal',
    items: [{ label: 'Tableau de bord', icon: LayoutDashboard, path: getPath('dashboard'), permission: 'canViewDashboard' }]
  },
  {
    id: 'inventory', label: 'Inventaire',
    items: [
      { label: 'Produits', icon: Package, path: getPath('products'), permission: 'canManageStock' },
      { label: 'Catégories', icon: Shapes, path: getPath('categories'), permission: 'canManageStock' },
      { label: 'Stock faible', icon: TrendingDown, path: getPath('lowStock'), permission: 'canManageStock', count: lowStockCount.value },
      { label: 'Rupture', icon: Tag, path: getPath('outOfStock'), permission: 'canManageStock', count: outOfStockCount.value }
    ]
  },
  {
    id: 'commercial', label: 'Ventes & Rapports',
    items: [
      { label: 'Ventes', icon: ShoppingCart, path: getPath('sales'), permission: 'canMakeSales' },
      { label: 'Factures', icon: FileText, path: getPath('invoices'), permission: 'canViewInvoices' },
      { label: 'Clients', icon: Users, path: getPath('clients'), permission: 'canMakeSales' },
      { label: 'Rapports', icon: BarChart3, path: getPath('reports'), permission: 'canViewDashboard' }
    ]
  }
])
const groupedMenu = computed(() => menuStructure.value)
const ActivityRoute = computed(() => getPath('AuditTrail'))

// Computed Properties
const pageTitle = computed(() => {
  const titles = { dashboard: 'Tableau de bord', products: 'Produits', categories: 'Catégories', sales: 'Ventes', invoices: 'Factures', clients: 'Clients', reports: 'Rapports', lowStock: 'Stock Faible', outOfStock: 'Rupture de Stock', AuditTrail: 'Journal' }
  const key = route.path.split('/').pop()
  return titles[key] || 'Iventello'
})

const userName = computed(() => `${authStore.user?.username || ''} ${authStore.user?.Last_name || ''}`.trim() || 'Utilisateur')
const userInitials = computed(() => ((authStore.user?.username?.[0] || '') + (authStore.user?.Last_name?.[0] || '')).toUpperCase() || 'U')
const userRoleDisplay = computed(() => authStore.isAdmin ? 'Admin' : (authStore.user?.roleName || 'Staff'))

// Functions
const isActive = (path) => route.path === path
const toggleNotificationPanel = () => { notificationOpen.value = !notificationOpen.value; if (notificationOpen.value) notificationStore.fetchNotifications() }
const closeSidebarOnMobile = () => { if (!isDesktop.value) sidebarOpen.value = false }
const toggleSidebarSize = () => { isExpanded.value = !isExpanded.value } // Action du bouton stretch
const logoutEntreprise = () => { entrepriseStore.clearActiveEntreprise(); authStore.user?.type === 'admin' ? authStore.logout('backToAdmin') : authStore.logout() }

watch(sidebarOpen, (v) => v && (notificationOpen.value = false))
const handleResize = () => { isDesktop.value = window.innerWidth >= 1024; if (isDesktop.value) sidebarOpen.value = false }

onMounted(async () => {
  window.addEventListener('resize', handleResize)
  if (authStore.token && !authStore.user) await authStore.getAccount()
})
onUnmounted(() => window.removeEventListener('resize', handleResize))
</script>

<style scoped>
/* Animations */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 4px; }
main.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; }
</style>