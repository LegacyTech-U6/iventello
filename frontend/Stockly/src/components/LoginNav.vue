<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Mobile Header -->
    <div class="fixed top-0 left-0 right-0 z-50 lg:hidden bg-white border-b border-gray-200 shadow-sm">
      <div class="flex items-center justify-between px-4 py-3">
        <!-- Menu Button -->
        <button @click="sidebarOpen = !sidebarOpen" class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Toggle menu">
          <Menu v-if="!sidebarOpen" class="w-6 h-6 text-gray-700" />
          <X v-else class="w-6 h-6 text-gray-700" />
        </button>

        <!-- Logo -->
        <div class="flex items-center gap-2">
          <div class=" border-gray-200/50 p-5">
            <img :src="Iventello" alt="Logo" class="w-42" />
          </div>

        </div>

        <!-- Notification Button -->
        <button @click="toggleNotificationPanel" class="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Notifications">
          <span class="material-icons">
            notifications
          </span>
          <span v-if="unreadCount > 0"
            class="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center px-1">
            {{ unreadCount > 9 ? '9+' : unreadCount }}
          </span>
        </button>
      </div>
    </div>

    <!-- Overlay for mobile -->
    <Transition name="fade">
      <div v-if="sidebarOpen && !isDesktop" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        @click="sidebarOpen = false"></div>
    </Transition>


    <!-- Sidebar -->
    <Transition name="slide">
      <aside v-if="sidebarOpen || isDesktop" class="fixed lg:static top-0 left-0 h-screen bg-white border-r border-gray-200 
           z-50 flex flex-col shadow-xl lg:shadow-none w-72" @click.stop>

        <!-- Desktop Logo -->
        <div class="hidden lg:block px-6 py-5  ">
          <div class=" border-gray-200/50 p-5">
            <img :src="Iventello" alt="Logo" class="w-42" />
          </div>

        </div>

        <!-- Mobile spacer -->
        <div class="lg:hidden h-16"></div>

        <!-- Navigation Menu -->
        <nav class="px-3 py-4 space-y-1 flex-1 overflow-y-auto custom-scrollbar">
          <!-- Section Main -->
          <div class="mb-6" v-if="authStore.can('canViewDashboard')">
            <div class="px-3 mb-2">
              <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Principal
              </span>
            </div>

            <router-link :to="dashboardRoute"
              class="flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-all group"
              :class="isActive(dashboardRoute)" @click="closeSidebarOnMobile">
              <span class="material-icons">
                dashboard
              </span>
              <span>Tableau de bord</span>
            </router-link>
          </div>

          <!-- Section Inventory -->
          <div class="mb-6" v-if="authStore.can('canManageStock')">
            <div class="px-3 mb-2">
              <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Inventaire
              </span>
            </div>

            <router-link :to="productsRoute"
              class="flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-all group"
              :class="isActive(productsRoute)" @click="closeSidebarOnMobile">
              <Package :size="20" class="flex-shrink-0" />
              <span>Produits</span>
            </router-link>

            <router-link :to="categoriesRoute"
              class="flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-all group"
              :class="isActive(categoriesRoute)" @click="closeSidebarOnMobile">
              <span class="material-icons">
                category
              </span>
              <span>Catégories</span>
            </router-link>

            <router-link :to="lowStocksRoute"
              class="flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-all group"
              :class="isActive(lowStocksRoute)" @click="closeSidebarOnMobile">
              <span class="material-icons">
                trending_down
              </span>
              <span>Stock faible</span>
              <span v-if="lowStockCount > 0"
                class="ml-auto bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {{ lowStockCount }}
              </span>
            </router-link>
          </div>

          <!-- Section Sales & Reports -->
          <div class="mb-6">
            <div class="px-3 mb-2">
              <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Ventes & Rapports
              </span>
            </div>

            <router-link v-if="authStore.can('canMakeSales')" :to="salesRoute"
              class="flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-all group"
              :class="isActive(salesRoute)" @click="closeSidebarOnMobile">
              <span class="material-icons">
                point_of_sale
              </span>
              <span>Ventes</span>
            </router-link>

            <router-link v-if="authStore.can('canViewInvoices')" :to="invoicesRoute"
              class="flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-all group"
              :class="isActive(invoicesRoute)" @click="closeSidebarOnMobile">
              <span class="material-icons">
                receipt_long
              </span>
              <span>Factures</span>
            </router-link>

            <router-link v-if="authStore.can('canMakeSales')" :to="clientsRoute"
              class="flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-all group"
              :class="isActive(clientsRoute)" @click="closeSidebarOnMobile">
              <span class="material-icons">
                group
              </span>
              <span>Clients</span>
            </router-link>

            <router-link v-if="authStore.can('canViewDashboard')" :to="reportsRoute"
              class="flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-all group"
              :class="isActive(reportsRoute)" @click="closeSidebarOnMobile">
              <span class="material-icons">
                analytics
              </span>
              <span>Rapports</span>
            </router-link>

            <router-link v-if="authStore.can('canAccessSettings')" :to="ActivityRoute"
              class="flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-all group"
              :class="isActive(ActivityRoute)" @click="closeSidebarOnMobile">
              <span class="material-icons">
                timeline
              </span>
              <span>Audit Trail</span>
            </router-link>
            <!-- Version désactivée -->
            <div v-if="isDisabled"
              class="flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-all group disabled-link">
              <span class="material-icons">
                trolley
              </span>
              <span>purchase</span>
            </div>

            <!-- Version active -->
            <router-link v-else to="/"
              class="flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-all group"
              :class="isActive(ActivityRoute)" @click="closeSidebarOnMobile">
              <span class="material-symbols-outlined"> trolley </span>
              <span>purchase</span>
            </router-link>


          </div>
        </nav>
        <div class="p-5">

          <ValidationButton :text="authStore.user?.type === 'admin' ? 'Retour à l\'admin' : 'Déconnexion'" size="large"
            :asyncClick="logoutEntreprise" :icon="LogoutIcon"
            class="w-full mt-3 flex justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-3 rounded-2xl font-semibold shadow-md hover:shadow-lg transition-all" />

        </div>



      </aside>
    </Transition>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Desktop Header -->
      <header class="hidden lg:flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">{{ pageTitle }}</h2>

        </div>
        <div class="mt-auto flex">
          <div class="flex items-center gap-6 p-4">

            <!-- Icône Notifications -->
            <button @click="toggleNotificationPanel" class="relative">
              <span class="material-icons text-blue-400 text-2xl">
                notifications
              </span>
              <span v-if="unreadCount > 0"
                class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {{ unreadCount > 9 ? '9+' : unreadCount }}
              </span>
            </button>

            <!-- Icône Settings -->
            <button class="relative">
              <span class="material-icons text-blue-400 text-2xl">
                settings
              </span>
            </button>


            <div class="relative">
              <div class="w-10 h-10 rounded-full flex items-center justify-center">
                <span class="material-icons md-48">
                  account_circle
                </span>
              </div>
            </div>

            <!-- Informations utilisateur -->
            <div class="flex flex-col">
              <span class="text-gray-900 font-medium text-sm">
                {{ authStore.user?.username || 'Utilisateur' }} {{ authStore.user?.Last_name || '' }}
              </span>
              <span class="text-gray-400 text-xs">
                {{ formattedDate }}
              </span>
            </div>

          </div>

        </div>

      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto bg-gray-50 pt-16 lg:pt-0">
        <div class="">
          <slot></slot>
        </div>
      </main>
    </div>

    <!-- Notification Panel -->
    <NotificationPanel v-model:notificationOpen="notificationOpen" @close="notificationOpen = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, h,watch } from 'vue'
import { useEntrepriseStore } from '@/stores/entrepriseStore'
import { useRouter, useRoute } from 'vue-router'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FileText,
  LogOut,
  Menu,
  FolderTree,
  X,
  Activity,
  TrendingDown,
  BarChart3,
  Bell,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/authStore.js'
import { useNotificationStore } from '@/stores/notificationStore'
import NotificationPanel from '@/components/ui/NotificationPanel.vue'
import Iventello from '@/assets/iventello.png'
import ValidationButton from './ui/buttons/ValidationButton.vue'
import LogoutIcon from './icons/LogoutIcon.vue'
const isDisabled = true; // ou ta condition logique

const router = useRouter()
const route = useRoute()
const entrepriseStore = useEntrepriseStore()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

// State
const sidebarOpen = ref(false)
const notificationOpen = ref(false)
const isDesktop = ref(window.innerWidth >= 1024)
const lowStockCount = ref(0) // À remplacer par une vraie valeur du store

watch(sidebarOpen, (value) => {
  if (value) notificationOpen.value = false
})

watch(notificationOpen, (value) => {
  if (value) sidebarOpen.value = false
})

// Computed
const unreadCount = computed(() => notificationStore.unreadCount)
const activeEntreprise = computed(() => entrepriseStore.activeEntreprise)
const currentUuid = computed(() => route.params.uuid)

const pageTitle = computed(() => {
  const routeName = route.name
  const titles = {
    dashboard: 'Tableau de bord',
    product: 'Product inventory',
    categories: 'Category management',
    sales: 'Point of sale',
    invoices: 'Invoices',
    client: 'Clients',
    reports: 'Rapports',
    lowStock: 'Low Stock',
    AuditTrail: 'Audit Trail'
  }
  return titles[routeName] || 'Iventelo'
})

// Dynamic routes
const dashboardRoute = computed(() => {
  const uuid = authStore.isWorker && authStore.user?.entrepriseUuid
    ? authStore.user.entrepriseUuid
    : currentUuid.value
  return `/${uuid}/dashboard`
})

const salesRoute = computed(() => {
  const uuid = authStore.isWorker && authStore.user?.entrepriseUuid
    ? authStore.user.entrepriseUuid
    : currentUuid.value
  return `/${uuid}/sales`
})

const productsRoute = computed(() => {
  const uuid = authStore.isWorker && authStore.user?.entrepriseUuid
    ? authStore.user.entrepriseUuid
    : currentUuid.value
  return `/${uuid}/products`
})

const clientsRoute = computed(() => {
  const uuid = authStore.isWorker && authStore.user?.entrepriseUuid
    ? authStore.user.entrepriseUuid
    : currentUuid.value
  return `/${uuid}/clients`
})

const invoicesRoute = computed(() => {
  const uuid = authStore.isWorker && authStore.user?.entrepriseUuid
    ? authStore.user.entrepriseUuid
    : currentUuid.value
  return `/${uuid}/invoices`
})

const categoriesRoute = computed(() => {
  const uuid = authStore.isWorker && authStore.user?.entrepriseUuid
    ? authStore.user.entrepriseUuid
    : currentUuid.value
  return `/${uuid}/categories`
})

const ActivityRoute = computed(() => {
  const uuid = authStore.isWorker && authStore.user?.entrepriseUuid
    ? authStore.user.entrepriseUuid
    : currentUuid.value
  return `/${uuid}/AuditTrail`
})

const reportsRoute = computed(() => {
  const uuid = authStore.isWorker && authStore.user?.entrepriseUuid
    ? authStore.user.entrepriseUuid
    : currentUuid.value
  return `/${uuid}/reports`
})

const lowStocksRoute = computed(() => {
  const uuid = authStore.isWorker && authStore.user?.entrepriseUuid
    ? authStore.user.entrepriseUuid
    : currentUuid.value
  return `/${uuid}/lowStock`
})

// User info
const userRoleDisplay = computed(() => {
  if (authStore.isAdmin) return 'Administrateur'
  if (authStore.user?.role?.name === 'StockManager') return 'Gestionnaire de Stock'
  if (authStore.user?.role?.name === 'SalesPoint') return 'Point de Vente'
  return authStore.user?.roleName || 'Utilisateur'
})

const userName = computed(() => {
  if (authStore.user) {
    return `${authStore.user.username || ''} ${authStore.user.Last_name || ''}`.trim() || 'Utilisateur'
  }
  return 'Utilisateur'
})

const userEmail = computed(() => {
  return authStore.user?.email || 'email@example.com'
})

const userInitials = computed(() => {
  if (authStore.user) {
    const first = authStore.user.username?.[0] || ''
    const last = authStore.user.Last_name?.[0] || ''
    return `${first}${last}`.toUpperCase() || 'U'
  }
  return 'U'
})

const isActive = (path) => {
  return route.path === path
    ? 'bg-blue-50 text-blue-600 font-semibold'
    : 'text-gray-700 hover:bg-gray-100'
}


const toggleNotificationPanel = () => {
  notificationOpen.value = !notificationOpen.value
  if (notificationOpen.value) {
    notificationStore.fetchNotifications()
  }
}
const formattedDate = ref('')

const updateDate = () => {
  const today = new Date()
  const options = { day: 'numeric', month: 'long', year: 'numeric' }
  formattedDate.value = today.toLocaleDateString('fr-FR', options)
}

// Appel initial
updateDate()

const closeSidebarOnMobile = () => {
  if (!isDesktop.value) sidebarOpen.value = false
}


const logoutEntreprise = () => {
  entrepriseStore.clearActiveEntreprise()
  const userType = authStore.user?.type
  if (userType === 'admin') {
    authStore.logout('backToAdmin')
  } else {
    authStore.logout()
  }
}

const handleResize = () => {
  isDesktop.value = window.innerWidth >= 1024
  if (isDesktop.value) {
    sidebarOpen.value = false
  }
}

// Lifecycle
onMounted(async () => {
  window.addEventListener('resize', handleResize)
  if (authStore.token && !authStore.user) {
    await authStore.getAccount()
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* Fade */
.fade-enter-active,
.fade-leave-active { transition: opacity .25s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

/* Slide */
.slide-enter-active,
.slide-leave-active { transition: transform .25s ease; }
.slide-enter-from,
.slide-leave-to { transform: translateX(-100%); }




/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}

/* Mobile adjustments */
@media (max-width: 1023px) {
  aside {
    padding-top: env(safe-area-inset-top);
  }
}

.disabled-link {
  pointer-events: none;
  /* désactive le clic */
  opacity: 0.4;
  /* effet désactivé */
  position: relative;
}

/* Trait dotted en haut */
.disabled-link::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  border-top: 2px dotted #999;
}
</style>
