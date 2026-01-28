<template>
  <div class="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8 font-sans">
    <div class="mx-auto max-w-7xl space-y-8">
      <!-- Header Section -->
      <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-4">
          <button @click="goBack"
            class="group flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-semibold">
            <ChevronLeftIcon class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Retour aux catégories
          </button>

          <div class="space-y-2">
            <h1 class="text-4xl font-extrabold tracking-tight text-gray-900">
              {{ Category?.name || 'Détails de la catégorie' }}
            </h1>
            <p v-if="Category?.description" class="max-w-2xl text-lg text-gray-500">
              {{ Category.description }}
            </p>
          </div>
        </div>

        <!-- View Mode Toggle -->
        <div
          class="flex items-center self-end rounded-2xl border border-gray-200 bg-white p-1.5 shadow-sm sm:self-center">
          <button @click="viewMode = 'grid'" :class="[
            'p-2.5 rounded-xl transition-all duration-300',
            viewMode === 'grid'
              ? 'bg-gray-900 text-white shadow-lg'
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
          ]" title="Vue Grille">
            <Squares2X2Icon class="h-5 w-5" />
          </button>
          <button @click="viewMode = 'list'" :class="[
            'p-2.5 rounded-xl transition-all duration-300',
            viewMode === 'list'
              ? 'bg-gray-900 text-white shadow-lg'
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
          ]" title="Vue Liste">
            <ListBulletIcon class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <GridCard title="Produits" :value="products?.length || 0" :icon="ArchiveBoxIcon" bgColor="bg-blue-600" />
        <GridCard title="Valeur du Stock" :value="format(totalProductsValue)" :icon="CurrencyDollarIcon"
          bgColor="bg-purple-600" />
      </div>

      <!-- Search & Filters -->
      <div class="flex flex-col gap-4 md:flex-row md:items-center">
        <div class="relative flex-1">
          <MagnifyingGlassIcon class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input v-model="searchQuery" type="text" placeholder="Rechercher un produit dans cette catégorie..."
            class="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-4 text-sm font-medium shadow-sm transition-all focus:border-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-900/5" />
        </div>
      </div>

      <!-- Content Section -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-40 space-y-6">
        <div class="relative h-20 w-20">
          <div class="absolute inset-0 animate-ping rounded-full bg-blue-100 opacity-75"></div>
          <div class="relative flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-xl">
            <div class="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600"></div>
          </div>
        </div>
        <p class="text-lg font-bold text-gray-400 animate-pulse">Chargement des produits...</p>
      </div>

      <div v-else>
        <!-- Empty State -->
        <div v-if="filteredProducts.length === 0"
          class="mx-auto max-w-md rounded-3xl border-2 border-dashed border-gray-200 bg-white px-6 py-24 text-center">
          <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-50">
            <ArchiveBoxIcon class="h-10 w-10 text-gray-300" />
          </div>
          <h3 class="text-xl font-bold text-gray-900">Aucun produit trouvé</h3>
          <p class="mt-2 text-gray-500">
            {{ searchQuery ? `Nous n'avons trouvé aucun produit correspondant à "${searchQuery}".` : 'Cette catégorie ne contient aucun produit pour le moment.' }}
          </p>
          <button v-if="searchQuery" @click="searchQuery = ''"
            class="mt-8 inline-flex items-center rounded-xl bg-gray-900 px-8 py-3 text-sm font-bold text-white shadow-xl shadow-gray-200 transition-all hover:bg-gray-800 active:scale-95">
            Effacer la recherche
          </button>
        </div>

        <!-- Grid View -->
        <div v-else-if="viewMode === 'grid'"
          class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <ProductListItem v-for="product in filteredProducts" :key="product.id" :product="product"
            :display-mode="viewMode" @view="handleViewProduct" />
        </div>

        <!-- List View -->
        <div v-else class="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div class="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
            <div class="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-gray-400">
              <div class="flex-1">Détails du Produit</div>
              <div class="hidden w-32 lg:block">Catégorie</div>
              <div class="hidden w-28 md:block">Barcode</div>
              <div class="w-24 text-center">Stock</div>
              <div class="hidden w-28 text-right xl:block">Coût</div>
              <div class="w-32 text-right">Prix Vente</div>
              <div class="w-10"></div>
            </div>
          </div>

          <div class="divide-y divide-gray-100">
            <ProductListItem v-for="product in filteredProducts" :key="product.id" :product="product"
              :display-mode="viewMode" @view="handleViewProduct" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  ChevronLeftIcon,
  Squares2X2Icon,
  ListBulletIcon,
  CubeIcon,
  ArrowTrendingUpIcon,
  MagnifyingGlassIcon,
  ArchiveBoxIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import { useCategoryStore } from '@/stores/CategoryStore'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import ProductListItem from '@/components/Products/ProductListItem.vue'
import GridCard from '@/components/ui/cards/GridCard.vue'
import { useCurrency } from '@/composable/useCurrency'

const { format } = useCurrency()
const categoryStore = useCategoryStore()
const router = useRouter()
const route = useRoute()

const { category: Category, loading, products } = storeToRefs(categoryStore)

const viewMode = ref('list')
const searchQuery = ref('')

// Methods
const goBack = () => {
  router.push({ name: 'categories' })
}

const handleViewProduct = (product) => {
  router.push({
    name: 'product-detail',
    params: { id: product.id },
  })
}

// Computed Properties
const filteredProducts = computed(() => {
  if (!products.value) return []
  if (!searchQuery.value) return products.value

  const query = searchQuery.value.toLowerCase()
  return products.value.filter((product) =>
    product.Prod_name.toLowerCase().includes(query) ||
    product.code_bar?.toLowerCase().includes(query)
  )
})

const totalProductsValue = computed(() => {
  if (!products.value) return 0
  return products.value.reduce((sum, product) => {
    return sum + (product.selling_price * (product.quantity || 0))
  }, 0)
})

const averagePrice = computed(() => {
  if (!products.value || products.value.length === 0) return 0
  const total = products.value.reduce((sum, p) => sum + p.selling_price, 0)
  return total / products.value.length
})

const lowStockCount = computed(() => {
  if (!products.value) return 0
  return products.value.filter(p => p.quantity <= (p.min_stock_level || 5)).length
})

onMounted(async () => {
  const id = route.params.id
  if (!id) {
    console.error('❌ Aucun ID de catégorie trouvé dans la route.')
    return
  }
  await categoryStore.fetchOneCategory(id)
  await categoryStore.Product(id)
})
</script>

<style scoped>
/* All styles have been converted to Tailwind CSS */
</style>
