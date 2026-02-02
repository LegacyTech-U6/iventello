<!-- 
  AdminLayout.vue
  ===============
  Layout principal pour toutes les pages administrateur
  - Enveloppe la navbar avec les routes admin
  - Ajoute une transition fluide entre les pages
  - Gère la navigation pour les utilisateurs authentifiés
-->
<template>
  <div>
    <!-- Navbar d'admin avec tous les menus disponibles -->
    <NavbarAdmin>
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in" appear>
          <component :is="Component" />
        </transition>
      </router-view>
    </NavbarAdmin>
    <ValidationModal />
  </div>
</template>

<script setup>
// Import du composant NavBar (contient tous les menus admin)
import NavbarAdmin from '@/components/layout/NavbarAdmin.vue'
import ValidationModal from '@/components/ui/ValidationModal.vue'
</script>
<style>
/* ========================================
   TRANSITIONS D'ANIMATION DES PAGES
   ======================================== */

/* Durée et type de transition lors de l'entrée/sortie */
.page-enter-active,
.page-leave-active {
  transition:
    opacity 0.5s ease,
    /* Fondu (transparence) */
    transform 0.5s ease;
  /* Transformation (position) */
}

/* Animation d'ENTRÉE de page */
.page-enter-from {
  opacity: 0;
  /* Page invisible au départ */
  transform: translateY(20px);
  /* Commence 20px plus bas */
}

.page-enter-to {
  opacity: 1;
  /* Page visible à la fin */
  transform: translateY(0);
  /* Retourne à sa position normale */
}

/* Animation de SORTIE de page */
.page-leave-from {
  opacity: 1;
  /* Page visible au départ */
  transform: translateY(0);
  /* Position normale */
}

.page-leave-to {
  opacity: 0;
  /* Page invisible à la fin */
  transform: translateY(-20px);
  /* Glisse vers le haut en disparaissant */
}
</style>
