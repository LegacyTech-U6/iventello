<template>
  <div class=" max-w-8xl mx-auto bg-gray-50 h-full">
    <div class="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6  shadow-sm border border-gray-100">
      <div class="flex-1 min-w-0">
        <h1 class="text-3xl font-extrabold text-gray-900 truncate">Product Categories</h1>
        <p class="text-sm text-gray-500 font-normal mt-1">Manage, add, and organize your product classifications.</p>
      </div>
      
      <div class="flex gap-3 mt-4 md:mt-0 flex-shrink-0">
        <button
          @click="$router.back()"
          class="bg-white text-gray-700 border border-gray-300 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-100 hover:border-gray-400 transition flex items-center gap-2 shadow-sm"
        >
          <ArrowLeft class="w-4 h-4" />
          Back to Products
        </button>
        <button
          @click="showAddCategory = true"
          class="bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-2 shadow-md hover:shadow-lg"
        >
          <Plus class="w-4 h-4" />
          Add Category
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 p-5 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      
      <div
        class="bg-white p-6 rounded-xl border border-gray-200 shadow-md flex items-center justify-between transition-shadow duration-300 hover:shadow-xl"
      >
        <div class="flex-1 min-w-0">
          <div class="text-sm text-gray-500 font-medium mb-1 uppercase tracking-wider">Total Categories</div>
          <div class="text-4xl font-extrabold text-gray-900 mt-1">{{ totalCategories }}</div>
        </div>
        <div
          class="w-14 h-14 rounded-full flex items-center justify-center bg-blue-500/10 text-blue-600"
        >
          <List class="w-7 h-7" />
        </div>
      </div>

      <div
        class="bg-white p-6 rounded-xl border border-gray-200 shadow-md flex items-center justify-between transition-shadow duration-300 hover:shadow-xl"
      >
        <div class="flex-1 min-w-0">
          <div class="text-sm text-gray-500 font-medium mb-1 uppercase tracking-wider">Total Products</div>
          <div class="text-4xl font-extrabold text-gray-900 mt-1">{{ totalProducts }}</div>
        </div>
        <div
          class="w-14 h-14 rounded-full flex items-center justify-center bg-purple-500/10 text-purple-700"
        >
          <Package class="w-7 h-7" />
        </div>
      </div>

      <div
        class="bg-white p-6 rounded-xl border border-gray-200 shadow-md flex items-center justify-between transition-shadow duration-300 hover:shadow-xl"
      >
        <div class="flex-1 min-w-0">
          <div class="text-sm text-gray-500 font-medium mb-1 uppercase tracking-wider">Avg Products per Cat.</div>
          <div class="text-4xl font-extrabold text-gray-900 mt-1">{{ averageProducts }}</div>
        </div>
        <div
          class="w-14 h-14 rounded-full flex items-center justify-center bg-green-500/10 text-green-600"
        >
          <TrendingUp class="w-7 h-7" />
        </div>
      </div>
    </div>

    <div class="mb-6  bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div class="relative max-w-full">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search categories by name or description..."
          class="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-sm"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 p-6 lg:grid-cols-2 gap-6">
      <CategoryCard
        v-for="category in filteredCategories"
        :key="category.id"
        :category="category"
        @edit="handleEditCategory"
        @delete="handleDeleteCategory"
        @view="handleViewCategory"
      />
    </div>

    <div
      v-if="filteredCategories.length === 0"
      class="text-center p-16 bg-white border border-gray-200 rounded-xl text-gray-400 shadow-lg mt-6"
    >
      <FolderX class="mx-auto mb-4 w-16 h-16 text-indigo-400" />
      <h3 class="text-xl font-semibold text-gray-700 mb-2">No Categories Found</h3>
      <p class="text-base">Your search did not match any existing categories.</p>
    </div>

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
// Remplacez les chemins d'accès API et composables par vos chemins réels
import CategoryCard from '../components/ CategoryCard .vue' 
import AddCategoryModal from '../components/AddCategoryModal .vue'
import { useCategoryStore } from '@/stores/CategoryStore' 
import { toast } from 'vue-sonner' // Si vous utilisez vue-sonner pour les notifications
import { useRouter } from 'vue-router'
import ActionModal from '@/components/ui/ActionModal.vue'
import { useActionMessage } from '@/composable/useActionMessage'
import { useGlobalModal } from '@/composable/useValidation'

// Importations Lucide (choisies pour simuler le style Material)
import { 
  ArrowLeft,
  Plus,
  List, // Remplacement pour Total Categories
  Package, // Remplacement pour Total Products
  TrendingUp, // Remplacement pour Avg Products
  Search,
  FolderX // Remplacement pour Empty State
} from 'lucide-vue-next'

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
// Note: formatDate n'est plus utilisé dans le template, mais conservé au cas où.
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

const handleEditCategory = (category) => {
  editingCategory.value = { ...category }
  showAddCategory.value = true
}

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

<style scoped>
/* Ajout d'un style de focus plus subtil et Material-like */
input:focus {
    box-shadow: 0 0 0 3px rgb(165 180 252 / 0.5); /* Indigo-300 shadow for focus */
}
</style>