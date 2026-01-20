<template>
  <div :class="{ 'dark': isDarkMode }" class="min-h-screen md:pt-15">
    <div class="bg-background-light dark:bg-background-dark text-[#111818] dark:text-white font-display transition-colors duration-200">
      
      <div class="fixed top-0 left-0 w-full h-1 z-[60] bg-[#dbe6e6]">
        <div class="h-full bg-primary transition-all duration-300" :style="{ width: readingProgress + '%' }"></div>
      </div>

      <main class="max-w-[1200px] mx-auto px-6 py-8">
        <nav class="flex items-center gap-2 mb-8 text-sm font-medium">
          <router-link class="text-[#618989] hover:text-primary transition-colors" to="/">Home</router-link>
          <ChevronRightIcon class="w-3 h-3 text-[#618989]" />
          <router-link class="text-[#618989] hover:text-primary transition-colors" to="/blogs">Blog</router-link>
          <ChevronRightIcon class="w-3 h-3 text-[#618989]" />
          <span class="text-primary line-clamp-1">{{ currentArticle.title }}</span>
        </nav>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <article class="lg:col-span-8">
            <header class="mb-10">
              <h1 class="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 leading-[1.15]">
                {{ currentArticle.title }}
              </h1>
              <div class="flex items-center gap-4 text-sm">
                <div class="size-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                  <img :src="currentArticle.author.image" alt="Author" class="object-cover" />
                </div>
                <div>
                  <p class="font-bold">{{ currentArticle.author.name }}</p>
                  <p class="text-[#618989]">Published on {{ currentArticle.date }} • {{ currentArticle.readTime }} read</p>
                </div>
              </div>
            </header>

            <div class="relative w-full aspect-video rounded-xl overflow-hidden mb-12 shadow-xl shadow-primary/5">
              <img :src="currentArticle.heroImage" class="w-full h-full object-cover" alt="Hero Image" />
            </div>

            <div class="prose max-w-none dark:prose-invert">
              <p class="text-xl text-[#618989] mb-10 leading-relaxed font-medium italic border-l-4 border-primary pl-6">
                {{ currentArticle.summary }}
              </p>

              <h2 id="section1">Centralization vs. Fragmentation</h2>
              <p>When a group manages several subsidiaries, the major challenge lies in global visibility...</p>

              <div id="section2" class="my-12 p-8 bg-white dark:bg-gray-800 border border-[#f0f4f4] dark:border-gray-700 rounded-xl">
                <div class="text-center mb-8">
                  <span class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">Iventello Architecture</span>
                  <h3 class="text-lg font-bold mt-2">Multi-Flow Synchronization</h3>
                </div>
                <div class="flex flex-col md:flex-row items-center justify-around gap-8">
                  <div class="flex flex-col items-center gap-2">
                    <div class="size-16 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center border border-dashed border-primary">
                      <BuildingOfficeIcon class="w-8 h-8 text-primary" />
                    </div>
                    <span class="text-xs font-bold">Branch A</span>
                  </div>
                  <ArrowsRightLeftIcon class="w-8 h-8 text-primary hidden md:block animate-pulse" />
                  <div class="size-24 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/40 ring-8 ring-primary/10">
                    <CloudIcon class="w-12 h-12" />
                  </div>
                  <ArrowsRightLeftIcon class="w-8 h-8 text-primary hidden md:block animate-pulse" />
                  <div class="flex flex-col items-center gap-2">
                    <div class="size-16 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center border border-dashed border-primary">
                      <BuildingOfficeIcon class="w-8 h-8 text-primary" />
                    </div>
                    <span class="text-xs font-bold">Branch B</span>
                  </div>
                </div>
              </div>

              <h2 id="section3">Key Platform Benefits</h2>
              <ul class="list-disc pl-6 space-y-4">
                <li v-for="benefit in benefits" :key="benefit.title">
                  <strong class="text-primary">{{ benefit.title }}:</strong> {{ benefit.description }}
                </li>
              </ul>
            </div>
            
            <div class="mt-16 p-10 bg-[#111818] rounded-2xl text-white relative overflow-hidden group">
               <div class="relative z-10">
                 <h3 class="text-2xl font-bold mb-4">Ready to simplify your management?</h3>
                 <p class="text-gray-400 mb-8 max-w-md">Join over 500 companies optimizing their stock daily with Iventello.</p>
                 <button class="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-bold transition-all flex items-center gap-2">
                   Start Free Trial <ArrowLongRightIcon class="w-5 h-5" />
                 </button>
               </div>
            </div>
          </article>

          <aside class="lg:col-span-4">
            <div class="sticky top-24 space-y-10">
              <div class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-[#f0f4f4] dark:border-gray-700">
                <h4 class="font-bold text-sm mb-4 uppercase tracking-wider text-[#618989]">Sommaire</h4>
                <ul class="space-y-4 text-sm font-medium">
                  <li v-for="(item, index) in summaryItems" :key="index">
                    <a :href="'#section' + (index + 1)" class="text-[#4a5568] dark:text-gray-300 hover:text-primary transition-colors flex items-center gap-2">
                      <span class="size-1.5 bg-gray-300 rounded-full"></span>
                      {{ item.text }}
                    </a>
                  </li>
                </ul>
              </div>

              <div class="space-y-6">
                <h4 class="font-bold text-sm uppercase tracking-wider text-[#618989]">Articles suggérés</h4>
                <router-link v-for="rel in 2" :key="rel" to="#" class="group block">
                  <div class="flex gap-4">
                    <div class="size-20 rounded-lg bg-gray-100 shrink-0 overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200" class="object-cover w-full h-full" />
                    </div>
                    <div class="flex flex-col justify-center">
                      <h5 class="text-sm font-bold group-hover:text-primary transition-colors line-clamp-2">Optimiser ses flux logistiques</h5>
                      <p class="text-[10px] text-[#618989] mt-1 uppercase">Logistique • 5 min</p>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useHead } from '@unhead/vue'
import { 
  ChevronRightIcon, 
  ArrowLongRightIcon, 
  BuildingOfficeIcon, 
  ArrowsRightLeftIcon,
  CloudIcon,
  UserIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  id: { type: String, required: true }
})

// Simuler une base de données d'articles
const blogDatabase = {
  '1': {
    title: 'How to Easily Manage Multi-Company Inventory with Iventello',
    author: { name: 'Iventello Team', image: 'https://i.pravatar.cc/150?u=staff' },
    date: 'Oct 24, 2023',
    readTime: '8 min',
    heroImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2000',
    summary: 'Multi-entity management is often the breaking point of traditional inventory systems.'
  }
}

const currentArticle = computed(() => {
  return blogDatabase[props.id] || blogDatabase['1']
})

useHead({
  title: computed(() => `${currentArticle.value.title} | Iventello Blog`),
  meta: [{ name: 'description', content: computed(() => currentArticle.value.summary) }]
})

const readingProgress = ref(0)
const isDarkMode = ref(false)

const benefits = [
  { title: 'Real-time Updates', description: 'Every sale in one entity instantly impacts the global group vision.' },
  { title: 'Inter-company Transfers', description: 'Manage stock movements between your companies with a single click.' },
  { title: 'Unified Reporting', description: 'Get a consolidated view of your assets without Excel files.' }
]

const summaryItems = [
  { text: 'Centralization vs. Fragmentation' },
  { text: 'Multi-Flow Synchronization' },
  { text: 'Key Benefits' }
]

const updateScrollProgress = () => {
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
  readingProgress.value = (window.scrollY / scrollHeight) * 100
}

onMounted(() => window.addEventListener('scroll', updateScrollProgress))
onUnmounted(() => window.removeEventListener('scroll', updateScrollProgress))
</script>

