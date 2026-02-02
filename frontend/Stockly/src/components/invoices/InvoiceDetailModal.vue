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

          <button v-if="invoice.status !== 'payee'" @click="markAsPaid" :disabled="isActionLoading"
            class="bg-blue-600 text-white px-4 py-2 rounded-md font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors text-sm shadow-md">
            <CheckCircleIcon class="h-4 w-4" />
            <span>Mark as Paid</span>
          </button>

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

        <!-- Reusable Components Structure -->
        <CompanyInfo :entreprise="entreprise" />

        <div class="invoice-grid">
          <div class="invoice-header-section">
            <InvoiceHeader :invoiceNumber="invoice.id" :creationDate="invoice.createdAt"
              :dueDate="invoice.date_echeance" />
          </div>
          <div class="client-section">
            <BillTo :client="invoice.client" />
          </div>
        </div>

        <InvoiceItemsTable :items="invoice.items" />

        <InvoiceSummary :items="invoice.items" :discount="invoice.discount" :tax="invoice.tax"
          :tax-rate="invoice.tva || 0" />

        <PaymentTerms />

        <div class="mt-8 pt-6 border-t text-center text-xs text-gray-400">
          <p>Thank you for your business.</p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { NSpin } from 'naive-ui'
import { useInvoiceStore } from '@/stores/FactureStore'
import { XMarkIcon, PrinterIcon, ArrowDownTrayIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'
import { exportToPDF } from '@/utils/invoicePdfTemplate'
import CompanyInfo from './CompanyInfo.vue'
import InvoiceHeader from './InvoiceHeader.vue'
import BillTo from './BillTo.vue'
import InvoiceItemsTable from './InvoiceItemsTable.vue'
import InvoiceSummary from './InvoiceSummary.vue'
import PaymentTerms from './PaymentTerms.vue'

const invoiceContent = ref(null)
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



function printInvoice() {
  const printElement = invoiceContent.value
  if (!printElement) return

  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  document.body.appendChild(iframe) // Append properly

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
           .invoice-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin: 1.5rem 0; }
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

import { useDialog, useMessage } from 'naive-ui'

const invoiceStore = useInvoiceStore()
const emit = defineEmits(['close', 'update'])
const dialog = useDialog()
const message = useMessage()

function markAsPaid() {
  dialog.warning({
    title: 'Confirm Payment',
    content: 'Are you sure you want to mark this invoice as Paid? This will deduct stock and record the sale.',
    positiveText: 'Mark as Paid',
    negativeText: 'Cancel',
    onPositiveClick: async () => {
      isActionLoading.value = true
      try {
        await invoiceStore.updateStatus(props.invoice.id, 'payee')
        message.success('Invoice marked as Paid successfully!')
        emit('update')
        emit('close')
      } catch (error) {
        console.error('Error updating status:', error)
        message.error('Failed to update status: ' + (error.message || 'Unknown error'))
      } finally {
        isActionLoading.value = false
      }
    }
  })
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
.invoice-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin: 1.5rem 0;
}

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
  background-color: #ffffff !important;
  color: #111827 !important;
}

@media (max-width: 768px) {
  .invoice-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>