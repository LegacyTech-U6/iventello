<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <div
      v-for="i in skeletonCount"
      :key="i"
      class="bg-white rounded-lg shadow-sm p-4 animate-pulse"
    >
      <!-- Avatar / thumbnail -->
      <div class="w-full h-32 bg-gray-200 rounded mb-4"></div>

      <!-- Name / Company -->
      <div class="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div class="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>

      <!-- Contact info -->
      <div class="h-3 bg-gray-200 rounded w-full mb-1.5"></div>
      <div class="h-3 bg-gray-200 rounded w-full mb-1.5"></div>
      <div class="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>

      <!-- Stats section -->
      <div class="flex justify-between">
        <div class="h-3 bg-gray-200 rounded w-1/4"></div>
        <div class="h-3 bg-gray-200 rounded w-1/4"></div>
      </div>

      <!-- Last order / small info -->
      <div class="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
    </div>
  </div>
</template>

<script setup lang="ts">

defineProps({
  skeletonCount: { type: Number, default: 6 },
})
</script>

<style scoped></style>
