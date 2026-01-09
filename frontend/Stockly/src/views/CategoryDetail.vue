<template>
  <div class="category-view">
    <!-- Header Section -->
    <div class="">
      <div class="mx-auto px-6 py-4">
        <button
          @click="goBack"
          class="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3 transition-colors text-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Category
        </button>

        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900 mb-1">
              {{ Category?.name || 'Category Details' }}
            </h1>
            <div class="flex items-center gap-4 text-sm text-gray-500">
              <span>{{ Category?.description }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center border border-gray-200 rounded-md">
        <button
          :class="
            viewMode === 'grid'
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          "
          class="p-2 transition-colors"
          @click="viewMode = 'grid'"
          title="Grid View"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
          </svg>
        </button>
        <div class="w-px h-6 bg-gray-200"></div>
        <button
          :class="
            viewMode === 'list'
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          "
          class="p-2 transition-colors"
          @click="viewMode = 'list'"
          title="List View"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon-wrapper blue">
          <svg class="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            ></path>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-label">Total Products</div>
          <div class="stat-value">{{ Category?.productCount }}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-wrapper purple">
          <svg class="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            ></path>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-label">Total Value</div>
          <div class="stat-value">{{ totalProductsValue }}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-wrapper orange">
          <svg class="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            ></path>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-label">Avg Products</div>
          <div class="stat-value">{{ averageProducts }}</div>
        </div>
      </div>
    </div>

    <!-- Search Section -->
    <div class="search-section">
      <div class="search-box">
        <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          class="search-input"
        />
      </div>
    </div>

    <!-- Categories Grid -->
    <div class="px-8 py-6">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-32">
        <div
          class="animate-spin rounded-full h-12 w-12 border-3 border-gray-200 border-t-green-600"
        ></div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="filteredProducts.length === 0"
        class="bg-white border border-gray-200 rounded-lg py-20"
      >
        <div class="text-center">
          <div
            class="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center"
          >
            <svg
              class="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
          <p class="text-gray-500 mb-6 max-w-md mx-auto">
            We couldn't find any products matching your criteria. Try adjusting your filters or
            search query.
          </p>
          <button
            @click="clearFilters"
            class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      </div>

      <!-- Grid View -->
      <div
        v-else-if="viewMode === 'grid'"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-4 gap-1"
      >
        <ProductListItem
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
          :display-mode="viewMode"
          @view="handleViewProduct"
        />
      </div>

      <!-- List View -->
      <div v-else class="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <!-- List Header -->
        <div class="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div
            class="flex items-center gap-4 text-xs font-medium text-gray-600 uppercase tracking-wide"
          >
            <div class="flex-1">Product Name</div>
            <div class="w-36 hidden lg:block">Category</div>
            <div class="w-32 hidden md:block">Barcode</div>
            <div class="w-24 text-center hidden sm:block">Stock</div>
            <div class="w-28 text-right hidden xl:block">Cost Price</div>
            <div class="w-32 text-right">Selling Price</div>
            <div class="w-10"></div>
          </div>
        </div>

        <!-- List Items -->
        <ProductListItem
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
          :display-mode="viewMode"
          @view="handleViewProduct"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import CategoryCard from '../components/CategoryCard.vue'
import AddCategoryModal from '../components/AddCategoryModal.vue'
import { useCategoryStore } from '@/stores/categoryOfflineStore'
import { toast } from 'vue-sonner'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import ProductListItem from '@/components/Products/ProductListItem.vue'
const averageProducts = ref(0)
// Mock data - replace with actual API calls
const categoryStore = useCategoryStore()
const router = useRouter()
const route = useRoute()
const viewMode = ref('list')
const showAddCategory = ref(false)
const editingCategory = ref(null)

// Search query (assume you have a ref defined somewhere)
const searchQuery = ref('')

// Computed: filtered categories based on search query
const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value

  const query = searchQuery.value.toLowerCase()
  return products.value.filter((product) => product.Prod_name.toLowerCase().includes(query))
})
const handleViewProduct = (product) => {
  router.push({
    name: 'product-detail',
    params: { id: product.id },
  })
}
// Computed: total products across all categories
const totalProducts = computed(() =>
  categoryStore.categories.reduce((sum, category) => sum + category.productCount, 0),
)

const totalProductsValue = computed(() =>
  products.value.reduce((sum, product) => {
    const productTotal = product.selling_price * (product.quantity ?? 1)
    return sum + productTotal
  }, 0),
)

// Methods
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

const closeModal = () => {
  showAddCategory.value = false
  editingCategory.value = null
}
// Destructure reactive references from the store
const { category: Category, loading, error, products } = storeToRefs(categoryStore)

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
.category-view {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  background-color: #f9fafb;
  min-height: 100vh;
}

/* Header Styles */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.025em;
}

.page-subtitle {
  color: #6b7280;
  font-size: 0.9375rem;
  margin: 0;
  font-weight: 400;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
}

.btn-secondary {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.625rem 1.25rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.btn-primary {
  background: #000000;
  color: white;
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #1f2937;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s ease;
}

.stat-card:hover {
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon-wrapper.blue {
  background: #dbeafe;
  color: #2563eb;
}

.stat-icon-wrapper.green {
  background: #d1fae5;
  color: #059669;
}

.stat-icon-wrapper.purple {
  background: #e9d5ff;
  color: #9333ea;
}

.stat-icon-wrapper.orange {
  background: #fed7aa;
  color: #ea580c;
}

.stat-icon {
  width: 24px;
  height: 24px;
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.025em;
}

/* Search Section */
.search-section {
  margin-bottom: 1.5rem;
}

.search-box {
  position: relative;
  max-width: 100%;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9375rem;
  background: white;
  transition: all 0.2s ease;
  color: #111827;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-input:focus {
  outline: none;
  border-color: #000000;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
}

/* Categories Grid */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
  gap: 1.5rem;
}

.category-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  transition: all 0.2s ease;
}

.category-card:hover {
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}

.category-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.category-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 600;
  flex-shrink: 0;
}

.category-info {
  flex: 1;
  min-width: 0;
}

.category-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.01em;
}

.category-company {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.category-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  padding: 0;
}

.action-btn:hover {
  background: #f3f4f6;
}

.action-btn svg {
  width: 18px;
  height: 18px;
  color: #6b7280;
}

.action-btn:hover svg {
  color: #111827;
}

.category-details {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  font-size: 0.875rem;
  color: #4b5563;
  line-height: 1.5;
}

.detail-icon {
  width: 16px;
  height: 16px;
  color: #9ca3af;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.category-footer {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.footer-stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.footer-label {
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.footer-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.category-meta {
  font-size: 0.8125rem;
  color: #9ca3af;
  padding-top: 0.75rem;
  border-top: 1px solid #f3f4f6;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #9ca3af;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  color: #d1d5db;
}

.empty-state p {
  margin: 0;
  font-size: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .category-view {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    gap: 1rem;
  }

  .header-actions {
    width: 100%;
  }

  .btn-secondary,
  .btn-primary {
    flex: 1;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .categories-grid {
    grid-template-columns: 1fr;
  }
}
</style>
