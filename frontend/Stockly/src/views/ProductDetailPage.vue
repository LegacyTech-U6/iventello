<template>
  <div class="h-full bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col overflow-hidden">
    <!-- Header modifié pour le mode édition -->
    <div class="bg-white shadow-sm z-10 flex-shrink-0">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-start justify-between flex-wrap gap-4">
          <div class="flex-1 min-w-0 flex items-center gap-4">
            <button
              @click="isEditing ? cancelEdit() : goBack()"
              class="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all group p-2 -ml-2 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft class="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
            </button>
            <div>
              <h1 class="text-xl font-bold text-gray-900 truncate">
                {{ product?.Prod_name || 'Product Details' }}
              </h1>
              <p class="text-xs text-gray-500 mt-0.5">
                SKU: {{ product?.code_bar }}
                <span class="text-gray-300 mx-2">•</span>
                Category: {{ product?.category_id }}
              </p>
            </div>
          </div>
          <div class="flex gap-2">
            <button
              v-if="!isEditing"
              @click="handleEdit"
              class="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all hover:shadow-sm flex items-center justify-center gap-2 group text-sm"
            >
              <Edit3 class="w-4 h-4" />
              Edit
            </button>
            <button
              v-else
              @click="handleSaveEdit"
              :disabled="saving"
              class="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all hover:shadow-sm flex items-center justify-center gap-2 group text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save class="w-4 h-4" v-if="!saving" />
              <Loader2 class="w-4 h-4 animate-spin" v-else />
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
            <button
              v-if="isEditing"
              @click="cancelEdit"
              class="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all hover:shadow-sm flex items-center justify-center gap-2 group text-sm"
            >
              <X class="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto">
      <div class="max-w-7xl mx-auto px-6 py-8">
        <!-- États de chargement et erreur restent inchangés -->
        <div v-if="loading" class="bg-white rounded-xl shadow-sm p-12">
          <div class="flex flex-col items-center justify-center">
            <Loader2 class="w-12 h-12 text-gray-400 animate-spin mb-4" />
            <p class="text-gray-500">Loading product details...</p>
          </div>
        </div>

        <div v-else-if="!product" class="bg-white rounded-xl shadow-sm p-12">
          <div class="text-center">
            <div
              class="w-20 h-20 bg-gray-100 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            >
              <PackageX class="w-10 h-10 text-gray-400" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">No product data found</h3>
            <p class="text-gray-500 mb-6">Please select a product from the inventory list</p>
            <button
              @click="goBack"
              class="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-all hover:shadow-lg inline-flex items-center gap-2"
            >
              <ArrowLeft class="w-4 h-4" />
              Go Back to Products
            </button>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Colonne principale - Modifiée pour l'édition directe -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Section Sortly ID et Quantity -->
            <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <h2 class="text-lg font-bold text-gray-900 mb-4">
                <input
                  v-if="isEditing"
                  v-model="editForm.Prod_name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Product Name"
                />
                <span v-else>{{ product.Prod_name }}</span>
              </h2>
              
              <div class="space-y-4">
                <div>
                  <h3 class="text-sm font-semibold text-gray-500 mb-1">Sortly ID: SLOIKTO001</h3>
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-700">Quantity</span>
                    <div v-if="isEditing" class="flex items-center gap-2">
                      <input
                        v-model.number="editForm.quantity"
                        type="number"
                        min="0"
                        class="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                      />
                      <span class="text-sm text-gray-500">units</span>
                    </div>
                    <span v-else class="text-2xl font-bold text-gray-900">{{ product.quantity }} units</span>
                  </div>
                </div>
                
                <hr class="border-gray-200">
                
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-700">Quantity: {{ product.quantity }} units</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-700">Min Level</span>
                    <span class="text-sm font-bold text-gray-900">1</span>
                  </div>
                </div>
                
                <hr class="border-gray-200">
                
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-700">
                      Total Value: {{ formatPrice(totalSellingValue) }} FCFA
                    </span>

        </div>
                  <div class="flex items-center justify-between text-xs text-gray-500">
                    <span>Updated at: {{ formatDate(product.date_of_arrival) }}</span>
                  </div>
                </div>
                
                <hr class="border-gray-200">
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <span class="text-sm font-medium text-gray-700">Price</span>
                    <div v-if="isEditing" class="flex items-center gap-2">
                      <input
                        v-model.number="editForm.selling_price"
                        type="number"
                        min="0"
                        step="0.01"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <p v-else class="text-lg font-bold text-gray-900">{{ formatPrice(product.selling_price) }} FCFA</p>
                  </div>
                  <div>
                    <span class="text-sm font-medium text-gray-700">Total value</span>
                    <p class="text-lg font-bold text-gray-900">{{ formatPrice(totalSellingValue) }} FCFA</p>
                  </div>
                </div>

                <!-- Champs supplémentaires en mode édition -->
                <div v-if="isEditing" class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Cost Price (FCFA)</label>
                    <input
                      v-model.number="editForm.cost_price"
                      type="number"
                      min="0"
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">SKU / Barcode</label>
                    <input
                      v-model="editForm.code_bar"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div class="col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                      v-model="editForm.category_id"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div class="col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                    <input
                      v-model="editForm.supplier_name"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div class="col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      v-model="editForm.Prod_Description"
                      rows="3"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    ></textarea>
                  </div>
                  <div class="col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                      v-model="editForm.Prod_image"
                      type="url"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Section QR / BARCODES -->
            <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <h2 class="text-lg font-bold text-gray-900 mb-4">QR / BARCODES</h2>
              <button class="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-all flex items-center justify-center gap-2">
                <Plus class="w-5 h-5" />
                ADD QR / BARCODE
              </button>
            </div>

            <!-- Section ADD NEW FIELD -->
            <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <h2 class="text-lg font-bold text-gray-900 mb-4">ADD NEW FIELD</h2>
              <button class="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-all flex items-center justify-center gap-2">
                <Settings class="w-5 h-5" />
                MANAGE CUSTOM FIELDS
              </button>
            </div>

            <!-- Section Stockly -->
            <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <h2 class="text-lg font-bold text-gray-900 mb-4">Stockly</h2>
              <div class="space-y-4">
                <div>
                  <h3 class="text-sm font-semibold text-gray-700 mb-2">Stockly</h3>
                  <p class="text-sm text-gray-600">Stock management information</p>
                </div>
                <div>
                  <h3 class="text-sm font-semibold text-gray-700 mb-2">Tags</h3>
                  <div class="flex flex-wrap gap-2">
                    <span class="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Inventory</span>
                    <span class="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">Product</span>
                  </div>
                </div>
                <div>
                  <h3 class="text-sm font-semibold text-gray-700 mb-2">Notes</h3>
                  <p class="text-sm text-gray-600">Additional notes about the product...</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Colonne latérale - Image et options développeur -->
          <div class="lg:col-span-1 space-y-6">
            <div class="bg-white rounded-xl shadow-sm p-4 sticky top-24">
              <h2 class="text-lg font-bold text-gray-900 mb-4">PRODUCT IMAGE</h2>
              <div
                class="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden group border border-gray-200"
              >
                <div v-if="editForm.Prod_image" class="relative w-full h-full">
                  <img
                    :src="editForm.Prod_image"
                    :alt="editForm.Prod_name"
                    class="w-full h-full object-contain p-4 transition-transform group-hover:scale-105"
                  />
                </div>
                <div v-else class="text-center">
                  <ImageOff class="w-16 h-16 text-gray-300 mb-3" />
                  <p class="text-sm text-gray-400">No image available</p>
                </div>
              </div>

              <div v-if="isEditing" class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  v-model="editForm.Prod_image"
                  type="url"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div class="flex gap-2">
                <div
                  class="w-1/4 aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-blue-500 p-1"
                >
                  <img
                    :src="editForm.Prod_image"
                    alt="Thumbnail"
                    class="w-full h-full object-cover rounded-md"
                    v-if="editForm.Prod_image"
                  />
                  <div v-else class="text-xs text-gray-400">Main</div>
                </div>
                <div
                  v-for="i in 3"
                  :key="i"
                  class="w-1/4 aspect-square bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200"
                >
                  <Camera class="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            <!-- Options développeur -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h4 class="text-xs font-medium text-gray-500 mb-2">DEVELOPER OPTIONS (Disabled)</h4>
              <div class="space-y-2">
                <button disabled class="w-full py-2 text-gray-400 border border-gray-200 rounded-lg text-sm bg-gray-50 cursor-not-allowed flex items-center justify-center gap-2">
                  <Plus class="w-4 h-4" />
                  Add New Field
                </button>
                <button disabled class="w-full py-2 text-gray-400 border border-gray-200 rounded-lg text-sm bg-gray-50 cursor-not-allowed flex items-center justify-center gap-2">
                  <Settings class="w-4 h-4" />
                  Manage Custom Fields
                </button>
              </div>
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
import { useCurrency } from '@/composable/useCurrency'

const { format } = useCurrency()
import {
  ChevronLeft,
  PackageX,
  ArrowLeft,
  ImageOff,
  Edit3,
  RefreshCw,
  Loader2,
  X,
  Save,
  Camera,
  Plus,
  Settings,
} from 'lucide-vue-next'
import { useGlobalModal } from '@/composable/useValidation'
const { show } = useGlobalModal()
const { showSuccess, showError } = useActionMessage()

interface Product {
  id?: string | number
  Prod_name: string
  quantity: string | number
  cost_price: string | number
  selling_price: string | number
  category_id: string | number
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
const isEditing = ref(false)
const saving = ref(false)
const editForm = ref<Product>({
  Prod_name: '',
  quantity: 0,
  cost_price: 0,
  selling_price: 0,
  category_id: '',
  Prod_Description: '',
  code_bar: '',
  date_of_arrival: '',
  supplier_name: '',
  Prod_image: '',
})

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
      
      // Simulation de données si elles sont manquantes pour l'affichage
      if (product.value && !product.value.Prod_image) {
        product.value.Prod_image = "https://picsum.photos/400/400?random=1"
      }
      if (product.value && !product.value.Prod_Description) {
        product.value.Prod_Description = "This is a detailed description of the product, including its features, benefits, and specifications, designed to inform the user about the item's core values and unique selling points. This text emulates the placeholder text length seen in the mockup."
      }
      if (product.value && !product.value.supplier_name) {
        product.value.supplier_name = "TechCorp Global"
      }
      if (product.value && !product.value.category_id) {
        product.value.category_id = "Electronics"
      }
      
    } catch (error) {
      // @ts-ignore
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
  router.back()
}

const quantityNum = computed(() => {
  if (!product.value) return 0
  return typeof product.value.quantity === 'string'
    ? parseInt(product.value.quantity)
    : product.value.quantity
})

const totalSellingValue = computed(() => {
  if (!product.value) return 0
  const qty = quantityNum.value
  const selling = parseFloat(product.value.selling_price?.toString() || '0')
  return qty * selling
})

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const handleEdit = () => {
  if (!product.value) return

  // Populate edit form with current product data
  editForm.value = {
    ...product.value,
    quantity:
      typeof product.value.quantity === 'string'
        ? parseInt(product.value.quantity)
        : product.value.quantity,
    cost_price:
      typeof product.value.cost_price === 'string'
        ? parseFloat(product.value.cost_price)
        : product.value.cost_price,
    selling_price:
      typeof product.value.selling_price === 'string'
        ? parseFloat(product.value.selling_price)
        : product.value.selling_price,
  }

  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
  // Reset edit form to original product data
  if (product.value) {
    editForm.value = { ...product.value }
  }
}

const handleSaveEdit = async () => {
  try {
    saving.value = true

    // Here you would call your update API
    // await updateProduct(product.value.id, editForm.value)

    // Update local product data
    product.value = { ...editForm.value }

    // @ts-ignore
    show('Product updated successfully', 'success')
    isEditing.value = false
  } catch (error) {
    // @ts-ignore
    show('Failed to update product', 'error')
    console.error('Error updating product:', error)
  } finally {
    saving.value = false
  }
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
  return isNaN(num) ? '0.00' : num.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>