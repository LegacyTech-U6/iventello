<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
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
} from '@heroicons/vue/24/outline'

useHead({
  title: 'Iventello Features - Stock Management, Sales, and Inventory',
  meta: [
    { name: 'description', content: 'Explore Iventello features: Multi-business management, real-time inventory, and advanced analytics.' }
  ]
})

// --- Core Features Data ---
const coreFeatures = [
  {
    icon: BuildingOffice2Icon,
    title: 'Multi-Business Management',
    description: 'Manage multiple business entities with strict data isolation and customization. Supports shared users for centralized administration.',
    details: ['Strict data isolation per business', 'Custom branding and settings', 'Shared users across entities']
  },
  {
    icon: CubeIcon,
    title: 'Real-Time Inventory',
    description: 'A complete product catalog with immediate stock tracking for purchases, sales, and adjustments. Manage categories and alerts.',
    details: ['Detailed product catalog', 'Tracked stock movements', 'Customizable alert thresholds']
  },
  {
    icon: DocumentTextIcon,
    title: 'Sales & POS Automation',
    description: 'Create comprehensive invoices with automatic calculations for taxes. Includes a Point of Sale (POS) interface optimized for speed.',
    details: ['Instant invoice generation', 'Automated tax calculations', 'Fast and simple POS']
  },
  {
    icon: UsersIcon,
    title: 'Centralized CRM',
    description: 'A complete customer database with purchase history. Manage suppliers with preferred communication channels.',
    details: ['Complete customer database', 'Purchase history per customer', 'Simplified supplier management']
  },
  {
    icon: ChartBarIcon,
    title: 'Advanced Analytics',
    description: 'Daily sales reports, top-selling products, profitability analysis, and real-time KPIs on your main dashboard.',
    details: ['Daily and category-based reports', 'Profitability insights', 'Real-time dashboard metrics']
  },
  {
    icon: ShieldCheckIcon,
    title: 'Security & Audit Log',
    description: 'JWT authentication, bcrypt hashing, and granular roles. Full tracking of all actions in an activity log for compliance.',
    details: ['Secure JWT authentication', 'Granular user roles', 'Full activity history']
  }
]
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
// --- Excel Features Data ---
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
          <defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" stroke-width="0.5"/></pattern></defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>
      
      <h1 class="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight animate-fadeInUp">
        The Smart Way to Manage <br /><span class="text-primary">Inventory and Sales</span>
      </h1>
      <p class="text-lg md:text-xl text-on-surface-variant mb-10 max-w-2xl mx-auto animate-fadeInUp" style="animation-delay: 0.1s">
        Iventello is the all-in-one SaaS solution for SMBs, designed to automate your stock flows and boost your operational efficiency.
      </p>
      <div class="flex justify-center gap-4 animate-fadeInUp" style="animation-delay: 0.2s">
        <a href="#core-features" class="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-xl shadow-lg hover:shadow-primary/20 transition-all">
          Explore Features
          <ChevronRightIcon class="size-5" />
        </a>
      </div>
    </header>

    <section id="core-features" class="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold mb-4">Powerful Core Capabilities</h2>
          <div class="h-1.5 w-20 bg-primary mx-auto rounded-full"></div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="(feature, index) in coreFeatures" :key="feature.title" 
               class="card group p-8 hover:-translate-y-2 transition-all duration-300 border border-outline-variant animate-popIn" 
               :style="{ animationDelay: `${index * 100}ms` }">
            <div class="flex items-center justify-center size-14 rounded-2xl bg-primary-container text-primary mb-8 group-hover:scale-110 transition-transform">
              <component :is="feature.icon" class="size-7" />
            </div>
            <h3 class="text-xl font-bold mb-3">{{ feature.title }}</h3>
            <p class="text-on-surface-variant mb-6 text-sm leading-relaxed">{{ feature.description }}</p>

            <ul class="space-y-3 text-sm mt-auto border-t border-outline-variant pt-6">
              <li v-for="item in feature.details" :key="item" class="flex items-center gap-3 text-on-surface-variant font-medium">
                <CheckCircleIcon class="size-5 text-primary flex-shrink-0" />
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

   <section class="py-24 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden">
    <div class="max-w-7xl mx-auto">
      
      <div class="flex flex-col lg:flex-row items-center gap-16 mb-32">
        <div class="lg:w-1/2 space-y-8 animate-fadeInLeft">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <ArrowUpTrayIcon class="size-4" />
            Data Integration
          </div>
          <h2 class="text-4xl font-extrabold text-on-surface leading-tight">
            Dites adieu à la saisie <br/>
            <span class="text-primary">manuelle fastidieuse.</span>
          </h2>
          <p class="text-lg text-on-surface-variant leading-relaxed">
            Iventello transforme vos fichiers Excel statiques en une base de données dynamique et intelligente. Importez des milliers de références en un clin d'œil.
          </p>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div v-for="item in excelHighlights" :key="item.title" class="flex gap-4">
              <div class="flex-shrink-0 size-10 rounded-lg bg-surface border border-outline-variant flex items-center justify-center text-primary shadow-sm">
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
          <div class="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-outline-variant overflow-hidden">
            <div class="flex items-center gap-2 px-4 py-3 border-b border-outline-variant bg-surface/50">
              <div class="flex gap-1.5">
                <div class="size-2.5 rounded-full bg-red-400/20"></div>
                <div class="size-2.5 rounded-full bg-yellow-400/20"></div>
                <div class="size-2.5 rounded-full bg-green-400/20"></div>
              </div>
              <div class="mx-auto bg-outline-variant/30 h-4 w-32 rounded-full"></div>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200" 
              alt="Interface d'importation Excel Iventello" 
              class="w-full h-auto object-cover aspect-[4/3] grayscale-[20%] hover:grayscale-0 transition-all duration-500"
            />
          </div>
          
          <div class="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl border border-outline-variant flex items-center gap-4 animate-bounce-slow">
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
        <div 
          v-for="(advantage, index) in advantages" 
          :key="advantage.title" 
          class="relative p-8 rounded-2xl border border-outline-variant hover:border-primary/50 transition-colors duration-300 animate-popIn"
          :style="{ animationDelay: `${index * 150}ms` }"
        >
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
      <button class="btn-primary px-10 py-4 rounded-full text-lg font-bold shadow-xl hover:scale-105 transition-transform">
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
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes popIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

.animate-fadeInUp {
  animation: fadeInUp 0.8s cubic-bezier(0.21, 0.6, 0.35, 1) forwards;
}

.animate-popIn {
  animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

</style>