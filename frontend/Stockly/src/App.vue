<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

import NavBar from './components/NavBar.vue'
import FooTer from './components/FooTer.vue'
import FloatingActionButton from './components/ui/FloatingActionButton.vue'
import ValidationModal from '@/components/ui/ValidationModal.vue'
import GlobalLoader from '@/components/ui/GlobalLoader.vue'
import { useUIStore } from '@/stores/uiStore'

const route = useRoute()
const uiStore = useUIStore()

const router = useRouter()

const onActionSelect = (item) => {
  if (item.route) router.push(item.route)
}

const isLoading = computed(() => uiStore.isLoading)
</script>

<template>
  <GlobalLoader v-if="isLoading" />

  <div v-show="!isLoading">
    <header>
      <div class="wrapper">
        <div class="items-center">
          <NavBar v-if="$route.meta.showNavbarAndFooter !== false" />
        </div>
      </div>
    </header>

    <FloatingActionButton v-if="$route.params.uuid" />

    <RouterView />

    <FooTer v-if="$route.meta.showNavbarAndFooter !== false" />

    <!-- ✅ Modal global de validation -->
    <ValidationModal />
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
