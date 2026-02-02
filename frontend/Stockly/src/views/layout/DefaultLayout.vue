<!-- layouts/DefaultLayout.vue -->
<script setup lang="ts">
import NavBar from '@/components/layout/NavBar.vue'
import Footer from '@/components/layout/Footer.vue'
</script>

<template>
  <div class="layout">
    <header>
      <NavBar />
    </header>

    <main>
      <!-- Ici on injecte la vue enfant -->
      <RouterView />
    </main>

    <Footer />
  </div>
</template>