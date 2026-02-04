<!-- 
  HomeView.vue
  =============
  Page d'accueil / Page de landing
  - Affiche les sections marketing du produit
  - Présente les fonctionnalités, tarifs, témoignages
  - Point d'entrée pour les nouveaux utilisateurs
-->
<script setup lang="ts">
import { useHead } from '@unhead/vue'

// SEO Optimization for the Homepage
useHead({
  title: 'Iventello | Modern Inventory & Sales Management SaaS',
  meta: [
    {
      name: 'description',
      content:
        'Streamline your business with Iventello, the all-in-one SaaS platform for real-time inventory management, point-of-sale (POS), and automated invoicing. Perfect for small to medium businesses.'
    },
    {
      name: 'keywords',
      content:
        'inventory management, SaaS, POS system, stock control, invoicing software, small business ERP, inventory tracking, sales automation'
    }
  ]
})
// Imports des sections composant la page de landing
import CharacTeristics from '@/components/landing/CharacTeristics.vue'
import CtaSection from '@/components/landing/CtaSection.vue'
import FeatureSection from '@/components/landing/FeatureSection.vue'
import HeroSection from '@/components/landing/HeroSection.vue'
import FaqSection from '@/components/landing/FaqSection.vue'
import StatsSection from '@/components/landing/StatsSection.vue'
import TestimonialMain from '@/components/landing/testimonail/TestimonialMain.vue'
import WorflowSection from '@/components/landing/WorflowSection.vue'
</script>

<!-- 
  Template: Composition de toutes les sections de la landing page
  - HeroSection: Section hero avec CTA principal
  - FeatureSection: Présentation des fonctionnalités
  - CharacTeristics: Caractéristiques détaillées
  - WorflowSection: Processus de workflow
  - StatsSection: Statistiques et chiffres clés
  - PricingSection: Plans tarifaires
  - CtaSection: Call-to-action final
-->
<template>
  <HeroSection />
  <FeatureSection />
  <CharacTeristics />
  <WorflowSection />
  <StatsSection />
  <FaqSection />
  <CtaSection />
</template>

<style scoped>
/* Hover effect pour les éléments avec la classe group */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}
</style>
