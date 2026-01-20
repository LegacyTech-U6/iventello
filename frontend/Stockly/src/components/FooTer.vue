<template>
  <footer class="bg-[#1a1d23] text-gray-400 border-t border-gray-800">
    <div class="max-w-[1200px] mx-auto px-6 py-16">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-12">
        
        <div class="md:col-span-4 lg:col-span-5">
          <div class="flex items-center gap-3 mb-6">
            <img :src="Iventello" class="h-10 w-auto object-contain" alt="Iventello Logo">
            <span class="text-xl font-bold text-white tracking-tight">Iventello</span>
          </div>
          <p class="text-sm leading-relaxed mb-8 max-w-xs">
            The smart way to manage inventory and sales. Centralize your operations and scale your business with ease.
          </p>
          
          <div class="flex space-x-5">
            <a v-for="(social, index) in socialLinks" :key="index" :href="social.url" 
               class="hover:text-primary transition-colors duration-300">
              <component :is="social.icon" class="w-5 h-5" />
            </a>
          </div>
        </div>

        <div class="md:col-span-2 lg:col-span-2">
          <h3 class="text-sm font-bold uppercase tracking-widest text-white mb-6">Navigation</h3>
          <nav class=" items-center gap-8">
    <a v-for="link in navLinks" :key="link.name" 
       href="#" 
       :class="[
         link.active ? 'text-primary' : 'text-gray-600 dark:text-gray-300 hover:text-primary transition-colors'
       ]"
       class="text-sm font-semibold flex items-center gap-2 group">
      
      <component 
        :is="link.icon" 
        class="w-4 h-4 transition-transform group-hover:scale-110" 
        :class="link.active ? 'text-primary' : 'text-gray-400 group-hover:text-primary'"
      />
      
      {{ link.name }}
    </a>
  </nav>
        </div>

        <div class="md:col-span-6 lg:col-span-5">
          <h3 class="text-sm font-bold uppercase tracking-widest text-white mb-6">Subscribe to our newsletter</h3>
          <p class="text-sm mb-6">
            Get the latest news, articles, and inventory management resources sent to your inbox weekly.
          </p>
          <form @submit.prevent="handleSubscribe" class="flex flex-col sm:flex-row gap-3">
            <div class="flex-grow">
              <input 
                type="email" 
                required 
                placeholder="Enter your email" 
                class="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            <button type="submit" class="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-primary/20">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div class="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <p>&copy; {{ new Date().getFullYear() }} Iventello SAS. All rights reserved.</p>
        <p class="flex items-center gap-1">
          Designed and developed by 
          <span class="font-bold text-white">Fillin Corporation</span>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue';
import Iventello from "@/assets/iventello.png";
// Vous pouvez importer des icônes de heroicons ou mettre vos SVG ici
import { 
  ChatBubbleLeftRightIcon as FacebookIcon, 
  ShareIcon as TwitterIcon, 
  LinkIcon as InstagramIcon,
  Squares2X2Icon,   // Pour "Product" ou "Dashboard"
  LightBulbIcon,    // Pour "Solutions"
  BookOpenIcon,     // Pour "Resources/Blog"
  TagIcon,          // Pour "Pricing"
  ArrowRightIcon 
} from '@heroicons/vue/24/outline';



const navLinks = [
  { name: 'Product', active: false, icon: Squares2X2Icon },
  { name: 'Solutions', active: false, icon: LightBulbIcon },
  { name: 'Resources', active: true, icon: BookOpenIcon },
  { name: 'Pricing', active: false, icon: TagIcon }
]

const socialLinks = [
  { url: '#', icon: FacebookIcon },
  { url: '#', icon: TwitterIcon },
  { url: '#', icon: InstagramIcon }
];

const handleSubscribe = () => {
  // Logique d'inscription
  alert('Thank you for subscribing!');
};
</script>

<style scoped>
/* Les styles sont maintenant gérés par Tailwind pour plus de légèreté */
</style>