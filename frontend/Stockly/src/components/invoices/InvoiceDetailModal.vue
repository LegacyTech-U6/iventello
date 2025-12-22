<template>
  <div style="width: 100%;">
    <div
      style="
        position: fixed;
        z-index: 50;
        background-color: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(4px);
        inset: 0px;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        overflow: auto;
      "
    >
      <div class="no-print" style="display: flex; position: absolute; justify-content: space-between; width: 100%; padding: 16px; z-index: 701;">
        <button
          @click="$emit('close')"
          style="color: #6b7280; background-color: #9ca3af; padding: 16px; border-radius: 16px; border: none; cursor: pointer;"
        >
          <svg xmlns="http://www.w3.org/2000/svg" style="height: 20px; width: 20px;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div style="display: flex; align-items: center; gap: 8px;">
          <button @click="printInvoice" style="background-color: white; border: 1px solid #d1d5db; color: #374151; padding: 8px 12px; border-radius: 8px; font-weight: 500; display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px;">
            Print
          </button>
          <button @click="downloadPDF" style="background-color: #2563eb; color: white; padding: 8px 12px; border-radius: 8px; font-weight: 500; display: flex; align-items: center; gap: 8px; border: none; cursor: pointer; font-size: 14px;">
            PDF
          </button>
        </div>
      </div>

      <div 
        ref="invoiceContent" 
        style="
          background-color: white; 
          border-radius: 4px; 
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); 
          max-width: 768px; 
          width: 100%; 
          min-height: 100vh; 
          padding-bottom: 40px; 
          position: relative; 
          margin: 16px;
          color: black;
          font-family: sans-serif;
        "
      >
        <div style="padding: 32px;">
          <div style="border-bottom: 2px solid black; padding-bottom: 24px; margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-end;">
              <div>
                <h1 style="font-size: 30px; font-weight: bold; margin: 0;">INVOICE</h1>
                <div style="font-size: 14px; color: #4b5563;">
                  <CompanyInfo :entreprise="entreprise" />
                </div>
              </div>
              <div style="text-align: right; font-size: 14px;">
                <div style="margin-bottom: 8px;">
                  <span style="font-weight: 600; color: #374151;">Invoice #:</span>
                  <span style="margin-left: 8px; font-weight: bold;">{{ invoice.id }}</span>
                </div>
                <div style="margin-bottom: 8px;">
                  <span style="font-weight: 600; color: #374151;">Date:</span>
                  <span style="margin-left: 8px;">{{ formatDate(invoice.createdAt) }}</span>
                </div>
                <div>
                  <span style="font-weight: 600; color: #374151;">Due Date:</span>
                  <span style="margin-left: 8px;">{{ formatDate(invoice.date_echeance) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div style="margin-bottom: 24px;">
            <h3 style="font-bold: bold; font-size: 18px; margin-bottom: 12px; border-bottom: 1px solid #d1d5db; padding-bottom: 8px;">BILL TO</h3>
            <div style="font-size: 14px;">
              <div style="font-weight: 600;">{{ invoice.client?.client_name || 'Client Name' }}</div>
              <div style="color: #4b5563;">{{ invoice.client?.client_adresse || 'Address not specified' }}</div>
              <div style="color: #4b5563;" v-if="invoice.client?.email">Email: {{ invoice.client.email }}</div>
              <div style="color: #4b5563;" v-if="invoice.client?.client_telephone">Phone: {{ invoice.client.telephone }}</div>
            </div>
          </div>

          <div style="margin-bottom: 8px;">
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #d1d5db; font-size: 14px;">
              <thead>
                <tr style="background-color: #f3f4f6;">
                  <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">#</th>
                  <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Description</th>
                  <th style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">Qty</th>
                  <th style="border: 1px solid #d1d5db; padding: 8px; text-align: right;">Unit Price</th>
                  <th style="border: 1px solid #d1d5db; padding: 8px; text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in invoice.items" :key="item.id">
                  <td style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">{{ index + 1 }}</td>
                  <td style="border: 1px solid #d1d5db; padding: 8px;">
                    <div style="font-weight: 500;">{{ item.product?.Prod_name }}</div>
                    <div style="font-size: 12px; color: #4b5563;" v-if="item.description">{{ item.description }}</div>
                  </td>
                  <td style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">{{ item.quantity }}</td>
                  <td style="border: 1px solid #d1d5db; padding: 8px; text-align: right; font-family: monospace;">{{ format(item.unit_price) }}</td>
                  <td style="border: 1px solid #d1d5db; padding: 8px; text-align: right; font-family: monospace; font-weight: 600;">{{ format(item.total_item) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="display: flex; justify-content: flex-end;">
            <div style="width: 288px; border: 1px solid #d1d5db; font-size: 14px;">
              <div style="display: flex; justify-content: space-between; padding: 8px; border-bottom: 1px solid #d1d5db;">
                <span style="font-weight: 600;">Subtotal:</span>
                <span style="font-family: monospace;">{{ format(invoice.total_hors_reduction) }}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px; background-color: #f3f4f6; font-weight: bold;">
                <span>TOTAL:</span>
                <span style="font-family: monospace;">{{ format(invoice.total) }}</span>
              </div>
            </div>
          </div>

          <div style="margin-top: 12px; border-top: 1px solid #d1d5db; padding-top: 12px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; font-size: 14px;">
              <div>
                <h4 style="font-weight: bold; margin-bottom: 8px;">STATUS</h4>
                <span :style="statusStyle(invoice.status)">
                  {{ formatStatus(invoice.status) }}
                </span>
              </div>
              <div>
                <h4 style="font-weight: bold; margin-bottom: 8px;">PAYMENT METHOD</h4>
                <p style="color: #4b5563; margin: 0;">{{ invoice.mode_paiement || 'Not specified' }}</p>
              </div>
            </div>
            <div v-if="invoice.notes" style="margin-top: 16px;">
              <h4 style="font-weight: bold; margin-bottom: 8px;">NOTES</h4>
              <p style="color: #4b5563; font-size: 14px; margin: 0;">{{ invoice.notes }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
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
  const printElement = invoiceContent.value
  if (!printElement) return

  // Create a hidden iframe to avoid modifying the main page
  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  document.body.appendChild(iframe)

  const doc = iframe.contentWindow.document

  // Copy all styles from the <head> to preserve the invoice's appearance
  const headContent = document.head.innerHTML

  doc.open()
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Invoice</title>
        ${headContent}
      </head>
      <body>
        ${printElement.innerHTML}
      </body>
    </html>
  `)
  doc.close()

  // Wait for the content to be loaded in the iframe before printing
  setTimeout(() => {
    iframe.contentWindow.focus()
    iframe.contentWindow.print()
    // Remove the iframe after printing
    document.body.removeChild(iframe)
  }, 500)
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
