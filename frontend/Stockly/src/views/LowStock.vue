<template>
  <div class="h-full bg-background">
    <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-20">
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <GridCard
          title="Units Needed"
          :value="totalUnitsNeeded"
          :icon="Package"
          bgColor="bg-primary"
        />
        <GridCard
          title="Est. Reorder Cost"
          :value="'$' + formatCurrency(totalReorderCost)"
          :icon="DollarSign"
          bgColor="bg-tertiary"
        />
        <GridCard
          title="Urgent Restocks"
          :value="urgentRestockCount"
          :icon="AlertTriangle"
          bgColor="bg-error"
        />
      </div>

      <!-- Search and Filter -->
      <div class="card p-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <!-- Search -->
          <div class="lg:col-span-2">
            <div class="relative flex items-center w-full">
              <Search class="absolute left-4 w-5 h-5 text-on-surface-variant pointer-events-none" />
              <input
                type="text"
                placeholder="Search products by name, SKU, or supplier..."
                v-model="searchQuery"
                class="input-field w-full pl-12 pr-4 py-3 text-base rounded-xl"
              />
            </div>
          </div>

          <!-- Stock Level Filter -->
          <div class="lg:col-span-1">
            <select
              v-model="stockLevelFilter"
              class="input-field w-full px-3 py-3 text-base rounded-xl"
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
      <div v-else class="card text-center p-16 mt-6">
        <CheckCircle2 class="mx-auto mb-4 w-16 h-16 text-tertiary" />
        <h3 class="card-title text-xl mb-2">All Stock Levels Normal</h3>
        <p class="card-subtitle">
          Great job! All products are adequately stocked.
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
import GridCard from '@/components/ui/cards/GridCard.vue'
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
