<template>
  <div class="product-selector bg-white h-full w-full p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Create Transaction</h1>
    </div>

    <div class="flex flex-col gap-6 mb-8">
      <div class="flex items-center justify-between gap-4">
        <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide flex-1">
          <button 
            @click="selectedCategoryId = null"
            :class="[
              'px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap border',
              selectedCategoryId === null 
                ? 'bg-[#006879] border-[#006879] text-white shadow-sm' 
                : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300'
            ]"
          >
            All Product
            <span class="bg-black/10 px-2 py-0.5 rounded-md text-[10px]">{{ products.length }}</span>
          </button>

          <button 
            v-for="cat in categoryStore.categories" 
            :key="cat.id"
            @click="selectedCategoryId = cat.id"
            :class="[
              'px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap border',
              selectedCategoryId === cat.id 
                ? 'bg-[#006879] border-[#006879] text-white shadow-sm' 
                : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300'
            ]"
          >
            {{ cat.name }}
            <span class="bg-gray-100 px-2 py-0.5 rounded-md text-[10px] text-gray-400">
              {{ getProductCountByCategory(cat.id) }}
            </span>
          </button>
        </div>

        <div class="relative">
          <button class="p-3 rounded-full border border-gray-100 hover:bg-gray-50 transition-all">
            <MagnifyingGlassIcon class="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
    <div v-if="loading" class="relative min-h-[400px]">
      <div class="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
        <n-spin size="large">
          <template #description>
            <span class="text-sm font-bold text-gray-500 uppercase tracking-widest mt-2 block">Chargement...</span>
          </template>
        </n-spin>
      </div>
    </div>

    <div v-else-if="finalFilteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      <ProductCard 
        v-for="product in finalFilteredProducts" 
        :key="product.id" 
        :product="product"
        @add="() => $emit('add-to-sale', product)" 
      />
    </div>


    <div v-else="finalFilteredProducts.length === 0" class="text-center py-20">
      <div class="w-20 h-20 rounded-[2.5rem] bg-gray-50 flex items-center justify-center mx-auto mb-4 border border-gray-100">
        <ArchiveBoxIcon class="w-10 h-10 text-gray-300" />
      </div>
      <p class="text-lg font-bold text-gray-900">No products found</p>
      <p class="text-gray-500">Try selecting another category or check your stock.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { MagnifyingGlassIcon, ArchiveBoxIcon } from '@heroicons/vue/24/outline'
import ProductCard from './ProductCard.vue'
import { useCategoryStore } from '@/stores/CategoryStore' // Vérifie ton chemin
import { NSpin } from 'naive-ui'
const props = defineProps({
  products: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['add-to-sale'])
const categoryStore = useCategoryStore()

const selectedCategoryId = ref(null)
const search = ref('')

// Charger les catégories au montage
onMounted(() => {
  categoryStore.fetchCategory()
})

// Logique de filtrage combinée (Catégorie + Recherche)
const finalFilteredProducts = computed(() => {
  return props.products.filter((p) => {
    const matchesSearch = p.Prod_name.toLowerCase().includes(search.value.toLowerCase())
    const matchesCategory = selectedCategoryId.value 
      ? p.category_id === selectedCategoryId.value || (p.category && p.category.id === selectedCategoryId.value)
      : true
    return matchesSearch && matchesCategory
  })
})

// Pour afficher le petit nombre à côté du nom de la catégorie
const getProductCountByCategory = (catId) => {
  return props.products.filter(p => p.category_id === catId || (p.category && p.category.id === catId)).length
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>