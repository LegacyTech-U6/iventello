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
                <span class="font-semibold" :style="getDynamicStyle(subtotal)">{{ format(subtotal) }}</span>
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
                <span class="font-semibold" :style="getDynamicStyle(taxAmount)">{{ format(taxAmount) }}</span>
              </div>

              <div class="border-t border-gray-200 pt-3 mt-3">
                <div class="flex justify-between items-center text-gray-900">
                  <span class="text-base font-semibold">Total</span>
                  <span class="text-2xl font-semibold" :style="getDynamicStyle(total)">{{ format(total) }}</span>
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
                    <span class="font-semibold" :style="getDynamicStyle(subtotal)">{{ format(subtotal) }}</span>
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
                    <span class="font-semibold" :style="getDynamicStyle(taxAmount)">{{ format(taxAmount) }}</span>
                  </div>

                  <div class="border-t border-gray-200 pt-3 mt-3">
                    <div class="flex justify-between items-center text-gray-900">
                      <span class="text-base font-semibold">Total</span>
                      <span class="text-2xl font-semibold" :style="getDynamicStyle(total)">{{ format(total) }}</span>
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
    <ClientModals :client-loading="clientLoading" :client-store="clientStore"
      :close-create-client-modal="closeCreateClientModal" :new-client-form="newClientForm"
      :show-create-client-modal="showCreateClientModal" :submit-create-client="submitCreateClient" />

    <CreateInvoiceForm v-if="showInvoiceModal" :invoice="modalInvoice" @close="showInvoiceModal = false" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { ShoppingBagIcon } from '@heroicons/vue/24/outline'
import ClientSelector from '@/components/sales/ClientSelector.vue'
import ProductSelector from '@/components/sales/ProductSelector.vue'
import CartItem from '@/components/sales/CartItem.vue'
import { useProductStore } from '@/stores/productStore'
import { useInvoiceStore } from '@/stores/FactureStore'
import CreateInvoiceForm from '@/components/invoices/CreateInvoiceForm.vue'
import { useRouter } from 'vue-router'
import { useClientStore } from '@/stores/clientStore'
import { useCurrency } from '@/composable/useCurrency'
import ClientModals from '@/views/ClientModals.vue'

const productLoading = ref(false)
const { format, getDynamicStyle } = useCurrency()
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
  saleItems.value.reduce((sum, item) => {
    const itemTotal = item.selling_price * item.quantity;
    // item.discount is now the calculated AMOUNT from CartItem
    const discountAmount = item.discount || 0
    return sum + (itemTotal - discountAmount);
  }, 0),
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
  // Calculate initial discount AMOUNT if product has a default percentage discount
  const initialDiscountAmount = product.discount
    ? (product.selling_price * 1 * (product.discount / 100))
    : 0;

  const existing = saleItems.value.find((item) => item.id === product.id)
  if (existing) existing.quantity++
  else saleItems.value.push({ ...product, quantity: 1, discount: initialDiscountAmount })

  localStorage.setItem('salesItem', JSON.stringify(existing))

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
