<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="top-0 z-10">
      <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div>
            <button @click="$router.back()"
              class="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-2 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Product</span>
            </button>
            <h1 class="text-2xl font-semibold text-gray-900">
              {{ isEditMode ? 'Edit Product' : 'Add New Product' }}
            </h1>
            <p class="text-sm text-gray-500 mt-1">
              {{ isEditMode ? 'Edit Your product' : 'Create and manage your inventory' }}
            </p>
          </div>
          <div class="flex items-center gap-3">
            <button @click="resetForm"
              class="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Reset
            </button>
            <button @click="$router.push(getPath('products'))"
              class="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="space-y-6">
        <!-- Product Information Section -->
        <div class="bg-white rounded-lg border border-gray-200">
          <button @click="toggleSection('info')"
            class="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 class="text-base font-semibold text-gray-900">Product Information</h2>
            </div>
            <svg class="w-5 h-5 text-gray-400 transition-transform" :class="{ 'rotate-180': sections.info }" fill="none"
              stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div v-show="sections.info" class="px-6 pb-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Product Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Product Name <span class="text-red-500">*</span>
                </label>
                <input v-model="form.name"
                  class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  :class="{ 'border-red-500': errors.name }" placeholder="Lenovo 3rd Generation"
                  :disabled="isEditMode" />
                <p v-if="errors.name" class="text-red-600 text-xs mt-1">{{ errors.name }}</p>
              </div>

              <!-- Category -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Category <span class="text-red-500">*</span>
                </label>
                <select v-model="form.category"
                  class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  :class="{ 'border-red-500': errors.category }" :disabled="isEditMode">
                  <option value="">Select category</option>
                  <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
                <p v-if="errors.category" class="text-red-600 text-xs mt-1">
                  {{ errors.category }}
                </p>
              </div>

              <!-- Barcode -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Barcode <span class="text-red-500">*</span>
                </label>
                <div class="flex gap-2">
                  <input v-model="form.barcode"
                    class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    :class="{ 'border-red-500': errors.barcode }" placeholder="LNV-123456-789" :disabled="isEditMode" />
                  <button @click="generateBarcode"
                    class="px-4 py-2 text-sm font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    :disabled="isEditMode">
                    Generate
                  </button>
                </div>
                <p v-if="errors.barcode" class="text-red-600 text-xs mt-1">{{ errors.barcode }}</p>
              </div>

              <!-- Supplier -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Supplier <span class="text-red-500">*</span>
                </label>
                <select v-model="form.supplier"
                  class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  :class="{ 'border-red-500': errors.supplier }" :disabled="isEditMode">
                  <option value="">Select supplier</option>
                  <option v-for="s in supplierStore.suppliers" :key="s.id" :value="s.id">
                    {{ s.supplier_name }}
                  </option>
                </select>
                <p v-if="errors.supplier" class="text-red-600 text-xs mt-1">
                  {{ errors.supplier }}
                </p>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <div class="border border-gray-300 rounded-lg overflow-hidden">
                <div class="bg-gray-50 border-b border-gray-300 px-3 py-2 flex items-center gap-2">
                  <button class="p-1 hover:bg-gray-200 rounded">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <span class="text-xs text-gray-600">Normal</span>
                </div>
                <textarea v-model="form.description" rows="4"
                  class="w-full px-3 py-2 text-sm focus:ring-0 focus:outline-none border-0"
                  placeholder="Enter product description..." :disabled="isEditMode"></textarea>
              </div>
              <p class="text-xs text-gray-500 mt-1">Maximum 60 Words</p>
            </div>
          </div>
        </div>

        <!-- Pricing & Stocks Section -->
        <div class="bg-white rounded-lg border border-gray-200">
          <button @click="toggleSection('pricing')"
            class="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 class="text-base font-semibold text-gray-900">Pricing & Stocks</h2>
            </div>
            <svg class="w-5 h-5 text-gray-400 transition-transform" :class="{ 'rotate-180': sections.pricing }"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div v-show="sections.pricing" class="px-6 pb-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Quantity -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Quantity <span class="text-red-500">*</span>
                </label>
                <input v-model.number="form.quantity" type="number"
                  class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="20" :disabled="isEditMode" />
              </div>

              <!-- Cost Price -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Cost Price <span class="text-red-500">*</span>
                </label>
                <input v-model.number="form.costPrice" type="number" step="0.01"
                  class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" />
                <p v-if="errors.costPrice" class="text-red-600 text-xs mt-1">
                  {{ errors.costPrice }}
                </p>
              </div>

              <!-- Selling Price -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Selling Price <span class="text-red-500">*</span>
                </label>
                <input v-model.number="form.sellingPrice" type="number" step="0.01"
                  class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  :class="{ 'border-red-500': errors.sellingPrice }" />
                <p v-if="errors.sellingPrice" class="text-red-600 text-xs mt-1">
                  {{ errors.sellingPrice }}
                </p>
              </div>

              <!-- Min Stock Level -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Min Stock Level</label>
                <input v-model.number="form.minStock" type="number"
                  class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" />
              </div>
              <!-- Max Stock Level -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Max Stock Level</label>
                <input v-model.number="form.maxStock" type="number"
                  class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" />
              </div>

              <!-- Discount -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
                <input v-model.number="form.discount" type="number" min="0" max="100"
                  class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  :disabled="isEditMode" />
              </div>

              <!-- Date of Arrival -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Date of Arrival</label>
                <input v-model="form.arrivalDate" type="date"
                  class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" />
              </div>
            </div>

            <!-- Profit Display -->
            <div v-if="form.costPrice > 0 && form.sellingPrice > 0"
              class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">Profit Margin</p>
                  <p class="text-xs text-gray-600 mt-0.5">Based on current pricing</p>
                </div>
                <div class="text-right">
                  <p class="text-lg font-bold text-green-600">
                    ${{ (form.sellingPrice - form.costPrice).toFixed(2) }}
                  </p>
                  <p class="text-xs text-gray-600">
                    {{
                      (((form.sellingPrice - form.costPrice) / form.costPrice) * 100 || 0).toFixed(
                        1,
                      )
                    }}% margin
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Images Section -->
        <div class="bg-white rounded-lg border border-gray-200">
          <button @click="toggleSection('images')"
            class="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 class="text-base font-semibold text-gray-900">Images</h2>
            </div>
            <svg class="w-5 h-5 text-gray-400 transition-transform" :class="{ 'rotate-180': sections.images }"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div v-show="sections.images" class="px-6 pb-6">
            <ImageUploader v-model="form.image" :maxSize="5" accept="image/png, image/jpeg" :preview="true"
              :disabled="isEditMode" />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3">
          <button @click="$router.push('/product')"
            class="px-6 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button @click="submit" :disabled="loading"
            class="px-6 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            <div v-if="loading" class="loader-small"></div>
            <span v-else>{{ isEditMode ? 'Update Product' : 'Add Product' }}</span>
          </button>
        </div>

        <!-- Error Message -->
        <div v-if="submitError" class="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex gap-3">
            <svg class="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm text-red-800">{{ submitError }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/productStore'
import { useCategoryStore } from '@/stores/CategoryStore'
import { useSupplierStore } from '@/stores/SupplierStore'
import ImageUploader from './main/ImageUploader.vue'
import { useActionMessage } from '@/composable/useActionMessage'
import { useRouter, useRoute } from 'vue-router'
import { useEntrepriseStore } from '@/stores/entrepriseStore'
const productStore = useProductStore()
const { showSuccess, showError } = useActionMessage()
const categoryStore = useCategoryStore()
const supplierStore = useSupplierStore()
const router = useRouter()
const route = useRoute()
const loading = computed(() => productStore.loading)
const isEditMode = ref(false)
const entrepriseStore = useEntrepriseStore()
const sections = reactive({
  info: true,
  pricing: true,
  images: true,
})
const currentUuid = computed(() => route.params.uuid || authStore.user?.entrepriseUuid)
const getPath = (suffix) => `/${currentUuid.value}/${suffix}`
const errors = reactive({})
const submitError = ref('')
const categories = computed(() => categoryStore.categories)
console.log('====================================')
console.log(categories.value)
console.log('====================================')
const form = reactive({
  name: '',
  barcode: '',
  category: '',
  supplier: '',
  costPrice: 0,
  sellingPrice: 0,
  quantity: 0,
  minStock: 10,
  maxStock: 100,
  arrivalDate: new Date().toISOString().split('T')[0],
  image: '',
  description: '',
  discount: 0,
})

onMounted(async () => {
  await categoryStore.fetchCategory()
  supplierStore.fetchSuppliers()
})

const toggleSection = (section) => {
  sections[section] = !sections[section]
}

const generateBarcode = () => {
  if (!form.name) return
  const prefix =
    form.name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 3) || 'PRD'
  form.barcode = `${prefix}-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')}`
  delete errors.barcode
}

const validate = () => {
  Object.keys(errors).forEach((key) => delete errors[key])

  if (!form.name.trim()) errors.name = 'Product name is required'
  if (!form.barcode.trim()) errors.barcode = 'Barcode is required'
  if (!form.category) errors.category = 'Category is required'

  if (form.costPrice <= 0) errors.costPrice = 'Cost price must be greater than 0'
  if (form.sellingPrice <= 0) errors.sellingPrice = 'Selling price must be greater than 0'
  if (form.sellingPrice < form.costPrice)
    errors.sellingPrice = 'Selling price should be greater than cost price'

  return Object.keys(errors).length === 0
}

const submit = async () => {
  if (!validate()) return

  try {
    const productData = {
      Prod_name: form.name,
      quantity: parseInt(form.quantity) || 0,
      cost_price: parseFloat(form.costPrice) || 0,
      selling_price: parseFloat(form.sellingPrice) || 0,
      category_id: parseInt(form.category),
      Prod_Description: form.description,
      code_bar: form.barcode,
      date_of_arrival: form.arrivalDate,
      supplier: form.supplier ? parseInt(form.supplier) : null,
      min_stock_level: parseInt(form.minStock) || 10,
      max_stock_level: parseInt(form.maxStock) || 100,
      discount: parseFloat(form.discount) || 0,
    }

    if (form.image && form.image instanceof File) {
      productData.Prod_image = form.image
    } else if (form.image) {
      productData.Prod_image = form.image
    }

    await productStore.addProduct(productData)

    showSuccess('Product added successfully!')
    resetForm()
    router.back()
  } catch (error) {
    submitError.value =
      error?.response?.data?.message ||
      error.message ||
      'An error occurred while adding the product.'
    console.error('❌ Error adding product:', error)
    showError(error?.message || 'Failed to add product')
  }
}

const resetForm = () => {
  Object.keys(form).forEach((key) => {
    form[key] =
      key === 'arrivalDate'
        ? new Date().toISOString().split('T')[0]
        : key === 'minStock'
          ? 10
          : key === 'maxStock'
            ? 100
            : typeof form[key] === 'number'
              ? 0
              : ''
  })
  submitError.value = ''
}
</script>

<style scoped>
.loader-small {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.rotate-180 {
  transform: rotate(180deg);
}
</style>
