<!-- 
  NavBar.vue
  ===========
  Barre de navigation de la page landing
  - Logo et liens de navigation
  - Responsive (menu hamburger sur mobile)
  - Effet parallaxe au scroll
  - Boutons de connexion/inscription
-->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Menu, X } from 'lucide-vue-next'
import Iventello from "@/assets/iventello.png";


// État du scroll
const isScrolled = ref(false)
// État du menu hamburger
const isOpen = ref(false)

// Détecte le scroll vertical pour changer le style de la navbar
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

// Ajoute le listener de scroll au montage du composant
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

// Nettoie le listener à la destruction du composant
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Items du menu de navigation
const navItems = [
  { name: 'Features', to: '/features' },

]
</script>

<template>
  <!-- HEADER / NAVBAR -->
  <header :class="[
    'fixed top-0 w-full z-50 transition-all ease-in duration-300',
    isScrolled ? 'bg-surface/80 backdrop-blur-lg shadow-md' : 'bg-surface'
  ]">
    <div class="px-6 max-w-7xl w-full mx-auto py-4 flex items-center justify-between relative z-10">
      <!-- Logo et nom du site -->
      <div class="flex items-center gap-2">
        <router-link to="/">
          <img :src="Iventello" class="w-30 h-10" alt="iventello illustration">

        </router-link>


      </div>

      <!-- Navigation Desktop (cachée sur mobile) -->
      <nav class="hidden md:flex items-center gap-8">
        <router-link v-for="item in navItems" :key="item.name" :to="item.to"
          class="text-on-surface-variant hover:text-primary transition-colors font-medium text-sm">
          {{ item.name }}
        </router-link>
      </nav>

      <!-- Boutons Desktop -->
      <div class="hidden md:flex items-center gap-6">
        <router-link to="/login"
          class="text-sm text-on-surface-variant hover:text-primary transition-colors font-medium">
          Log in
        </router-link>
        <router-link to="/register" class="btn-primary px-5 py-2 text-sm rounded-full">
          Get Started
        </router-link>
      </div>

      <!-- Menu Mobile -->
      <button class="md:hidden relative z-10" @click="isOpen = !isOpen">
        <Menu v-if="!isOpen" :size="26" :stroke-width="1.5" />
        <X v-else :size="26" :stroke-width="1.5" />
      </button>
    </div>

    <!-- Menu Mobile -->
    <div v-if="isOpen" class="md:hidden px-6 py-6 space-y-6 transition-all relative z-10 bg-surface">
      <router-link v-for="item in navItems" :key="item.name" :to="item.to"
        class="block text-on-surface-variant hover:text-primary transition-colors font-medium">
        {{ item.name }}
      </router-link>

      <div class="pt-4 space-y-4">
        <router-link to="/login" class="block text-on-surface-variant hover:text-primary transition-colors font-medium">
          Log in
        </router-link>
        <router-link to="/register" class="block btn-primary px-6 py-3 text-sm text-center rounded-full">
          Get Started
        </router-link>
      </div>
    </div>
  </header>
</template>
