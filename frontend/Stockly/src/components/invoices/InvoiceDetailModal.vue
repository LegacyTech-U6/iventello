<template>
  <Teleport to="body">
    <div
      class="absolute inset-0 w-full h-full z-50 bg-black/85 backdrop-blur-sm overflow-y-auto flex justify-center py-10">

      <div class="absolute top-4 left-0 w-full px-6 flex justify-between items-start z-[60] pointer-events-none">
        <button @click="$emit('close')"
          class="pointer-events-auto bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors shadow-lg">
          <XMarkIcon class="h-6 w-6" />
        </button>

        <div
          class="pointer-events-auto flex items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-lg border border-white/20 shadow-xl">
          <button @click="printInvoice"
            class="bg-white text-gray-800 px-4 py-2 rounded-md font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors text-sm">
            <PrinterIcon class="h-4 w-4" />
            Print
          </button>
          <button @click="downloadPDF"
            class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-bold flex items-center gap-2 transition-colors text-sm shadow-lg">
            <ArrowDownTrayIcon class="h-4 w-4" />
            PDF
          </button>
        </div>
      </div>

      <div id="invoice-card" ref="invoiceContent"
        class="relative bg-white shadow-2xl rounded-sm p-8 max-w-[210mm] w-full min-h-[297mm] pdf-container mt-8">

        <div class="border-b-2 border-gray-800 pb-6 mb-8">
          <div class="flex justify-between items-start">
            <div>
              <h1 class="text-4xl font-extrabold text-gray-900 tracking-wide uppercase">Invoice</h1>
              <div class="mt-4 text-sm text-gray-600">
                <CompanyInfo :entreprise="entreprise" />
              </div>
            </div>
            <div class="text-right">
              <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div class="mb-2">
                  <span class="text-gray-500 text-xs uppercase font-bold tracking-wider">Invoice #</span>
                  <div class="font-bold text-xl text-gray-900">{{ invoice.id }}</div>
                </div>
                <div class="mb-1 text-sm">
                  <span class="text-gray-500 font-medium">Date:</span>
                  <span class="ml-2 font-mono text-gray-900">{{ formatDate(invoice.createdAt) }}</span>
                </div>
                <div class="text-sm">
                  <span class="text-gray-500 font-medium">Due Date:</span>
                  <span class="ml-2 font-mono text-gray-900">{{ formatDate(invoice.date_echeance) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-8 grid grid-cols-2 gap-8">
          <div>
            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</h3>
            <div class="text-gray-900 font-bold text-lg">
              {{ invoice.client.client_name || 'Client Name' }}
            </div>
            <div class="text-gray-600 text-sm mt-1 leading-relaxed">
              {{ invoice.client.client_adresse || 'Address not specified' }}<br>
              <span v-if="invoice.client.email">{{ invoice.client.email }}</span><br>
              <span v-if="invoice.client.client_telephone">{{ invoice.client.telephone }}</span>
            </div>
          </div>
        </div>

        <div class="mb-8">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-50 border-y border-gray-200">
                <th class="py-3 pl-4 text-left font-semibold text-gray-600 uppercase text-xs tracking-wider">#</th>
                <th class="py-3 text-left font-semibold text-gray-600 uppercase text-xs tracking-wider w-1/2">
                  Description</th>
                <th class="py-3 text-center font-semibold text-gray-600 uppercase text-xs tracking-wider">Qty</th>
                <th class="py-3 text-right font-semibold text-gray-600 uppercase text-xs tracking-wider">Price</th>
                <th class="py-3 pr-4 text-right font-semibold text-gray-600 uppercase text-xs tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(item, index) in invoice.items" :key="item.id">
                <td class="py-4 pl-4 text-gray-500">{{ index + 1 }}</td>
                <td class="py-4">
                  <div class="font-bold text-gray-900">{{ item.product.Prod_name }}</div>
                  <div class="text-xs text-gray-500 mt-0.5" v-if="item.description">
                    {{ item.description }}
                  </div>
                </td>
                <td class="py-4 text-center font-mono text-gray-700">{{ item.quantity }}</td>
                <td class="py-4 text-right font-mono text-gray-700">{{ format(item.unit_price) }}</td>
                <td class="py-4 pr-4 text-right font-mono font-bold text-gray-900">
                  {{ format(item.total_item) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex flex-col md:flex-row justify-between gap-8 border-t-2 border-gray-100 pt-8">

          <div class="md:w-1/2 space-y-6">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</h4>
                <span :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                  invoice.status === 'payée' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    invoice.status === 'en_attente' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-red-50 text-red-700 border-red-200'
                ]">
                  {{ formatStatus(invoice.status) }}
                </span>
              </div>
              <div>
                <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Payment Method</h4>
                <p class="text-sm text-gray-900 font-medium">{{ invoice.mode_paiement || 'Not specified' }}</p>
              </div>
            </div>

            <div v-if="invoice.notes">
              <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Notes</h4>
              <p class="text-sm text-gray-600 italic bg-gray-50 p-3 rounded border border-gray-100">
                {{ invoice.notes }}
              </p>
            </div>
          </div>

          <div class="md:w-5/12">
            <div class="space-y-3">
              <div class="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span class="font-mono font-medium text-gray-900">{{ format(invoice.total_hors_reduction) }}</span>
              </div>
              <div class="border-t border-gray-200 pt-3 mt-3 flex justify-between items-center">
                <span class="text-base font-bold text-gray-900">Total Due</span>
                <span class="text-xl font-bold text-emerald-600 font-mono">{{ format(invoice.total) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-12 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
          <p>Thank you for your business.</p>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { XMarkIcon, PrinterIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/outline'
import { useInvoiceStore } from '@/stores/FactureStore'
import CompanyInfo from './CompanyInfo.vue'
import { useCurrency } from '@/composable/useCurrency'
import { exportToPDF } from '@/utils/invoicePdfTemplate'

const { format } = useCurrency()
const invoiceContent = ref(null)
const invoiceStore = useInvoiceStore()

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

defineEmits(['close'])

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
  const printElement = invoiceContent.value
  if (!printElement) return

  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  document.body.appendChild(iframe)

  const doc = iframe.contentWindow.document
  const headContent = document.head.innerHTML

  doc.open()
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice #${props.invoice.id}</title>
        ${headContent}
        <style>
           body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        </style>
      </head>
      <body>
        ${printElement.innerHTML}
      </body>
    </html>
  `)
  doc.close()

  setTimeout(() => {
    iframe.contentWindow.focus()
    iframe.contentWindow.print()
    document.body.removeChild(iframe)
  }, 500)
}

async function downloadPDF() {
  try {
    const elementId = 'invoice-card';
    const fileName = `Invoice_${props.invoice.id || 'export'}.pdf`;
    await exportToPDF(elementId, fileName);
  } catch (error) {
    console.error('Erreur lors de l\'export PDF:', error);
  }
}
</script>

<style scoped>
/* Pour l'impression native */
@media print {

  .fixed,
  .absolute {
    position: static !important;
  }

  .bg-black\/85 {
    background: white !important;
  }

  .shadow-2xl {
    box-shadow: none !important;
  }

  button {
    display: none !important;
  }
}

/* Styles pour le rendu PDF/A4 */
.pdf-container {
  font-family: 'Inter', 'Arial', sans-serif;
  color: #111827 !important;
  /* gray-900 */
  background-color: #fff !important;
  width: 210mm;
  /* Largeur A4 */
  min-height: 297mm;
  /* Hauteur A4 minimum */
  margin: 0 auto;
}
</style>