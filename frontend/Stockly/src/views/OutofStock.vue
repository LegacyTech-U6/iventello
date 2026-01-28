<template>
  <div class="min-h-screen bg-background p-6">
    <div class="max-w-8xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-center mb-8 bg-surface p-6 rounded-xl elevation-1">
        <div>
          <h1 class="text-2xl font-semibold text-on-surface">Out of Stock Products</h1>
          <p class="text-sm text-on-surface-variant mt-1">Manage inventory shortages and potential lost revenue.</p>
        </div>
        <button class="btn-primary px-5 py-2.5 rounded-full text-sm flex items-center gap-2 elevation-1 mt-4 md:mt-0">
          <ArchiveBoxArrowDownIcon class="w-4 h-4" />
          Restock Selected
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <GridCard title="Out of Stock" :value="outOfStockProducts?.length || 0" :icon="ArchiveBoxXMarkIcon"
          bgColor="bg-error" />
        <GridCard title="Lost Revenue" :value="'$' + formatNumber(totalLostRevenue)" :icon="CurrencyDollarIcon"
          bgColor="bg-secondary" />
        <GridCard title="Avg Days Empty" :value="Math.round(averageDaysEmpty)" :icon="ClockIcon"
          bgColor="bg-tertiary" />
        <GridCard title="High Value Items" :value="highValueCount" :icon="SparklesIcon" bgColor="bg-primary" />
      </div>

      <!-- Search and Filters -->
      <div class="card p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-1 relative flex items-center w-full">
            <MagnifyingGlassIcon class="absolute left-4 w-5 h-5 text-on-surface-variant pointer-events-none" />
            <input v-model="searchQuery" type="text" placeholder="Search products by name or SKU..."
            class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all" />
          </div>
          <select v-model="selectedCategory" class="input-field w-full px-4 py-3 text-base rounded-xl">
            <option value="all">All Categories</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
          <select v-model="sortBy" class="input-field w-full px-4 py-3 text-base rounded-xl">
            <option value="daysEmpty">Days Empty</option>
            <option value="lostRevenue">Lost Revenue</option>
            <option value="unitPrice">Unit Price</option>
          </select>
        </div>
      </div>

      <!-- Products Grid -->
      <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <OutOfStockCard v-for="product in filteredProducts" :key="product.id" :product="product"
          @restock="handleRestock" />
      </div>

      <!-- Empty State -->
      <div v-if="filteredProducts.length === 0" class="card text-center p-16 mt-6">
        <PartyPopperIcon class="mx-auto mb-4 w-16 h-16 text-tertiary" />
        <h3 class="card-title text-xl mb-2">All Stocked Up!</h3>
        <p class="card-subtitle">No out-of-stock products found. Great inventory management!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * OutofStock.vue - Script Setup
 * 
 * Affiche et gère tous les produits en rupture de stock
 * Permet aux utilisateurs de:
 * - Voir les produits avec quantité = 0
 * - Analyser les revenus perdus
 * - Trier et filtrer les produits en rupture
 * - Initier le réapprovisionnement
 */

import { ref, computed, onMounted } from 'vue'
import { OutOfStock } from '@/service/api'
import GridCard from '@/components/ui/cards/GridCard.vue'
import OutOfStockCard from '@/components/OutOfStockCard.vue'
import {
  ArchiveBoxArrowDownIcon,
  ArchiveBoxXMarkIcon,
  CurrencyDollarIcon,
  ClockIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  SparklesIcon as PartyPopperIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'
import { useRoute, useRouter } from 'vue-router'
import { useActionMessage } from '@/composable/useActionMessage'

// ========================================
// COMPOSABLES ET ROUTER
// ========================================

/** Composable pour les notifications */
const { showSuccess, showError } = useActionMessage()

/** Router Vue pour la navigation */
const router = useRouter()

// ========================================
// DONNÉES RÉACTIVES
// ========================================

/** 
 * Liste des produits en rupture de stock
 * Tableau vide au départ (rempli par fetchFinishedProducts)
 */
const finishedProducts = ref([])

/** Message retourné par l'API */
const message = ref('')

/** Commandes de réapprovisionnement */
const orders = ref([])

/** Terme de recherche pour filtrer les produits */
const searchQuery = ref('')

/** Catégorie sélectionnée pour filtrer ('all' = sans filtre) */
const selectedCategory = ref('all')

/** Champ de tri sélectionné: 'daysEmpty', 'lostRevenue', 'unitPrice' */
const sortBy = ref('daysEmpty')

/** Compteur de produits haute valeur (prix de vente élevé) */
const highValueCount = ref(0)

/** Liste de toutes les catégories disponibles */
const categories = ref([])

/** Alias pour finishedProducts (pour la compatibilité) */
const outOfStockProducts = ref([])

/** Revenu total perdu à cause des ruptures de stock */
const totalLostRevenue = ref(0)

/** Nombre moyen de jours depuis la rupture */
const averageDaysEmpty = ref(0)

// ========================================
// LIFECYCLE HOOKS
// ========================================

/**
 * Hook du cycle de vie: Exécuté au montage du composant
 * 
 * Appel à fetchFinishedProducts pour charger les données initiales
 */
onMounted(async () => {
  await fetchFinishedProducts()
})

// ========================================
// MÉTHODES - RÉCUPÉRATION DES DONNÉES
// ========================================

/**
 * Récupère la liste des produits en rupture de stock depuis l'API
 * 
 * Actions:
 * 1. Appelle l'API OutOfStock()
 * 2. Stocke le message et les commandes
 * 3. Remplit finishedProducts avec les produits retournés
 * 4. Gère les erreurs de connexion
 * 
 * Structure de la réponse API attendue:
 * {
 *   message: string,
 *   orders: Array,
 *   products: Array<{id, Prod_name, category, selling_price, cost_price, lostRevenue, daysEmpty}>
 * }
 */
async function fetchFinishedProducts() {
  try {
    const data = await OutOfStock()
    console.log('✅ API Response:', data)

    // Stocke les données de la réponse API
    message.value = data.message
    orders.value = data.orders
    finishedProducts.value = data.products || [] // Initialise avec un tableau vide si pas de produits
  } catch (err) {
    showError('Failed to fetch out-of-stock products')
    console.error('❌ Error fetching out-of-stock products:', err)
  }
}

// ========================================
// PROPRIÉTÉS CALCULÉES (COMPUTED)
// ========================================

/**
 * Filtre et trie les produits selon les critères sélectionnés
 * 
 * Applique 3 niveaux de traitement:
 * 1. COPIE: Crée une copie du tableau pour ne pas modifier l'original
 * 2. FILTRAGE:
 *    - Recherche: par nom de produit
 *    - Catégorie: si une catégorie est sélectionnée
 * 3. TRI:
 *    - 'daysEmpty': Jours depuis la rupture (ordre décroissant)
 *    - 'lostRevenue': Revenu perdu (ordre décroissant)
 *    - 'unitPrice': Prix de vente (ordre décroissant)
 * 
 * @returns {Array} Tableau filtré et trié de produits
 */
const filteredProducts = computed(() => {
  // Crée une copie pour éviter de modifier finishedProducts
  let filtered = [...finishedProducts.value]

  // FILTRAGE 1: Recherche par nom
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((p) => p.Prod_name.toLowerCase().includes(query))
  }

  // FILTRAGE 2: Catégorie
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter((p) => p.category === selectedCategory.value)
  }

  // TRI: Applique le tri selon le champ sélectionné
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'daysEmpty':
        // Trie par nombre de jours (du plus ancien au plus récent)
        return (b.daysEmpty || 0) - (a.daysEmpty || 0)

      case 'lostRevenue':
        // Trie par revenu perdu (du plus important au moins important)
        return (b.lostRevenue || 0) - (a.lostRevenue || 0)

      case 'unitPrice':
        // Trie par prix de vente (du plus cher au moins cher)
        return (b.selling_price || 0) - (a.selling_price || 0)

      default:
        return 0
    }
  })

  return filtered
})

// ========================================
// MÉTHODES - UTILITAIRES
// ========================================

/**
 * Formate un nombre en devise USD avec 2 décimales
 * 
 * Exemple: 1234.567 → "1,234.57"
 * 
 * @param {number} num - Le nombre à formater
 * @returns {string} Nombre formaté en devise
 */
const formatNumber = (num) => {
  if (typeof num !== 'number') {
    return '0.00'
  }
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

// ========================================
// MÉTHODES - ACTIONS
// ========================================

/**
 * Navigue vers la page de réapprovisionnement
 * 
 * Actions:
 * 1. Vérifie que le produit est valide
 * 2. Navigue vers la route 'restock' avec l'ID du produit
 * 3. Affiche l'ID du produit en log pour déboggage
 * 
 * @param {Object} finishedProduct - Le produit en rupture à réapprovisionner
 */
const handleRestock = (finishedProduct) => {
  if (!finishedProduct) return console.error('❌ No product loaded')

  router.push({
    name: 'restock',
    params: { reStockId: finishedProduct.id },
  })
  console.log('Restock product:', finishedProduct.id)
}
</script>
