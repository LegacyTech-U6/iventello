import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useEntrepriseStore } from '@/stores/entrepriseStore'
import HomeView from '../views/HomeView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/layout/DefaultLayout.vue'), // Layout avec NavBar + Footer
    children: [
      {
        path: '',
        name: 'home',
        component: HomeView,
      },
      {
        path: 'features',
        name: 'features',
        component: () => import('@/components/landing/FeaturesPAge.vue'),
        
      },
   // index.ts
{
  path: 'blogs',
  name: 'blogs',
  component: () => import('@/views/BlogSection.vue'),
},
{
  path: 'blogs/search',
  name: 'blog-search',
  component: () => import('@/views/blog/BlogSearch.vue'), // Le nouveau composant
},
{
  path: 'blogs/:id', // On le met au même niveau, pas en enfant
  name: 'blog-detail',
  component: () => import('@/views/blog/HowIventelloManage.vue'),
  props: true,
},
{
  path: '/blogs/stock-alerts', // Chemin absolu pour éviter les conflits
  name: 'blog-detail-absolute',
  component: () => import('@/views/blog/StockAlert.vue'),
  props: true,
},
      {
        path: 'verify/:token',
        name: 'VerifyEmail',
        component: () => import('@/views/auth/VerifyEmail.vue'),
      },
      {
        path: 'activation',
        name: 'activation',
        component: () => import('@/views/auth/ActivationSent.vue'),
      },
    ],
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/auth/RegisterView.vue'),
    
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/auth/LoginView.vue'),
  
  },

  // ===================== ADMIN =====================
  {
    path: '/ad',
    component: () => import('@/views/AdminLayout.vue'),
    meta: { showNavbarAndFooter: false, requiresAuth: false },
    children: [
      {
        path: 'admin',
        name: 'admin',
        component: () => import('@/views/MainPage.vue'),
        meta: { showNavbarAndFooter: false, permission: 'canViewDashboard' },
      },
      {
        path: 'workers',
        name: 'workers',
        component: () => import('@/views/WorkerPage.vue'),
        meta: { showNavbarAndFooter: false, permission: 'canManageUsers' },
      },
      {
        path: 'roles',
        name: 'roles',
        component: () => import('@/views/RoleManagement.vue'),
        meta: { showNavbarAndFooter: false, permission: 'canManageUsers' },
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/Statistics/DashBoard.vue'),
        meta: { showNavbarAndFooter: false, permission: 'canViewDashboard' },
      },
      {
        path: 'company',
        name: 'company',
        component: () => import('@/views/CreateEntreprise.vue'),
        meta: { showNavbarAndFooter: false, permission: 'canManageUsers' },
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/views/settings/AdminSetting.vue'),
        meta: { permission: 'canAccessSettings' },
      },
    ],
  },

  // ===================== ENTERPRISE / WORKER =====================
  {
    path: '/:uuid',
    name: 'real',
    component: () => import('../views/LayoutPage.vue'),
    meta: { showNavbarAndFooter: false, requiresAuth: true },
    redirect: (to) => `/${to.params.uuid}/sales`,
    children: [
      {
        path: 'dashboard',
        name: 'EDashboardd',
        component: () => import('@/views/Enterprise.vue'),
        meta: { permission: 'canViewDashboard' },
      },
      {
        path: 'AuditTrail',
        name: 'Audit Trail',
        component: () => import('@/views/ActivityLogPage.vue'),
        meta: { permission: 'canViewDashboard' },
      },
      {
        path: 'sales',
        name: 'sales',
        component: () => import('../views/SalesInterface.vue'),
        meta: { showNavbarAndFooter: false, permission: 'canMakeSales' },
      },
      {
        path: 'invoice',
        name: 'invoice',
        component: () => import('../components/invoices/CreateInvoiceForm.vue'),
        meta: { showNavbarAndFooter: false, permission: 'canViewInvoices' },
      },
      {
        path: 'products',
        name: 'product',
        component: () => import('../views/ProductView.vue'),
        meta: { showNavbarAndFooter: false, permission: 'canManageStock' },
      },
      {
        path: 'stepper',
        name: 'steper',
        component: () => import('../components/SteeperComponent.vue'),
        meta: { showNavbarAndFooter: false },
      },
      {
        path: 'product/:id',
        name: 'product-detail',
        component: () => import('@/views/ProductDetailPage.vue'),
        props: true,
        meta: { showNavbarAndFooter: false, permission: 'canManageStock' },
      },
      {
        path: 'product/:reStockId',
        name: 'restock',
        component: () => import('@/views/RestockView.vue'),
        props: true,
        meta: { showNavbarAndFooter: false, permission: 'canManageStock' },
      },
      {
        path: 'clients',
        name: 'client',
        component: () => import('../views/ClientManager.vue'),
        meta: { showNavbarAndFooter: false, permission: 'canManageUsers' },
      },
      {
        path: 'invoices',
        name: 'invoices',
        component: () => import('@/views/InvoiceView.vue'),
        meta: { permission: 'canViewInvoices' },
      },
      {
        path: 'categories',
        name: 'categories',
        component: () => import('@/views/CategoryView.vue'),
        meta: { permission: 'canManageStock' },
      },
      {
        path: 'outOfStock',
        name: 'outOfStock',
        component: () => import('@/views/OutofStock.vue'),
        meta: { permission: 'canManageStock' },
      },
      {
        path: 'lowStock',
        name: 'lowStock',
        component: () => import('@/views/LowStock.vue'),
        meta: { permission: 'canManageStock' },
      },
      {
        path: 'detail/:id',
        name: 'category-detail',
        component: () => import('@/views/CategoryDetail.vue'),
        props: true,
        meta: { permission: 'canManageStock' },
      },
      {
        path: 'invoices/:id',
        name: 'InvoiceDetail',
        component: () => import('@/components/invoices/InvoiceDetail.vue'),
        meta: { permission: 'canViewInvoices' },
      },
      {
        path: 'reports',
        name: 'reports',
        component: () => import('@/views/SalesReport.vue'),
        meta: { permission: 'canViewInvoices' },
      },
      {
        path: 'EntrepriseSettings',
        name: 'wholehouse_settings',
        component: () => import('@/views/Settings.vue'),
        meta: { permission: 'canAccessSettings' },
      }
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  // Si page reload et token existe → récupérer user
  if (!auth.user && auth.token) {
    await auth.getAccount()
  }

  // Routes nécessitant authentification
  if (to.meta.requiresAuth && !auth.user) {
    return next('/login')
  }

  // Vérification des permissions
  const requiredPermission = to.meta.permission as string
  if (requiredPermission && !auth.can('canViewDashboard')) {
    console.warn(`❌ Accès refusé à ${to.fullPath}, permission manquante: ${requiredPermission}`)
    // Redirection selon le rôle
    if (auth.user?.type === 'admin') next('/ad/admin')
    else if (auth.user?.type === 'worker' && auth.user?.entreprise?.uuid) {
      next(`/${auth.user.entreprise.uuid}/dashboard`)
    } else next('/login')
    return
  }

  // Login page redirige si déjà connecté
  if (to.path === '/login' && auth.user) {
    next('/dashboard')
    return
  }

  next()
})

router.afterEach((to, from) => {
  // Si on revient sur la page /admin, on désactive l’entreprise active
  if (to.path === '/ad/admin') {
    localStorage.removeItem('activeEnterprise')
  }
})

export default router
