<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
// Imports Heroicons
import { 
  Bars3Icon, 
  XMarkIcon, 
  BoltIcon, 
  BookOpenIcon, 
  ChevronDownIcon, 
  Squares2X2Icon, 
  LifebuoyIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  MagnifyingGlassIcon // Ajout de l'icône de recherche
} from '@heroicons/vue/24/outline'
import Iventello from "@/assets/iventello.png";

const router = useRouter()
const isScrolled = ref(false)
const isOpen = ref(false)
const isResourcesOpen = ref(false)
const localSearch = ref('') // État pour la recherche

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

// Logique de redirection vers la recherche
const handleSearch = () => {
  if (localSearch.value.trim()) {
    router.push({ name: 'blog-search', query: { q: localSearch.value } })
    isOpen.value = false // Ferme le menu mobile si ouvert
    localSearch.value = '' // Reset l'input
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const navItems = [
  { name: 'Features', to: '/features', icon: BoltIcon },
]

const resourceItems = [
  { name: 'Blogs', to: '/blogs', icon: BookOpenIcon },
  { name: 'Help Center', to: '#', icon: LifebuoyIcon },
]
</script>

<template>
  <header :class="[
    'fixed top-0 w-full z-50 transition-all ease-in duration-300',
    isScrolled ? 'bg-surface/80 backdrop-blur-lg shadow-md' : 'bg-surface'
  ]">
    <div class="px-6 max-w-7xl w-full mx-auto py-4 flex items-center justify-between relative z-10">
      
      <div class="flex items-center gap-2">
        <router-link to="/">
          <img :src="Iventello" class="w-auto h-10" alt="Iventello">
        </router-link>
      </div>

      <nav class="hidden md:flex items-center gap-8">
        <router-link v-for="item in navItems" :key="item.name" :to="item.to"
          class="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-medium text-sm group">
          <component :is="item.icon" class="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
          {{ item.name }}
        </router-link>

        <div class="relative group" @mouseenter="isResourcesOpen = true" @mouseleave="isResourcesOpen = false">
          <button class="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-medium text-sm">
            <Squares2X2Icon class="w-5 h-5 text-gray-400 group-hover:text-primary" />
            Resources
            <ChevronDownIcon :class="['w-4 h-4 transition-transform', isResourcesOpen ? 'rotate-180' : '']" />
          </button>

          <div v-if="isResourcesOpen" class="absolute top-full left-0 mt-2 w-52 bg-surface border border-gray-100 rounded-xl shadow-xl py-2 overflow-hidden animate-in fade-in slide-in-from-top-2">
            <router-link v-for="res in resourceItems" :key="res.name" :to="res.to"
              class="flex items-center gap-3 px-4 py-3 text-sm text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-all">
              <component :is="res.icon" class="w-5 h-5" />
              {{ res.name }}
            </router-link>
          </div>
        </div>
      </nav>

      <div class="hidden md:flex items-center gap-6">
        <div class="relative group">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
          <input 
            v-model="localSearch" 
            @keyup.enter="handleSearch"
            type="text" 
            placeholder="Search blog..."
            class="pl-9 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm w-48 focus:w-64 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
          />
        </div>

        <router-link to="/login"
          class="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors font-medium group">
          <ArrowRightOnRectangleIcon class="w-5 h-5 text-gray-400 group-hover:text-primary" />
          Log in
        </router-link>
        <router-link to="/register" class="btn-primary px-6 py-2.5 text-sm rounded-full flex items-center gap-2 shadow-lg shadow-primary/20">
          <UserPlusIcon class="w-5 h-5" />
          Get Started
        </router-link>
      </div>

      <button class="md:hidden relative z-10 text-on-surface-variant" @click="isOpen = !isOpen">
        <Bars3Icon v-if="!isOpen" class="w-7 h-7" />
        <XMarkIcon v-else class="w-7 h-7" />
      </button>
    </div>

    <div v-if="isOpen" class="md:hidden fixed inset-0 top-[72px] bg-surface z-50 px-6 py-8 space-y-8 animate-in slide-in-from-right overflow-y-auto">
      <div class="relative">
        <MagnifyingGlassIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input 
          v-model="localSearch" 
          @keyup.enter="handleSearch"
          class="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-lg outline-none focus:border-primary transition-colors" 
          placeholder="Search blog..." 
          type="text"
        />
      </div>

      <div class="space-y-6">
        <p class="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">Main Menu</p>
        <router-link v-for="item in navItems" :key="item.name" :to="item.to"
          class="flex items-center gap-4 text-xl text-on-surface-variant font-semibold"
          @click="isOpen = false">
          <component :is="item.icon" class="w-6 h-6 text-primary" />
          {{ item.name }}
        </router-link>
        
        <p class="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold pt-4">Resources</p>
        <router-link v-for="res in resourceItems" :key="res.name" :to="res.to"
          class="flex items-center gap-4 text-xl text-on-surface-variant font-semibold"
          @click="isOpen = false">
          <component :is="res.icon" class="w-6 h-6 text-primary" />
          {{ res.name }}
        </router-link>
      </div>

      <div class="pt-8 space-y-4 border-t border-gray-100">
        <router-link to="/login" class="flex items-center gap-4 text-xl text-on-surface-variant font-semibold" @click="isOpen = false">
          <ArrowRightOnRectangleIcon class="w-6 h-6" />
          Log in
        </router-link>
        <router-link to="/register" class="flex items-center justify-center gap-3 w-full btn-primary px-6 py-4 rounded-full text-base font-bold shadow-xl shadow-primary/20" @click="isOpen = false">
          Get Started
        </router-link>
      </div>
    </div>
  </header>
</template>