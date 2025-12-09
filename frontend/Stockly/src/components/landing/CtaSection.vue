<template>
  <section class="relative h-150 flex justify-center items-center px-6 py-6 bg-[#0C333B] overflow-hidden">
    <div class="grid lg:grid-cols-2 gap-10 max-w-7xl w-full items-center relative z-10">
      <!-- 📝 Text content -->
      <div class="flex flex-col gap-6">
        <div class="text-green-800">
          <!-- Icon réduit -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
        <h1 class="text-4xl lg:text-5xl font-bold text-white leading-tight">
          Managing your inventory has never been easier!
        </h1>
        <p class="text-gray-300 text-base lg:text-lg">
          Track stock levels, manage multiple companies, and streamline operations with a simple, intuitive dashboard.
        </p>
        <div class="flex gap-4 mt-4">
          <button @click="login"
            class="bg-green-500 text-white px-6 py-3 rounded-lg border border-green-500 font-medium hover:bg-gray-900 hover:border hover:text-green-500 hover:border-green-500 transition">
            Get Started
          </button>
          <button
            class="border border-green-500 text-green-500 px-6 py-3 rounded-lg font-medium hover:bg-green-500 hover:text-white transition">
            Contact Us
          </button>
        </div>
      </div>

      <!-- 🖼️ Image content -->
      <div class="flex justify-center">
        <div class="rounded-xl">
          <img :src="multitasking" class="w-full" alt="">
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import router from '@/router';
import multitasking from '@/assets/image/multitasking.png'

const login = () => {
  router.push('/register')

}
// Aucun script nécessaire
</script>
