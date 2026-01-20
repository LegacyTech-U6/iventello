<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark text-[#111818] dark:text-white transition-colors duration-200">
    <main class="max-w-[1440px] mx-auto px-6 lg:px-20 py-8">
      <nav class="flex items-center gap-2 mb-6 text-sm">
        <router-link class="text-[#618989] hover:text-primary transition-colors" to="/">Home</router-link>
        <ChevronRightIcon class="w-3 h-3 text-[#618989]" />
        <router-link class="text-[#618989] hover:text-primary transition-colors" to="/blogs">Blog</router-link>
        <ChevronRightIcon class="w-3 h-3 text-[#618989]" />
        <span class="font-semibold text-primary">Search Results</span>
      </nav>

      <div class="flex flex-col lg:flex-row gap-8">
        <aside class="w-full lg:w-64 flex-shrink-0 space-y-8">
          <div class="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-[#f0f4f4] dark:border-gray-800">
            <div class="mb-6">
              <h3 class="font-bold text-lg mb-1">Filters</h3>
              <p class="text-[#618989] text-xs">Refine your search results</p>
            </div>

            <div class="mb-8">
              <label class="block text-xs font-bold uppercase tracking-wider text-[#618989] mb-4">Categories</label>
              <div class="space-y-3">
                <label v-for="cat in availableCategories" :key="cat" class="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    v-model="selectedCategories" 
                    :value="cat"
                    class="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span class="text-sm font-medium group-hover:text-primary transition-colors">{{ cat }}</span>
                </label>
              </div>
            </div>

            <button 
              @click="clearFilters"
              class="w-full py-2 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary/20 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </aside>

        <section class="flex-1">
          <div class="mb-8 px-2">
            <h1 class="text-3xl font-extrabold tracking-tight mb-2">
              Results for '{{ searchQuery }}'
            </h1>
            <p class="text-[#618989] font-medium">{{ filteredArticles.length }} articles found</p>
          </div>

          <div class="space-y-6">
            <article 
              v-for="article in filteredArticles" 
              :key="article.id"
              @click="goToArticle(article.id)"
              class="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border border-[#f0f4f4] dark:border-gray-800 hover:shadow-md transition-all group cursor-pointer"
            >
              <div class="flex flex-col md:flex-row p-5 gap-6">
                <div class="w-full md:w-56 h-40 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden relative">
                  <img 
                    :src="article.image" 
                    class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span class="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    {{ article.category }}
                  </span>
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-3 text-xs text-[#618989] mb-3 font-medium">
                    <span>{{ article.date }}</span>
                    <span class="size-1 rounded-full bg-[#618989]"></span>
                    <span>{{ article.readTime }}</span>
                    <span class="size-1 rounded-full bg-[#618989]"></span>
                    <span class="text-primary font-bold">By {{ article.author }}</span>
                  </div>
                  <h3 class="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {{ article.title }}
                  </h3>
                  <p class="text-sm text-[#618989] leading-relaxed mb-4 line-clamp-2">
                    {{ article.excerpt }}
                  </p>
                  <div class="inline-flex items-center text-sm font-bold text-primary group/link">
                    Read Article 
                    <ArrowRightIcon class="w-4 h-4 ml-1 transition-transform group-hover/link:translate-x-1" />
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div v-if="filteredArticles.length === 0" class="text-center py-20">
            <MagnifyingGlassIcon class="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p class="text-[#618989]">No articles found matching your criteria.</p>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ChevronRightIcon, ArrowRightIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()

// 1. État de recherche (initialisé via l'URL si besoin)
const searchQuery = ref(route.query.q || '')
const selectedCategories = ref([])

// 2. Base de données étendue (devrait idéalement être dans un store ou fichier séparé)
const articles = ref([
  {
    id: 1,
    title: 'How to Easily Manage Multi-Company Inventory',
    category: 'Multi-entreprise',
    author: 'Iventello Team',
    date: 'Oct 24, 2023',
    readTime: '8 min',
    excerpt: 'Multi-entity management is often the breaking point of traditional systems. Learn how to centralize...',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800'
  },
  {
    id: 2,
    title: 'The Future of RFID in Modern Management',
    category: 'Warehouse',
    author: 'David Chen',
    date: 'Oct 12, 2023',
    readTime: '12 min',
    excerpt: 'How automated RFID tracking is revolutionizing the speed of inventory verification...',
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800'
  }
])

const availableCategories = ['Warehouse', 'Logistics', 'Auditing', 'Multi-entreprise']

// 3. Logique de filtrage réactive
const filteredArticles = computed(() => {
  return articles.value.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesCategory = selectedCategories.value.length === 0 || 
                           selectedCategories.value.includes(article.category)
    
    return matchesSearch && matchesCategory
  })
})

// 4. Navigation
const goToArticle = (id) => {
  router.push(`/blogs/${id}`)
}

const clearFilters = () => {
  selectedCategories.value = []
}
</script>