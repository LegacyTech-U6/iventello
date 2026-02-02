<!-- 
  LayoutPage.vue
  ===============
  Layout pour les pages d'authentification
  - Contient le navbar de login
  - Affiche les routes d'authentification
  - Utilisé pour ForgotPassword, Register, etc.
-->
<script setup lang="ts">
// Import du navbar spécifique aux pages de login
import LoginNav from '@/components/layout/LoginNav.vue'
import ValidationModal from '@/components/ui/ValidationModal.vue'
</script>

<!-- Template: Enveloppe toutes les pages d'auth -->
<template>
  <div>
    <!-- LoginNav: Navbar simplifié pour les pages d'authentification -->
    <LoginNav>
      <!-- 
        router-view: Affiche le contenu de la route (Login, Register, ForgotPassword, etc.)
        v-slot="{ Component }": Récupère le composant de la route actuelle
      -->
      <router-view v-slot="{ Component }">
        <!-- Transition fluide lors du changement de page -->
        <transition name="page" mode="out-in" appear>
          <component :is="Component" />
        </transition>
      </router-view>
    </LoginNav>
    <ValidationModal />
  </div>
</template>

<style>
/* ========================================
   TRANSITIONS D'ANIMATION PAGES AUTH
   ======================================== */

/* Durée et type de transition */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

/* Animation d'ENTRÉE */
.page-enter-from {
  opacity: 0;
  /* Invisible au départ */
  transform: translateY(20px);
  /* Commence 20px plus bas */
}

/* Animation de SORTIE */
.page-leave-to {
  opacity: 0;
  /* Invisible à la fin */
  transform: translateY(-20px);
  /* Glisse vers le haut */
}
</style>
