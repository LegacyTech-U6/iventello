<template>
  <div class="h-full max-w-8xl mx-auto flex flex-col overflow-hidden text-sm bg-gray-50/30">
    <div class="sticky px-5 top-0 z-20 shrink-0 bg-white border-b border-gray-100">
      <div class="max-w-8xl mx-auto py-3">
        <div class="flex items-center justify-between flex-wrap gap-3">
          <div class="flex-1 min-w-0 flex items-center gap-5">
            <button @click="isEditing ? cancelEdit() : goBack()"
              class="flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-all p-2 -ml-2 rounded-full hover:bg-indigo-50">
              <ChevronLeft :size="20" />
            </button>

            <div class="max-w-xs sm:max-w-md">
              <h1 class="text-base capitalize font-bold text-gray-900 truncate">
                {{ product?.Prod_name || 'Détails du produit' }}
              </h1>
              <p class="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                <span class="font-medium">SKU: {{ product?.code_bar || 'N/A' }}</span>
                <span class="text-gray-300">•</span>
                <span class="text-indigo-600 font-medium">{{ product?.category.name || 'Sans catégorie' }}</span>
              </p>
            </div>
          </div>

          <div class="flex gap-2 items-center">
            <template v-if="!isEditing">
              <validation-button text="Modifier" :loading="saving" color="primary" size="medium" :icon="Pencil" @click="handleEdit" />
            </template>
            <template v-else>
              <validation-button text="Enregistrer" :loading="saving" color="success" size="medium" :icon="Save" @click="handleSaveEdit" />
              <validation-button text="Annuler" color="default" size="medium" :icon="X" @click="cancelEdit" />
            </template>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto">
      <div class="mx-auto px-5 py-5 max-w-8xl">
        <div v-if="loading" class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Loader2 class="animate-spin mx-auto text-indigo-500 mb-4" :size="40" />
          <p class="text-gray-500 font-medium">Chargement des données...</p>
        </div>

        <div v-else-if="!product" class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <PackageX class="mx-auto text-gray-300 mb-4" :size="60" />
          <h3 class="text-lg font-bold text-gray-900 mb-2">Produit introuvable</h3>
          <button @click="goBack" class="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg flex items-center gap-2 mx-auto text-sm">
            <ArrowLeft :size="16" /> Retour à l'inventaire
          </button>
        </div>

        <div v-else class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
              <div>
                <span class="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-1">Stock Actuel</span>
                <div v-if="isEditing">
                  <input v-model.number="editForm.quantity" type="number" class="w-20 font-bold border-b border-indigo-300 focus:outline-none focus:border-indigo-600" />
                </div>
                <span v-else class="text-lg font-bold text-gray-900">{{ product.quantity }}</span>
              </div>
              <div class="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Package :size="20" /></div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
              <div>
                <span class="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-1">Alerte Stock</span>
                <div v-if="isEditing">
                  <input v-model.number="editForm.min_stock_level" type="number" class="w-20 font-bold border-b border-red-300 focus:outline-none" />
                </div>
                <span v-else class="text-lg font-bold text-red-600">{{ product.min_stock_level }}</span>
              </div>
              <div class="p-2 bg-red-50 rounded-lg text-red-600"><AlertTriangle :size="20" /></div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
              <div>
                <span class="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-1">Prix de Vente</span>
                <div v-if="isEditing">
                  <input v-model.number="editForm.selling_price" type="number" step="0.01" class="w-24 font-bold border-b border-green-300 focus:outline-none" />
                </div>
                <span v-else class="text-lg font-bold text-green-600">{{ format(product.selling_price) }}</span>
              </div>
              <div class="p-2 bg-green-50 rounded-lg text-green-600"><Tag :size="20" /></div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
              <div>
                <span class="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-1">Prix d'Achat</span>
                <div v-if="isEditing">
                  <input v-model.number="editForm.cost_price" type="number" step="0.01" class="w-24 font-bold border-b border-amber-300 focus:outline-none" />
                </div>
                <span v-else class="text-lg font-bold text-gray-900">{{ format(product.cost_price) }}</span>
              </div>
              <div class="p-2 bg-amber-50 rounded-lg text-amber-600"><TrendingDown :size="20" /></div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-1">
              <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-20">
                <div class="aspect-square rounded-xl mb-4 flex items-center justify-center overflow-hidden border border-gray-100 bg-gray-50 group">
                  <img :src="isEditing ? editForm.Prod_image : product.Prod_image" 
                       class="w-full h-full object-contain p-4 transition-transform group-hover:scale-105" />
                </div>

                <div v-if="isEditing" class="space-y-3">
                  <label class="block text-xs font-bold text-gray-500 uppercase">URL de l'image</label>
                  <div class="relative">
                    <input v-model="editForm.Prod_image" type="url" class="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="https://..." />
                    <Link :size="14" class="absolute left-2.5 top-2.5 text-gray-400" />
                  </div>
                </div>

                <div class="grid grid-cols-4 gap-2 mt-4">
                  <div class="aspect-square bg-indigo-50 rounded-lg border-2 border-indigo-500 p-1">
                    <img :src="product.Prod_image" class="w-full h-full object-cover rounded-md" />
                  </div>
                  <div v-for="i in 3" :key="i" class="aspect-square bg-gray-50 rounded-lg border border-dashed border-gray-200 flex items-center justify-center text-gray-300">
                    <Camera :size="18" />
                  </div>
                </div>
              </div>
            </div>

            <div class="lg:col-span-2 space-y-6">
              <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 class="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FileText class="text-indigo-500" :size="18" /> Information Générale
                </h2>

                <div v-if="isEditing" class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div class="space-y-1">
                    <label class="text-xs font-bold text-gray-500 uppercase">Nom du Produit</label>
                    <input v-model="editForm.Prod_name" type="text" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-xs font-bold text-gray-500 uppercase">Code Barre / SKU</label>
                    <input v-model="editForm.code_bar" type="text" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div class="sm:col-span-2 space-y-1">
                    <label class="text-xs font-bold text-gray-500 uppercase">Description</label>
                    <textarea v-model="editForm.Prod_Description" rows="4" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
                  </div>
                </div>

                <div v-else class="space-y-4">
                  <div class="grid grid-cols-3 gap-4 py-3 border-b border-gray-50">
                    <span class="text-gray-500 font-medium">Description</span>
                    <p class="col-span-2 text-gray-900 leading-relaxed">{{ product.Prod_Description }}</p>
                  </div>
                  <div class="grid grid-cols-3 gap-4 py-3 border-b border-gray-50">
                    <span class="text-gray-500 font-medium">Fournisseur</span>
                    <p class="col-span-2 text-gray-900">{{ product.supplier_name }}</p>
                  </div>
                  <div class="grid grid-cols-3 gap-4 py-3">
                    <span class="text-gray-500 font-medium">Arrivage</span>
                    <p class="col-span-2 text-gray-900">{{ formatDate(product.date_of_arrival) }}</p>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-indigo-600 rounded-xl p-5 text-white shadow-lg shadow-indigo-200">
                  <div class="flex items-center gap-3 mb-4 text-indigo-100 uppercase tracking-widest text-[10px] font-bold">
                    <PieChart :size="16" /> Valorisation du stock
                  </div>
                  <div class="space-y-4">
                    <div>
                      <span class="text-xs opacity-80 block">Valeur à l'achat</span>
                      <p class="text-xl font-bold">{{ format(total) }}</p>
                    </div>
                    <div>
                      <span class="text-xs opacity-80 block">CA Potentiel</span>
                      <p class="text-xl font-bold text-green-300">{{ format(totalSellingValue) }}</p>
                    </div>
                  </div>
                </div>

                <div class="grid grid-rows-2 gap-4">
                  <button @click="handleRestock" class="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-indigo-500 hover:shadow-sm transition-all group">
                    <div class="flex items-center gap-3">
                      <span class="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Truck :size="18" />
                      </span>
                      <span class="font-bold text-gray-700 text-xs">Réapprovisionner</span>
                    </div>
                    <ChevronRight :size="16" class="text-gray-300" />
                  </button>

                  <button class="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-indigo-500 hover:shadow-sm transition-all group">
                    <div class="flex items-center gap-3">
                      <span class="p-2 bg-gray-50 text-gray-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <QrCode :size="18" />
                      </span>
                      <span class="font-bold text-gray-700 text-xs">Imprimer Étiquettes</span>
                    </div>
                    <ChevronRight :size="16" class="text-gray-300" />
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
import { 
  ChevronLeft, ChevronRight, Pencil, Save, X, Loader2, Package, 
  PackageX, AlertTriangle, Tag, TrendingDown, Camera, Link, 
  FileText, PieChart, Truck, QrCode, ArrowLeft 
} from 'lucide-vue-next'
import { getOneProduct as fetchProductById } from '@/service/api'
import { useActionMessage } from '@/composable/useActionMessage'
import { useCurrency } from '@/composable/useCurrency'
import { useGlobalModal } from '@/composable/useValidation'
import ValidationButton from '@/components/ui/buttons/ValidationButton.vue'

const { format } = useCurrency()
const router = useRouter()
const route = useRoute()
const { show } = useGlobalModal()
const { showSuccess, showError } = useActionMessage()

// Interfaces
interface Category { id: string | number; name: string }
interface Product {
  id?: string | number
  Prod_name: string
  quantity: number
  cost_price: number
  selling_price: number
  category: Category
  Prod_Description: string
  code_bar: string | number
  date_of_arrival: string
  supplier_name: string
  Prod_image?: string
  min_stock_level: number
}

// State
const product = ref<Product | null>(null)
const loading = ref(true)
const isEditing = ref(false)
const saving = ref(false)
const editForm = ref<Product>({} as Product)

// Computed
const total = computed(() => (product.value?.quantity || 0) * (product.value?.cost_price || 0))
const totalSellingValue = computed(() => (product.value?.quantity || 0) * (product.value?.selling_price || 0))

// Logic
onMounted(async () => {
  const id = route.params.id as string
  if (!id) return loading.value = false

  try {
    const response = await fetchProductById(id)
    const data = response?.data?.[0] || response?.data || response
    
    if (data) {
      product.value = {
        ...data,
        quantity: parseInt(data.quantity) || 0,
        cost_price: parseFloat(data.cost_price) || 0,
        selling_price: parseFloat(data.selling_price) || 0,
        min_stock_level: parseInt(data.min_stock_level) || 0,
        Prod_image: data.Prod_image || `https://picsum.photos/400/400?random=${data.id}`,
        Prod_Description: data.Prod_Description || 'Aucune description disponible.'
      }
    }
  } catch (error) {
    show('Erreur lors de la récupération', 'error')
  } finally {
    loading.value = false
  }
})

const goBack = () => router.back()
const formatDate = (date: string) => date ? new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'

const handleEdit = () => {
  if (product.value) {
    editForm.value = JSON.parse(JSON.stringify(product.value))
    isEditing.value = true
  }
}

const cancelEdit = () => isEditing.value = false

const handleSaveEdit = async () => {
  try {
    saving.value = true
    await new Promise(resolve => setTimeout(resolve, 800)) // Simu API
    product.value = JSON.parse(JSON.stringify(editForm.value))
    showSuccess('Produit mis à jour')
    isEditing.value = false
  } catch (error) {
    showError('Erreur de mise à jour')
  } finally {
    saving.value = false
  }
}

const handleRestock = () => {
  router.push({ name: 'restock', params: { reStockId: product.value?.id }})
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>