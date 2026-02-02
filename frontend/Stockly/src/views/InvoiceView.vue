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
          <span class="text-xs font-medium uppercase tracking-wider text-gray-500">{{ $t('invoices.stats.total')
            }}</span>
          <span class="text-lg font-bold text-gray-800">{{ invoices.length }}</span>
        </div>
      </div>

      <div
        class="relative flex flex-col md:flex-row items-center md:items-start gap-3 cursor-pointer p-4 rounded-xl border transition-all duration-200"
        :class="selectedStatus === 'payee'
          ? 'bg-white border-blue-200 shadow-sm ring-1 ring-blue-500/20'
          : 'bg-white border-gray-100 hover:border-gray-200 text-gray-500'" @click="selectedStatus = 'payee'">
        <div class="p-2 rounded-lg" :class="selectedStatus === 'payee' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100'">
          <CheckCircle class="w-5 h-5" />
        </div>
        <div class="flex flex-col items-center md:items-start">
          <span class="text-xs font-medium uppercase tracking-wider text-gray-500">{{ $t('invoices.stats.paid')
            }}</span>
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
          <span class="text-xs font-medium uppercase tracking-wider text-gray-500">{{ $t('invoices.stats.pending')
            }}</span>
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
          <span class="text-xs font-medium uppercase tracking-wider text-gray-500">{{ $t('invoices.stats.overdue')
            }}</span>
          <span class="text-lg font-bold text-gray-800">{{ overdueCount }}</span>
        </div>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
      <div class="relative w-full sm:w-64">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-[18px] h-[18px]" />
        <input v-model="searchQuery" type="text" :placeholder="$t('invoices.search_placeholder')"
          class="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
      </div>
    </div>

    <n-spin :show="loading" size="large" tip="Loading invoices...">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <n-data-table :columns="columns" :data="filteredInvoices" :pagination="pagination" :row-props="rowProps"
          :loading="loading" :bordered="false" size="small" :row-class-name="'group'">
          <template #empty>
            <div class="p-12 flex flex-col items-center justify-center">
              <div class="w-48 h-48 text-gray-200 mb-4">
                <FileText class="w-16 h-16 mx-auto opacity-20" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900">{{ $t('invoices.empty.title') }}</h3>
              <p class="text-gray-500 mt-2">{{ $t('invoices.empty.subtitle') }}</p>
            </div>
          </template>
        </n-data-table>
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
import { ref, computed, onMounted, h } from 'vue'
import { NButton, NTag, NSpin, NDataTable, NIcon } from 'naive-ui'
import { useCurrency } from '@/composable/useCurrency'
import {
  DocumentTextIcon as FileText,
  CheckCircleIcon as CheckCircle,
  ClockIcon as Hourglass,
  ExclamationCircleIcon as AlertCircle,
  MagnifyingGlassIcon as Search,
  EyeIcon as Eye,
  PencilIcon as Pencil,
  TrashIcon as Trash2
} from '@heroicons/vue/24/outline'
import { useInvoiceStore } from '@/stores/FactureStore'
import { useEntrepriseStore } from '@/stores/entrepriseStore'
import InvoiceDetailModal from '@/components/invoices/InvoiceDetailModal.vue'
import ActionModal from '@/components/ui/ActionModal.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()


const { format, getDynamicStyle } = useCurrency()
// Stores
const invoiceStore = useInvoiceStore()
const entrepriseStore = useEntrepriseStore()
const loading = ref(true)

// Refs
const searchQuery = ref('')
const selectedStatus = ref(null)
// n-data-table internal pagination
const pagination = ref({ pageSize: 10 })

const showInvoiceModal = ref(false)
const selectedInvoice = ref(null)
const showDeleteModal = ref(false)
const invoiceToDelete = ref(null)

const rowProps = (row) => {
  return {
    style: 'cursor: pointer;',
    onClick: () => viewInvoice(row)
  }
}

const columns = computed(() => [
  {
    title: t('invoices.table.id'),
    key: 'id',
    render: (row) => h('span', { class: 'font-mono text-xs font-medium text-gray-500' }, { default: () => `#${row.id}` })
  },
  {
    title: t('invoices.table.client'),
    key: 'client',
    render(row) {
      return h('div', { class: 'flex flex-col' }, [
        h('span', { class: 'text-sm font-medium text-gray-900' }, { default: () => row.client?.client_name || 'N/A' }),
        h('span', { class: 'text-xs text-gray-400' }, { default: () => row.client?.email || '' })
      ])
    }
  },
  {
    title: t('invoices.table.date'),
    key: 'createdAt',
    render: (row) => formatDate(row.createdAt)
  },
  {
    title: t('invoices.table.due_date'),
    key: 'dueDate',
    render: (row) => formatDate(row.dueDate || row.createdAt)
  },
  {
    title: t('invoices.table.amount'),
    key: 'total',
    render(row) {
      return h('span', {
        class: 'text-sm font-semibold text-gray-900',
        style: getDynamicStyle(row.total)
      }, { default: () => format(row.total) })
    }
  },
  {
    title: t('invoices.table.status'),
    key: 'status',
    render(row) {
      return h(NTag, {
        type: getStatusType(row.status),
        bordered: false,
        size: 'small',
        round: true,
        class: 'px-3'
      }, { default: () => getStatusLabel(row.status) })
    }
  },
  {
    title: t('invoices.table.actions'),
    key: 'actions',
    render(row) {
      return h('div', { class: 'flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity' }, [
        h(NButton, { quaternary: true, circle: true, size: 'small', onClick: (e) => { e.stopPropagation(); viewInvoice(row) } }, { icon: () => h(NIcon, null, { default: () => h(Eye, { class: 'w-4 h-4 text-gray-500 hover:text-blue-600' }) }) }),
        h(NButton, { quaternary: true, circle: true, size: 'small', onClick: (e) => { e.stopPropagation(); editInvoice(row) } }, { icon: () => h(NIcon, null, { default: () => h(Pencil, { class: 'w-4 h-4 text-gray-500 hover:text-orange-500' }) }) }),
        h(NButton, { quaternary: true, circle: true, size: 'small', onClick: (e) => { e.stopPropagation(); deleteInvoice(row) } }, { icon: () => h(NIcon, null, { default: () => h(Trash2, { class: 'w-4 h-4 text-gray-500 hover:text-red-600' }) }) })
      ])
    }
  }
])

// Computed
const invoices = computed(() => invoiceStore.invoices || [])
const entreprise = computed(() => entrepriseStore.activeEntreprise || {})

const paidCount = computed(() =>
  invoices.value.filter(i => i.status === 'payee').length
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
  if (status === 'payee') return 'success'
  if (status === 'en_attente') return 'warning'
  if (status === 'overdue') return 'error'
  return 'default'
}

const getStatusLabel = (status: string) => {
  if (status === 'payee') return t('invoices.status.paid')
  if (status === 'en_attente') return t('invoices.status.pending')
  if (status === 'overdue') return t('invoices.status.overdue')
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