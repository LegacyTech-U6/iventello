<template>
  <div class="h-full bg-gray-50 pb-10">
    <div class="flex items-center justify-between px-4 py-4 mb-2 sticky top-0 z-30 bg-gray-50/90 backdrop-blur-sm">
      <button @click="goBack"
        class="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-700 hover:bg-gray-100 transition-colors border border-gray-100">
        <span class="material-icons">arrow_back</span>
      </button>

      <div class="flex gap-3">
        <template v-if="isEditing">
          <button @click="cancelEdit"
            class="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2">
            <span class="material-icons text-sm">close</span>
            Cancel
          </button>

          <ValidationButton :text="'Save'" :loadingText="'Chargement...'" :loading="saving" :block="false"
            :size="'medium'" :icon="saving ? RefreshIcon : CheckIcon" :asyncClick="handleSaveEdit" />

        </template>
        <button v-else @click="startEdit"
          class="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-700 hover:text-blue-600 transition-colors border border-gray-100">
          <span class="material-icons">edit</span>
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center h-64">
      <div class="flex flex-col items-center gap-6">
        <n-spin size="large" />
      </div>
    </div>

    <div v-else-if="!product" class="flex flex-col items-center justify-center h-64 px-4 text-center">
      <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
        <span class="material-icons text-3xl text-gray-400">inventory_2</span>
      </div>
      <h3 class="text-lg font-bold text-gray-900">Product not found</h3>
    </div>

    <div v-else class="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">

      <div class="lg:col-span-2 space-y-6">

        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all"
          :class="{ 'ring-2 ring-blue-500/20': isEditing }">
          <h2 class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            General Information
            <span v-if="isEditing"
              class="text-xs font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Editing</span>
          </h2>

          <div class="space-y-6">
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Product Name</label>
              <input v-if="isEditing" v-model="editForm.Prod_name" type="text"
                class="w-full p-3 bg-white border border-blue-300 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium text-gray-900"
                placeholder="Product Name" />
              <div v-else class="p-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-900 font-medium">
                {{ product.Prod_name }}
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Brand /
                  Supplier</label>
                <div v-if="isEditing" class="relative">
                  <span class="material-icons text-gray-400 absolute left-3 top-3.5 text-sm">store</span>
                  <input v-model="editForm.supplier_name" type="text"
                    class="w-full pl-9 p-3 bg-white border border-blue-300 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-700" />
                </div>
                <div v-else
                  class="p-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-700 flex items-center gap-2">
                  <span class="material-icons text-sm text-gray-400">store</span>
                  {{ product.supplier_name || 'Generic' }}
                </div>
              </div>

              <div>
                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Category</label>
                <div v-if="isEditing" class="relative">
                  <span class="material-icons text-gray-400 absolute left-3 top-3.5 text-sm">category</span>
                  <input v-model="editForm.category.name" type="text"
                    class="w-full pl-9 p-3 bg-white border border-blue-300 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-700" />
                </div>
                <div v-else
                  class="p-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-700 flex items-center gap-2">
                  <span class="material-icons text-sm text-gray-400">category</span>
                  {{ product.category?.name }}
                </div>
              </div>
            </div>

            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Description</label>
              <textarea v-if="isEditing" v-model="editForm.Prod_Description" rows="4"
                class="w-full p-4 bg-white border border-blue-300 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-600 text-sm leading-relaxed resize-none"></textarea>
              <div v-else
                class="p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-600 text-sm leading-relaxed min-h-[100px] whitespace-pre-wrap">
                {{ product.Prod_Description || 'No description available.' }}
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all"
          :class="{ 'ring-2 ring-blue-500/20': isEditing }">
          <div class="flex items-center gap-2 mb-6">
            <h2 class="text-lg font-bold text-gray-900">Pricing & Stock</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Selling Price</label>
                <div v-if="isEditing" class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                  <input v-model.number="editForm.selling_price" type="number" step="0.01"
                    class="w-full pl-7 p-3 bg-white border border-blue-300 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-gray-900" />
                </div>
                <div v-else class="flex items-center gap-1 text-2xl font-bold text-gray-900">
                  <span class="text-sm text-gray-400 align-top mt-1">$</span>
                  {{ formatPrice(product.selling_price) }}
                </div>
              </div>

              <div>
                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Cost Price</label>
                <div v-if="isEditing" class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                  <input v-model.number="editForm.cost_price" type="number" step="0.01"
                    class="w-full pl-7 p-3 bg-white border border-blue-300 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium text-gray-600" />
                </div>
                <div v-else class="text-sm font-medium text-gray-600">
                  ${{ formatPrice(product.cost_price) }}
                </div>
              </div>
            </div>

            <div class="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-start mb-2">
                  <div class="w-full">
                    <label class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Total
                      Stock</label>

                    <div v-if="isEditing" class="relative mt-2">
                      <input :value="product.quantity" disabled type="number"
                        class="w-full p-2 bg-gray-200 border border-gray-300 rounded-lg text-gray-500 font-bold cursor-not-allowed opacity-70"
                        title="Stock quantity cannot be edited directly. Please use Restock." />
                      <p class="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                        <span class="material-icons text-[12px]">lock</span>
                        Use 'Restock' to change quantity
                      </p>
                    </div>

                    <span v-else class="text-2xl font-bold text-gray-900">{{ product.quantity }}</span>
                  </div>

                  <span v-if="!isEditing" :class="stockBadgeClass"
                    class="text-xs px-2 py-1 rounded-md font-medium border flex items-center gap-1 ml-2">
                    <span class="material-icons text-[10px]"
                      :class="stockDotClass.replace('bg-', 'text-')">circle</span>
                    {{ stockStatus }}
                  </span>
                </div>

                <div v-if="!isEditing" class="mt-3">
                  <div class="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-500" :class="stockLevelColor"
                      :style="{ width: `${stockPercentage}%` }">
                    </div>
                  </div>
                </div>
              </div>

              <button v-if="!isEditing" @click="handleRestock"
                class="w-full mt-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                <span class="material-icons text-sm">autorenew</span>
                Restock
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div
            class="aspect-square bg-gray-50 rounded-xl flex items-center justify-center relative overflow-hidden group mb-4">
            <img v-if="isEditing ? editForm.Prod_image : product.Prod_image"
              :src="isEditing ? editForm.Prod_image : product.Prod_image" :alt="product.Prod_name"
              class="w-full h-full object-contain p-4 transition-transform duration-500"
              :class="{ 'group-hover:scale-105': !isEditing }" />
            <div v-else class="flex flex-col items-center text-gray-300">
              <span class="material-icons text-5xl mb-2">image_not_supported</span>
              <span class="text-xs">No image</span>
            </div>
          </div>

          <div v-if="isEditing" class="mb-4">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Image URL</label>
            <input v-model="editForm.Prod_image" type="text"
              class="w-full p-2 text-sm bg-white border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-gray-600"
              placeholder="https://..." />
          </div>

          <div class="grid grid-cols-4 gap-2">
            <div v-for="i in 4" :key="i"
              class="aspect-square rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
              <img v-if="product.Prod_image && i === 1" :src="product.Prod_image"
                class="w-full h-full object-cover rounded-lg opacity-50 hover:opacity-100" />
              <span v-else class="material-icons text-gray-300 text-sm">image</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          :class="{ 'ring-2 ring-blue-500/20': isEditing }">
          <div class="space-y-4">
            <div class="py-2 border-b border-gray-50">
              <label class="text-xs text-gray-500 mb-1 block">SKU Code</label>
              <input v-if="isEditing" v-model="editForm.code_bar"
                class="w-full p-2 bg-white border border-blue-300 rounded-lg text-sm font-mono" />
              <span v-else class="text-sm font-mono font-bold text-gray-900 block">{{ product.code_bar }}</span>
            </div>
            <div class="flex items-center justify-between py-2 border-b border-gray-50">
              <span class="text-sm text-gray-500">Last Arrival</span>
              <span class="text-sm font-medium text-gray-900">{{ formatDate(product.date_of_arrival) }}</span>
            </div>
            <div class="flex items-center justify-between py-2">
              <span class="text-sm text-gray-500">Status</span>
              <span class="text-sm font-medium text-green-600 flex items-center gap-1">
                <span class="material-icons text-sm">check_circle</span> Published
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getOneProduct as fetchProductById } from '@/service/api'
import { useActionMessage } from '@/composable/useActionMessage'
import { useGlobalModal } from '@/composable/useValidation'
import ValidationButton from '@/components/ui/buttons/ValidationButton.vue'
const { show } = useGlobalModal()
const { showSuccess, showError } = useActionMessage()
interface Category {
  id: number
  name: string
}
interface Product {
  id?: string | number
  Prod_name: string
  quantity: string | number
  cost_price: string | number
  selling_price: string | number
  category: Category
  Prod_Description: string
  code_bar: string | number
  date_of_arrival: string
  supplier_name: string | number
  Prod_image?: string
}

const router = useRouter()
const route = useRoute()

const product = ref<Product | null>(null)
const loading = ref(true)
const saving = ref(false)

const isEditing = ref(false)
const editForm = ref<Product>({
  Prod_name: '',
  quantity: 0,
  cost_price: 0,
  selling_price: 0,
  category: { id: 0, name: '' },  // <-- ici c'est un objet
  Prod_Description: '',
  code_bar: '',
  date_of_arrival: '',
  supplier_name: '',
  Prod_image: '',
})
const CheckIcon = {
  template: `<span class="material-icons text-sm">check</span>`
}
const RefreshIcon = {
  template: `<span class="material-icons animate-spin text-sm">refresh</span>`
}

onMounted(async () => {
  if (route.params.id) {
    try {
      loading.value = true
      const response = await fetchProductById(route.params.id)

      if (response.data) {
        product.value = Array.isArray(response.data) ? response.data[0] : response.data
      } else if (Array.isArray(response)) {
        product.value = response[0]
      } else {
        product.value = response
      }
    } catch (error) {
      show('Error fetching product details', 'error')
      console.error('Error fetching product:', error)
    } finally {
      loading.value = false
    }
  } else {
    loading.value = false
  }
})

const goBack = () => {
  if (isEditing.value) {
    if (confirm("Discard changes?")) {
      isEditing.value = false
    }
    return
  }
  router.back()
}

// Logic for Inline Editing
const startEdit = () => {
  if (!product.value) return
  // Clone data to editForm
  editForm.value = {
    ...product.value,
    quantity: typeof product.value.quantity === 'string' ? parseInt(product.value.quantity) : product.value.quantity,
    cost_price: typeof product.value.cost_price === 'string' ? parseFloat(product.value.cost_price) : product.value.cost_price,
    selling_price: typeof product.value.selling_price === 'string' ? parseFloat(product.value.selling_price) : product.value.selling_price,
  }
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
  editForm.value = { ...product.value } as Product // Reset
}

const handleSaveEdit = async () => {
  try {
    saving.value = true
    // API Call Simulation:
    // await updateProduct(product.value.id, editForm.value)

    // Update local state
    product.value = { ...editForm.value }
    showSuccess('Product updated successfully')
    isEditing.value = false
  } catch (error) {
    show('Failed to update product', 'error')
    console.error('Error updating product:', error)
  } finally {
    saving.value = false
  }
}

// Computeds
const quantityNum = computed(() => {
  if (!product.value) return 0
  return typeof product.value.quantity === 'string'
    ? parseInt(product.value.quantity)
    : product.value.quantity
})

const stockStatus = computed(() => {
  const qty = quantityNum.value
  if (qty === 0) return 'Out of Stock'
  if (qty <= 10) return 'Low Stock'
  return 'In Stock'
})

const stockBadgeClass = computed(() => {
  const qty = quantityNum.value
  if (qty === 0) return 'bg-red-50 text-red-700 border-red-100'
  if (qty <= 10) return 'bg-orange-50 text-orange-700 border-orange-100'
  return 'bg-green-50 text-green-700 border-green-100'
})

const stockDotClass = computed(() => {
  const qty = quantityNum.value
  if (qty === 0) return 'bg-red-500'
  if (qty <= 10) return 'bg-orange-500'
  return 'bg-green-500'
})

const stockPercentage = computed(() => {
  const qty = quantityNum.value
  const max = 100
  return Math.min((qty / max) * 100, 100)
})

const stockLevelColor = computed(() => {
  const qty = quantityNum.value
  if (qty === 0) return 'bg-red-500'
  if (qty <= 10) return 'bg-orange-500'
  return 'bg-green-500'
})

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const handleRestock = () => {
  if (!product.value) return console.error('❌ No product loaded')

  router.push({
    name: 'restock',
    params: { reStockId: product.value.id },
  })
}

const formatPrice = (value: any) => {
  const num = parseFloat(value)
  return isNaN(num) ? '0.00' : num.toFixed(2)
}
</script>

<style scoped>
.material-icons {
  font-size: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}
</style>