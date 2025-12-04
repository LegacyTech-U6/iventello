<template>
  <div
    class="h-full max-w-8xl mx-auto bg-white flex flex-col overflow-hidden shadow-lg border-l border-r border-gray-100">
    <div class="border-b border-gray-200 bg-white sticky px-5 top-0 z-20 shrink-0">
      <div class="max-w-8xl mx-auto  py-4">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div class="flex-1 min-w-0 flex items-center gap-4">
            <button @click="isEditing ? cancelEdit() : goBack()"
              class="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-all group p-2 -ml-2 rounded-full hover:bg-indigo-50/50">
              <span class="material-icons w-5 h-5 transition-transform group-hover:-translate-x-0.5">chevron_left</span>
            </button>

            <div class="max-w-xs sm:max-w-md md:max-w-xl lg:max-w-3xl">
              <h1 class="text-3xl capitalize font-extrabold text-gray-900 truncate">
                {{ product?.Prod_name || 'Product Details' }}
              </h1>
              <p class="text-sm text-gray-500 mt-1 flex items-center gap-2">
                <span class="font-medium">SKU: {{ product?.code_bar || 'N/A' }}</span>
                <span class="text-gray-300">•</span>
                <span class="text-indigo-600 font-medium">{{ product?.category.name || 'No Category' }}</span>
              </p>
            </div>
          </div>

          <div class="flex gap-3">
            <validation-button v-if="!isEditing" text="Edit Product" :loading="saving" :disabled="saving"
              color="primary" size="medium" :icon="EditIcon" @click="handleEdit" />

            <validation-button v-else text="Save Changes" :loading="saving" :disabled="saving" color="success"
              size="medium" :icon="SaveIcon" @click="handleSaveEdit" />

            <validation-button v-if="isEditing" text="Cancel" color="default" size="medium" :icon="CancelIcon"
              @click="cancelEdit" />

          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto bg-gray-50">
      <div class="mx-auto px-6 py-8">
        <div v-if="loading" class="bg-white rounded-xl shadow-lg p-12">
          <div class="flex flex-col items-center justify-center">
            <span class="material-icons w-12 h-12 text-indigo-400 animate-spin mb-4">refresh</span>
            <p class="text-gray-500 font-medium">Loading product details...</p>
          </div>
        </div>

        <div v-else-if="!product" class="bg-white rounded-xl shadow-lg p-12">
          <div class="text-center">
            <div class="w-20 h-20 bg-indigo-50 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span class="material-icons w-10 h-10 text-indigo-600">inventory_2</span>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h3>
            <p class="text-gray-500 mb-6">The product ID seems invalid or the data is unavailable.</p>
            <button @click="goBack"
              class="px-6 py-3 bg-gray-800 text-white font-medium rounded-xl hover:bg-gray-700 transition-all shadow-md inline-flex items-center gap-2">
              <span class="material-icons w-4 h-4">arrow_back</span>
              Go Back to Products
            </button>
          </div>
        </div>

        <div v-else class="space-y-6">

          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">

            <div class="bg-white rounded-xl shadow-md border border-gray-100 p-5 flex items-center justify-between">
              <div>
                <span class="text-sm font-medium text-gray-500 block mb-1">Stock Quantity</span>
                <div v-if="isEditing">
                  <input v-model.number="editForm.quantity" type="number" min="0"
                    class="w-full text-xl font-bold px-2 py-1 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-right" />
                </div>
                <span v-else class="text-3xl font-extrabold text-gray-900">{{ product.quantity }}</span>
              </div>
              <span class="material-icons w-8 h-8 text-indigo-500">inventory_2</span>
            </div>

            <div class="bg-white rounded-xl shadow-md border border-gray-100 p-5 flex items-center justify-between">
              <div>
                <span class="text-sm font-medium text-gray-500 block mb-1">Min. Stock Level</span>
                <div v-if="isEditing">
                  <input v-model.number="editForm.min_stock_level" type="number" min="0"
                    class="w-full text-xl font-bold px-2 py-1 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-right" />
                </div>
                <span v-else class="text-3xl font-extrabold text-red-600">{{ product.min_stock_level }}</span>
              </div>
              <span class="material-icons w-8 h-8 text-red-500">warning</span>
            </div>

            <div class="bg-white rounded-xl shadow-md border border-gray-100 p-5 flex items-center justify-between">
              <div>
                <span class="text-sm font-medium text-gray-500 block mb-1">Selling Price</span>
                <div v-if="isEditing">
                  <input v-model.number="editForm.selling_price" type="number" min="0" step="0.01"
                    class="w-full text-xl font-bold px-2 py-1 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-right" />
                </div>
                <span v-else class="text-3xl font-extrabold text-green-600">{{ format(product.selling_price) }}</span>
              </div>
              <span class="material-icons w-8 h-8 text-green-500">sell</span>
            </div>

            <div class="bg-white rounded-xl shadow-md border border-gray-100 p-5 flex items-center justify-between">
              <div>
                <span class="text-sm font-medium text-gray-500 block mb-1">Cost Price</span>
                <div v-if="isEditing">
                  <input v-model.number="editForm.cost_price" type="number" min="0" step="0.01"
                    class="w-full text-xl font-bold px-2 py-1 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-right" />
                </div>
                <p v-else class="text-3xl font-extrabold text-gray-900">{{ format(product.cost_price) }}</p>
              </div>
              <span class="material-icons w-8 h-8 text-yellow-500">trending_down</span>
            </div>
          </div>

          <!-- Image + QR + Quick Actions + General Info + Financial Snapshot -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div class="lg:col-span-1 space-y-4"> <!-- gap réduit -->
              <div class="bg-white rounded-xl shadow-md border border-gray-100 p-3 sticky top-16">
                <!-- padding réduit et top plus petit -->
                <div
                  class="aspect-square rounded-lg mb-3 flex items-center justify-center overflow-hidden group border border-gray-200 bg-gray-50">
                  <!-- margin-bottom réduit -->
                  <div v-if="editForm.Prod_image || product.Prod_image" class="relative w-full h-full">
                    <img :src="isEditing ? editForm.Prod_image : product.Prod_image" :alt="product.Prod_name"
                      class="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105" />
                    <!-- padding réduit -->
                  </div>
                  <div v-else class="text-center p-4"> <!-- padding réduit -->
                    <span class="material-icons w-12 h-12 text-gray-300 mx-auto mb-2">image_not_supported</span>
                    <p class="text-xs text-gray-400">No image available</p>
                  </div>
                </div>

                <div v-if="isEditing" class="mb-3"> <!-- margin-bottom réduit -->
                  <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input v-model="editForm.Prod_image" type="url"
                    class="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="https://example.com/image.jpg" /> <!-- padding réduit -->
                </div>

                <div class="flex gap-2 border-t border-gray-100 pt-3"> <!-- padding-top réduit -->
                  <div
                    class="w-1/4 aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-indigo-500 p-1">
                    <img :src="editForm.Prod_image || product.Prod_image" alt="Thumbnail"
                      class="w-full h-full object-cover rounded-md" v-if="editForm.Prod_image || product.Prod_image" />
                    <span v-else class="text-xs text-gray-500">Main</span>
                  </div>
                  <div v-for="i in 3" :key="i"
                    class="w-1/4 aspect-square bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 hover:border-indigo-300 transition-all">
                    <span class="material-icons w-4 h-4 text-gray-400">photo_camera</span> <!-- taille icône réduite -->
                  </div>
                </div>
              </div>


            </div>

            <div class="lg:col-span-2 space-y-6">

              <div class="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <h2 class="text-xl font-bold text-gray-900 mb-5 border-b border-gray-100 pb-3 flex items-center gap-2">
                  <span class="material-icons w-6 h-6 text-indigo-500">list_alt</span>
                  General Information
                </h2>

                <div v-if="isEditing" class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input v-model="editForm.Prod_name" type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g. Samsung Galaxy S23" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">SKU / Barcode</label>
                    <input v-model="editForm.code_bar" type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Category ID (Temp)</label>
                    <input v-model="editForm.category.id" type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Should be a select field in production" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Supplier Name</label>
                    <input v-model="editForm.supplier_name" type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                  <div class="col-span-1 sm:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea v-model="editForm.Prod_Description" rows="4"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                      placeholder="Enter a detailed description of the product..."></textarea>
                  </div>
                </div>

                <div v-else class="divide-y divide-gray-100">
                  <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt class="text-sm font-medium text-gray-500">Description</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {{ product.Prod_Description || 'No detailed description provided.' }}
                    </dd>
                  </div>
                  <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt class="text-sm font-medium text-gray-500">Category</dt>
                    <dd class="mt-1 text-sm text-indigo-600 font-semibold sm:col-span-2 sm:mt-0">
                      {{ product.category.name }}
                    </dd>
                  </div>
                  <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt class="text-sm font-medium text-gray-500">Supplier</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {{ product.supplier_name || 'N/A' }}
                    </dd>
                  </div>
                  <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt class="text-sm font-medium text-gray-500">Date Arrived</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {{ formatDate(product.date_of_arrival) }}
                    </dd>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <h2 class="text-xl font-bold text-gray-900 mb-5 border-b border-gray-100 pb-3 flex items-center gap-2">
                  <span class="material-icons w-6 h-6 text-indigo-500">pie_chart</span>
                  Financial Snapshot
                </h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <dt class="text-sm font-medium text-gray-500 mb-1">Total Stock Value (Cost)</dt>
                    <dd class="text-xl font-bold text-gray-900">{{ format(total) }}</dd>
                  </div>
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <dt class="text-sm font-medium text-gray-500 mb-1">Potential Revenue (Sell)</dt>
                    <dd class="text-xl font-bold text-green-700">{{ format(totalSellingValue) }}</dd>
                  </div>
                </div>
              </div>
              <div class="flex space-x-5">
                <div class="p-6 bg-white rounded-xl shadow-md border border-gray-100">
                  <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span class="material-icons w-5 h-5 text-indigo-500">qr_code</span>
                    QR / Barcode Management
                  </h2>
                  <button
                    class="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 font-medium">
                    <span class="material-icons w-5 h-5">add</span>
                    Add New Barcode
                  </button>
                </div>

                <div class="p-6 bg-white rounded-xl shadow-md border border-gray-100 space-y-3">
                  <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span class="material-icons w-5 h-5 text-indigo-500">bolt</span>
                    Quick Actions
                  </h2>
                  <button @click="handleRestock"
                    class="w-full  py-2 px-4 bg-indigo-50 border border-indigo-300 text-indigo-700 font-medium rounded-lg hover:bg-indigo-100 transition-all flex items-center justify-center gap-2 text-sm">
                    <span class="material-icons w-4 h-4">local_shipping</span>
                    Perform Restock
                  </button>
                </div>
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
// Remplacez les chemins d'accès API et composables par vos chemins réels
import { getOneProduct as fetchProductById } from '@/service/api'
import { useActionMessage } from '@/composable/useActionMessage'
import { useCurrency } from '@/composable/useCurrency'
import EditIcon from '@/components/icons/EditIcon.vue'
import SaveIcon from '@/components/icons/SaveIcon.vue'
import CancelIcon from '@/components/icons/CancelIcon.vue'
const { format } = useCurrency()
import ValidationButton from '@/components/ui/buttons/ValidationButton.vue'






import { useGlobalModal } from '@/composable/useValidation' // Assurez-vous que ce composable existe
import { Icon } from 'lucide-vue-next'
const { show } = useGlobalModal()
const { showSuccess, showError } = useActionMessage() // Assurez-vous que ce composable existe

interface Category {
  id: string | number
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
  min_stock_level?: number | string
  max_stock_level?: number | string
}

const router = useRouter()
const route = useRoute()
const total = computed(() => {
  if (!product || !product.value) return 0
  const qty = typeof product.value.quantity === 'string'
    ? parseInt(product.value.quantity)
    : (product.value.quantity || 0)
  const cost = parseFloat(product.value.cost_price?.toString() || '0')
  return qty * cost
})
const product = ref<Product | null>(null)
const loading = ref(true)
const isEditing = ref(false)
const saving = ref(false)

const editForm = ref<Product>({
  id: '',
  Prod_name: '',
  quantity: 0,
  cost_price: 0,
  selling_price: 0,
  category: { id: '', name: '' },
  Prod_Description: '',
  code_bar: '',
  date_of_arrival: '',
  supplier_name: '',
  Prod_image: '',
  min_stock_level: 0,
  max_stock_level: 0
})


onMounted(async () => {
  if (route.params.id) {
    try {
      loading.value = true
      // NOTE: J'ai conservé votre logique de chargement et de simulation de données manquantes
      const response = await fetchProductById(route.params.id)

      let fetchedProduct: Product | null = null;

      if (response && response.data) {
        fetchedProduct = Array.isArray(response.data) ? response.data[0] : response.data;
      } else if (Array.isArray(response)) {
        fetchedProduct = response[0];
      } else if (response) {
        fetchedProduct = response as Product;
      }

      if (fetchedProduct) {
        // Nettoyage/Standardisation des données (important pour les inputs number)
        fetchedProduct.quantity = fetchedProduct.quantity ? parseInt(fetchedProduct.quantity.toString()) : 0;
        fetchedProduct.cost_price = fetchedProduct.cost_price ? parseFloat(fetchedProduct.cost_price.toString()) : 0;
        fetchedProduct.selling_price = fetchedProduct.selling_price ? parseFloat(fetchedProduct.selling_price.toString()) : 0;
        fetchedProduct.min_stock_level = fetchedProduct.min_stock_level ? parseInt(fetchedProduct.min_stock_level.toString()) : 0;

        // Simulation/Placeholder pour l'UI
        if (!fetchedProduct.Prod_image) {
          fetchedProduct.Prod_image = "https://picsum.photos/400/400?random=" + fetchedProduct.id;
        }
        if (!fetchedProduct.Prod_Description) {
          fetchedProduct.Prod_Description = "This is a detailed description of the product, including its features, benefits, and specifications.";
        }
        if (!fetchedProduct.category) {
          fetchedProduct.category = { id: 1, name: 'General' };
        }
        if (!fetchedProduct.date_of_arrival) {
          fetchedProduct.date_of_arrival = new Date().toISOString(); // Simuler une date d'arrivée
        }
        if (!fetchedProduct.supplier_name) {
          fetchedProduct.supplier_name = 'Unspecified Supplier';
        }

        product.value = fetchedProduct;
      } else {
        // @ts-ignore
        show('Product not found', 'error')
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

  // Populate edit form with current product data, ensuring correct types for inputs
  editForm.value = {
    ...product.value,
    quantity:
      typeof product.value.quantity === 'string'
        ? parseInt(product.value.quantity)
        : product.value.quantity || 0,
    cost_price:
      typeof product.value.cost_price === 'string'
        ? parseFloat(product.value.cost_price)
        : product.value.cost_price || 0,
    selling_price:
      typeof product.value.selling_price === 'string'
        ? parseFloat(product.value.selling_price)
        : product.value.selling_price || 0,
    min_stock_level: product.value.min_stock_level || 0,
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

    // Simuler un appel API réussi
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Ici vous appelleriez votre update API

    // Update local product data
    product.value = { ...editForm.value }

    // @ts-ignore
    showSuccess('Product updated successfully')
    isEditing.value = false
  } catch (error) {
    // @ts-ignore
    showError('Failed to update product')
    console.error('Error updating product:', error)
  } finally {
    saving.value = false
  }
}

const handleRestock = () => {
  if (!product.value) return console.error('❌ No product loaded')

  // Redirection simulée (ajustez le nom de la route si nécessaire)
  router.push({
    name: 'restock',
    params: { reStockId: product.value.id },
  })
}


</script>