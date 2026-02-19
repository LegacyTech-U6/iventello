<script setup lang="ts">
import { ref } from 'vue'
import { CheckIcon, ArrowRightIcon } from '@heroicons/vue/24/solid'
import featureImageInfo from '@/assets/image/invoice_view.png' // Variable placeholder as requested

// You can change this image path to your own
const featureImage = ref(featureImageInfo)

const features = [
  'Easily upload your existing inventory list into Iventello.',
  'Organize inventory folders by location, type, and more.',
  'Add critical item details with custom fields.',
]
</script>

<template>
  <section class="py-20 px-6 bg-white overflow-hidden">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

        <!-- Text Content (Left) -->
        <div class="w-full lg:w-1/2 flex flex-col items-start text-left">

          <h2 class="text-4xl md:text-5xl font-extrabold text-gray-900 leading-[1.15] mb-8">
            Organize and automate your inventory at the touch of a button.
          </h2>

          <ul class="space-y-6 mb-10 w-full">
            <li v-for="(feature, index) in features" :key="index" class="flex items-start gap-4">
              <div class="flex-shrink-0 mt-1">
                <CheckIcon class="w-6 h-6 text-gray-900" />
              </div>
              <span class="text-lg text-gray-600 leading-relaxed font-medium">{{ feature }}</span>
            </li>
          </ul>

          <div class="flex flex-col sm:flex-row items-center gap-6 mt-2">
            <button
              class="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-full text-lg font-bold transition-all shadow-lg hover:shadow-emerald-500/30">
              Start Free Trial
            </button>
            <a href="#"
              class="group flex items-center gap-2 text-emerald-600 font-bold text-lg hover:text-emerald-700 transition-colors">
              See All Features
              <ArrowRightIcon class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        <!-- Image Placeholder (Right) -->
        <div class="w-full  relative">
          <!-- Placeholder Variable applied here -->
          <div class="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100 bg-gray-50">
            <img :src="featureImage" alt="Feature Interface"
              class="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700" />

            <!-- Optional decorative sidebar mimic (as seen in reference) if image is just screenshot -->
            <!-- Using the image variable is the key requirement -->
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
/* Scoped styles if necessary */
</style>