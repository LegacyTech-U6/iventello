<template>
  <section class="relative flex justify-center items-center max-h-150 px-6  overflow-hidden">
 
    <div class="grid lg:grid-cols-2 gap-10 max-w-7xl w-full items-center relative z-10">
      <!-- 🖼️ Section image -->
      <div class="hidden lg:flex w-full justify-center">
        <TechIcon class="w-78 h-78 lg:w-full lg:h-94" />
      </div>

      <!-- 📝 Section texte -->
      <div class="space-y-6 animate-fadeInUp">
        <h1 class="text-5xl font-light text-gray-800 leading-tight">
          Included <span class="text-[#0C333B]-600">Capabilities</span>
        </h1>

        <p class="text-gray-600 text-lg leading-relaxed">
          <strong>Features designed for you</strong>
          <br />
          When <strong>Iventello</strong> detects a missing item in your inventory, 
          a new order is automatically generated and sent to your supplier.
          This ensures smooth store operations and prevents interruptions caused by shortages.
        </p>

        <!-- Features list -->
        <div class="space-y-3">
          <div class="flex items-center space-x-3">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span class="text-gray-700">Capture everything</span>
          </div>
          <div class="flex items-center space-x-3">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span class="text-gray-700">Organize your to-do list by workflow</span>
          </div>
          <div class="flex items-center space-x-3">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span class="text-gray-700">Always include a deadline</span>
          </div>
        </div>

        <div class="pt-4">
          <button @click="navigate()"
            class="bg-[#0C333B] hover:bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
          >
            Discover Features
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import TechIcon from '@/assets/TechIcon.vue'
import { useRouter,useRoute } from 'vue-router';

const router = useRouter()

const navigate = () => {
  router.push('/features')
}
</script>

<style scoped>
/* Animation fade in */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeInUp {
  animation: fadeInUp 1s ease-out;
}

/* Animation pulsation lente pour les formes */
@keyframes pulse-slow {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.4; }
}
.animate-pulse-slow {
  animation: pulse-slow 6s ease-in-out infinite;
}
</style>