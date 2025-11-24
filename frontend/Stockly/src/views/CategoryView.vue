<!-- 
  CategoryView.vue
  =================
  Gestionnaire de catégories de produits
  - Affiche la liste de toutes les catégories
  - Permet ajouter, modifier, supprimer des catégories
  - Statistiques sur les catégories et produits
  - Recherche et filtrage
-->
<template>
  <div class="p-8 max-w-[1400px] mx-auto bg-gray-50 h-full">
    <!-- En-tête avec titre et actions -->
    <div class="flex flex-col md:flex-row justify-between items-start mb-8">
      <div class="flex-1">
        <p class="text-sm text-gray-500 font-normal">Manage your product categories</p>
      </div>
      <!-- Boutons: Retour et Ajouter catégorie -->
      <div class="flex gap-3 mt-4 md:mt-0">
        <!-- Bouton retour -->
        <button
          @click="$router.back()"
          class="bg-white text-gray-700 border border-gray-300 px-5 py-2.5 rounded-md text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition"
        >
          Back to Products
        </button>
        <!-- Bouton ajouter catégorie -->
        <button
          @click="showAddCategory = true"
          class="bg-black text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-gray-800 transition"
        >
          + Add Category
        </button>
      </div>
    </div>

    <!-- Cartes de statistiques -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
      <!-- Statistique: Total des catégories -->
      <div
        class="flex items-center gap-4 bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition"
      >
        <div
          class="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-100 text-blue-600"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            ></path>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-sm text-gray-500 font-medium mb-1">Total Categories</div>
          <div class="text-3xl font-bold text-gray-900">{{ totalCategories }}</div>
        </div>
      </div>

      <!-- Statistique: Total des produits -->
      <div
        class="flex items-center gap-4 bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition"
      >
        <div
          class="w-12 h-12 rounded-lg flex items-center justify-center bg-purple-100 text-purple-700"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            ></path>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-sm text-gray-500 font-medium mb-1">Total Products</div>
          <div class="text-3xl font-bold text-gray-900">{{ totalProducts }}</div>
        </div>
      </div>

      <!-- Avg Products -->
      <div
        class="flex items-center gap-4 bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition"
      >
        <div
          class="w-12 h-12 rounded-lg flex items-center justify-center bg-orange-100 text-orange-600"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            ></path>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-sm text-gray-500 font-medium mb-1">Avg Products</div>
          <div class="text-3xl font-bold text-gray-900">{{ averageProducts }}</div>
        </div>
      </div>
    </div>

    <!-- Search Section -->
    <div class="mb-6">
      <div class="relative max-w-full">
        <svg
          class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search categories by name or description..."
          class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition"
        />
      </div>
    </div>

    <!-- Categories Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <CategoryCard
        v-for="category in filteredCategories"
        :key="category.id"
        :category="category"
        @edit="handleEditCategory"
        @delete="handleDeleteCategory"
        @view="handleViewCategory"
      />
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredCategories.length === 0"
      class="text-center p-16 bg-white border border-gray-200 rounded-xl text-gray-400"
    >
      <svg
        class="mx-auto mb-4 w-16 h-16 text-gray-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <p class="text-base">No categories found matching your search.</p>
    </div>

    <!-- Modals -->
    <AddCategoryModal
      v-if="showAddCategory"
      :category="editingCategory"
      @save="handleSaveCategory"
      @close="closeModal"
    />
    <ActionModal
      v-model="showDeleteModal"
      title="Delete Category"
      message="Are you sure you want to delete this category? This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import CategoryCard from '../components/ CategoryCard .vue'
import AddCategoryModal from '../components/AddCategoryModal .vue'
import { useCategoryStore } from '@/stores/CategoryStore'
import { toast } from 'vue-sonner'
import { useRouter } from 'vue-router'
import ActionModal from '@/components/ui/ActionModal.vue'
import { useActionMessage } from '@/composable/useActionMessage'
import { useGlobalModal } from '@/composable/useValidation'
const { show } = useGlobalModal()
const { showSuccess, showError } = useActionMessage()
// Mock data - replace with actual API calls
const categoryStore = useCategoryStore()
const router = useRouter()
const searchQuery = ref('')
const showAddCategory = ref(false)
const editingCategory = ref(null)

// Computed properties
const filteredCategories = computed(() => {
  if (!searchQuery.value) return categoryStore.categories

  const query = searchQuery.value.toLowerCase()
  return categoryStore.categories.filter(
    (category) =>
      category.name.toLowerCase().includes(query) ||
      category.description.toLowerCase().includes(query),
  )
})

const totalCategories = computed(() => categoryStore.categories.length)
const totalProducts = computed(() =>
  categoryStore.categories.reduce((sum, category) => sum + category.productCount, 0),
)
const categoriesWithProducts = computed(
  () => categoryStore.categories.filter((category) => category.productCount > 0).length,
)
const averageProducts = computed(() => {
  if (categoriesWithProducts.value === 0) return '0.0'
  return (totalProducts.value / categoriesWithProducts.value).toFixed(1)
})

// Methods
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

const handleEditCategory = (category) => {
  editingCategory.value = { ...category }
  showAddCategory.value = true
}
// ✅ Add modal visibility + id to delete
const showDeleteModal = ref(false)
const categoryToDelete = ref(null)

const handleDeleteCategory = (categoryId) => {
  categoryToDelete.value = categoryId
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    await categoryStore.Delete(categoryToDelete.value)
    await categoryStore.fetchCategory()
    showSuccess('Category deleted successfully!')
  } catch (error) {
    console.error('Error deleting category:', error)
    showError('Failed to delete category')
  } finally {
    showDeleteModal.value = false
    categoryToDelete.value = null
  }
}
const handleSaveCategory = async (categoryData) => {
  try {
    if (categoryData.id) {
      // 🔹 Mise à jour d'une catégorie existante
      const success = await categoryStore.Update(categoryData.id, {
        name: categoryData.name,
        description: categoryData.description,
      })
      if (success) {
        show('Catégorie mise à jour avec succès !', 'success')
      } else {
        show('Échec de la mise à jour de la catégorie', 'error')
      }
    } else {
      // 🔹 Création d'une nouvelle catégorie
      const success = await categoryStore.Create({
        name: categoryData.name,
        description: categoryData.description,
      })
      if (success) {
        show('Nouvelle catégorie créée avec succès !', 'success')
      } else {
        show('Echec de la creation de la category', 'error')
      }
    }

    // 🔄 Recharge la liste pour garder l'UI à jour
    await categoryStore.fetchCategory()

    // ✅ Ferme le modal après succès
    closeModal()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la catégorie :', error)
    toast.error('Erreur lors de la sauvegarde de la catégorie !')
  }
}
const closeModal = () => {
  showAddCategory.value = false
  editingCategory.value = null
}

const handleViewCategory = (categoryId) => {
  router.push({
    name: 'category-detail',
    params: { id: categoryId },
  })
}

onMounted(async () => {
  // Fetch categories from API in real implementation
  await categoryStore.fetchCategory()
})
</script>

<style scoped></style>
