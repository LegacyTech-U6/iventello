<script setup lang="ts">
import { useHead } from '@unhead/vue'

useHead({
  title: 'Iventello Features - Stock Management, Sales, and Inventory',
  meta: [
    {
      name: 'description',
      content:
        'Discover the complete features of Iventello: multi-company management, real-time inventory, automated invoicing, advanced analytics, and JWT security.'
    },
    {
      name: 'keywords',
      content:
        'Iventello, stock management, point of sale, invoicing, inventory, multi-company, analytics, SaaS, Security'
    }
  ]
})

// --- Core Features Data ---
const coreFeatures = [
  {
    icon: 'domain',
    title: 'Multi-Business Management',
    description:
      'Manage multiple business entities with strict data isolation and customization (logo, profile). Supports shared users for centralized administration.',
    details: [
      'Strict data isolation per business',
      'Custom branding and settings',
      'Shared users across entities'
    ]
  },
  {
    icon: 'inventory_2',
    title: 'Real-Time Inventory',
    description:
      'A complete product catalog with immediate stock tracking for purchases, sales, and adjustments. Manage categories, costs, and low-stock alerts.',
    details: [
      'Detailed product catalog',
      'Tracked stock movements',
      'Customizable alert thresholds'
    ]
  },
  {
    icon: 'receipt_long',
    title: 'Sales & POS Automation',
    description:
      'Create comprehensive invoices with automatic calculations for taxes, discounts, and totals. Includes a Point of Sale (POS) interface optimized for speed.',
    details: [
      'Instant invoice generation',
      'Automated tax and discount calculation',
      'Fast and simple Point of Sale (POS)'
    ]
  },
  {
    icon: 'groups',
    title: 'Centralized CRM',
    description:
      'A complete customer database with purchase history. Manage suppliers with preferred communication channels for streamlined ordering.',
    details: [
      'Complete customer database',
      'Purchase history per customer',
      'Simplified supplier management'
    ]
  },
  {
    icon: 'analytics',
    title: 'Advanced Analytics',
    description:
      'Daily sales reports, top-selling products, profitability analysis (margin per product), and real-time Key Performance Indicators (KPIs) on the dashboard.',
    details: [
      'Daily and category-based reports',
      'Top products and profitability insights',
      'Real-time dashboard metrics'
    ]
  },
  {
    icon: 'admin_panel_settings',
    title: 'Security, Roles & Audit Log',
    description:
      'JWT authentication, bcrypt password hashing, and Admin/Employee roles. Full tracking of all actions in an activity log for audit and compliance.',
    details: [
      'Secure JWT and Bcrypt authentication',
      'Granular user roles and permissions',
      'Activity history (Who, What, When)'
    ]
  }
]

// --- Key Advantages ---
const advantages = [
  {
    icon: 'schedule',
    title: 'Save Time',
    description:
      'Automate repetitive processes and get instant calculations. Focus on what truly matters for your business.'
  },
  {
    icon: 'insights',
    title: 'Make Smarter Decisions',
    description:
      'Access real-time data, detailed analytics, and KPIs to make fast, accurate, and strategic choices.'
  },
  {
    icon: 'trending_up',
    title: 'Scale and Grow',
    description:
      'Our multi-business architecture grows with you. Extensible modules adapt to all your future needs.'
  },
  {
    icon: 'task_alt',
    title: 'Boost Productivity',
    description:
      'A centralized interface and optimized workflows reduce errors and increase daily operational efficiency.'
  }
]
</script>
<template>
  <div class="bg-background min-h-screen font-sans">
    <!-- Header Section -->
    <header class="pt-24 pb-20 px-4 sm:px-6 lg:px-8 text-center bg-surface">
      <h1
        class="text-4xl md:text-6xl font-extrabold text-on-surface mb-4 tracking-tight animate-fadeInUp"
      >
        The Smart Way to Manage <br /><span class="text-primary">Inventory and Sales</span>
      </h1>
      <p
        class="text-lg md:text-xl text-on-surface-variant mb-10 max-w-3xl mx-auto animate-fadeInUp"
        style="animation-delay: 0.2s"
      >
        Iventello is the all-in-one SaaS solution for SMBs, designed to automate processes,
        centralize data, and provide real-time business insights.
      </p>
      <a
        href="#core-features"
        class="btn-primary inline-flex items-center justify-center px-8 py-3 text-base rounded-md shadow-sm transition-transform transform hover:scale-105 animate-fadeInUp"
        style="animation-delay: 0.4s"
      >
        Explore Features
      </a>
    </header>

    <!-- Core Features Section -->
    <section id="core-features" class="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">
            Everything You Need to Succeed
          </h2>
          <p class="mt-4 text-lg text-on-surface-variant">
            Powerful features designed to streamline your operations from day one.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(feature, index) in coreFeatures"
            :key="feature.title"
            class="card p-8 hover:shadow-xl transition-shadow duration-300 border border-outline-variant animate-popIn"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <div
              class="flex items-center justify-center h-12 w-12 rounded-full bg-primary-container mb-6"
            >
              <span class="material-symbols-outlined text-on-primary-container">{{
                feature.icon
              }}</span>
            </div>
            <h3 class="text-lg font-semibold text-on-surface mb-2">
              {{ feature.title }}
            </h3>
            <p class="text-on-surface-variant mb-4 text-sm leading-relaxed">
              {{ feature.description }}
            </p>

            <ul class="space-y-2 text-sm mt-auto">
              <li
                v-for="item in feature.details"
                :key="item"
                class="flex items-start text-on-surface-variant"
              >
                <span
                  class="material-symbols-outlined text-green-500 mr-2 text-base leading-5 flex-shrink-0"
                  >check_circle</span
                >
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Advantages Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 bg-surface">
      <div class="max-w-6xl mx-auto text-center">
        <h2 class="text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">
          Unlock Your Business Potential
        </h2>
        <p class="mt-4 text-lg text-on-surface-variant">
          Iventello empowers you to work smarter, not harder.
        </p>

        <div class="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="(advantage, index) in advantages"
            :key="advantage.title"
            class="p-8 animate-popIn"
            :style="{ animationDelay: `${index * 150}ms` }"
          >
            <span class="material-symbols-outlined text-5xl text-primary mb-4">{{
              advantage.icon
            }}</span>
            <h4 class="text-lg font-semibold text-on-surface mb-2">
              {{ advantage.title }}
            </h4>
            <p class="text-on-surface-variant text-sm">
              {{ advantage.description }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style>
/* Import Google Fonts for Material Symbols and a clean sans-serif font */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');

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