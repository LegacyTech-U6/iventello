<template>
  <div :class="{ 'dark': isDarkMode }" class="min-h-screen lg:pt-15">
    <div class="bg-background-light dark:bg-background-dark text-[#111818] dark:text-white transition-colors duration-200">
      
    

      <main class="max-w-[1280px] mx-auto px-6 py-8">
        <nav class="flex items-center gap-2 mb-8 text-sm font-medium">
            <router-link class="text-[#618989] hover:text-primary transition-colors" to="/">Home</router-link>
          <ChevronRightIcon class="w-3 h-3 text-[#329898]" />
          <router-link class="text-[#618989] hover:text-primary transition-colors" to="/blogs"> <span class="text-primary">Blog</span></router-link>
          
        </nav>
        <section class="mb-16">
          <div class="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-[#f0f4f4] dark:border-gray-800 shadow-sm">
            <div class="flex flex-col lg:flex-row">
              <div class="lg:w-3/5 h-[300px] lg:h-auto bg-center bg-cover relative" 
                   style="background-image: url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000')">
                <div class="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
              </div>
              <div class="lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center gap-6">
                <span class="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">Featured Insight</span>
                <h2 class="text-3xl lg:text-4xl font-extrabold leading-tight">{{ featuredArticle.title }}</h2>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ featuredArticle.excerpt }}</p>
                <button @click="viewBlog(1)" class="bg-primary w-fit text-white px-6 py-3 rounded-xl font-bold hover:scale-[1.02] transition-transform flex items-center gap-2">
                  Read Article <ArrowRightIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <div class="flex flex-col lg:flex-row gap-12">
          <div class="flex-1">
            <div class="flex items-center justify-between mb-8">
              <h3 class="text-2xl font-bold">Latest Articles</h3>
              <div class="flex gap-2">
                <button @click="viewMode = 'grid'" :class="viewMode === 'grid' ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'" class="p-2 rounded-lg border border-gray-200 dark:border-gray-700">
                  <Squares2X2Icon class="w-5 h-5" />
                </button>
                <button @click="viewMode = 'list'" :class="viewMode === 'list' ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'" class="p-2 rounded-lg border border-gray-200 dark:border-gray-700">
                  <ListBulletIcon class="w-5 h-5" />
                </button>
              </div>
            </div>

            <div :class="viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-8' : 'flex flex-col gap-6'">
              <article v-for="article in articles" :key="article.id" 
                       class="group bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-[#f0f4f4] dark:border-gray-800 hover:shadow-xl transition-all duration-300">
                <div :class="viewMode === 'grid' ? 'aspect-video' : 'h-48 md:h-64'" 
                     class="bg-cover bg-center transition-transform duration-500 group-hover:scale-105" 
                     :style="{ backgroundImage: `url(${article.image})` }"></div>
                <div class="p-6">
                  <span class="text-primary text-xs font-bold uppercase tracking-tighter">{{ article.category }}</span>
                  <h4 class="text-xl font-bold mt-2 mb-3 group-hover:text-primary transition-colors">{{ article.title }}</h4>
                  <p class="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3">{{ article.excerpt }}</p>
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-400 font-medium">{{ article.readTime }}</span>
                    <router-link :to="article.to" class="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
                      Read More <ArrowUpRightIcon class="w-3 h-3" />
                    </router-link>

                   
                  </div>
                </div>
              </article>
            </div>
            
            <div class="mt-12 flex justify-center">
              <button class="px-8 py-3 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all">
                Load More Articles
              </button>
            </div>
          </div>

          <aside class="w-full lg:w-80 flex flex-col gap-10">
            <div class="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-[#f0f4f4] dark:border-gray-800 shadow-sm">
              <h4 class="text-sm font-bold mb-4 uppercase tracking-widest text-gray-400">Search</h4>
              <div class="relative">
                <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input v-model="searchQuery" class="w-full bg-[#f0f4f4] dark:bg-gray-800 border-none rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary text-sm" placeholder="Topics..." type="text"/>
              </div>
            </div>

            <div class="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-[#f0f4f4] dark:border-gray-800 shadow-sm">
              <h4 class="text-sm font-bold mb-4 uppercase tracking-widest text-gray-400">Categories</h4>
              <ul class="flex flex-col gap-1">
                <li v-for="cat in categories" :key="cat.name">
                  <a class="flex items-center justify-between p-2 rounded-lg hover:bg-primary/5 group transition-colors" href="#">
                    <span class="text-sm font-medium group-hover:text-primary">{{ cat.name }}</span>
                    <span class="text-[10px] bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-gray-500">{{ cat.count }}</span>
                  </a>
                </li>
              </ul>
            </div>

            <div class="bg-primary p-8 rounded-2xl text-white shadow-xl shadow-primary/20 relative overflow-hidden">
              <div class="relative z-10">
                <EnvelopeIcon class="w-10 h-10 mb-4" />
                <h4 class="text-2xl font-bold leading-tight mb-3">Inventory Insights Weekly</h4>
                <p class="text-white/80 text-sm mb-6">Join 5,000+ logistics experts.</p>
                <form @submit.prevent="handleSubscribe" class="flex flex-col gap-3">
                  <input v-model="email" class="w-full px-4 py-3 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:ring-white outline-none" placeholder="Email address" type="email"/>
                  <button class="bg-white text-primary font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors">Subscribe Now</button>
                </form>
              </div>
              <div class="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full"></div>
            </div>
          </aside>
        </div>
      </main>

      </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { 
  CubeIcon as InventoryIcon, 
  MagnifyingGlassIcon, 
  ArrowRightIcon, 
  ArrowUpRightIcon,
  Squares2X2Icon,
  ListBulletIcon,
  EnvelopeIcon,
  SunIcon,
  MoonIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/solid'
import { useRouter } from 'vue-router'
const router = useRouter()

// État
const isDarkMode = ref(false)
const viewMode = ref('grid')
const searchQuery = ref('')
const email = ref('')

const navLinks = [
  { name: 'Product', active: false },
  { name: 'Solutions', active: false },
  { name: 'Resources', active: true },
  { name: 'Pricing', active: false }
]

const categories = [
  { name: 'Gestion de Stock', count: 24 },
  { name: 'Multi-entreprise', count: 18 },
  { name: 'Supply Chain Automation', count: 12 },
  { name: 'Inventory Analytics', count: 31 }
]

const featuredArticle = {
  title: "Mastering Multi-Warehouse Inventory Management",
  excerpt: "Discover the strategies top enterprises use to synchronize stock levels across dozens of locations with 99.9% accuracy.",
}

const viewBlog = (id) => {
  router.push(`/blogs/${id}`)
  // Logique pour naviguer vers la page de blog
}

const articles = reactive([
 {
  id: 1, // ou l'ID correspondant à cet article
  category: "Inventory Management",
  title: "Product Tracking and Auto-Alerts: The Power of Multi-Company Management",
excerpt: "Managing logistics across multiple subsidiaries often leads to costly synchronization errors. This article explores how Iventello's multi-tenant architecture and proactive smart alerts can unify your stock tracking, automate reordering, and reduce stock-out rates by 34% through real-time global visibility.",
  readTime: '5 min',
  image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200',
    to: '/blogs/stock-alerts'
},
  {
    id: 2,
    category: "Inventory Analytics",
    title: "The Benefits of Real-Time Tracking",
    excerpt: "Visibility is king. We explore why real-time data sync is the foundation.",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    to: "/blogs/AnalyticsBenefits"
  }
])

// Méthodes
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
}

const handleSubscribe = () => {
  alert(`Merci pour l'inscription : ${email.value}`)
  email.value = ''
}
</script>

<style>
/* Manrope font est géré via Tailwind ou @import */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>