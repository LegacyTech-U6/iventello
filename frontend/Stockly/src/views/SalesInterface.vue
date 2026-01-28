<!-- 
  SalesInterface.vue
  ===================
  Interface de point de vente (POS)
  - Permet créer une nouvelle vente/facture
  - Sélection du client
  - Ajout de produits au panier
  - Calcul du total et paiement
  - Gestion du panier (mobile et desktop)
-->
<template>
  <div class="sales-interface h-full bg-gray-50">
    <!-- En-tête -->
    <div class="bg-white lg:hidden border-b border-gray-200">
      <div class="p-4 lg:p-6">
        <div class="flex justify-between items-start">
          <div class="flex gap-2">
            <!-- Bouton panier (mobile only) -->
            <button @click="showCartModal = true"
              class="lg:hidden relative bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors">
              <span>Cart</span>
              <!-- Badge avec le nombre d'articles -->
              <span v-if="saleItems.length > 0"
                class="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-medium">
                {{ saleItems.length }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="p-4">
      <div class="lg:grid grid-cols-12 gap-6">
        <!-- Section gauche: Sélection client et produits -->
        <div class="lg:col-span-8 space-y-4">
          <!-- Sélecteur de client -->

          <!-- Section produits -->
          <div class="bg-white border border-gray-200 rounded-lg p-4 lg:p-5">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-semibold text-gray-900">Products</h2>
              <!-- Bouton parcourir tous les produits (mobile) -->
              <button @click="showProductModal = true"
                class="lg:hidden bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                Browse All
              </button>
            </div>

            <!-- Affichage desktop: liste des produits visible -->
            <div class="hidden lg:block">
              <ProductSelector :products="products" @add-to-sale="addToSale" :loading="productLoading" />
            </div>

            <!-- Affichage mobile: info sur le nombre de produits -->
            <div class="lg:hidden text-sm text-gray-600">
              {{ products.length }} products available
            </div>
          </div>
        </div>

        <!-- Right Section: Cart & Summary (Desktop only) -->
        <div class="hidden lg:block lg:col-span-4 space-y-4">
          <ClientSelector @select-client="handleClientSelect" />
          <!-- Cart -->
          <div class="bg-white border border-gray-200 rounded-lg p-4 lg:p-5">
            <div class="flex justify-between items-center mb-4">
              <h2 class="font-semibold text-gray-900">Cart Items</h2>
              <span class="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-sm font-medium">
                {{ saleItems.length }}
              </span>
            </div>

            <div v-if="saleItems.length <= 0" class="flex flex-col justify-center items-center py-12 text-gray-400">
              <ShoppingBagIcon class="w-16 h-16 mb-3 text-gray-300" />
              <p class="text-sm">No items added yet</p>
            </div>

            <div v-else class="space-y-3 max-h-96 overflow-y-auto">
              <div class="flex justify-between items-center pb-3 border-b border-gray-200 mb-2">
                <span class="text-sm font-medium text-gray-500">Item</span>
                <span class="text-sm font-medium text-gray-500">QTY</span>
                <span class="text-sm font-medium text-gray-500">Cost</span>
              </div>
              <CartItem v-for="item in saleItems" :key="item.id" :item="item" @update-item="updateItem"
                @remove-item="removeItem" />
            </div>
          </div>

          <!-- Summary -->
          <div class="bg-white border border-gray-200 rounded-lg p-4 lg:p-5">
            <h3 class="font-semibold text-gray-900 mb-4">payent Summary</h3>
            <!-- Discount Banner -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div class="flex items-start gap-2">
                <div
                  class="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span class="text-xs font-bold">%</span>
                </div>
                <div>
                  <h4 class="font-semibold text-blue-900 text-sm">Discount {{ discount }}%</h4>

                </div>
              </div>
            </div>

            <div class="space-y-3">
              <div class="flex justify-between items-center text-gray-700">
                <span class="text-sm">Shipping</span>
                <span class="font-semibold">{{ format(subtotal) }}</span>
              </div>

              <div class="flex justify-between items-center text-gray-700">
                <span class="text-sm">Discount</span>
                <div class="flex items-center gap-2">
                  <input type="number" v-model.number="discount" min="0" max="100"
                    class="w-16 border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-gray-900" />
                  <span class="text-sm">%</span>
                </div>
              </div>

              <div class="flex justify-between items-center text-gray-700">
                <span class="text-sm">Tax ({{ taxRate }}%)</span>
                <span class="font-semibold">{{ format(taxAmount) }}</span>
              </div>

              <div class="border-t border-gray-200 pt-3 mt-3">
                <div class="flex justify-between items-center text-gray-900">
                  <span class="text-base font-semibold">Total</span>
                  <span class="text-2xl font-semibold">{{ format(total) }}</span>
                </div>
              </div>

              <button @click="createInvoice" :disabled="saleItems.length === 0 || !selectedClient"
                class="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg mt-4 transition-colors">
                Create Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile: Product Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showProductModal" class="lg:hidden fixed inset-0 bg-white z-50 overflow-y-auto">
          <div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <h2 class="text-lg font-semibold text-gray-900">Select Products</h2>
            <button @click="showProductModal = false" class="text-gray-600 text-2xl hover:text-gray-900">
              &times;
            </button>
          </div>
          <div class="p-1">
            <ProductSelector :products="products" @add-to-sale="addToSale" :loading="productLoading" />
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Mobile: Cart Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showCartModal" class="lg:hidden fixed inset-0 bg-white z-50 overflow-y-auto">
          <div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <h2 class="text-lg font-semibold text-gray-900">Shopping Cart</h2>
            <button @click="showCartModal = false" class="text-gray-600 text-2xl hover:text-gray-900">
              &times;
            </button>
          </div>
          <div class="p-4 space-y-4">
            <!-- Cart Items -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-3">Cart Items ({{ saleItems.length }})</h3>

              <div v-if="saleItems.length <= 0" class="flex flex-col justify-center items-center py-12 text-gray-400">
                <ShoppingBagIcon class="w-16 h-16 mb-3 text-gray-300" />
                <p class="text-sm">No items added yet</p>
              </div>

              <div v-else class="space-y-3">
                <ClientSelector @select-client="handleClientSelect" />
                <CartItem v-for="item in saleItems" :key="item.id" :item="item" @update-item="updateItem"
                  @remove-item="removeItem" />
              </div>
            </div>

            <!-- Summary -->
            <div class="bg-white border border-gray-200 rounded-lg p-5">
              <!-- Discount Banner -->
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div class="flex items-start gap-2">
                  <div
                    class="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span class="text-xs font-bold">%</span>
                  </div>
                  <div>
                    <h4 class="font-semibold text-blue-900 text-sm">Discount {{ discount }}%</h4>

                  </div>
                </div>
              </div>

              <!-- Payment Summary Header -->

              <!-- Summary -->
              <div class="bg-white border border-gray-200 rounded-lg p-4 lg:p-5">
                <h3 class="font-semibold text-gray-900 mb-4">payent Summary</h3>

                <div class="space-y-3">
                  <div class="flex justify-between items-center text-gray-700">
                    <span class="text-sm">Shipping</span>
                    <span class="font-semibold">{{ format(subtotal) }}</span>
                  </div>

                  <div class="flex justify-between items-center text-gray-700">
                    <span class="text-sm">Discount</span>
                    <div class="flex items-center gap-2">
                      <input type="number" v-model.number="discount" min="0" max="100"
                        class="w-16 border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-gray-900" />
                      <span class="text-sm">%</span>
                    </div>
                  </div>

                  <div class="flex justify-between items-center text-gray-700">
                    <span class="text-sm">Tax ({{ taxRate }}%)</span>
                    <input type="text" v-model="taxRate" />
                    <span class="font-semibold">{{ format(taxAmount) }}</span>
                  </div>

                  <div class="border-t border-gray-200 pt-3 mt-3">
                    <div class="flex justify-between items-center text-gray-900">
                      <span class="text-base font-semibold">Total</span>
                      <span class="text-2xl font-semibold">{{ format(total) }}</span>
                    </div>
                  </div>

                  <button @click="createInvoice" :disabled="saleItems.length === 0 || !selectedClient"
                    class="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg mt-4 transition-colors">
                    Create Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>


    <!-- Create Client Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showCreateClientModal"
          class="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4"
          @click.self="closeCreateClientModal">
          <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <!-- Modal Header -->
            <div class="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 class="text-2xl font-bold text-gray-900">Create</h2>
              <button @click="closeCreateClientModal"
                class="text-white bg-red-500 hover:bg-red-600 rounded-full w-8 h-8 flex items-center justify-center transition-colors">
                &times;
              </button>
            </div>

            <!-- Modal Body -->
            <form @submit.prevent="submitCreateClient" class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Customer Name -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name <span class="text-red-500">*</span>
                  </label>
                  <input v-model="newClientForm.client_name" type="text" required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter customer name" />
                </div>

                <!-- Phone -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Phone <span class="text-red-500">*</span>
                  </label>
                  <input v-model="newClientForm.client_PhoneNumber" type="tel" required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter phone number" />
                </div>

                <!-- Email -->
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1"> Email </label>
                  <input v-model="newClientForm.email" type="email"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email address" />
                </div>

                <!-- Address -->
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1"> Address </label>
                  <input v-model="newClientForm.location" type="text"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter address" />
                </div>

                <!-- City -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"> City </label>
                  <input v-model="newClientForm.city" type="text"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter city" />
                </div>

                <!-- Country -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"> Country </label>
                  <input v-model="newClientForm.country" type="text"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter country" />
                </div>
              </div>

              <!-- Error Message -->
              <!-- Error Message -->
              <div v-if="clientStore.submitError" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-sm text-red-700">{{ clientStore.submitError }}</p>
              </div>

              <!-- Modal Footer -->
              <div class="flex justify-end gap-3 mt-6">
                <button type="button" @click="closeCreateClientModal"
                  class="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium">
                  Cancel
                </button>
                <button type="submit" :disabled="clientLoading"
                  class="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed transition-colors font-medium">
                  {{ clientLoading ? 'Creating...' : 'Submit' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <CreateInvoiceForm v-if="showInvoiceModal" :invoice="modalInvoice" @close="showInvoiceModal = false" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ShoppingBagIcon } from '@heroicons/vue/24/outline'
import ClientSelector from '@/components/ClientSelector.vue'
import ProductSelector from '@/components/ProductSelector.vue'
import CartItem from '@/components/CartItem.vue'
import { useProductStore } from '@/stores/productStore'
import { useInvoiceStore } from '@/stores/FactureStore'
import CreateInvoiceForm from '@/components/invoices/CreateInvoiceForm.vue'
import { useRouter } from 'vue-router'
import { useClientStore } from '@/stores/clientStore'
import { useCurrency } from '@/composable/useCurrency'
const productLoading = ref(false) 
const { format } = useCurrency()
const clientStore = useClientStore()
const router = useRouter()
const productStore = useProductStore()
const invoiceStore = useInvoiceStore()
const showInvoiceModal = ref(false)
const modalInvoice = ref(null)

function openInvoice(invoice, client) {
  modalInvoice.value = { ...invoice, client }
  showInvoiceModal.value = true
}
const products = ref([])
const selectedClient = ref(null)
const saleItems = ref([])
const discount = ref(0)
const taxRate = ref(10)
const showInvoiceForm = ref(false)
const invoice = ref(null)
const showCreateClientModal = ref(false)
// Mobile modals
const showProductModal = ref(false)
const showCartModal = ref(false)
// New Client Form
const newClientForm = ref({
  client_name: '',
  client_PhoneNumber: '',
  email: '',
  location: '',
  city: '',
  country: '',
  client_Signature: '',
  image: '',
})
const clientLoading = ref(false)
const clientError = ref(null)
// Computed values
const subtotal = computed(() =>
  saleItems.value.reduce((sum, item) => sum + item.selling_price * item.quantity, 0),
)
async function submitCreateClient() {
  try {
    await clientStore.addClient(newClientForm.value)
    // Close modal after successful creation
    showCreateClientModal.value = false
    // Optional: reset selected client if you want
    selectedClient.value = clientStore.clients.at(-1) // select newly added client
  } catch (error) {
    console.error('Error creating client:', error)
  }
}

const taxAmount = computed(() => parseFloat(((subtotal.value * taxRate.value) / 100).toFixed(2)))

const total = computed(() =>
  parseFloat(
    (subtotal.value - (subtotal.value * discount.value) / 100 + taxAmount.value).toFixed(2),
  ),
)

function handleClientSelect(client) {
  if (client && client.action === 'add-new-client') {
    showCreateClientModal.value = true
  } else {
    selectedClient.value = client
  }
}
function closeCreateClientModal() {
  showCreateClientModal.value = false
  // Reset form and errors
  newClientForm.value = {
    client_name: '',
    client_PhoneNumber: '',
    email: '',
    location: '',
    city: '',
    country: '',
    client_Signature: '',
    image: '',
  }
  clientError.value = null
}

function addToSale(product) {
  const existing = saleItems.value.find((item) => item.id === product.id)
  if (existing) existing.quantity++
  else saleItems.value.push({ ...product, quantity: 1 })

  // Close product modal on mobile after adding
  showProductModal.value = false
}

function updateItem(updatedItem) {
  const index = saleItems.value.findIndex((i) => i.id === updatedItem.id)
  if (index !== -1) {
    saleItems.value[index] = updatedItem
  }
}

function removeItem(id) {
  saleItems.value = saleItems.value.filter((i) => i.id !== id)
}

async function createInvoice() {
  const data = {
    client_id: selectedClient.value.id,
    items: saleItems.value,
    reduction: discount.value,
    tva: taxRate.value,
  }

  invoice.value = data

  modalInvoice.value = { ...invoice.value, client_id: data.client_id }
  showInvoiceModal.value = true
  // Close cart modal on mobile
  showCartModal.value = false
}

onMounted(async () => {
  productLoading.value = true
  await productStore.fetchProducts()
  productLoading.value = false
  products.value = productStore.products
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: transform 0.3s ease;
}

.modal-enter-from {
  transform: translateY(100%);
}

.modal-leave-to {
  transform: translateY(100%);
}
</style>
