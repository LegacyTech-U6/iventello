<script setup lang="ts">
import { ref } from 'vue'
import {
  MagnifyingGlassIcon,
  CalculatorIcon,
  ClipboardDocumentCheckIcon,
  CircleStackIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'

const steps = [
  {
    icon: MagnifyingGlassIcon,
    title: 'Product Selection',
    description: 'Scan or search for your products in the catalog. Our intuitive interface supports instant search and barcode scanning for rapid selection, ensuring you find what you need in seconds.',
  },
  {
    icon: CalculatorIcon,
    title: 'Automated Calculations',
    description: 'VAT, discounts, and totals are calculated instantly. Our intelligent calculation engine handles all mathematical operations automatically, eliminating human error and saving valuable time.',
  },
  {
    icon: ClipboardDocumentCheckIcon,
    title: 'Invoice Generation',
    description: 'Generate professional invoices in a single click. Create compliant documents with customizable designs that reflect your brand identity, ready to be sent to customers immediately.',
  },
  {
    icon: CircleStackIcon,
    title: 'Stock Synchronization',
    description: 'Inventory and statistics updated in real-time. Automatic synchronization ensures your stock levels are always accurate, providing a complete history of all product movements.',
  },
]
</script>

<template>
  <section class="relative bg-white py-24 overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent">
    </div>
    <div class="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent">
    </div>

    <div class="max-w-7xl mx-auto px-6 relative z-10">

      <!-- Header -->
      <div class="text-center mb-24">
        <h2 class="text-emerald-600 font-bold tracking-wide uppercase text-sm mb-3">Workflow</h2>
        <h3 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">How it works</h3>
        <p class="text-gray-600 text-lg max-w-2xl mx-auto">
          A streamlined process designed to optimize your workflow from product selection to final sale.
        </p>
      </div>

      <!-- Timeline -->
      <div class="relative">
        <!-- Vertical Line (Desktop) -->
        <div
          class="hidden md:block absolute left-1/2 top-0 bottom-0 w-px border-l-2 border-dashed border-gray-200 transform -translate-x-1/2">
        </div>

        <!-- Steps -->
        <div v-for="(step, index) in steps" :key="index"
          class="group flex flex-col md:flex-row items-center gap-12 mb-20 last:mb-0 relative"
          :class="{ 'md:flex-row-reverse': index % 2 !== 0 }">

          <!-- Image/Card Side -->
          <div class="w-full md:w-1/2 flex justify-center"
            :class="index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'">
            <div
              class="w-full max-w-md aspect-[4/3] bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex items-center justify-center relative overflow-hidden transition-all duration-500 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 group-hover:-translate-y-2">
              <!-- Decorative BG -->
              <div
                class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              </div>
              <div
                class="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500">
              </div>

              <!-- Icon -->
              <component :is="step.icon"
                class="w-24 h-24 text-emerald-600 relative z-10 drop-shadow-sm transform transition-transform duration-500 group-hover:scale-110"
                stroke-width="1.5" />
            </div>
          </div>

          <!-- Center Marker -->
          <div
            class="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white border-2 border-gray-200 rounded-full items-center justify-center z-10 transition-colors duration-300 group-hover:border-emerald-500 shadow-[0_0_0_4px_rgba(255,255,255,1)]">
            <div class="w-3 h-3 bg-gray-400 rounded-full group-hover:bg-emerald-500 transition-colors duration-300">
            </div>
          </div>

          <!-- Text Side -->
          <div class="w-full md:w-1/2 text-center md:text-left pl-0"
            :class="index % 2 === 0 ? 'md:pl-12 md:text-left' : 'md:pr-12 md:text-right'">
            <div
              class="inline-block px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-600 text-xs font-bold tracking-wider mb-4">
              STEP {{ index + 1 }}
            </div>
            <h3
              class="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors duration-300">
              {{ step.title }}</h3>
            <p class="text-gray-600 text-base md:text-lg leading-relaxed">{{ step.description }}</p>
          </div>

        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* Any specific overrides if needed */
</style>
