<template>
  <div
    class="testimonial-card bg-white shadow-md rounded-2xl p-5 w-64 h-72 flex flex-col justify-between border border-gray-100">
    <div>
      <p class="text-gray-700 text-sm leading-relaxed">"{{ testimonial.message }}"</p>
    </div>
    <div class="flex items-center gap-3 mt-4">
      <img :src="testimonial.avatar" alt="avatar" class="w-10 h-10 rounded-full object-cover" />
      <div>
        <h4 class="text-gray-900 font-semibold text-sm">
          {{ testimonial.name }}
        </h4>
        <div class="flex">
          <StarIcon v-for="star in 5" :key="star" class="w-4 h-4"
            :class="star <= testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { StarIcon } from '@heroicons/vue/20/solid'
defineProps({
  testimonial: {
    type: Object,
    required: true,
  },
})
</script>
