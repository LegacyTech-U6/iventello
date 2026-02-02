<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useRouter } from 'vue-router'
// Importation des Heroicons (Outline version)
import {
  BuildingOffice2Icon,
  CubeIcon,
  DocumentTextIcon,
  UsersIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ArrowUpTrayIcon,
  TableCellsIcon,
  CheckBadgeIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  LightBulbIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  SparklesIcon,
  FolderIcon,
  PhotoIcon,
  TagIcon,
  ListBulletIcon,
  DevicePhoneMobileIcon,
  QrCodeIcon,
  WifiIcon,
  BellIcon
} from '@heroicons/vue/24/outline'

useHead({
  title: 'Iventello Features - Stock Management, Sales, and Inventory',
  meta: [
    { name: 'description', content: 'Explore Iventello features: Multi-business management, real-time inventory, and advanced analytics.' }
  ]
})

const router = useRouter()
const activeTab = ref('Organizing')

const handleRegister = () => {
  router.push('/register')
}

// --- Features Data Organized by Category ---
const featuresByCategory = {
  'Organizing': [
    {
      icon: CubeIcon,
      title: 'Real-Time Inventory',
      description: 'Track stock levels across multiple locations instantly. Purchases, sales, and adjustments update in real-time.'
    },
    {
      icon: FolderIcon,
      title: 'Custom Categories',
      description: 'Organize items with a flexible category structure that matches your specific business needs.'
    },
    {
      icon: PhotoIcon,
      title: 'Item Photos',
      description: 'Upload high-resolution images for each product to prevent identification errors by staff.'
    },
    {
      icon: TagIcon,
      title: 'Custom Fields',
      description: 'Add specific attributes (size, color, weight) to your products for precise tracking.'
    }
  ],
  'Managing': [
    {
      icon: DocumentTextIcon,
      title: 'Quick Invoicing',
      description: 'Generate professional invoices in seconds. Taxes and totals are calculated automatically.'
    },
    {
      icon: UsersIcon,
      title: 'Centralized CRM',
      description: 'Maintain a complete database of customers and suppliers with detailed purchase history.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'User Access Control',
      description: 'Define granular roles (Admin, Worker, Sales) to secure sensitive data and features.'
    },
    {
      icon: BuildingOffice2Icon,
      title: 'Multi-Business',
      description: 'Manage multiple separate business entities from a single super-admin account.'
    }
  ],
  'Reporting': [
    {
      icon: ChartBarIcon,
      title: 'Advanced Analytics',
      description: 'Visual dashboards showing sales trends, top performing products, and revenue analysis.'
    },
    {
      icon: TableCellsIcon,
      title: 'Inventory Lists',
      description: 'Generate comprehensive stock lists optimized for physical audits and accounting.'
    },
    {
      icon: ArrowDownTrayIcon,
      title: 'One-Click Exports',
      description: 'Export any report or data set to Excel/CSV instantly for external processing.'
    },
    {
      icon: ListBulletIcon,
      title: 'Activity Log',
      description: 'Full audit trail of every action taken by any user for complete accountability.'
    }
  ],
  'Mobile': [
    {
      icon: DevicePhoneMobileIcon,
      title: 'Mobile App',
      description: 'Access your inventory from anywhere. Fully responsive design for tablets and phones.'
    },
    {
      icon: QrCodeIcon,
      title: 'Barcode Scanning',
      description: 'Use your device camera to scan products for instant lookup and stock adjustments.'
    },
    {
      icon: WifiIcon,
      title: 'Offline Mode',
      description: 'Continue working even without internet. Data syncs automatically when connection returns.'
    },
    {
      icon: BellIcon,
      title: 'Smart Alerts',
      description: 'Receive push notifications for low stock, new orders, and critical updates.'
    }
  ]
}

// Computed property to get features for the active tab
const currentFeatures = computed(() => {
  return featuresByCategory[activeTab.value] || []
})

// --- Feature Lists for other sections (kept for compatibility if needed) ---
const excelHighlights = [
  {
    icon: TableCellsIcon,
    title: 'Template Intelligent',
    desc: 'Structure auto-adaptative selon vos catégories.'
  },
  {
    icon: SparklesIcon,
    title: 'Clean-up Automatique',
    desc: 'Détection des doublons et erreurs de prix.'
  },
  {
    icon: ArrowDownTrayIcon,
    title: 'Export Comptable',
    desc: 'Générez vos rapports en un clic au format .xlsx.'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Intégrité Garantie',
    desc: 'Historique complet de chaque modification.'
  }
]
const excelFeatures = [
  {
    icon: ArrowUpTrayIcon,
    title: 'Simplified Import',
    description: 'Integrate new products or update existing stock in seconds. Drag & drop your file and let Iventello handle it.',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800',
    alt: 'Import interface illustration'
  },
  {
    icon: TableCellsIcon,
    title: 'Smart Template',
    description: 'Download a dynamic Excel template that includes your categories and suppliers to avoid formatting errors.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    alt: 'Data sheet illustration'
  },
  {
    icon: CheckBadgeIcon,
    title: 'Automatic Validation',
    description: 'Preview data before final import. The system detects anomalies (negative prices, missing fields) instantly.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    alt: 'Data validation dashboard'
  },
  {
    icon: ArrowDownTrayIcon,
    title: 'Export & Reporting',
    description: 'Export your full inventory in one click for accounting or physical inventory. Your data remains portable.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800',
    alt: 'Reporting and export visualization'
  }
]

// --- Key Advantages ---
const advantages = [
  { icon: ClockIcon, title: 'Save Time', description: 'Automate repetitive processes and get instant calculations.' },
  { icon: LightBulbIcon, title: 'Smart Decisions', description: 'Access real-time data, detailed analytics, and KPIs.' },
  { icon: ArrowTrendingUpIcon, title: 'Scale and Grow', description: 'Our multi-business architecture grows with you.' },
  { icon: CheckCircleIcon, title: 'Productivity', description: 'Optimized workflows and centralized interface reduce errors.' }
]
</script>

<template>
  <div class="bg-background min-h-screen font-sans text-on-surface">
    <header class="pt-32 pb-24 px-4 sm:px-6 lg:px-8 text-center bg-surface relative overflow-hidden">
      <div class="absolute inset-0 opacity-10 pointer-events-none">
        <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" stroke-width="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <h1 class="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight animate-fadeInUp">
        The Smart Way to Manage <br /><span class="text-primary">Inventory and Sales</span>
      </h1>
      <p class="text-lg md:text-xl text-on-surface-variant mb-10 max-w-2xl mx-auto animate-fadeInUp"
        style="animation-delay: 0.1s">
        Iventello is the all-in-one SaaS solution for SMBs, designed to automate your stock flows and boost your
        operational efficiency.
      </p>
      <div class="flex justify-center gap-4 animate-fadeInUp" style="animation-delay: 0.2s">
        <a href="#core-features"
          class="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-xl shadow-lg hover:shadow-primary/20 transition-all">
          Explore Features
          <ChevronRightIcon class="size-5" />
        </a>
      </div>
    </header>

    <section id="core-features" class="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div class="max-w-7xl mx-auto">
        <!-- Tabs Navigation -->
        <div class="flex justify-center mb-16 border-b border-gray-100">
          <div class="flex space-x-8 overflow-x-auto">
            <button v-for="(features, category) in featuresByCategory" :key="category" @click="activeTab = category"
              class="pb-4 text-lg font-medium transition-all relative px-2 whitespace-nowrap"
              :class="activeTab === category ? 'text-primary' : 'text-gray-500 hover:text-gray-700'">
              {{ category }}
              <div v-if="activeTab === category"
                class="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full transition-all"></div>
            </button>
          </div>
        </div>

        <!-- Grid Features -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          <div v-for="(feature, index) in currentFeatures" :key="feature.title" class="text-center group animate-popIn"
            :style="{ animationDelay: `${index * 50}ms` }">
            <!-- Icon -->
            <div class="flex items-center justify-center mb-6">
              <component :is="feature.icon"
                class="size-8 text-primary group-hover:scale-110 transition-transform duration-300 stroke-2" />
            </div>

            <!-- Title -->
            <h3 class="text-lg font-bold mb-3 text-gray-900">{{ feature.title }}</h3>

            <!-- Description -->
            <p class="text-gray-500 text-sm leading-relaxed px-2">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-24 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden">
      <div class="max-w-7xl mx-auto">

        <div class="flex flex-col lg:flex-row items-center gap-16 mb-32">
          <div class="lg:w-1/2 space-y-8 animate-fadeInLeft">
            <div
              class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <ArrowUpTrayIcon class="size-4" />
              Data Integration
            </div>
            <h2 class="text-4xl font-extrabold text-on-surface leading-tight">
              Dites adieu à la saisie <br />
              <span class="text-primary">manuelle fastidieuse.</span>
            </h2>
            <p class="text-lg text-on-surface-variant leading-relaxed">
              Iventello transforme vos fichiers Excel statiques en une base de données dynamique et intelligente.
              Importez des milliers de références en un clin d'œil.
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div v-for="item in excelHighlights" :key="item.title" class="flex gap-4">
                <div
                  class="flex-shrink-0 size-10 rounded-lg bg-surface border border-outline-variant flex items-center justify-center text-primary shadow-sm">
                  <component :is="item.icon" class="size-5" />
                </div>
                <div>
                  <h4 class="font-bold text-on-surface">{{ item.title }}</h4>
                  <p class="text-sm text-on-surface-variant">{{ item.desc }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:w-1/2 relative animate-fadeInRight">
            <div class="absolute -inset-4 bg-primary/5 rounded-3xl -rotate-2"></div>
            <div
              class="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-outline-variant overflow-hidden">
              <div class="flex items-center gap-2 px-4 py-3 border-b border-outline-variant bg-surface/50">
                <div class="flex gap-1.5">
                  <div class="size-2.5 rounded-full bg-red-400/20"></div>
                  <div class="size-2.5 rounded-full bg-yellow-400/20"></div>
                  <div class="size-2.5 rounded-full bg-green-400/20"></div>
                </div>
                <div class="mx-auto bg-outline-variant/30 h-4 w-32 rounded-full"></div>
              </div>
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200"
                alt="Interface d'importation Excel Iventello"
                class="w-full h-auto object-cover aspect-[4/3] grayscale-[20%] hover:grayscale-0 transition-all duration-500" />
            </div>

            <div
              class="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl border border-outline-variant flex items-center gap-4 animate-bounce-slow">
              <div class="size-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                <CheckBadgeIcon class="size-6" />
              </div>
              <div>
                <p class="text-xs text-on-surface-variant font-medium">Validation Auto</p>
                <p class="text-sm font-bold text-on-surface">100% de données propres</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <section class="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-2xl md:text-3xl font-bold text-on-surface">Why choose Iventello?</h2>
          <p class="text-on-surface-variant mt-4">Experience a new standard in inventory management.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="(advantage, index) in advantages" :key="advantage.title"
            class="relative p-8 rounded-2xl border border-outline-variant hover:border-primary/50 transition-colors duration-300 animate-popIn"
            :style="{ animationDelay: `${index * 150}ms` }">
            <div class="size-14 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-6">
              <component :is="advantage.icon" class="size-7" />
            </div>

            <h4 class="text-xl font-bold text-on-surface mb-3">
              {{ advantage.title }}
            </h4>

            <p class="text-on-surface-variant text-sm leading-relaxed">
              {{ advantage.description }}
            </p>

            <div class="absolute bottom-4 right-4 opacity-10">
              <component :is="advantage.icon" class="size-12" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 text-center px-4">
      <h2 class="text-3xl md:text-4xl font-bold mb-8">Ready to transform your logistics?</h2>
      <button @click="handleRegister()"
        class="btn-primary px-10 py-4 rounded-full text-lg font-bold shadow-xl hover:scale-105 transition-transform">
        Start Your Free Trial
      </button>
    </section>
  </div>
</template>


<style scoped>
/* Utilisation des couleurs définies dans votre système de thème Material 3 */
.btn-primary {
  background-color: var(--md-primary, #0da5a5);
  color: white;
}

.card {
  background-color: var(--md-surface, #ffffff);
  border-radius: 1.5rem;
}

.bg-primary-container {
  background-color: rgba(13, 165, 165, 0.1);
}

.text-primary {
  color: #0da5a5;
}

.bg-primary {
  background-color: #0da5a5;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.8s cubic-bezier(0.21, 0.6, 0.35, 1) forwards;
}

.animate-popIn {
  animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
</style>