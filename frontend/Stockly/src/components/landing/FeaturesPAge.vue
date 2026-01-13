<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { 
  Building2, 
  Package, 
  ReceiptText, 
  Users, 
  BarChart3, 
  ShieldCheck, 
  FilePlay, 
  TableProperties, 
  FileCheck, 
  FileDown, 
  Clock, 
  Lightbulb, 
  TrendingUp, 
  CheckCircle2,
  ChevronRight,
  Image as ImageIcon
} from 'lucide-vue-next'

useHead({
  title: 'Iventello Features - Stock Management, Sales, and Inventory',
  // ... meta reste inchangé
})

// --- Core Features Data ---
const coreFeatures = [
  {
    icon: Building2, // On passe directement le composant
    title: 'Multi-Business Management',
    description: 'Manage multiple business entities with strict data isolation and customization (logo, profile). Supports shared users for centralized administration.',
    details: ['Strict data isolation per business', 'Custom branding and settings', 'Shared users across entities']
  },
  {
    icon: Package,
    title: 'Real-Time Inventory',
    description: 'A complete product catalog with immediate stock tracking for purchases, sales, and adjustments. Manage categories, costs, and low-stock alerts.',
    details: ['Detailed product catalog', 'Tracked stock movements', 'Customizable alert thresholds']
  },
  {
    icon: ReceiptText,
    title: 'Sales & POS Automation',
    description: 'Create comprehensive invoices with automatic calculations for taxes, discounts, and totals. Includes a Point of Sale (POS) interface optimized for speed.',
    details: ['Instant invoice generation', 'Automated tax and discount calculation', 'Fast and simple Point of Sale (POS)']
  },
  {
    icon: Users,
    title: 'Centralized CRM',
    description: 'A complete customer database with purchase history. Manage suppliers with preferred communication channels for streamlined ordering.',
    details: ['Complete customer database', 'Purchase history per customer', 'Simplified supplier management']
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Daily sales reports, top-selling products, profitability analysis (margin per product), and real-time Key Performance Indicators (KPIs) on the dashboard.',
    details: ['Daily and category-based reports', 'Top products and profitability insights', 'Real-time dashboard metrics']
  },
  {
    icon: ShieldCheck,
    title: 'Security, Roles & Audit Log',
    description: 'JWT authentication, bcrypt password hashing, and Admin/Employee roles. Full tracking of all actions in an activity log for audit and compliance.',
    details: ['Secure JWT and Bcrypt authentication', 'Granular user roles and permissions', 'Activity history (Who, What, When)']
  }
]

// --- Excel Features Data ---
const excelFeatures = [
  {
    icon: FilePlay,
    title: 'Simplified Import',
    description: 'Integrate new products or update existing stock in seconds. Drag & drop your file and let Iventello handle automatic creation.',
    placeholder: 'Interface Drag & Drop Import'
  },
  {
    icon: TableProperties,
    title: 'Smart Template',
    description: 'Download a dynamic Excel template that includes your categories and suppliers. Avoid formatting errors and ensure data consistency.',
    placeholder: 'Excel Template Preview'
  },
  {
    icon: FileCheck,
    title: 'Automatic Validation',
    description: 'Preview data before final import. The system detects anomalies (negative prices, missing fields) to ensure a clean database.',
    placeholder: 'Validation & Error Table'
  },
  {
    icon: FileDown,
    title: 'Export & Reporting',
    description: 'Export your full or filtered inventory in one click for accounting or physical inventory. Your data remains portable.',
    placeholder: 'Excel Export Button'
  }
]

// --- Key Advantages ---
const advantages = [
  { icon: Clock, title: 'Save Time', description: 'Automate repetitive processes and get instant calculations.' },
  { icon: Lightbulb, title: 'Make Smarter Decisions', description: 'Access real-time data, detailed analytics, and KPIs.' },
  { icon: TrendingUp, title: 'Scale and Grow', description: 'Our multi-business architecture grows with you.' },
  { icon: CheckCircle2, title: 'Boost Productivity', description: 'A centralized interface and optimized workflows reduce errors.' }
]
</script>

<template>
  <div class="bg-background min-h-screen font-sans">
    <header class="pt-24 pb-20 px-4 sm:px-6 lg:px-8 text-center bg-surface">
      <h1 class="text-4xl md:text-6xl font-extrabold text-on-surface mb-4 tracking-tight animate-fadeInUp">
        The Smart Way to Manage <br /><span class="text-primary">Inventory and Sales</span>
      </h1>
      <p class="text-lg md:text-xl text-on-surface-variant mb-10 max-w-3xl mx-auto animate-fadeInUp" style="animation-delay: 0.2s">
        Iventello is the all-in-one SaaS solution for SMBs, designed to automate processes.
      </p>
      <a href="#core-features" class="btn-primary inline-flex items-center justify-center gap-2 px-8 py-3 text-base rounded-md shadow-sm transition-transform transform hover:scale-105 animate-fadeInUp" style="animation-delay: 0.4s">
        Explore Features
        <ChevronRight :size="20" />
      </a>
    </header>

    <section id="core-features" class="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="(feature, index) in coreFeatures" :key="feature.title" class="card p-8 hover:shadow-xl transition-shadow duration-300 border border-outline-variant animate-popIn" :style="{ animationDelay: `${index * 100}ms` }">
            <div class="flex items-center justify-center h-12 w-12 rounded-full bg-primary-container mb-6">
              <component :is="feature.icon" class="text-on-primary-container" :size="24" />
            </div>
            <h3 class="text-lg font-semibold text-on-surface mb-2">{{ feature.title }}</h3>
            <p class="text-on-surface-variant mb-4 text-sm leading-relaxed">{{ feature.description }}</p>

            <ul class="space-y-2 text-sm mt-auto">
              <li v-for="item in feature.details" :key="item" class="flex items-start text-on-surface-variant">
                <CheckCircle2 class="text-green-500 mr-2 flex-shrink-0" :size="18" />
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 px-4 sm:px-6 lg:px-8 bg-surface border-t border-outline-variant">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div v-for="(feature, index) in excelFeatures" :key="feature.title" class="flex flex-col gap-6 animate-fadeInUp" :style="{ animationDelay: `${index * 100}ms` }">
            <div class="flex gap-4">
              <div class="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-primary-container text-on-primary-container">
                <component :is="feature.icon" :size="24" />
              </div>
              <div>
                <h3 class="text-xl font-semibold text-on-surface">{{ feature.title }}</h3>
                <p class="mt-2 text-on-surface-variant leading-relaxed">{{ feature.description }}</p>
              </div>
            </div>
            <div class="ml-16 border-2 border-dashed border-outline-variant rounded-lg bg-background p-8 flex flex-col items-center justify-center h-48 text-on-surface-variant text-sm italic">
               <ImageIcon class="mb-2 opacity-50" :size="32" />
               {{ feature.placeholder }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 px-4 sm:px-6 lg:px-8 bg-surface">
      <div class="max-w-6xl mx-auto text-center">
        <div class="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="(advantage, index) in advantages" :key="advantage.title" class="p-8 animate-popIn" :style="{ animationDelay: `${index * 150}ms` }">
            <component :is="advantage.icon" class="mx-auto text-primary mb-4" :size="48" stroke-width="1.5" />
            <h4 class="text-lg font-semibold text-on-surface mb-2">{{ advantage.title }}</h4>
            <p class="text-on-surface-variant text-sm">{{ advantage.description }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>



<style>

/* Material Design 3 - CSS Variables for Theme System
   Auto-generated from material-theme.json
   Use these CSS variables for dynamic theme switching */


/* Buttons - Quick Styles */
.btn-primary {
  background-color: var(--md-primary);
  color: var(--md-on-primary);
  font-weight: 500;
  transition: opacity 0.2s;
}

.btn-primary:hover {
  opacity: 0.9;
}

/* Card Styles */
.card {
  background-color: var(--md-surface);
  color: var(--md-on-surface);
  border-radius: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.font-sans {
  font-family: 'Roboto', sans-serif;
}

.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}
.animate-popIn {
  animation: popIn 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
  opacity: 0;
}
</style>