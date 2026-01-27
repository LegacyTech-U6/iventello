<template>
  <div class="max-w-8xl mx-auto bg-background h-full">



    <div class="flex gap-3 px-5 justify-end mt-4 md:mt-0 shrink-0">
      <button @click="showAddCategory = true"
        class="btn-primary px-5 py-2.5 rounded-full text-sm flex items-center gap-2 elevation-1">
        <PlusIcon class="w-4 h-4" />
        Add Category
      </button>
    </div>


    <div class="grid grid-cols-1 p-5 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <GridCard title="Total Categories" :value="totalCategories || 0" :icon="ListBulletIcon" bgColor="bg-primary" />
      <GridCard title="Total Products" :value="totalProducts" :icon="CubeIcon" bgColor="bg-secondary" />
      <GridCard title="Avg Products/Cat." :value="averageProducts" :icon="ArrowTrendingUpIcon" bgColor="bg-tertiary" />
    </div>

    <div class="mb-6 bg-surface p-6 rounded-xl elevation-1">
      <div class="relative max-w-full">
        <MagnifyingGlassIcon
          class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
        <input v-model="searchQuery" type="text" placeholder="Search categories by name or description..."
          class="input-field w-full pl-12 pr-4 py-3.5 text-base rounded-xl" />
      </div>
    </div>

    <div class="grid grid-cols-1 p-6 lg:grid-cols-2 gap-6">
      <CategoryCard v-for="category in filteredCategories" :key="category.id" :category="category"
        @edit="handleEditCategory" @delete="handleDeleteCategory" @view="handleViewCategory" />
    </div>

    <div v-if="filteredCategories.length === 0" class="card text-center p-16 mt-6">
      <FolderMinusIcon class="mx-auto mb-4 w-16 h-16 text-primary" />
      <h3 class="card-title text-xl mb-2">No Categories Found</h3>
      <p class="card-subtitle">Your search did not match any existing categories.</p>
    </div>

    <AddCategoryModal v-if="showAddCategory" :category="editingCategory" @save="handleSaveCategory"
      @close="closeModal" />
    <ActionModal v-model="showDeleteModal" title="Delete Category"
      message="Are you sure you want to delete this category? This action cannot be undone." confirm-text="Delete"
      cancel-text="Cancel" @confirm="confirmDelete" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
// Remplacez les chemins d'accès API et composables par vos chemins réels
import CategoryCard from '../components/CategoryCard.vue'
import AddCategoryModal from '../components/AddCategoryModal.vue'
import { useCategoryStore } from '@/stores/CategoryStore'
import { toast } from 'vue-sonner' // Si vous utilisez vue-sonner pour les notifications
import { useRouter } from 'vue-router'
import ActionModal from '@/components/ui/ActionModal.vue'
import { useActionMessage } from '@/composable/useActionMessage'
import { useGlobalModal } from '@/composable/useValidation'
import GridCard from '@/components/ui/cards/GridCard.vue'

// Importations Heroicons (choisies pour simuler le style Material)
import {
  ArrowLeftIcon,
  PlusIcon,
  ListBulletIcon,
  CubeIcon,
  ArrowTrendingUpIcon,
  MagnifyingGlassIcon,
  FolderMinusIcon
} from '@heroicons/vue/24/outline'

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
<style scoped></style>