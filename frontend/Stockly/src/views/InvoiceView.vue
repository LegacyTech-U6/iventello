<template>
  <div class="h-full bg-gray-50 p-1 md:px-8">
 
<div class="flex gap-3 overflow-x-auto py-2">
  <!-- All Invoice -->
  <div
    class="relative flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg"
    :class="selectedStatus === null ? 'bg-green-50' : 'bg-gray-100'"
    @click="selectedStatus = null"
  >
    <span class="material-symbols-rounded text-green-500 text-xl">receipt_long</span>
    <span class="text-sm font-medium text-gray-700">All Invoice</span>
    <span
      class="absolute top-0 right-0 -translate-x-1/4 -translate-y-1/4 px-2 py-0.5 text-xs font-semibold rounded-full bg-green-500 text-white"
    >
      {{ invoices.length }}
    </span>
  </div>

  <!-- Paid -->
  <div
    class="relative flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg"
    :class="selectedStatus === 'payée' ? 'bg-blue-50' : 'bg-gray-100'"
    @click="selectedStatus = 'payée'"
  >
    <span class="material-symbols-rounded text-blue-500 text-xl">check_circle</span>
    <span class="text-sm font-medium text-gray-700">Paid</span>
    <span
      class="absolute top-0 right-0 -translate-x-1/4 -translate-y-1/4 px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-500 text-white"
    >
      {{ paidCount }}
    </span>
  </div>

  <!-- Pending -->
  <div
    class="relative flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg"
    :class="selectedStatus === 'en_attente' ? 'bg-cyan-50' : 'bg-gray-100'"
    @click="selectedStatus = 'en_attente'"
  >
    <span class="material-symbols-rounded text-cyan-500 text-xl">hourglass_top</span>
    <span class="text-sm font-medium text-gray-700">Pending</span>
    <span
      class="absolute top-0 right-0 -translate-x-1/4 -translate-y-1/4 px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-400 text-white"
    >
      {{ pendingCount }}
    </span>
  </div>

  <!-- Overdue -->
  <div
    class="relative flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg"
    :class="selectedStatus === 'overdue' ? 'bg-red-50' : 'bg-gray-100'"
    @click="selectedStatus = 'overdue'"
  >
    <span class="material-symbols-rounded text-red-500 text-xl">error</span>
    <span class="text-sm font-medium text-gray-700">Overdue</span>
    <span
      class="absolute top-0 right-0 -translate-x-1/4 -translate-y-1/4 px-2 py-0.5 text-xs font-semibold rounded-full bg-red-500 text-white"
    >
      {{ overdueCount }}
    </span>
  </div>
</div>



    <!-- Table -->
 <!-- Table avec loader et empty state -->
<n-spin :show="loading" size="large" tip="Loading invoices...">
  <div v-if="filteredInvoices.length === 0 && !loading" class="h-96 flex flex-col items-center justify-center">
    <div class="text-center">
      <div class="mb-4 flex justify-center">
        <div class="w-64 h-64 flex items-center justify-center">
          <InvoicePart />
        </div>
      </div>
      <p class="text-gray-500 mt-4">No invoices found.</p>
    </div>
    
  </div>

  <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full min-w-[1000px]">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Invoice ID</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Name Client</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Email</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Start Date</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Due Date</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Invoice Amount</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
            <th class="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="invoice in paginatedInvoices" :key="invoice.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 text-sm text-gray-900">{{ invoice.id }}</td>
            <td class="px-6 py-4 text-sm text-gray-900">{{ invoice.client.client_name || 'N/A' }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ invoice.client.email || 'N/A' }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ formatDate(invoice.createdAt) }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ formatDate(invoice.dueDate || invoice.createdAt) }}</td>
            <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ format(invoice.total) }}</td>
            <td class="px-6 py-4">
              <n-tag :type="getStatusType(invoice.status)" :bordered="false" size="small" round>
                {{ getStatusLabel(invoice.status) }}
              </n-tag>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center justify-center gap-2">
                <n-button text @click="viewInvoice(invoice)">
                  <ChevronRight :size="18" class="text-gray-600" />
                </n-button>
                <n-button text @click="editInvoice(invoice)">
                  <Minus :size="18" class="text-gray-600" />
                </n-button>
                <n-button text @click="deleteInvoice(invoice)">
                  <Trash2 :size="18" class="text-red-500" />
                </n-button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="px-6 py-4 border-t bg-gray-50">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-600">
          Showing {{ startIndex }} to {{ endIndex }} of {{ filteredInvoices.length }} entries
        </div>
        <div class="flex items-center gap-2">
          <n-button size="small" :disabled="currentPage === 1" @click="currentPage = 1">«</n-button>
          <n-button size="small" :disabled="currentPage === 1" @click="prevPage">‹</n-button>

          <n-button v-for="page in visiblePages" :key="page" size="small"
            :type="page === currentPage ? 'success' : 'default'" @click="currentPage = page">
            {{ page }}
          </n-button>

          <n-button size="small" :disabled="currentPage === totalPages" @click="nextPage">›</n-button>
          <n-button size="small" :disabled="currentPage === totalPages" @click="currentPage = totalPages">»</n-button>
        </div>
      </div>
    </div>
  </div>
</n-spin>


    <!-- Modals -->
    <InvoiceDetailModal v-if="showInvoiceModal" :invoice="selectedInvoice" :entreprise="entreprise"
      @close="showInvoiceModal = false" />
    <ActionModal v-model="showDeleteModal" title="Delete Invoice"
      message="Are you sure you want to delete this invoice? This action cannot be undone." confirm-text="Delete"
      cancel-text="Cancel" @confirm="confirmDelete" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { NButton, NTag, NInput, NSelect } from 'naive-ui'
import { NSpin, NEmpty } from 'naive-ui'
import { useCurrency } from '@/composable/useCurrency'
import { Plus, Search, Filter, MoreVertical, ChevronRight, Minus, Trash2 } from 'lucide-vue-next'
import { useInvoiceStore } from '@/stores/FactureStore'
import { useEntrepriseStore } from '@/stores/entrepriseStore'
import InvoiceDetailModal from '@/components/invoices/InvoiceDetailModal.vue'
import ActionModal from '@/components/ui/ActionModal.vue'
import InvoicePart from '@/assets/icon svg/invoicePart.vue'


const {format} = useCurrency()
// Stores
const invoiceStore = useInvoiceStore()
const entrepriseStore = useEntrepriseStore()
 const loading = ref(true)

// Refs
const searchQuery = ref('')
const selectedStatus = ref(null)
const pageSize = ref(10)
const currentPage = ref(1)
const showInvoiceModal = ref(false)
const selectedInvoice = ref(null)
const showDeleteModal = ref(false)
const invoiceToDelete = ref(null)

// Options
const pageSizeOptions = [
  { label: '10', value: 10 },
  { label: '25', value: 25 },
  { label: '50', value: 50 },
  { label: '100', value: 100 }
]

// Computed
const invoices = computed(() => invoiceStore.invoices || [])
const entreprise = computed(() => entrepriseStore.activeEntreprise || {})

const paidCount = computed(() =>
  invoices.value.filter(i => i.status === 'payée').length
)

const pendingCount = computed(() =>
  invoices.value.filter(i => i.status === 'en_attente').length
)

const overdueCount = computed(() =>
  invoices.value.filter(i => i.status === 'overdue').length
)

// Filtering
const filteredInvoices = computed(() => {
  let result = invoices.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      i =>
        i.id.toString().includes(query) ||
        (i.client.client_name && i.client.client_name.toLowerCase().includes(query)) ||
        (i.client.email && i.client.email.toLowerCase().includes(query))
    )
  }

  if (selectedStatus.value) {
    result = result.filter(i => i.status === selectedStatus.value)
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredInvoices.value.length / pageSize.value))

const paginatedInvoices = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredInvoices.value.slice(start, start + pageSize.value)
})

const startIndex = computed(() => {
  if (filteredInvoices.value.length === 0) return 0
  return (currentPage.value - 1) * pageSize.value + 1
})

const endIndex = computed(() => {
  const end = currentPage.value * pageSize.value
  return Math.min(end, filteredInvoices.value.length)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Pagination
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// Actions
const addInvoice = () => {
  // Add invoice functionality
}

const viewInvoice = (invoice) => {
  selectedInvoice.value = invoice
  showInvoiceModal.value = true
}

const editInvoice = (invoice) => {
  // Edit invoice functionality
}

const deleteInvoice = (invoice) => {
  invoiceToDelete.value = invoice.id
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!invoiceToDelete.value) return
  try {
   alert("invoiceToDelete")
  } catch (error) {
    console.error(error)
  } finally {
    showDeleteModal.value = false
    invoiceToDelete.value = null
  }
}

// Helpers
const formatDate = (date: string | Date) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

const getStatusType = (status: string) => {
  if (status === 'payée') return 'success'
  if (status === 'en_attente') return 'warning'
  if (status === 'overdue') return 'error'
  return 'default'
}

const getStatusLabel = (status: string) => {
  if (status === 'payée') return 'Paid'
  if (status === 'en_attente') return 'Pending'
  if (status === 'overdue') return 'Unpaid'
  return status
}

// OnMounted
onMounted(async () => {
  loading.value = true
  await invoiceStore.fetchInvoices()
  loading.value = false
})

</script>

<style scoped>
/* Custom scrollbar */
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f7fafc;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background-color: #a0aec0;
}
</style>