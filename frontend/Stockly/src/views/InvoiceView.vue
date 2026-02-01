<template>
  <div class="min-h-full bg-gray-50 p-4 md:p-8">

    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">

      <div
        class="relative flex flex-col md:flex-row items-center md:items-start gap-3 cursor-pointer p-4 rounded-xl border transition-all duration-200"
        :class="selectedStatus === null
          ? 'bg-white border-green-200 shadow-sm ring-1 ring-green-500'
          : 'bg-white border-gray-100 hover:border-gray-200 text-gray-500'" @click="selectedStatus = null">
        <div class="p-2 rounded-lg" :class="selectedStatus === null ? 'bg-green-50 text-green-600' : 'bg-gray-100'">
          <FileText class="w-5 h-5" />
        </div>
        <div class="flex flex-col items-center md:items-start">
          <span class="text-xs font-medium uppercase tracking-wider text-gray-500">Total</span>
          <span class="text-lg font-bold text-gray-800">{{ invoices.length }}</span>
        </div>
      </div>

      <div
        class="relative flex flex-col md:flex-row items-center md:items-start gap-3 cursor-pointer p-4 rounded-xl border transition-all duration-200"
        :class="selectedStatus === 'payée'
          ? 'bg-white border-blue-200 shadow-sm ring-1 ring-blue-500/20'
          : 'bg-white border-gray-100 hover:border-gray-200 text-gray-500'" @click="selectedStatus = 'payée'">
        <div class="p-2 rounded-lg" :class="selectedStatus === 'payée' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100'">
          <CheckCircle class="w-5 h-5" />
        </div>
        <div class="flex flex-col items-center md:items-start">
          <span class="text-xs font-medium uppercase tracking-wider text-gray-500">Paid</span>
          <span class="text-lg font-bold text-gray-800">{{ paidCount }}</span>
        </div>
      </div>

      <div
        class="relative flex flex-col md:flex-row items-center md:items-start gap-3 cursor-pointer p-4 rounded-xl border transition-all duration-200"
        :class="selectedStatus === 'en_attente'
          ? 'bg-white border-cyan-200 shadow-sm ring-1 ring-cyan-500/20'
          : 'bg-white border-gray-100 hover:border-gray-200 text-gray-500'" @click="selectedStatus = 'en_attente'">
        <div class="p-2 rounded-lg"
          :class="selectedStatus === 'en_attente' ? 'bg-cyan-50 text-cyan-600' : 'bg-gray-100'">
          <Hourglass class="w-5 h-5" />
        </div>
        <div class="flex flex-col items-center md:items-start">
          <span class="text-xs font-medium uppercase tracking-wider text-gray-500">Pending</span>
          <span class="text-lg font-bold text-gray-800">{{ pendingCount }}</span>
        </div>
      </div>

      <div
        class="relative flex flex-col md:flex-row items-center md:items-start gap-3 cursor-pointer p-4 rounded-xl border transition-all duration-200"
        :class="selectedStatus === 'overdue'
          ? 'bg-white border-red-200 shadow-sm ring-1 ring-red-500/20'
          : 'bg-white border-gray-100 hover:border-gray-200 text-gray-500'" @click="selectedStatus = 'overdue'">
        <div class="p-2 rounded-lg" :class="selectedStatus === 'overdue' ? 'bg-red-50 text-red-600' : 'bg-gray-100'">
          <AlertCircle class="w-5 h-5" />
        </div>
        <div class="flex flex-col items-center md:items-start">
          <span class="text-xs font-medium uppercase tracking-wider text-gray-500">Overdue</span>
          <span class="text-lg font-bold text-gray-800">{{ overdueCount }}</span>
        </div>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
      <div class="relative w-full sm:w-64">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-[18px] h-[18px]" />
        <input v-model="searchQuery" type="text" placeholder="Search client, ID..."
          class="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
      </div>
    </div>

    <n-spin :show="loading" size="large" tip="Loading invoices...">
      <div v-if="filteredInvoices.length === 0 && !loading"
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center min-h-[400px]">
        <div class="w-48 h-48 text-gray-200 mb-4">
          <FileText class="w-16 h-16 mx-auto opacity-20" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900">No invoices found</h3>
        <p class="text-gray-500 mt-2">Try adjusting your search or filters.</p>
      </div>

      <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[1000px]">
            <thead class="bg-gray-50/50 border-b border-gray-200">
              <tr>
                <th class="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                <th class="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Client</th>
                <th class="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th class="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Due Date</th>
                <th class="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                <th class="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th class="text-center px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="invoice in paginatedInvoices" :key="invoice.id"
                class="group hover:bg-gray-50/80 transition-colors">
                <td class="px-6 py-4">
                  <span class="font-mono text-xs font-medium text-gray-500">#{{ invoice.id }}</span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <span class="text-sm font-medium text-gray-900">{{ invoice.client?.client_name || 'N/A' }}</span>
                    <span class="text-xs text-gray-400">{{ invoice.client?.email || '' }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ formatDate(invoice.createdAt) }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ formatDate(invoice.dueDate || invoice.createdAt) }}</td>
                <td class="px-6 py-4">
                  <span class="text-sm font-semibold text-gray-900" :style="getDynamicStyle(invoice.total)">{{
                    format(invoice.total) }}</span>
                </td>
                <td class="px-6 py-4">
                  <n-tag :type="getStatusType(invoice.status)" :bordered="false" size="small" round class="px-3">
                    {{ getStatusLabel(invoice.status) }}
                  </n-tag>
                </td>
                <td class="px-6 py-4">
                  <div
                    class="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <n-button quaternary circle size="small" @click="viewInvoice(invoice)">
                      <template #icon>
                        <Eye class="w-4 h-4 text-gray-500 hover:text-blue-600" />
                      </template>
                    </n-button>
                    <n-button quaternary circle size="small" @click="editInvoice(invoice)">
                      <template #icon>
                        <Pencil class="w-4 h-4 text-gray-500 hover:text-orange-500" />
                      </template>
                    </n-button>
                    <n-button quaternary circle size="small" @click="deleteInvoice(invoice)">
                      <template #icon>
                        <Trash2 class="w-4 h-4 text-gray-500 hover:text-red-600" />
                      </template>
                    </n-button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          class="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="text-sm text-gray-500">
            Showing <span class="font-medium text-gray-800">{{ startIndex }}</span> to <span
              class="font-medium text-gray-800">{{ endIndex }}</span> of <span class="font-medium text-gray-800">{{
                filteredInvoices.length }}</span>
          </div>

          <div class="flex items-center gap-1">
            <button
              class="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
              :disabled="currentPage === 1" @click="currentPage = 1">
              <ChevronsLeft class="w-4 h-4" />
            </button>
            <button
              class="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
              :disabled="currentPage === 1" @click="prevPage">
              <ChevronLeft class="w-4 h-4" />
            </button>

            <div class="flex gap-1 px-2">
              <button v-for="page in visiblePages" :key="page" @click="currentPage = page"
                class="w-8 h-8 rounded-lg text-sm font-medium transition-colors"
                :class="page === currentPage ? 'bg-white shadow-sm border border-gray-200 text-blue-600' : 'text-gray-500 hover:bg-gray-100'">
                {{ page }}
              </button>
            </div>

            <button
              class="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
              :disabled="currentPage === totalPages" @click="nextPage">
              <ChevronRight class="w-4 h-4" />
            </button>
            <button
              class="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
              :disabled="currentPage === totalPages" @click="currentPage = totalPages">
              <ChevronsRight class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </n-spin>

    <InvoiceDetailModal v-if="showInvoiceModal" :invoice="selectedInvoice" :entreprise="entreprise"
      @close="showInvoiceModal = false" />
    <ActionModal v-model="showDeleteModal" title="Delete Invoice"
      message="Are you sure you want to delete this invoice? This action cannot be undone." confirm-text="Delete"
      cancel-text="Cancel" :loading="isActionLoading" @confirm="confirmDelete" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { NButton, NTag, NSpin } from 'naive-ui' // Suppression des imports inutilisés
import { useCurrency } from '@/composable/useCurrency'
import {
  DocumentTextIcon as FileText,
  CheckCircleIcon as CheckCircle,
  ClockIcon as Hourglass,
  ExclamationCircleIcon as AlertCircle,
  MagnifyingGlassIcon as Search,
  EyeIcon as Eye,
  PencilIcon as Pencil,
  TrashIcon as Trash2,
  ChevronLeftIcon as ChevronLeft,
  ChevronRightIcon as ChevronRight,
  ChevronDoubleLeftIcon as ChevronsLeft,
  ChevronDoubleRightIcon as ChevronsRight
} from '@heroicons/vue/24/outline'
import { useInvoiceStore } from '@/stores/FactureStore'
import { useEntrepriseStore } from '@/stores/entrepriseStore'
import InvoiceDetailModal from '@/components/invoices/InvoiceDetailModal.vue'
import ActionModal from '@/components/ui/ActionModal.vue'


const { format, getDynamicStyle } = useCurrency()
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
  const end = Math.min(totalPages.value, start + maxVisible - 1)

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

const isActionLoading = ref(false)

const confirmDelete = async () => {
  if (!invoiceToDelete.value) return
  isActionLoading.value = true
  try {
    // Note: Assuming deleteInvoice API/action might be added later
    // or handled within the store. For now, we follow the pattern.
    // await invoiceStore.removeInvoice(invoiceToDelete.value)
    alert("Delete functionality to be implemented in store/API for invoice #" + invoiceToDelete.value)
  } catch (error) {
    console.error(error)
  } finally {
    isActionLoading.value = false
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
  if (status === 'overdue') return 'Overdue'
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
/* Custom scrollbar pour la table */
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #e2e8f0 transparent;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}
</style>