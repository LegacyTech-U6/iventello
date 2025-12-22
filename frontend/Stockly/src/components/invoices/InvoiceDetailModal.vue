<template>
  <div style="" class="w-full">
    <div
      class="fixed z-50 bg-black bg-opacity-50 flex justify-center items-start overflow-auto"
      style="
        background-color: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(4px);
        inset: 0px;
        margin-bottom: -1px;
      "
    >
      <div class="flex absolute justify-between w-full p-4" style="z-index: 701">
        <button
          @click="$emit('close')"
          class="text-gray-500 bg-gray-400 p-4 hover:text-gray-700 hover:bg-gray-100 rounded-2xl transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div class="flex items-center gap-2">
          <button
            @click="printInvoice"
            class="bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Print
          </button>
          <button
            @click="downloadPDF"
            class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            PDF
          </button>
        </div>
      </div>

      <div ref="invoiceContent" class="bg-white rounded shadow-xl max-w-3xl w-full h-screen pb-10 relative m-4">
        <!-- Header -->

        <!-- Invoice Content -->
        <div class="p-8">
          <!-- Classic Invoice Design -->
          <div class="border-b-2 border-black pb-6 mb-4">
            <div class="flex justify-between items-end">
              <div>
                <h1 class="text-3xl font-bold text-black">INVOICE</h1>
                <div class="text-sm text-gray-600">
                  <CompanyInfo :entreprise="entreprise" />
                </div>
              </div>
              <div class="text-right">
                <div class="mb-2">
                  <span class="font-semibold text-gray-700">Invoice #:</span>
                  <span class="ml-2 font-bold text-black">{{ invoice.id }}</span>
                </div>
                <div class="mb-2">
                  <span class="font-semibold text-gray-700">Date:</span>
                  <span class="ml-2 text-black">{{ formatDate(invoice.createdAt) }}</span>
                </div>
                <div>
                  <span class="font-semibold text-gray-700">Due Date:</span>
                  <span class="ml-2 text-black">{{ formatDate(invoice.date_echeance) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Bill To -->
          <div class="mb-6">
            <h3 class="font-bold text-black text-lg mb-3 border-b border-gray-300 pb-2">BILL TO</h3>
            <div class="text-sm">
              <div class="font-semibold text-black">
                {{ invoice.client.client_name || 'Client Name' }}
              </div>
              <div class="text-gray-600">
                {{ invoice.client.client_adresse || 'Address not specified' }}
              </div>
              <div class="text-gray-600" v-if="invoice.client.email">
                Email: {{ invoice.client.email }}
              </div>
              <div class="text-gray-600" v-if="invoice.client.client_telephone">
                Phone: {{ invoice.client.telephone }}
              </div>
            </div>
          </div>

          <!-- Items Table -->
          <div class="mb-2">
            <table class="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr class="bg-gray-100">
                  <th class="border border-gray-300 px-3 py-2 text-left font-bold">#</th>
                  <th class="border border-gray-300 px-3 py-2 text-left font-bold">Description</th>
                  <th class="border border-gray-300 px-3 py-2 text-center font-bold">Qty</th>
                  <th class="border border-gray-300 px-3 py-2 text-right font-bold">Unit Price</th>
                  <th class="border border-gray-300 px-3 py-2 text-right font-bold">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in invoice.items" :key="item.id">
                  <td class="border border-gray-300 px-3 py-2 text-center">{{ index + 1 }}</td>
                  <td class="border border-gray-300 px-3 py-2">
                    <div class="font-medium">{{ item.product.Prod_name }}</div>
                    <div class="text-xs text-gray-600" v-if="item.description">
                      {{ item.description }}
                    </div>
                  </td>
                  <td class="border border-gray-300 px-3 py-2 text-center">{{ item.quantity }}</td>
                  <td class="border border-gray-300 px-3 py-2 text-right font-mono">
                    {{ format(item.unit_price) }}
                  </td>
                  <td class="border border-gray-300 px-3 py-2 text-right font-mono font-semibold">
                    {{ format(item.total_item) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Summary -->
          <div class="flex justify-end">
            <div class="w-72 border border-gray-300 text-sm">
              <div class="flex justify-between px-3 py-2 border-b border-gray-300">
                <span class="font-semibold">Subtotal:</span>
                <span class="font-mono">{{ format(invoice.total_hors_reduction) }}</span>
              </div>
              <!-- <div v-if="invoice.reduction > 0" class="flex justify-between px-3 py-2 border-b border-gray-300">
              <span class="font-semibold">Discount ({{ invoice.reduction }}%):</span>
              <span class="font-mono text-red-600">- {{ formatPrice(calculateDiscount()) }}</span>
            </div>
            <div class="flex justify-between px-3 py-2 border-b border-gray-300">
              <span class="font-semibold">Tax ({{ invoice.tva }}%):</span>
              <span class="font-mono">{{ formatPrice(calculateTax()) }}</span>
            </div> -->
              <div class="flex justify-between px-3 py-2 bg-gray-100 font-bold">
                <span>TOTAL:</span>
                <span class="font-mono">{{ format(invoice.total) }}</span>
              </div>
            </div>
          </div>

          <!-- Status and Payment Info -->
          <div class="mt-3 border-t border-gray-300">
            <div class="grid grid-cols-2 gap-6 text-sm">
              <div>
                <h4 class="font-bold text-black mb-2">STATUS</h4>
                <span
                  :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                    invoice.status === 'payée'
                      ? 'bg-green-100 text-green-800'
                      : invoice.status === 'en_attente'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800',
                  ]"
                >
                  {{ formatStatus(invoice.status) }}
                </span>
              </div>
              <div>
                <h4 class="font-bold text-black mb-2">PAYMENT METHOD</h4>
                <p class="text-gray-600">{{ invoice.mode_paiement || 'Not specified' }}</p>
              </div>
            </div>
            <!-- Notes Section -->
            <div v-if="invoice.notes" class="mt-4">
              <h4 class="font-bold text-black mb-2">NOTES</h4>
              <p class="text-gray-600 text-sm">{{ invoice.notes }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useInvoiceStore } from '@/stores/FactureStore'
import CompanyInfo from './CompanyInfo.vue'
import { usePdfStore } from '@/stores/pdfStore'
import { useCurrency } from '@/composable/useCurrency'
const pdfStore = usePdfStore() 
const {format} = useCurrency()
const invoiceContent = ref(null)
const invoiceStore = useInvoiceStore()

// const invoice = ref({
//       id: '',
//       date_of_creation: '',
//       date_echeance: '',
//       client_name: '',
//       client_adresse: '',
//       client_email: '',
//       client_telephone: '',
//       items: [],
//       reduction: 0,
//       tva: 0,
//       total: 0,
//       total_hors_reduction: 0,
//       mode_paiement: '',
//       status: '',
//       notes: null

// })

const props = defineProps({
  invoice: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  entreprise: {
    type: Object,
    required: true,
    default: () => ({}),
  },
})

// ✅ Calculs basés sur la structure réelle des données
function calculateDiscount() {
  const subtotal = props.invoice.value.total_hors_reduction || 0
  return (subtotal * (invoice.value.reduction || 0)) / 100
}

function calculateTax() {
  const subtotal = props.invoice.value.total_hors_reduction || 0
  const discount = calculateDiscount()
  return ((subtotal - discount) * (props.invoice.value.tva || 0)) / 100
}



defineEmits(['close'])

function calculateSubtotal() {
  return invoice.value.items.reduce((sum, item) => sum + item.selling_price * item.quantity, 0)
}

function formatDate(date) {
  if (!date) return 'N/A'
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return 'N/A'
  }
}

function formatStatus(status) {
  const statusMap = {
    payée: 'Paid',
    en_attente: 'Pending',
    overdue: 'Overdue',
  }
  return statusMap[status] || status
}

function printInvoice() {
  const printContent = invoiceContent.value.innerHTML
  const originalContent = document.body.innerHTML

  // Remplace tout le body temporairement par le contenu de la facture
  document.body.innerHTML = printContent
  downloadPDF()
  // Lance l’impression
  window.print()

  // Restaure le contenu original
  document.body.innerHTML = originalContent

  
}


// Fonction de téléchargement du PDF
async function downloadPDF() {
  try {
    await pdfStore.downloadInvoicePdf(props.invoice, props.entreprise)
  } catch (err) {
    console.error('PDF download failed:', err)
  }
}
  // try {
  //   await invoiceStore.createInvoice(invoice.value)
  // } catch (error) {
  //   console.error('Error downloading PDF:', error)
  // }
</script>

<style scoped>
@media print {
  .fixed {
    position: static !important;
  }
  .bg-black {
    background: white !important;
  }
  .shadow-xl {
    box-shadow: none !important;
  }
  .m-4 {
    margin: 0 !important;
  }
  button {
    display: none !important;
  }
}
</style>
