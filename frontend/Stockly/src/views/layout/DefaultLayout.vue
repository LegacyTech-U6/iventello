<!-- layouts/DefaultLayout.vue -->
<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import FooTer from '@/components/FooTer.vue'
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

    <FooTer />
  </div>
</template>