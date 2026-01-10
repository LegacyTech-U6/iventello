<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-4">
        <button
          @click="$router.back()"
          class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Invoice #{{ invoice.id }}</h1>
          <p class="text-sm text-gray-500 mt-1">Invoice details and summary</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="printInvoice"
          class="bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors"
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
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Print
        </button>
        <button
          @click="downloadPDF"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors"
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
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Download PDF
        </button>
      </div>
    </div>

    <!-- Invoice Content -->
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-2xl border border-gray-200 p-8">
        <!-- Classic Invoice Header -->
        <div class="border-b-2 border-black pb-6 mb-6">
          <div class="flex justify-between items-end">
            <div>
              <h1 class="text-4xl font-bold text-black mb-2">INVOICE</h1>
              <div class="text-sm text-gray-600">
                <div>123 Business Street</div>
                <div>City, State 12345</div>
                <div>Phone: (555) 123-4567</div>
                <div>Email: hello@company.com</div>
              </div>
            </div>
            <div class="text-right">
              <div class="mb-2">
                <span class="font-semibold text-gray-700">Invoice #:</span>
                <span class="ml-2 font-bold text-black">{{ invoice.id }}</span>
              </div>
              <div class="mb-2">
                <span class="font-semibold text-gray-700">Date:</span>
                <span class="ml-2 text-black">{{ formatDate(invoice.date) }}</span>
              </div>
              <div>
                <span class="font-semibold text-gray-700">Due Date:</span>
                <span class="ml-2 text-black">{{ formatDate(invoice.due_date) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Bill To Section -->
        <div class="mb-8">
          <h3 class="font-bold text-black text-lg mb-4 border-b border-gray-300 pb-2">BILL TO</h3>
          <div class="text-sm">
            <div class="font-semibold text-black">{{ invoice.client_name || 'Client Name' }}</div>
            <div class="text-gray-600">{{ invoice.client_company || 'Company Name' }}</div>
            <div class="text-gray-600">{{ invoice.client_address || 'Address not provided' }}</div>
            <div class="text-gray-600" v-if="invoice.client_email">
              Email: {{ invoice.client_email }}
            </div>
            <div class="text-gray-600" v-if="invoice.client_phone">
              Phone: {{ invoice.client_phone }}
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <div class="mb-8">
          <table class="w-full border-collapse border border-gray-300">
            <thead>
              <tr class="bg-gray-100">
                <th class="border border-gray-300 px-4 py-3 text-left font-bold text-sm uppercase">
                  #
                </th>
                <th class="border border-gray-300 px-4 py-3 text-left font-bold text-sm uppercase">
                  Description
                </th>
                <th
                  class="border border-gray-300 px-4 py-3 text-center font-bold text-sm uppercase"
                >
                  Qty
                </th>
                <th class="border border-gray-300 px-4 py-3 text-right font-bold text-sm uppercase">
                  Unit Price
                </th>
                <th class="border border-gray-300 px-4 py-3 text-right font-bold text-sm uppercase">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in invoice.items" :key="item.id">
                <td class="border border-gray-300 px-4 py-3 text-center">{{ index + 1 }}</td>
                <td class="border border-gray-300 px-4 py-3">
                  <div class="font-medium">{{ item.Prod_name }}</div>
                  <div class="text-sm text-gray-600" v-if="item.description">
                    {{ item.description }}
                  </div>
                </td>
                <td class="border border-gray-300 px-4 py-3 text-center">{{ item.quantity }}</td>
                <td class="border border-gray-300 px-4 py-3 text-right font-mono">
                  ${{ item.selling_price.toFixed(2) }}
                </td>
                <td class="border border-gray-300 px-4 py-3 text-right font-mono font-semibold">
                  ${{ (item.quantity * item.selling_price).toFixed(2) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Summary Section -->
        <div class="flex justify-end">
          <div class="w-80 border border-gray-300">
            <div class="flex justify-between px-4 py-3 border-b border-gray-300">
              <span class="font-semibold">Subtotal:</span>
              <span class="font-mono">${{ calculateSubtotal().toFixed(2) }}</span>
            </div>
            <div
              v-if="invoice.discount > 0"
              class="flex justify-between px-4 py-3 border-b border-gray-300"
            >
              <span class="font-semibold">Discount ({{ invoice.discount }}%):</span>
              <span class="font-mono text-red-600">- ${{ calculateDiscount().toFixed(2) }}</span>
            </div>
            <div class="flex justify-between px-4 py-3 border-b border-gray-300">
              <span class="font-semibold">Tax ({{ invoice.tva }}%):</span>
              <span class="font-mono">${{ calculateTax().toFixed(2) }}</span>
            </div>
            <div class="flex justify-between px-4 py-3 bg-gray-100 font-bold">
              <span>TOTAL:</span>
              <span class="font-mono">${{ invoice.total.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Payment Terms -->
        <div class="mt-12 pt-6 border-t border-gray-300">
          <h4 class="font-bold text-black text-sm mb-3">PAYMENT TERMS</h4>
          <div class="text-sm text-gray-600 space-y-1">
            <p><strong>Due Date:</strong> Payment is due within 30 days of invoice date.</p>
            <p>
              <strong>Payment Methods:</strong>
              {{ invoice.mode_paiement || 'Bank Transfer, Credit Card, Check' }}
            </p>
            <p><strong>Late Payment:</strong> 1.5% monthly interest on overdue amounts.</p>
          </div>
          <div class="text-center mt-8 pt-4 border-t border-gray-300">
            <p class="font-bold text-black">Thank you for your business!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInvoiceStore } from '@/stores/FactureStore'

const route = useRoute()
const router = useRouter()
const invoiceStore = useInvoiceStore()
const invoice = ref({
  id: '',
  date: '',
  due_date: '',
  client_name: '',
  client_company: '',
  client_email: '',
  client_phone: '',
  client_address: '',
  items: [],
  discount: 0,
  tva: 0,
  total: 0,
  mode_paiement: '',
  status: '',
})

onMounted(async () => {
  const invoiceId = route.params.id
  if (invoiceId) {
    await loadInvoice(invoiceId)
  }
})

async function loadInvoice(id) {
  try {
    const invoices = await invoiceStore.fetchInvoiceById(id)
    const foundInvoice = invoices.find((inv) => inv.id.toString() === id.toString())
    if (foundInvoice) {
      invoice.value = foundInvoice
    } else {
      console.error('Invoice not found')
      router.back()
    }
  } catch (error) {
    console.error('Error loading invoice:', error)
    router.back()
  }
}

function calculateSubtotal() {
  return invoice.value.items.reduce((sum, item) => sum + item.selling_price * item.quantity, 0)
}

function calculateDiscount() {
  const subtotal = calculateSubtotal()
  return (subtotal * invoice.value.discount) / 100
}

function calculateTax() {
  const subtotal = calculateSubtotal()
  const discount = calculateDiscount()
  return ((subtotal - discount) * invoice.value.tva) / 100
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

function printInvoice() {
  window.print()
}

// async function downloadPDF() {
//   try {
//     await invoiceStore.createInvoice(invoice.value)
//   } catch (error) {
//     console.error('Error downloading PDF:', error)
//   }
// }
</script>

<style scoped>
@media print {
  .bg-gray-50 {
    background: white !important;
  }
  .p-6 {
    padding: 0 !important;
  }
  .mb-8 {
    margin-bottom: 1rem !important;
  }
  button {
    display: none !important;
  }
}
</style>
