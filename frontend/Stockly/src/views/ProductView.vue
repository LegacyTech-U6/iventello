<template>
  <div class="h-full bg-white">
    <!-- Clean Header -->
    <div class="border-b border-gray-200 bg-white">
      <div class="px-8 py-6">
        <div class="flex items-center justify-between mb-6">
          <div>

            <p class="text-sm text-gray-500 mt-1">Manage and track your product database</p>
          </div>

          <div class="flex items-center gap-3">
           

            <!-- View Mode Toggle -->
            <div class="flex items-center border border-gray-200 rounded-md">
              <button :class="viewMode === 'grid'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                " class="p-2 transition-colors" @click="viewMode = 'grid'" title="Grid View">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
                </svg>
              </button>
              <div class="w-px h-6 bg-gray-200"></div>
              <button :class="viewMode === 'list'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                " class="p-2 transition-colors" @click="viewMode = 'list'" title="List View">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
                </svg>
              </button>
            </div>

            <!-- Export Excel Button -->
            <button @click="productStore.exportProducts()" :disabled="productStore.loading"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors flex items-center gap-2">
              <span v-if="productStore.loading" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              <span v-else class="material-symbols-rounded text-lg">
                file_download
              </span>
              Export Excel
            </button>

            <!-- Import Excel Button -->
            <button @click="isImportModalOpen = true"
              class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md transition-colors flex items-center gap-2">
              <span class="material-symbols-rounded text-lg">
                file_upload
              </span>
              Import Excel
            </button>

            <!-- Add Product Button -->
            <button @click="handleAddProduct"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </button>
          </div>
        </div>
        <!-- Stats Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <GridCard title="Total Products" :value="productStore.totalProducts || 0" :icon="Users" bgColor="#006879" />
          <GridCard title="in Stock" :value="inStockCount" :icon="UserCheck" bgColor="#3E4565" />
          <GridCard title="Low Stock" :value="lowStockCount" :icon="UserX" bgColor="#3E4565" />
          <GridCard title="Nember of categories" :value="categories.length" :icon="UserPlus" bgColor="#3E4565" />
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="px-8 py-6 bg-gray-50 border-b border-gray-200">
      <div class="flex flex-col sm:flex-row gap-3">
        <!-- Search -->
        <div class="flex-1 relative">
          <svg class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none"
            stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input v-model="searchQuery" type="text" placeholder="Search by product name or barcode..."
            class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
        </div>

        <!-- Category Filter -->
        <select v-model="selectedCategory"
          class="px-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all min-w-[200px]">
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>

        <!-- Stock Filter -->
        <select v-model="selectedStock"
          class="px-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all min-w-[180px]">
          <option value="">All Stock Levels</option>
          <option value="in-stock">In Stock</option>
          <option value="low-stock">Low Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>

        <!-- Clear Filters Button -->
        <button v-if="searchQuery || selectedCategory || selectedStock" @click="clearFilters"
          class="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-100 rounded-md transition-colors"
          title="Clear all filters">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Product List -->
    <div class="px-8 py-6">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-32">
        <div class="animate-spin rounded-full h-12 w-12 border-3 border-gray-200 border-t-green-600"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredProducts.length === 0" class="bg-white border border-gray-200 rounded-lg py-20">
        <div class="text-center">
          <div class="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
          <p class="text-gray-500 mb-6 max-w-md mx-auto">
            We couldn't find any products matching your criteria. Try adjusting your filters or
            search query.
          </p>
          <button @click="clearFilters"
            class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors">
            Clear All Filters
          </button>
        </div>
      </div>

      <!-- Grid View -->
      <div v-else-if="viewMode === 'grid'" class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        <ProductListItem v-for="product in filteredProducts" :key="product.id" :product="product"
          :display-mode="viewMode" @view="handleViewProduct" />
      </div>

      <!-- List View -->
      <div v-else class="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <!-- List Header -->
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 sticky top-0 z-10">
          <div class="flex items-center gap-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
            <div class="flex-1 min-w-0">Product Name</div>
            <div class="w-32 hidden sm:block">Category</div>
            <div class="w-32 hidden md:block">Barcode</div>
            <div class="w-24 text-center hidden sm:block">Stock</div>
            <div class="w-28 text-right hidden lg:block">Cost Price</div>
            <div class="w-32 text-right">Selling Price</div>
            <div class="w-12 text-right"></div>
          </div>
        </div>

        <!-- List Items Container -->
        <div class="divide-y divide-gray-200">
          <ProductListItem v-for="product in filteredProducts" :key="product.id" :product="product"
            :display-mode="viewMode" @view="handleViewProduct" />
        </div>

        <!-- Empty State -->
        <div v-if="filteredProducts.length === 0" class="px-6 py-12 text-center">
          <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p class="text-gray-500 text-sm">No products found</p>
        </div>
      </div>
    </div>
    <ValidationModal />

    <!-- Import Modal -->
    <div v-if="isImportModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 class="text-lg font-bold text-gray-800">Importer des produits</h3>
          <button @click="isImportModalOpen = false" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        <div class="p-6">
          <ExcelProductUpload @close="isImportModalOpen = false" @imported="handleImportSuccess" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * ProductView.vue - Script Setup
 * 
 * Cette section contient toute la logique réactive et les comportements du composant
 * ProductView pour la gestion de l'inventaire des produits
 */

import { useRouter } from 'vue-router'
import { Users, UserCheck, UserX, UserPlus } from 'lucide-vue-next'
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/productStore'
import ProductListItem from '@/components/Products/ProductListItem.vue'
import { useEntrepriseStore } from '@/stores/entrepriseStore'
import GridCard from '@/components/ui/cards/GridCard.vue'
import ValidationModal from '@/components/ui/ValidationModal.vue'
import ExcelProductUpload from '@/components/Products/ExcelProductUpload.vue'

// ========================================
// INITIALISATION DES STORES ET ROUTER
// ========================================

/** Store Pinia pour la gestion des produits */
const productStore = useProductStore()

/** Router Vue pour la navigation */
const router = useRouter()

/** Store pour gérer l'entreprise active */
const entrepriseStore = useEntrepriseStore()

/** UUID unique de l'entreprise actuellement sélectionnée */
const Uuid = entrepriseStore.activeEntreprise.uuid

// ========================================
// DONNÉES RÉACTIVES (ref)
// ========================================

/** Terme de recherche utilisateur (par nom ou code-barres) */
const searchQuery = ref('')

/** ID de la catégorie sélectionnée pour filtrage */
const selectedCategory = ref('')

/** Filtre statut du stock (in-stock, low-stock, out-of-stock) */
const selectedStock = ref('')

/** Mode d'affichage: 'list' ou 'grid' */
const viewMode = ref('list')

/** État du chargement des données */
const loading = ref(false)

/** État de la modale d'import */
const isImportModalOpen = ref(false)

// ========================================
// PROPRIÉTÉS CALCULÉES (computed)
// ========================================

/**
 * Extrait toutes les catégories uniques des produits
 * - Crée un Set pour éviter les doublons
 * - Retourne un tableau des ID de catégories
 */
const categories = computed(() => {
  const cats = new Set(productStore.products.map((p) => p.category_id))
  return Array.from(cats).filter(Boolean)
})

/**
 * Filtre les produits selon les critères sélectionnés
 * 
 * Applique 3 filtres en cascade:
 * 1. Recherche: par nom de produit ou code-barres
 * 2. Catégorie: si une catégorie est sélectionnée
 * 3. Stock: filtrage par statut (en stock, peu de stock, rupture)
 * 
 * @returns {Array} Liste filtrée des produits
 */
const filteredProducts = computed(() => {
  let products = productStore.products

  // Filtre 1: Recherche par texte
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    products = products.filter(
      (p) => p.Prod_name.toLowerCase().includes(query) || p.code_bar.toLowerCase().includes(query),
    )
  }

  // Filtre 2: Catégorie
  if (selectedCategory.value) {
    products = products.filter((p) => p.category_id === selectedCategory.value)
  }

  // Filtre 3: Statut du stock
  if (selectedStock.value) {
    products = products.filter((p) => {
      // Conversion en nombre (la quantité peut être string ou number)
      const qty = typeof p.quantity === 'string' ? parseInt(p.quantity) : p.quantity

      // Logique de filtrage par statut
      if (selectedStock.value === 'in-stock') return qty > 10        // Plus de 10 unités
      if (selectedStock.value === 'low-stock') return qty > 0 && qty <= 10  // Entre 1 et 10
      if (selectedStock.value === 'out-of-stock') return qty === 0   // 0 unités
      return true
    })
  }

  return products
})

/**
 * Compte le nombre de produits en stock (quantité > 10)
 * Utilisé pour afficher la statistique "In Stock"
 */
const inStockCount = computed(() => {
  return productStore.products.filter((p) => {
    const qty = typeof p.quantity === 'string' ? parseInt(p.quantity) : p.quantity
    return qty > 10
  }).length
})

/**
 * Compte le nombre de produits avec stock faible (1-10 unités)
 * Utilisé pour afficher la statistique "Low Stock"
 */
const lowStockCount = computed(() => {
  return productStore.products.filter((p) => {
    const qty = typeof p.quantity === 'string' ? parseInt(p.quantity) : p.quantity
    return qty > 0 && qty <= 10
  }).length
})

// ========================================
// MÉTHODES (functions)
// ========================================

/**
 * Réinitialise tous les filtres à leur valeur par défaut
 * Affiche tous les produits sans aucun filtre
 */
const clearFilters = () => {
  searchQuery.value = ''        // Efface la recherche
  selectedCategory.value = ''   // Réinitialise la catégorie
  selectedStock.value = ''      // Réinitialise le filtre de stock
}

/**
 * Navigue vers la page de création de produit
 * Utilise le composant Stepper pour un processus guidé
 */
const handleAddProduct = () => {
  router.push(`/${entrepriseStore.activeEntreprise.uuid}/stepper`)
}

/**
 * Navigue vers la page de détail d'un produit
 * @param {Object} product - Le produit sélectionné
 */
const handleViewProduct = (product) => {
  router.push({
    name: 'product-detail',
    params: { id: product.id },
  })
}

/**
 * Callback après un import réussi
 * Rafraîchit la liste des produits
 */
const handleImportSuccess = async () => {
  loading.value = true
  await productStore.fetchProducts()
  loading.value = false
}

// ========================================
// LIFECYCLE HOOKS
// ========================================

/**
 * Hook du cycle de vie: Exécuté au montage du composant
 * 
 * Actions:
 * 1. Affiche l'indicateur de chargement
 * 2. Récupère tous les produits depuis l'API via le store
 * 3. Masque l'indicateur de chargement
 */
onMounted(async () => {
  loading.value = true

  // Appel API pour récupérer la liste des produits
  await productStore.fetchProducts()

  loading.value = false
})
</script>
