<template>
  <div class="h-full bg-gray-50/50">
    <div class="border-b border-gray-200 bg-white sticky top-0 z-30">
      <div class="px-4 py-4 sm:px-8 sm:py-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900">{{ $t('inventory.title') }}</h1>
            <p class="text-xs sm:text-sm text-gray-500 mt-1">{{ $t('inventory.subtitle') }}</p>
          </div>

          <div class="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 sm:overflow-visible">
            <div
              class="hidden xs:flex items-center border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 p-1">
              <n-button size="small" :type="viewMode === 'grid' ? 'primary' : 'default'" @click="viewMode = 'grid'">
                <template #icon><n-icon :component="Squares2X2Icon" /></template>
              </n-button>
              <n-button size="small" :type="viewMode === 'list' ? 'primary' : 'default'" @click="viewMode = 'list'">
                <template #icon><n-icon :component="ListBulletIcon" /></template>
              </n-button>
            </div>

            <n-button @click="productStore.exportProducts()" :loading="productStore.loading" secondary>
              <template #icon><n-icon :component="ArrowDownTrayIcon" /></template>
              {{ $t('inventory.actions.export') }}
            </n-button>

            <n-button @click="isImportModalOpen = true" secondary>
              <template #icon><n-icon :component="ArrowUpTrayIcon" /></template>
              {{ $t('inventory.actions.import') }}
            </n-button>

            <n-button @click="handleAddProduct" type="primary">
              <template #icon><n-icon :component="PlusIcon" /></template>
              {{ $t('inventory.actions.add') }}
            </n-button>
          </div>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <GridCard :title="$t('inventory.stats.total')" :value="productStore.totalProducts || 0" :icon="CubeIcon"
            bgColor="#0f172a" />
          <GridCard :title="$t('inventory.stats.in_stock')" :value="inStockCount" :icon="CheckCircleIcon"
            bgColor="#16a34a" />
          <GridCard :title="$t('inventory.stats.low_stock')" :value="lowStockCount" :icon="ExclamationTriangleIcon"
            bgColor="#ea580c" />
          <GridCard :title="$t('inventory.stats.categories')" :value="categories.length" :icon="Square3Stack3DIcon"
            bgColor="#2563eb" />
        </div>
      </div>
    </div>

    <div class="px-4 py-4 sm:px-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div class="flex flex-col lg:flex-row gap-3">
        <div class="relative flex-1">
          <n-input v-model:value="searchQuery" :placeholder="$t('inventory.filters.search_placeholder')" clearable
            size="large">
            <template #prefix>
              <n-icon :component="MagnifyingGlassIcon" />
            </template>
          </n-input>
        </div>

        <div class="flex gap-2">
          <n-select v-model:value="selectedCategory" :options="categoryOptions"
            :placeholder="$t('inventory.filters.all_categories')" clearable class="w-48" />

          <n-select v-model:value="selectedStock" :options="stockOptions"
            :placeholder="$t('inventory.filters.all_stocks')" clearable class="w-48" />
        </div>
      </div>
    </div>

    <div class="px-4 py-6 sm:px-8">
      <div v-if="loading" class="flex flex-col justify-center items-center py-32 gap-4">
        <n-spin size="large" />
        <p class="text-gray-500 animate-pulse">Chargement de l'inventaire...</p>
      </div>

      <div v-else-if="filteredProducts.length === 0"
        class="bg-white border-2 border-dashed border-gray-200 rounded-3xl py-20 px-6 text-center">
        <div class="w-20 h-20 bg-gray-50 rounded-full mx-auto mb-4 flex items-center justify-center">
          <MagnifyingGlassMinusIcon class="w-10 h-10 text-gray-300" />
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-1">{{ $t('inventory.empty.title') }}</h3>
        <p class="text-gray-500 mb-6 max-w-xs mx-auto text-sm">{{ $t('inventory.empty.subtitle') }}
        </p>
        <button @click="clearFilters" class="px-6 py-2 bg-gray-900 text-white rounded-full text-sm font-medium">
          {{ $t('inventory.empty.button') }}
        </button>
      </div>

      <div v-else-if="viewMode === 'grid'"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        <ProductListItem v-for="product in filteredProducts" :key="product.id" :product="product"
          :display-mode="viewMode" @view="handleViewProduct" />
      </div>

      <div v-else class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <n-data-table :columns="columns" :data="filteredProducts" :pagination="{ pageSize: 10 }" :bordered="false" />
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
            <XMarkIcon class="w-5 h-5" />
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
  Squares2X2Icon, ListBulletIcon, ArrowDownTrayIcon, ArrowUpTrayIcon, PlusIcon,
  CubeIcon, CheckCircleIcon, ExclamationTriangleIcon, Square3Stack3DIcon,
  MagnifyingGlassIcon, XMarkIcon, ArrowPathIcon, MagnifyingGlassMinusIcon
} from '@heroicons/vue/24/outline'
/**
 * ProductView.vue - Script Setup
 * 
 * Cette section contient toute la logique réactive et les comportements du composant
 * ProductView pour la gestion de l'inventaire des produits
 */

import { useRouter } from 'vue-router'
import { ref, computed, onMounted, h } from 'vue'
import { NSpin, NDataTable, NButton, NInput, NSelect, NIcon, NSpace, NTag, NTooltip } from 'naive-ui'
import { useProductStore } from '@/stores/productStore'
import ProductListItem from '@/components/Products/ProductListItem.vue'
import { useEntrepriseStore } from '@/stores/entrepriseStore'
import GridCard from '@/components/ui/cards/GridCard.vue'
import ValidationModal from '@/components/ui/ValidationModal.vue'
import ExcelProductUpload from '@/components/Products/ExcelProductUpload.vue'
import { useI18n } from 'vue-i18n'
import { useCurrency } from '@/composable/useCurrency' // Import currency formatter

const { t } = useI18n()
const { format } = useCurrency()

// Columns for NDataTable
const columns = [
  {
    title: t('inventory.table.product'),
    key: 'Prod_name',
    render(row) {
      return h('div', { class: 'font-medium' }, [
        h('div', row.Prod_name),
        h('div', { class: 'text-xs text-gray-500' }, row.code_bar)
      ])
    }
  },
  {
    title: t('inventory.table.category'),
    key: 'category_id',
    render(row) {
      return h(NTag, { type: 'default', size: 'small' }, { default: () => row.category.name || 'N/A' })
    }
  },
  {
    title: t('inventory.table.stock'),
    key: 'quantity',
    render(row) {
      const qty = typeof row.quantity === 'string' ? parseInt(row.quantity) : row.quantity
      let type = 'success'
      if (qty <= 0) type = 'error'
      else if (qty <= 10) type = 'warning'

      return h(NTag, { type, bordered: false }, { default: () => qty })
    }
  },
  {
    title: t('inventory.table.buy_price'),
    key: 'buying_price',
    render(row) { return format(row.cost_price) }
  },
  {
    title: t('inventory.table.sell_price'),
    key: 'selling_price',
    render(row) { return format(row.selling_price) }
  },
  {
    key: 'actions',
    render(row) {
      return h(NButton, {
        size: 'small',
        onClick: () => handleViewProduct(row)
      }, { default: () => 'View' })
    }
  }
]

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

const categoryOptions = computed(() => categories.value.map(c => ({ label: c, value: c })))

const stockOptions = [
  { label: t('inventory.filters.in_stock_label'), value: 'in-stock' },
  { label: t('inventory.filters.low_stock_label'), value: 'low-stock' },
  { label: t('inventory.filters.out_of_stock_label'), value: 'out-of-stock' }
]

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
