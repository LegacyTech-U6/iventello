<template>
  <div class="min-h-screen bg-background-light md:pb-15 dark:bg-background-dark text-[#111818] dark:text-white font-display transition-colors duration-200">
    <div class="fixed top-0 left-0 w-full h-1 z-[60] bg-[#dbe6e6]">
      <div 
        class="h-full bg-primary transition-all duration-300" 
        :style="{ width: readingProgress + '%' }"
      ></div>
    </div>

    <main class="max-w-[1200px] mx-auto px-6 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <article class="lg:col-span-8">
          <nav class="flex items-center gap-2 mb-6 text-sm font-medium text-gray-500">
            <router-link to="/blogs" class="text-primary hover:underline">Blog</router-link>
            <ChevronRightIcon class="size-3" />
            <span>Product Updates</span>
          </nav>

          <h1 class="text-4xl lg:text-5xl font-extrabold tracking-tight mb-8 leading-[1.15]">
            Product Tracking and Automated Alerts: The Power of Multi-Company Management.
          </h1>

          <div class="flex items-center gap-4 mb-10 pb-10 border-b border-gray-100 dark:border-gray-800">
            <div class="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <UserIcon class="size-6" />
            </div>
            <div>
              <p class="font-bold text-sm">John Doe</p>
              <p class="text-gray-500 text-xs">May 12, 2024 • 5 min read</p>
            </div>
          </div>

          <div class="article-content prose dark:prose-invert max-w-none text-lg text-gray-600 dark:text-gray-300">
            <p>
              Managing inventory for a single entity is already a challenge. But when your business expands across multiple sites, subsidiaries, or countries, complexity increases exponentially. Manual synchronization becomes a fertile ground for costly errors.
            </p>

            

            <div class="my-12 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
              <div class="flex items-center justify-between mb-6">
                <div class="flex gap-2">
                  <span class="size-3 rounded-full bg-red-400"></span>
                  <span class="size-3 rounded-full bg-yellow-400"></span>
                  <span class="size-3 rounded-full bg-green-400"></span>
                </div>
                <div class="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-[10px] font-mono text-gray-500">dashboard.iventello.io</div>
              </div>

              <div class="flex gap-4 border-b border-gray-100 dark:border-gray-800 mb-6">
                <button class="px-4 py-2 text-sm font-bold border-b-2 border-primary text-primary">Global View</button>
                <button class="px-4 py-2 text-sm font-medium text-gray-400">Logistics SARL</button>
                <button class="px-4 py-2 text-sm font-medium text-gray-400">Iventello UK</button>
              </div>

              <div class="space-y-4">
                <div class="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <BellAlertIcon class="size-6 text-red-600" />
                    <div>
                      <p class="text-sm font-bold text-red-900 dark:text-red-100">Critical Stock Alert</p>
                      <p class="text-xs text-red-700 dark:text-red-200">Product: X-200 Sensor (Lyon Warehouse)</p>
                    </div>
                  </div>
                  <span class="text-[10px] font-bold px-2 py-1 bg-white dark:bg-red-800 text-red-600 dark:text-red-100 rounded uppercase">Now</span>
                </div>
                <div class="p-4 bg-primary/5 border-l-4 border-primary rounded-r-lg flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <ArrowPathIcon class="size-6 text-primary" />
                    <div>
                      <p class="text-sm font-bold text-primary">Sync Complete</p>
                      <p class="text-xs text-gray-600">Inventory updated for 4 entities.</p>
                    </div>
                  </div>
                  <span class="text-[10px] text-gray-400">2m ago</span>
                </div>
              </div>

              <div class="grid grid-cols-3 gap-4 mt-8 text-center">
                <div v-for="stat in stats" :key="stat.label" class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <p class="text-[10px] text-gray-500 uppercase font-bold mb-1">{{ stat.label }}</p>
                  <p class="text-xl font-bold" :class="stat.color">{{ stat.value }}</p>
                </div>
              </div>
            </div>

            <h2 class="text-2xl font-bold text-[#111818] dark:text-white mt-12 mb-4">Why Multi-Company Synchronization?</h2>
            <p>
              Iventello was built with a native "multi-tenant" architecture. This means each entity in your group maintains its own accounting and tax autonomy, while sharing a common or synchronized product database.
            </p>

            <p>
              Imagine a scenario where your French subsidiary is missing critical components, while your Belgian branch has a dormant surplus. Without a unified system, you would place an unnecessary supplier order. With Iventello, a <strong>low stock alert</strong> can automatically suggest an internal transfer.
            </p>

            <div class="bg-primary/10 p-8 rounded-2xl border border-primary/20 my-8 italic text-primary/80">
              <h3 class="text-lg font-bold text-primary mb-2 not-italic">Did you know?</h3>
              Companies using automated alerts reduce their stock-out rates by an average of 34% within the first six months.
            </div>

            <h2 class="text-2xl font-bold text-[#111818] dark:text-white mt-12 mb-4">Smart and Proactive Alerts</h2>
            <p>
              Our alerts aren't just simple email notifications. They are contextual. You can configure different replenishment thresholds per warehouse, country, or seasonality.
            </p>

            <ul class="list-none space-y-4 my-8">
              <li v-for="feature in alertFeatures" :key="feature" class="flex items-start gap-3">
                <CheckCircleIcon class="size-6 text-primary shrink-0" />
                <span>{{ feature }}</span>
              </li>
            </ul>
          </div>
        </article>

        <aside class="lg:col-span-4">
          <div class="sticky top-24 space-y-8">
            <div class="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <h4 class="text-sm font-bold mb-4">Search</h4>
              <div class="relative">
                <input 
                  type="text" 
                  placeholder="Articles, guides, news..." 
                  class="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg py-3 pl-10 text-sm focus:ring-2 focus:ring-primary"
                />
                <MagnifyingGlassIcon class="size-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div class="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <h4 class="text-sm font-bold mb-6 uppercase text-gray-500 tracking-wider">Related Articles</h4>
              <div class="space-y-6">
                <router-link v-for="art in relatedArticles" :key="art.title" to="#" class="group flex gap-4 items-center">
                  <div class="size-16 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                    <img :src="art.img" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h5 class="text-sm font-bold leading-tight group-hover:text-primary transition-colors">{{ art.title }}</h5>
                </router-link>
              </div>
            </div>

            <div class="bg-primary p-8 rounded-2xl text-white shadow-lg shadow-primary/20">
              <EnvelopeIcon class="size-10 mb-4" />
              <h4 class="text-xl font-bold mb-2">Stay Informed</h4>
              <p class="text-sm text-white/80 mb-6">Get logistics tips directly in your inbox.</p>
              <div class="space-y-3">
                <input type="email" placeholder="your@email.com" class="w-full rounded-lg border-none text-gray-900 py-3 text-sm px-4 focus:ring-0" />
                <button class="w-full bg-white text-primary font-bold py-3 rounded-lg text-sm hover:bg-gray-50 transition-colors">Subscribe</button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useHead } from '@unhead/vue'
// Importation des icônes Heroicons (Outline)
import { 
  UserIcon, 
  BellAlertIcon, 
  ArrowPathIcon, 
  CheckCircleIcon, 
  MagnifyingGlassIcon, 
  EnvelopeIcon,
  ChevronRightIcon 
} from '@heroicons/vue/24/outline'
// --- SEO CONFIGURATION ---
useHead({
  title: 'Multi-Company Inventory Alerts & Tracking | Iventello Blog',
  meta: [
    { 
      name: 'description', 
      content: 'Learn how Iventello helps multi-site enterprises synchronize stock and automate alerts across different entities to reduce stock-outs by 34%.' 
    },
    { property: 'og:title', content: 'Product Tracking and Automated Alerts: Multi-Company Power' },
    { property: 'og:description', content: 'Explore the benefits of native multi-tenant architecture for global inventory management.' },
    { property: 'og:type', content: 'article' },
    { name: 'twitter:card', content: 'summary_large_image' }
  ],
})
// Logic for the reading progress bar
const readingProgress = ref(0)
const updateScroll = () => {
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
  readingProgress.value = (window.scrollY / scrollHeight) * 100
}

onMounted(() => window.addEventListener('scroll', updateScroll))
onUnmounted(() => window.removeEventListener('scroll', updateScroll))

// Dynamic Data
const stats = [
  { label: 'Total Stock', value: '12,840', color: '' },
  { label: 'Movement', value: '+14%', color: 'text-green-600' },
  { label: 'Active Alerts', value: '3', color: 'text-red-500' }
]

const alertFeatures = [
  "Automatically sending a pre-filled purchase order to your favorite supplier.",
  "Slack or Microsoft Teams notification for the local logistics team.",
  "Real-time update of your B2B e-commerce store to avoid backorders."
]

const relatedArticles = [
  { title: 'Optimizing your storage costs in 2024', img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200' },
  { title: 'Connecting your ERP to Iventello: API Guide', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200' }
]
</script>

<style scoped>

</style>