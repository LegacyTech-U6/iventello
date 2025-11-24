<template>
  <div class="h-full bg-gray-50">

    <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-20">
      <!-- Stats Grid - 2 cols mobile, 3 cols tablet, 3 cols desktop -->
      <div class="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <!-- Units Needed -->
        <div class="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 lg:p-6">
          <div class="flex items-start justify-between mb-3">
            <div class="p-2 bg-blue-50 rounded-lg">
              <Package class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
          </div>
          <div>
            <p class="text-xs sm:text-sm text-gray-600 font-medium mb-1">Units Needed</p>
            <p class="text-2xl sm:text-3xl font-bold text-gray-900">{{ totalUnitsNeeded }}</p>
          </div>
        </div>

        <!-- Reorder Cost -->
        <div class="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 lg:p-6">
          <div class="flex items-start justify-between mb-3">
            <div class="p-2 bg-green-50 rounded-lg">
              <DollarSign class="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
          </div>
          <div>
            <p class="text-xs sm:text-sm text-gray-600 font-medium mb-1">Est. Reorder Cost</p>
            <p class="text-2xl sm:text-3xl font-bold text-gray-900">${{ formatCurrency(totalReorderCost) }}</p>
          </div>
        </div>

        <!-- Urgent Restocks -->
        <div class="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 lg:p-6 col-span-2 lg:col-span-1">
          <div class="flex items-start justify-between mb-3">
            <div class="p-2 bg-red-50 rounded-lg">
              <AlertTriangle class="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
            </div>
          </div>
          <div>
            <p class="text-xs sm:text-sm text-gray-600 font-medium mb-1">Urgent Restocks</p>
            <p class="text-2xl sm:text-3xl font-bold text-gray-900">{{ urgentRestockCount }}</p>
          </div>
        </div>
      </div>

      <!-- Search and Filter -->
      <div class="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 lg:p-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <!-- Search -->
          <div class="lg:col-span-2">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products by name, SKU, or supplier..."
                v-model="searchQuery"
                class="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <!-- Stock Level Filter -->
          <div class="lg:col-span-1">
            <label class="block text-xs font-medium text-gray-700 mb-2">Stock Level</label>
            <select
              v-model="stockLevelFilter"
              class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All Low Stock</option>
              <option value="critical">Critical Only</option>
              <option value="warning">Warning Only</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Products Grid - 1 col mobile, 2 cols tablet, 2 cols desktop -->
      <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        <LowStockCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
          @restock="handleRestock"
          :reorderCost="totalReorderCost"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center">
        <div class="flex justify-center mb-4">
          <div class="p-3 sm:p-4 bg-green-50 rounded-full">
            <CheckCircle2 class="w-12 h-12 sm:w-16 sm:h-16 text-green-600" />
          </div>
        </div>
        <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">All Stock Levels Normal</h3>
        <p class="text-sm text-gray-500">
          All products are adequately stocked. Excellent inventory management!
        </p>
      </div>
    </div>

    <!-- Restock Modal -->
    <RestockModal
      :isOpen="isModalOpen"
      :product="selectedProduct"
      :suppliers="suppliers"
      @close="isModalOpen = false"
      @restock="handleRestock"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Package,
  DollarSign,
  AlertTriangle,
  Search,
  ChevronLeft,
  ArrowLeft,
  CheckCircle2
} from 'lucide-vue-next'
import LowStockCard from '../components/LowStockCard.vue'
import { LowStock } from '@/service/api'
import RestockModal from '@/components/RestockModal.vue'
import { useRouter, useRoute } from 'vue-router'

const searchQuery = ref('')
const stockLevelFilter = ref('all')
const lowStockProducts = ref([])
const error = ref(null)
const isModalOpen = ref(false)
const message = ref('')
const router = useRouter()
const route = useRoute()
const selectedProduct = ref(null)

onMounted(async () => {
  await fetchLowStockProducts()
})

async function fetchLowStockProducts() {
  try {
    const data = await LowStock()
    message.value = data.message
    lowStockProducts.value = data.products
    error.value = null
    console.log('✅ Low products loaded:', lowStockProducts.value)
  } catch (err) {
    console.error('❌ Error fetching low stock:', err)
    error.value = err
    lowStockProducts.value = []
  }
}

const suppliers = ref([
  { id: 1, name: 'Supplier A' },
  { id: 2, name: 'Supplier B' },
])

const totalUnitsNeeded = computed(() =>
  (lowStockProducts.value || []).reduce((sum, p) => sum + (p.min_stock_level - p.quantity), 0),
)

const totalReorderCost = computed(() =>
  (lowStockProducts.value || []).reduce(
    (sum, p) => sum + p.cost_price * (p.min_stock_level - p.quantity),
    0,
  ),
)

const urgentRestockCount = computed(
  () => (lowStockProducts.value || []).filter((p) => p.stockLevel === 'critical').length,
)

const filteredProducts = computed(() => {
  let result = lowStockProducts.value || []

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.supplier.toLowerCase().includes(q),
    )
  }

  if (stockLevelFilter.value !== 'all') {
    result = result.filter((p) => p.stockLevel === stockLevelFilter.value)
  }

  // Sort by urgency (critical first)
  result = result.sort(
    (a, b) => (b.stockLevel === 'critical' ? 1 : 0) - (a.stockLevel === 'critical' ? 1 : 0),
  )

  return result
})

function openRestockModal(product) {
  selectedProduct.value = product
  isModalOpen.value = true
}

const handleRestock = (lowStockProduct) => {
  if (!lowStockProduct) return console.error('❌ No product loaded')

  router.push({
    name: 'restock',
    params: { reStockId: lowStockProduct.id },
  })
  console.log('Restock product:', lowStockProduct.id)
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
</script>
