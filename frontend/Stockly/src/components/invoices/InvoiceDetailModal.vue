<template>
  <Teleport to="body">
    <div class="absolute inset-0 w-full h-full z-50 backdrop-blur-sm overflow-y-auto flex justify-center py-10"
      style="background-color: rgba(0, 0, 0, 0.85);">

      <div class="absolute top-4 left-0 w-full px-6 flex justify-between items-start z-[60] pointer-events-none">
        <button @click="$emit('close')"
          class="pointer-events-auto bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors shadow-lg">
          <XMarkIcon class="h-6 w-6" />
        </button>

        <div class="pointer-events-auto flex items-center gap-2 backdrop-blur-md p-2 rounded-lg border shadow-xl"
          style="background-color: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.2);">
          <button @click="printInvoice"
            class="bg-white text-gray-800 px-4 py-2 rounded-md font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors text-sm">
            <PrinterIcon class="h-4 w-4" />
            Print
          </button>
          <button @click="downloadPDF" :disabled="isActionLoading"
            class="text-white px-4 py-2 rounded-md font-bold flex items-center justify-center gap-2 transition-colors text-sm shadow-lg min-w-[80px]"
            style="background-color: #059669;">
            <n-spin v-if="isActionLoading" size="small" stroke="white" />
            <ArrowDownTrayIcon v-if="!isActionLoading" class="h-4 w-4" />
            <span>{{ isActionLoading ? '...' : 'PDF' }}</span>
          </button>
        </div>
      </div>

      <div id="invoice-card" ref="invoiceContent"
        class="relative bg-white shadow-2xl rounded-sm p-8 max-w-[210mm] w-full min-h-[297mm] pdf-container mt-8"
        style="background-color: #ffffff; color: #111827;">

        <div class="border-b-2 pb-6 mb-8" style="border-color: #1f2937;">
          <div class="flex justify-between items-start">
            <div>
              <h1 class="text-4xl font-extrabold tracking-wide uppercase" style="color: #111827;">Invoice</h1>
              <div class="mt-4 text-sm" style="color: #4b5563;">
                <CompanyInfo :entreprise="entreprise" />
              </div>
            </div>
            <div class="text-right">
              <div class="p-4 rounded-lg border" style="background-color: #f9fafb; border-color: #f3f4f6;">
                <div class="mb-2">
                  <span class="text-xs uppercase font-bold tracking-wider" style="color: #6b7280;">Invoice #</span>
                  <div class="font-bold text-xl" style="color: #111827;">{{ invoice.id }}</div>
                </div>
                <div class="mb-1 text-sm">
                  <span class="font-medium" style="color: #6b7280;">Date:</span>
                  <span class="ml-2 font-mono" style="color: #111827;">{{ formatDate(invoice.createdAt) }}</span>
                </div>
                <div class="text-sm">
                  <span class="font-medium" style="color: #6b7280;">Due Date:</span>
                  <span class="ml-2 font-mono" style="color: #111827;">{{ formatDate(invoice.date_echeance) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-8 grid grid-cols-2 gap-8">
          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider mb-2" style="color: #9ca3af;">Billed To</h3>
            <div class="font-bold text-lg" style="color: #111827;">
              {{ invoice.client.client_name || 'Client Name' }}
            </div>
            <div class="text-sm mt-1 leading-relaxed" style="color: #4b5563;">
              {{ invoice.client.client_adresse || 'Address not specified' }}<br>
              <span v-if="invoice.client.email">{{ invoice.client.email }}</span><br>
              <span v-if="invoice.client.client_telephone">{{ invoice.client.telephone }}</span>
            </div>
          </div>
        </div>

        <div class="mb-8">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-y" style="background-color: #f9fafb; border-color: #e5e7eb;">
                <th class="py-3 pl-4 text-left font-semibold uppercase text-xs tracking-wider" style="color: #4b5563;">#
                </th>
                <th class="py-3 text-left font-semibold uppercase text-xs tracking-wider w-1/2" style="color: #4b5563;">
                  Description</th>
                <th class="py-3 text-center font-semibold uppercase text-xs tracking-wider" style="color: #4b5563;">Qty
                </th>
                <th class="py-3 text-right font-semibold uppercase text-xs tracking-wider" style="color: #4b5563;">Price
                </th>
                <th class="py-3 pr-4 text-right font-semibold uppercase text-xs tracking-wider" style="color: #4b5563;">
                  Total</th>
              </tr>
            </thead>
            <tbody class="divide-y" style="border-color: #f3f4f6;">
              <tr v-for="(item, index) in invoice.items" :key="item.id">
                <td class="py-4 pl-4" style="color: #6b7280;">{{ index + 1 }}</td>
                <td class="py-4">
                  <div class="font-bold" style="color: #111827;">{{ item.product.Prod_name }}</div>
                  <div class="text-xs mt-0.5" style="color: #6b7280;" v-if="item.description">
                    {{ item.description }}
                  </div>
                </td>
                <td class="py-4 text-center font-mono" style="color: #374151;">{{ item.quantity }}</td>
                <td class="py-4 text-right font-mono" style="color: #374151;" :style="getDynamicStyle(item.unit_price)">
                  {{ format(item.unit_price) }}</td>
                <td class="py-4 pr-4 text-right font-mono font-bold" style="color: #111827;"
                  :style="getDynamicStyle(item.total_item)">
                  {{ format(item.total_item) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex flex-col md:flex-row justify-between gap-8 border-t-2 pt-8" style="border-color: #f3f4f6;">

          <div class="md:w-1/2 space-y-6">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <h4 class="text-xs font-bold uppercase tracking-wider mb-1" style="color: #9ca3af;">Status</h4>

                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                  :style="getStatusStyle(invoice.status)">
                  {{ formatStatus(invoice.status) }}
                </span>
              </div>
              <div>
                <h4 class="text-xs font-bold uppercase tracking-wider mb-1" style="color: #9ca3af;">Payment Method</h4>
                <p class="text-sm font-medium" style="color: #111827;">{{ invoice.mode_paiement || 'Not specified' }}
                </p>
              </div>
            </div>

            <div v-if="invoice.notes">
              <h4 class="text-xs font-bold uppercase tracking-wider mb-2" style="color: #9ca3af;">Notes</h4>
              <p class="text-sm italic p-3 rounded border"
                style="background-color: #f9fafb; border-color: #f3f4f6; color: #4b5563;">
                {{ invoice.notes }}
              </p>
            </div>
          </div>

          <div class="md:w-5/12">
            <div class="space-y-3">
              <div class="flex justify-between text-sm" style="color: #4b5563;">
                <span>Subtotal</span>
                <span class="font-mono font-medium" style="color: #111827;"
                  :style="getDynamicStyle(invoice.total_hors_reduction)">{{ format(invoice.total_hors_reduction)
                  }}</span>
              </div>
              <div class="border-t pt-3 mt-3 flex justify-between items-center" style="border-color: #e5e7eb;">
                <span class="text-base font-bold" style="color: #111827;">Total Due</span>
                <span class="text-xl font-bold font-mono" style="color: #059669;"
                  :style="getDynamicStyle(invoice.total)">{{ format(invoice.total) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-12 pt-6 border-t text-center text-xs" style="border-color: #f3f4f6; color: #9ca3af;">
          <p>Thank you for your business.</p>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { NSpin } from 'naive-ui'
import { XMarkIcon, PrinterIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/outline'
import { useInvoiceStore } from '@/stores/FactureStore'
import CompanyInfo from './CompanyInfo.vue'
import { useCurrency } from '@/composable/useCurrency'
import { exportToPDF } from '@/utils/invoicePdfTemplate'

const { format, getDynamicStyle } = useCurrency()
const invoiceContent = ref(null)
const invoiceStore = useInvoiceStore()
const isActionLoading = ref(false)

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

// Fonction pour retourner les couleurs HEX selon le statut
function getStatusStyle(status) {
  if (status === 'payée') {
    // Emerald palette
    return {
      backgroundColor: '#ecfdf5',
      color: '#047857',
      borderColor: '#a7f3d0'
    }
  } else if (status === 'en_attente') {
    // Amber palette
    return {
      backgroundColor: '#fffbeb',
      color: '#b45309',
      borderColor: '#fde68a'
    }
  } else {
    // Red palette (default/overdue)
    return {
      backgroundColor: '#fef2f2',
      color: '#b91c1c',
      borderColor: '#fecaca'
    }
  }
}

function printInvoice() {
  const printElement = invoiceContent.value
  if (!printElement) return

  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  document.body.appendChild(iframe)

  const doc = iframe.contentWindow.document
  // On récupère les styles du head mais on ajoute une règle pour forcer l'impression des couleurs
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
  isActionLoading.value = true
  try {
    const elementId = 'invoice-card';
    const fileName = `Invoice_${props.invoice.id || 'export'}.pdf`;
    await exportToPDF(elementId, fileName);
  } catch (error) {
    console.error('Erreur lors de l\'export PDF:', error);
  } finally {
    isActionLoading.value = false
  }
}
</script>

<style scoped>
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

.pdf-container {
  font-family: 'Inter', 'Arial', sans-serif;
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  /* On force le blanc et le noir en hexadécimal ici aussi par sécurité */
  background-color: #ffffff !important;
  color: #111827 !important;
}
</style>