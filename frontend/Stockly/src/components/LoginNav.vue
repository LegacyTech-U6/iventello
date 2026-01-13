<template>
  <div class="flex h-screen bg-gray-50 font-sans text-gray-600">
    
    <div class="fixed top-0 left-0 right-0 z-40 lg:hidden bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-4 h-16 flex items-center justify-between transition-all duration-200">
      <div class="flex items-center gap-3">
        <button 
          @click="sidebarOpen = true" 
          class="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors active:scale-95"
          aria-label="Ouvrir le menu"
        >
          <Menu :size="24" stroke-width="2.5" />
        </button>
        <span class="font-bold text-lg text-gray-800 tracking-tight">Iventello</span>
      </div>
      
      <button @click="toggleNotificationPanel" class="relative p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
        <Bell :size="24" />
        <span v-if="unreadCount > 0" class="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>
      </button>
    </div>

    <Transition
      enter-active-class="transition-opacity ease-linear duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity ease-linear duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="sidebarOpen && !isDesktop" class="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-50 lg:hidden" @click="sidebarOpen = false"></div>
    </Transition>

    <aside 
      class="fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200/60 transition-transform duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] lg:translate-x-0 lg:static shadow-2xl lg:shadow-none"
      :class="[
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        isExpanded ? 'w-72' : 'w-20'
      ]"
    >
      <div class="h-20 flex items-center px-6 relative" :class="isExpanded ? 'justify-start' : 'justify-center'">
        <button 
          v-if="!isDesktop" 
          @click="sidebarOpen = false"
          class="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 lg:hidden"
        >
          <X :size="20" />
        </button>

        <div class="flex items-center gap-3 overflow-hidden whitespace-nowrap">
           <div class="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <img :src="Iventello" alt="Logo" class="w-6 h-6 object-contain" />
           </div>
           
           <span 
             class="font-bold text-xl tracking-tight text-gray-800 transition-opacity duration-300"
             :class="isExpanded ? 'opacity-100' : 'opacity-0 hidden lg:block'"
           >
             Iventello
           </span>
        </div>
      </div>

      <nav class="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar py-4 px-3 space-y-1">
        <template v-for="group in groupedMenu" :key="group.id">
          
          <div 
            v-if="isExpanded || !isDesktop" 
            class="px-3 mt-6 mb-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider transition-opacity duration-300"
          >
            {{ group.label }}
          </div>
          <div v-else-if="group.id !== 'main'" class="my-3 mx-2 border-t border-gray-100"></div>

          <div v-for="item in group.items" :key="item.path">
            <router-link 
              v-if="!item.permission || authStore.can(item.permission)"
              :to="item.path"
              @click="closeSidebarOnMobile"
              class="group relative flex items-center rounded-xl transition-all duration-200 min-h-[44px]"
              :class="[
                isActive(item.path) 
                  ? 'bg-emerald-50 text-emerald-700 font-medium' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900',
                isExpanded ? 'px-3 gap-3' : 'justify-center px-2'
              ]"
            >
              <component 
                :is="item.icon" 
                :size="20" 
                class="flex-shrink-0 transition-colors"
                :class="isActive(item.path) ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-600'" 
              />

              <span v-if="isExpanded" class="text-sm whitespace-nowrap overflow-hidden transition-all">
                {{ item.label }}
              </span>

              <span v-if="item.count > 0" 
                class="flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full ring-2 ring-white"
                :class="isExpanded ? 'ml-auto h-5 px-1.5 min-w-[20px]' : 'absolute top-1 right-1 w-2.5 h-2.5 p-0 border-none !ring-0 !text-transparent overflow-hidden'">
                 {{ isExpanded ? (item.count > 99 ? '99+' : item.count) : '' }}
              </span>

              <div v-if="!isExpanded && isDesktop"
                   class="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg shadow-xl opacity-0 translate-x-[-10px] group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap">
                {{ item.label }}
                <div class="absolute top-1/2 right-full -translate-y-1/2 border-[5px] border-transparent border-r-gray-900"></div>
              </div>
            </router-link>
          </div>
        </template>
      </nav>

      <div class="p-3 border-t border-gray-100 bg-gray-50/50">
        
        <button @click="toggleSidebarSize" 
          class="hidden lg:flex w-full items-center justify-center p-2 rounded-lg text-gray-400 hover:bg-white hover:text-emerald-600 hover:shadow-sm transition-all mb-2 border border-transparent hover:border-gray-200"
          :title="isExpanded ? 'Réduire' : 'Agrandir'">
          <PanelLeftClose v-if="isExpanded" :size="18" />
          <PanelLeftOpen v-else :size="18" />
        </button>

        <div class="flex flex-col gap-1">
          <router-link v-if="authStore.can('canAccessSettings')" :to="SettingRoute"
             class="group relative flex items-center rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 text-gray-500 transition-all min-h-[40px]"
             :class="isExpanded ? 'px-3 gap-3' : 'justify-center'">
            <Settings :size="18" />
            <span v-if="isExpanded" class="text-sm">Paramètres</span>
             <div v-if="!isExpanded && isDesktop" class="absolute left-full ml-3 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 z-50 whitespace-nowrap pointer-events-none">Paramètres</div>
          </router-link>

          <button @click="logoutEntreprise" 
             class="group relative flex items-center rounded-lg hover:bg-red-50 hover:text-red-600 text-gray-500 transition-colors min-h-[40px]"
             :class="isExpanded ? 'px-3 gap-3' : 'justify-center'">
            <LogOut :size="18" />
            <span v-if="isExpanded" class="text-sm">Déconnexion</span>
             <div v-if="!isExpanded && isDesktop" class="absolute left-full ml-3 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 z-50 whitespace-nowrap pointer-events-none">Déconnexion</div>
          </button>
        </div>
      </div>
    </aside>

    <div class="flex-1 flex flex-col h-screen overflow-hidden relative bg-gray-50">
      
      <header class="hidden lg:flex items-center justify-between px-8 py-5 bg-white/80 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-30">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 tracking-tight">{{ pageTitle }}</h1>
          <p class="text-sm text-gray-400 mt-1 flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"></span> 
            {{ formattedDate }}
          </p>
        </div>
        <div class="flex items-center gap-6">
          <button @click="toggleNotificationPanel" class="relative group p-2.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all">
            <Bell :size="20" class="text-gray-500 group-hover:text-gray-700" />
            <span v-if="unreadCount > 0" class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>
          
          <div class="flex items-center gap-3 pl-6 border-l border-gray-100">
            <div class="text-right">
              <p class="text-sm font-semibold text-gray-800 leading-tight">{{ userName }}</p>
              <p class="text-[11px] font-medium text-emerald-600 uppercase tracking-wide bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                {{ userRoleDisplay }}
              </p>
            </div>
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-white shadow-sm text-gray-600 flex items-center justify-center font-bold text-sm">
              {{ userInitials }}
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-8 pt-20 lg:pt-8 custom-scrollbar">
        <div class="w-full max-w-[1600px] mx-auto animate-fade-in-up">
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
  PanelLeftClose, PanelLeftOpen
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const entrepriseStore = useEntrepriseStore()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

// STATE
const sidebarOpen = ref(false)
const isExpanded = ref(true) // Par défaut ouvert sur desktop pour le confort
const notificationOpen = ref(false)
const isDesktop = ref(window.innerWidth >= 1024)
const formattedDate = ref(new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })) // Ajout du jour de la semaine

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
    id: 'commercial', label: 'Commercial',
    items: [
      { label: 'Ventes', icon: ShoppingCart, path: getPath('sales'), permission: 'canMakeSales' },
      { label: 'Factures', icon: FileText, path: getPath('invoices'), permission: 'canViewInvoices' },
      { label: 'Clients', icon: Users, path: getPath('clients'), permission: 'canMakeSales' },
      { label: 'Rapports', icon: BarChart3, path: getPath('reports'), permission: 'canViewDashboard' },
      { label: 'Audit Trail', icon: BarChart3, path: getPath('AuditTrail'), permission: 'canAccessSettings' }
    ]
  }
])
const groupedMenu = computed(() => menuStructure.value)
const SettingRoute = computed(() => getPath('EntrepriseSettings'))

// Computed Properties
const pageTitle = computed(() => {
  const titles = { dashboard: 'Tableau de bord', products: 'Gestion des Produits', categories: 'Catégories', sales: 'Ventes', invoices: 'Facturation', clients: 'Répertoire Clients', reports: 'Rapports & Analytiques', lowStock: 'Alertes Stock Faible', outOfStock: 'Ruptures de Stock', AuditTrail: 'Journal d\'activité' }
  const key = route.path.split('/').pop()
  return titles[key] || 'Iventello'
})

const userName = computed(() => `${authStore.user?.username || ''} ${authStore.user?.Last_name || ''}`.trim() || 'Utilisateur')
const userInitials = computed(() => ((authStore.user?.username?.[0] || '') + (authStore.user?.Last_name?.[0] || '')).toUpperCase() || 'U')
const userRoleDisplay = computed(() => authStore.isAdmin ? 'Administrateur' : (authStore.user?.roleName || 'Membre'))

// Functions
const isActive = (path) => route.path === path || route.path.startsWith(path + '/')
const toggleNotificationPanel = () => { notificationOpen.value = !notificationOpen.value; if (notificationOpen.value) notificationStore.fetchNotifications() }
const closeSidebarOnMobile = () => { if (!isDesktop.value) sidebarOpen.value = false }
const toggleSidebarSize = () => { isExpanded.value = !isExpanded.value }
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
/* Petite animation d'entrée pour le contenu */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.4s ease-out forwards;
}

/* Scrollbar fine et élégante */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #e2e8f0 transparent;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}
</style>