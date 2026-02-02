<template>
  <section class="relative h-150 flex justify-center items-center px-6 py-6 bg-[#0C333B] overflow-hidden">
    <div class="grid lg:grid-cols-2 gap-10 max-w-7xl w-full items-center relative z-10">
      <!-- 📝 Text content -->
      <div class="flex flex-col gap-6">
        <div class="text-emerald-600">
          <!-- ArrowRightIcon -->
          <ArrowRightIcon class="h-8 w-8" />
        </div>
        <h1 class="text-4xl lg:text-5xl font-bold text-white leading-tight">
          Managing your inventory has never been easier!
        </h1>
        <p class="text-gray-300 text-base lg:text-lg">
          Track stock levels, manage multiple companies, and streamline operations with a simple, intuitive dashboard.
        </p>
        <div class="flex gap-4 mt-4">
          <button @click="login"
            class="bg-emerald-600 text-white px-6 py-3 rounded-lg border border-emerald-600 font-medium hover:bg-emerald-700 hover:border-emerald-700 transition shadow-lg">
            Get Started
          </button>
          <button
            class="border border-emerald-600 text-emerald-500 px-6 py-3 rounded-lg font-medium hover:bg-emerald-600/10 transition">
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
import { ArrowRightIcon } from '@heroicons/vue/24/outline'

const login = () => {
  router.push('/register')

}
// Aucun script nécessaire
</script>
