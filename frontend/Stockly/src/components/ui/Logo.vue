<template>
  <n-card class="w-40 h-40 shadow-md rounded-xl overflow-hidden" :bordered="false"
    content-style="padding: 0; display: flex; align-items: center; justify-content: center; height: 100%;">
    <img :src="logo" :alt="altText" class="max-w-full max-h-full object-contain" />
  </n-card>
</template>

<script setup>
import { NCard } from 'naive-ui'

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
