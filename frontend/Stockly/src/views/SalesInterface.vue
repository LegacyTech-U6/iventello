<template>
  <div class="h-full bg-gray-50 flex flex-col">
    <!-- Navbar Mobile -->
    <div class="lg:hidden bg-white border-b border-gray-200 p-4 sticky top-0 z-20 shrink-0">
      <div class="flex justify-between items-center">
        <h1 class="font-bold text-lg text-gray-800">{{ $t('sales.title') }}</h1>
        <n-button strong secondary circle type="primary" @click="showCartModal = true">
          <template #icon>
            <n-icon>
              <ShoppingBagIcon />
            </n-icon>
          </template>
        </n-button>
        <div v-if="saleItems.length > 0"
          class="absolute top-3 right-3 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center pointer-events-none">
          {{ saleItems.length }}
        </div>
      </div>
    </div>

    <div class="p-4 flex-1 min-h-0">
      <n-grid x-gap="24" y-gap="24" :cols="12" item-responsive responsive="screen" class="h-full">
        <!-- Section Produit -->
        <n-gi span="12 m:8" class="h-full">
          <n-card :bordered="false" class="h-full shadow-sm rounded-xl"
            content-style="height: 100%; display: flex; flex-direction: column;">
            <div class="flex justify-between items-center mb-4 shrink-0">
              <h2 class="text-xl font-bold text-gray-800">{{ $t('sales.section_products') }}</h2>
              <n-button class="lg:hidden" size="small" @click="showProductModal = true">
                {{ $t('sales.browse_all') }}
              </n-button>
            </div>

            <div class="hidden lg:block flex-1 min-h-0">
              <ProductSelector :products="products" @add-to-sale="addToSale" :loading="productLoading" />
            </div>

            <div class="lg:hidden text-gray-500 text-center py-8 shrink-0">
              {{ $t('sales.mobile_instruction') }}
            </div>
          </n-card>
        </n-gi>

        <!-- Section Cart & Payment -->
        <n-gi span="12 m:4">
          <div class="space-y-4">
            <!-- Client Selector -->
            <n-card :bordered="false" size="small" class="shadow-sm rounded-xl">
              <ClientSelector @select-client="handleClientSelect" />
            </n-card>

            <!-- Cart Items -->
            <n-card :bordered="false" class="shadow-sm rounded-xl" content-style="padding: 0;">
              <div class="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 class="font-bold text-gray-800">{{ $t('sales.current_order') }}</h3>
                <n-tag type="primary" round size="small">{{ saleItems.length }} Items</n-tag>
              </div>

              <div class="max-h-[300px] overflow-y-auto p-4 space-y-3">
                <div v-if="saleItems.length === 0" class="flex flex-col items-center justify-center py-8 text-gray-400">
                  <n-icon size="48" class="mb-2">
                    <ShoppingBagIcon />
                  </n-icon>
                  <p>{{ $t('sales.empty_cart') }}</p>
                </div>
                <CartItem v-else v-for="item in saleItems" :key="item.id" :item="item" @update-item="updateItem"
                  @remove-item="removeItem" />
              </div>
            </n-card>

            <!-- Payment Summary -->
            <n-card :bordered="false" class="shadow-sm rounded-xl">
              <template #header>
                <div class="font-bold text-gray-800">{{ $t('sales.payment_summary') }}</div>
              </template>

              <div class="space-y-4">
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-600">{{ $t('sales.subtotal') }}</span>
                  <span class="font-semibold text-gray-800">{{ format(subtotal) }}</span>
                </div>

                <!-- Discount Control -->
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">{{ $t('sales.discount') }} (%)</span>
                  <n-input-number v-model:value="discountPercent" size="small" :min="0" :max="100" class="w-24">
                    <template #suffix>%</template>
                  </n-input-number>
                </div>

                <!-- Tax Control -->
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-gray-600">{{ $t('sales.tax') }} ({{ taxRate }}%)</span>
                    <n-switch v-model:value="enableTax" size="small" />
                  </div>
                  <span class="font-medium text-gray-800">{{ format(taxAmount) }}</span>
                </div>

                <n-divider class="my-3" />

                <div class="flex justify-between items-center mb-6">
                  <span class="text-lg font-bold text-gray-900">{{ $t('sales.total') }}</span>
                  <span class="text-2xl font-black text-primary" :style="getDynamicStyle(total)">{{ format(total)
                  }}</span>
                </div>

                <n-button type="primary" block size="large" @click="createInvoice"
                  :disabled="saleItems.length === 0 || !selectedClient" :loading="processing">
                  {{ $t('sales.complete_payment') }}
                </n-button>
              </div>
            </n-card>
          </div>
        </n-gi>
      </n-grid>

      <!-- Modals for Mobile -->
      <n-modal v-model:show="showProductModal" preset="card" :title="$t('sales.modals.select_products')"
        class="w-full h-full lg:hidden" :bordered="false">
        <ProductSelector :products="products" @add-to-sale="addToSale" :loading="productLoading" />
      </n-modal>

      <n-modal v-model:show="showCartModal" preset="card" :title="$t('sales.modals.cart')"
        class="w-full h-full lg:hidden" :bordered="false">
        <div class="flex flex-col h-full">
          <div class="flex-1 overflow-y-auto p-2">
            <ClientSelector @select-client="handleClientSelect" class="mb-4" />
            <CartItem v-for="item in saleItems" :key="item.id" :item="item" @update-item="updateItem"
              @remove-item="removeItem" />
          </div>
          <div class="p-4 border-t bg-gray-50">
            <div class="flex justify-between mb-4">
              <span class="font-bold">{{ $t('sales.total') }}</span>
              <span class="font-bold text-primary">{{ format(total) }}</span>
            </div>
            <n-button type="primary" block @click="createInvoice" :disabled="saleItems.length === 0 || !selectedClient">
              {{ $t('sales.checkout') }}
            </n-button>
          </div>
        </div>
      </n-modal>

      <!-- Sub-Components Modals -->
      <ClientModals :client-loading="clientLoading" :client-store="clientStore"
        :close-create-client-modal="closeCreateClientModal" :new-client-form="newClientForm"
        :show-create-client-modal="showCreateClientModal" :submit-create-client="submitCreateClient" />

      <CreateInvoiceForm v-if="showInvoiceModal" :invoice="modalInvoice" @close="showInvoiceModal = false" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { ShoppingBagIcon } from '@heroicons/vue/24/outline'
import {
  NGrid, NGi, NCard, NButton, NIcon, NInputNumber, NSwitch, NDivider, NTag, NModal
} from 'naive-ui'
import ClientSelector from '@/components/sales/ClientSelector.vue'
import ProductSelector from '@/components/sales/ProductSelector.vue'
import CartItem from '@/components/sales/CartItem.vue'
import { useProductStore } from '@/stores/productStore'
import { useInvoiceStore } from '@/stores/FactureStore'
import CreateInvoiceForm from '@/components/invoices/CreateInvoiceForm.vue'
import { useClientStore } from '@/stores/clientStore'
import { useCurrency } from '@/composable/useCurrency'
import ClientModals from '@/views/ClientModals.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()


const { format, getDynamicStyle } = useCurrency()
const clientStore = useClientStore()
const productStore = useProductStore()
const invoiceStore = useInvoiceStore()

// State
const products = ref([])
const productLoading = ref(false)
const selectedClient = ref(null)
const saleItems = ref([])
const discountPercent = ref(0) // Now explicitly Percentage
const enableTax = ref(true)    // Optional Tax Toggle
const taxRate = ref(19.25)     // Default VAT Rate
const showInvoiceModal = ref(false)
const modalInvoice = ref(null)
const invoice = ref(null)      // Added missing ref
const showProductModal = ref(false)
const showCartModal = ref(false)
const processing = ref(false)

// Logic
const subtotal = computed(() => {
  return saleItems.value.reduce((sum, item) => {
    // item.discount is absolute amount from CartItem logic
    const itemTotal = (item.selling_price * item.quantity) - (item.discount || 0);
    return sum + itemTotal;
  }, 0);
});

// Calculate tax amount based on subtotal (after item discounts)
const taxAmount = computed(() => {
  if (!enableTax.value) return 0;
  // Apply tax on the subtotal *after* global discount? 
  // Usually Tax is on the final price.
  // Final Price = Subtotal - GlobalDiscount.
  // Tax = (Subtotal - GlobalDiscount) * Rate / 100 ??
  // OR Tax is on Subtotal, and Discount reduces Tax?

  // Let's assume Discount is pre-tax reduction (Commercial discount).
  const discountedBase = subtotal.value - (subtotal.value * discountPercent.value / 100);
  return discountedBase * (taxRate.value / 100);
});

const total = computed(() => {
  const discountAmount = subtotal.value * (discountPercent.value / 100);
  return subtotal.value - discountAmount + taxAmount.value;
});

// Load Data
onMounted(async () => {
  productLoading.value = true;
  await productStore.fetchProducts();
  products.value = productStore.products;
  productLoading.value = false;
});

// Cart Actions
function addToSale(product) {
  // item.discount calc remains: calculated as amount if product has defined % discount
  const initialDiscountAmount = product.discount
    ? (product.selling_price * (product.discount / 100))
    : 0;

  const existing = saleItems.value.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity++;
  } else {
    saleItems.value.push({
      ...product,
      quantity: 1,
      discount: initialDiscountAmount // store unit discount amount
    });
  }
  showProductModal.value = false;
}

function updateItem(updatedItem) {
  const index = saleItems.value.findIndex((i) => i.id === updatedItem.id);
  if (index !== -1) saleItems.value[index] = updatedItem;
}

function removeItem(id) {
  saleItems.value = saleItems.value.filter((i) => i.id !== id);
}

// Invoice Creation
async function createInvoice() {
  if (!selectedClient.value) return;
  processing.value = true;

  try {
    const globalDiscountAmount = subtotal.value * (discountPercent.value / 100);

    // Payload to Backend matches InvoiceController expectation
    const data = {
      client_id: selectedClient.value.id,
      items: saleItems.value.map(item => ({
        id: item.id,
        quantity: item.quantity,
        selling_price: item.selling_price,
        discount: item.discount * item.quantity, // Send total discount for this line item? 
        // Backend InvoiceItem expects 'discount'. Model says 'defaultValue 0'.
        // InvoiceController createInvoice uses `item.discount || 0` in InvoiceItem.create.
        // It assumes `item.discount` is Total or Unit?
        // InvoiceItem virtual total uses `q * u * ... - d`. So `d` is total discount for line?
        // Let's assume backend expects TOTAL discount for the line item or UNIT?
        // Let's check backend `InvoiceItem` virtual logic again. 
        // `return (q * u * (1 + t / 100)) - d`. Here `d` is subtracted once. So `d` is TOTAL discount for the line.
        // `CartItem` usually manages unit discount. `item.discount` in `addToSale` was `selling_price * %`. That's UNIT discount.
        // So we should send `item.discount * item.quantity`.

        // Wait, if I change `item.discount` here, I must ensure backend receives what it expects.
        // I will calculate lineDiscount = item.discount * item.quantity (if item.discount is unit).
      })),

      // Global Invoice Fields
      discount: globalDiscountAmount, // Send Amount
      tax: taxAmount.value,           // Send Amount
      reduction_type: 'amount',       // Since we calculated it
    };

    // However, I need to pass the FULL item object because Backend loop uses `selling_price` from item?
    // Backend: `const sale = await Sales.create... item.selling_price`.
    // I should pass the full items but ensuring `discount` property is set correctly.
    // Actually, let's keep `saleItems.value` but update the discount property to be total line discount if that's what backend model implies.
    // InvoiceItem model: `(q * u ...) - d`. Yes `d` is absolute value subtracted from total.

    // Let's Map items to ensure correctness
    const payloadItems = saleItems.value.map(item => ({
      ...item,
      discount: (item.discount || 0) * item.quantity // Convert Unit Discount to Total Line Discount for Model
    }));

    const payload = {
      client_id: selectedClient.value.id,
      items: payloadItems,
      discount: globalDiscountAmount,
      tax: taxAmount.value,
      taxRate: taxRate.value,
      reduction_type: 'amount',
      date: new Date(),
      date: new Date(),
      date_echeance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Default 30 days
    };

    console.log('Opening Invoice Modal with payload:', payload);

    // For local modal simulation (legacy behavior in component)
    invoice.value = payload;
    modalInvoice.value = { ...payload, client: selectedClient.value }; // Add client obj for display
    showInvoiceModal.value = true;
    showCartModal.value = false;

    // Clear cart?
    // saleItems.value = [];
    // discountPercent.value = 0;
  } catch (err) {
    console.error(err);
  } finally {
    processing.value = false;
  }
}

// Client Management (Legacy)
const showCreateClientModal = ref(false)
const newClientForm = ref({})
const clientLoading = ref(false)

function handleClientSelect(client) {
  if (client?.action === 'add-new-client') {
    showCreateClientModal.value = true;
  } else {
    selectedClient.value = client;
  }
}

function closeCreateClientModal() { showCreateClientModal.value = false; }
async function submitCreateClient() {
  await clientStore.addClient(newClientForm.value);
  showCreateClientModal.value = false;
}
</script>

<style scoped>
/* Scoped overrides if needed */
</style>
