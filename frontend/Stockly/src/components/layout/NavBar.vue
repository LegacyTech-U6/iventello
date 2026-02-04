<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Bars3Icon, XMarkIcon, ChevronDownIcon,
  BoltIcon, Squares2X2Icon, LifebuoyIcon, BookOpenIcon
} from '@heroicons/vue/24/outline'
import Iventello from "@/assets/iventello.png";

const router = useRouter()
const isScrolled = ref(false)
const isOpen = ref(false)
const isResourcesOpen = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

const navItems = [
  { name: 'Fonctionnalités', to: '/features', icon: BoltIcon },
  { name: 'Tarifs', to: '/pricing', icon: LifebuoyIcon },
  { name: 'Blog', to: '/blogs', icon: BookOpenIcon },
]


</script>

<template>
  <header :class="[
    'fixed top-0 w-full z-50 transition-all duration-300',
    isScrolled ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm' : 'bg-white py-4'
  ]">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

      <div class="flex-shrink-0 flex items-center gap-2">
        <router-link to="/">
          <img :src="Iventello" class="w-auto h-8" alt="Iventello">
        </router-link>
      </div>

      <nav class="hidden lg:flex items-center gap-8">
        <router-link v-for="item in navItems" :key="item.name" :to="item.to"
          class="text-[15px] font-medium text-gray-600 hover:text-emerald-600 transition-colors">
          {{ item.name }}
        </router-link>

      </nav>

      <div class="hidden md:flex items-center gap-3">
        <router-link to="/login"
          class="text-[15px] font-semibold text-gray-700 hover:text-emerald-600 transition-colors px-4 py-2">
          Se connecter
        </router-link>

        <router-link to="/register"
          class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full text-[15px] font-bold shadow-sm transition-all hover:-translate-y-0.5">
          Essai Gratuit
        </router-link>
      </div>

      <button class="lg:hidden p-2 text-gray-600" @click="isOpen = !isOpen">
        <Bars3Icon v-if="!isOpen" class="w-7 h-7" />
        <XMarkIcon v-else class="w-7 h-7" />
      </button>
    </div>

    <div v-if="isOpen"
      class="lg:hidden fixed inset-0 top-[70px] bg-white z-40 px-6 py-8 overflow-y-auto border-t border-gray-100">
      <div class="flex flex-col space-y-6">
        <router-link v-for="item in navItems" :key="item.name" :to="item.to" class="text-lg font-semibold text-gray-900"
          @click="isOpen = false">
          {{ item.name }}
        </router-link>
        <div class="h-px bg-gray-100 my-2"></div>
        <router-link to="/login" class="text-lg font-semibold text-gray-600" @click="isOpen = false">
          Se connecter
        </router-link>
        <router-link to="/register" class="bg-emerald-600 text-white text-center py-3 rounded-full font-bold shadow-md"
          @click="isOpen = false">
          Essai Gratuit
        </router-link>
      </div>
    </div>
  </header>
</template>