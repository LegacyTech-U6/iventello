<!-- components/MIcon.vue -->
<template>
  <span
    class="material-icons"
    :style="{ fontSize: size + 'px', color: color }"
  >
    {{ name }}
  </span>
</template>

<script setup>
defineProps({
  name: { type: String, required: true },  // nom de l'icône Material
  size: { type: Number, default: 24 },     // taille en px
  color: { type: String, default: 'currentColor' }, // couleur
});
</script>
