<template>
  <div class="h-full bg-gray-50/50">
    <div class="border-b border-gray-200 bg-white sticky top-0 z-30">
      <div class="px-4 py-4 sm:px-8 sm:py-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Inventaire</h1>
            <p class="text-xs sm:text-sm text-gray-500 mt-1">Gérez et suivez votre base de produits</p>
          </div>

          <div class="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 sm:overflow-visible">
            <div class="hidden xs:flex items-center border border-gray-200 rounded-lg bg-white p-1">
              <button @click="viewMode = 'grid'"
                :class="viewMode === 'grid' ? 'bg-gray-100 text-blue-600' : 'text-gray-500'"
                class="p-1.5 rounded-md transition-all">
                <LayoutGrid :size="18" />
              </button>
              <button @click="viewMode = 'list'"
                :class="viewMode === 'list' ? 'bg-gray-100 text-blue-600' : 'text-gray-500'"
                class="p-1.5 rounded-md transition-all">
                <List :size="18" />
              </button>
            </div>

            <button @click="productStore.exportProducts()" :disabled="productStore.loading"
              class="flex-shrink-0 p-2 sm:px-4 sm:py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium">
              <Download :size="18" :class="{ 'animate-bounce': productStore.loading }" />
              <span class="hidden sm:inline">Export</span>
            </button>

            <button @click="isImportModalOpen = true"
              class="flex-shrink-0 p-2 sm:px-4 sm:py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium">
              <Upload :size="18" />
              <span class="hidden sm:inline">Import</span>
            </button>

            <button @click="handleAddProduct"
              class="flex-shrink-0 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg shadow-sm shadow-green-200 transition-all flex items-center gap-2">
              <Plus :size="20" />
              <span>Ajouter</span>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <GridCard title="Total Produits" :value="productStore.totalProducts || 0" :icon="Package" bgColor="#0f172a" />
          <GridCard title="En Stock" :value="inStockCount" :icon="CheckCircle2" bgColor="#16a34a" />
          <GridCard title="Stock Faible" :value="lowStockCount" :icon="AlertTriangle" bgColor="#ea580c" />
          <GridCard title="Catégories" :value="categories.length" :icon="Layers" bgColor="#2563eb" />
        </div>
      </div>
    </div>

    <div class="px-4 py-4 sm:px-8 bg-white border-b border-gray-200 shadow-sm">
      <div class="flex flex-col lg:flex-row gap-3">
        <div class="relative flex-1">
          <Search class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input v-model="searchQuery" type="text" placeholder="Rechercher un produit ou code-barres..."
            class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all" />
        </div>

        <div class="flex gap-2">
          <select v-model="selectedCategory"
            class="flex-1 lg:flex-none px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20">
            <option value="">Toutes catégories</option>
            <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
          </select>

          <select v-model="selectedStock"
            class="flex-1 lg:flex-none px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20">
            <option value="">Tous les stocks</option>
            <option value="in-stock">En Stock (>10)</option>
            <option value="low-stock">Faible (1-10)</option>
            <option value="out-of-stock">Rupture (0)</option>
          </select>

          <button v-if="searchQuery || selectedCategory || selectedStock" @click="clearFilters"
            class="p-2.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors">
            <X :size="20" />
          </button>
        </div>
      </div>
    </div>

    <div class="px-4 py-6 sm:px-8">
      <div v-if="loading" class="flex flex-col justify-center items-center py-32 gap-4">
        <Loader2 class="w-10 h-10 text-green-600 animate-spin" />
        <p class="text-gray-500 animate-pulse">Chargement de l'inventaire...</p>
      </div>

      <div v-else-if="filteredProducts.length === 0"
        class="bg-white border-2 border-dashed border-gray-200 rounded-3xl py-20 px-6 text-center">
        <div class="w-20 h-20 bg-gray-50 rounded-full mx-auto mb-4 flex items-center justify-center">
          <SearchX :size="40" class="text-gray-300" />
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-1">Aucun produit trouvé</h3>
        <p class="text-gray-500 mb-6 max-w-xs mx-auto text-sm">Essayez de modifier vos filtres ou le terme de recherche.
        </p>
        <button @click="clearFilters" class="px-6 py-2 bg-gray-900 text-white rounded-full text-sm font-medium">
          Effacer les filtres
        </button>
      </div>

      <div v-else-if="viewMode === 'grid'"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        <ProductListItem v-for="product in filteredProducts" :key="product.id" :product="product"
          :display-mode="viewMode" @view="handleViewProduct" />
      </div>

      <div v-else class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
  <div class="overflow-x-auto">
    <table class="w-full text-left border-collapse">
      <thead class="bg-gray-50 border-b border-gray-200 hidden sm:table-header-group">
        <tr class="flex items-center gap-3 sm:gap-4 px-4 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          <th class="w-10 sm:w-12 border-none"></th> <th class="flex-1 border-none text-left">Produit</th>
          <th class="w-32 hidden sm:block border-none text-left">Catégorie</th>
          <th class="w-32 hidden md:block border-none text-left">Code-barres</th>
          <th class="w-16 sm:w-24 border-none text-center">Stock</th>
          <th class="w-24 sm:w-32 border-none text-right">P. Achat</th>
          <th class="w-24 sm:w-32 border-none text-right">P. Vente</th>
          <th class="w-8 sm:w-12 border-none"></th> </tr>
      </thead>
      <tbody class="divide-y divide-gray-100 block sm:table-row-group">
        <ProductListItem v-for="product in filteredProducts" :key="product.id" :product="product"
          :display-mode="viewMode" @view="handleViewProduct" />
      </tbody>
    </table>
  </div>
</div>
    </div>

    <ValidationModal />

    <div v-if="isImportModalOpen"
      class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm">
      <div
        class="bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 class="text-lg font-bold text-gray-800">Importer des produits</h3>
          <button @click="isImportModalOpen = false" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X :size="20" />
          </button>
        </div>
        <div class="p-6">
          <ExcelProductUpload @close="isImportModalOpen = false" @imported="handleImportSuccess" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  LayoutGrid, List, Download, Upload, Plus,
  Package, CheckCircle2, AlertTriangle, Layers,
  Search, X, Loader2, SearchX
} from 'lucide-vue-next'
/**
 * ProductView.vue - Script Setup
 * 
 * Cette section contient toute la logique réactive et les comportements du composant
 * ProductView pour la gestion de l'inventaire des produits
 */

import { useRouter } from 'vue-router'
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
