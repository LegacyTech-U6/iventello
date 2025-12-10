<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  FileText, 
  Bell 
} from 'lucide-vue-next'

gsap.registerPlugin(ScrollTrigger)

const features = computed(() => [
  {
    icon: Package,
    title: 'Complete Inventory Management',
    description:
      'Track your stock levels in real time, monitor incoming and outgoing product movements, and receive automatic alerts when items reach low or critical levels. Enjoy advanced categorization, batch and expiry tracking, and full product history for complete control over your inventory.',
  },
  {
    icon: ShoppingCart,
    title: 'Integrated Point of Sale',
    description:
      'Generate sales instantly with an intuitive POS interface that supports VAT automation, discounts, refunds, and multiple payment methods. Print professional receipts, create invoices on the fly, and sync all transactions directly with your inventory in real time.',
  },
  {
    icon: Users,
    title: 'Customer & Supplier Management',
    description:
      'Centralize all your business contacts in one place. Access detailed purchase histories, manage supplier relationships, automate purchase orders, and personalize communication based on customer behavior and previous interactions.',
  },
  {
    icon: TrendingUp,
    title: 'Advanced Analytics & Reporting',
    description:
      'Analyze your business performance with detailed dashboards and KPIs. Identify your best-selling products, monitor sales trends, compare categories, and access daily, weekly, and monthly performance insights to make better, data-driven decisions.',
  },
  {
    icon: FileText,
    title: 'Multi-Company Management',
    description:
      'Manage multiple businesses from a single account while ensuring complete data isolation between companies. Customize configurations, products, user roles, and dashboards independently for each business, all under one secure interface.',
  },
  {
    icon: Bell,
    title: 'Smart & Automated Notifications',
    description:
      'Receive real-time alerts for low stock levels, upcoming supplier orders, pending tasks, employee activity, and critical system events. Customize your notification settings to stay informed and never miss an important update.',
  },
])


const sectionRef = ref(null)
const headerRef = ref(null)
const subtitleRef = ref(null)

onMounted(() => {
  gsap.from([headerRef.value, subtitleRef.value], {
    scrollTrigger: { trigger: sectionRef.value, start: 'top 80%' },
    opacity: 0,
    y: 40,
    stagger: 0.15,
    duration: 1.1,
    ease: 'power3.out',
  })

  nextTick(() => {
    gsap.utils.toArray('.feature-item').forEach((card: any, i) => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 85%' },
        opacity: 0,
        y: 60,
        duration: 1,
        delay: i * 0.1,
        ease: 'power3.out',
      })
    })
  })
})
</script>


<template>
  <section ref="sectionRef" class="bg-gray-50 py-20 px-6">
    <div class="max-w-7xl mx-auto">

      <!-- HEADER -->
      <div class="text-center mb-20">
        <p class="text-sm uppercase tracking-wider text-gray-500 mb-3">
          THE ULTIMATE STOCK MANAGEMENT SOLUTION
        </p>

        <h2
          ref="headerRef"
          class="text-3xl md:text-4xl font-light text-gray-900 inline-block relative pb-4"
        >
          Everything You Need to Manage Your Business
          <svg class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-40 h-8"
               viewBox="0 0 300 40" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 20 C30 35, 60 5, 90 25 C120 40, 150 10, 180 30 C210 40, 240 15, 270 25 C300 20, 300 20, 300 20"
              stroke="#10B981"
              stroke-width="10"
              fill="none"
              stroke-linecap="round"
            />
          </svg>
        </h2>

        <p ref="subtitleRef" class="text-gray-600 mt-6 text-lg max-w-2xl mx-auto font-light">
          A complete solution to digitize and automate your stock, sales, suppliers, notifications and analytics.
        </p>
      </div>

      <!-- GRID -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-24">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="feature-item"
        >
          <component
            :is="feature.icon"
            :size="30"
            class="text-[#006879] mb-6"
          />

          <h3 class="text-2xl font-light text-gray-900 mb-4">
            {{ feature.title }}
          </h3>

          <p class="text-gray-600 leading-relaxed">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.feature-card {
  will-change: transform, opacity;
}
</style>
