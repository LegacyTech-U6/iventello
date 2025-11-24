<template>
  <div class="w-40 h-40 flex items-center justify-center bg-white rounded-xl shadow-md overflow-hidden">
    <img 
      :src="logo" 
      :alt="altText" 
      class="max-w-full max-h-full object-contain"
    />
  </div>
</template>

<script setup>
defineProps({
  logo: {
    type: String,
    required: true
  },
  altText: {
    type: String,
    default: "Company Logo"
  }
});
</script>

<style scoped>
/* Optionnel : ajouter un effet au hover */
div:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease-in-out;
}
</style>
