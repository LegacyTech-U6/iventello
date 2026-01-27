<!-- ClientManager.vue - Grid View -->
<template>
  <div class="h-full bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-4 md:px-8 py-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">Customers</h1>
          <p class="text-sm text-gray-500">Manage your customers</p>
        </div>
        <div class="flex gap-3 items-center">
          <button @click="handleRefresh"
            class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <ArrowPathIcon class="w-5 h-5" />
          </button>


          <ValidationButton color="#334A50" :asyncClick="handleAddClient" text="Add Customer" :icon="PlusIcon" />
        </div>
      </div>
    </div>

    <div class="px-4 md:px-8 py-4 border-b border-gray-200 bg-white">
      <!-- Search and Filter Toolbar - Intégré dans le header -->
      <div class="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <div class="flex-1 relative">
          <MagnifyingGlassIcon class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input v-model="search" type="text" placeholder="Search customers..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm" />
        </div>

      </div>
    </div>

    <div class="px-4  py-6 flex flex-col gap-4">

      <!-- Loading State -->
      <div v-if="loadingClients"
        class="flex justify-center items-center min-h-[400px] bg-white rounded-lg border border-gray-200 shadow-sm">
        <div class="flex flex-col items-center gap-6">
          <n-spin size="large" />
        </div>
      </div>

      <!-- Client Cards Grid -->
      <div v-else-if="filteredClients.length > 0">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <ClientCard v-for="client in paginatedClients" :key="client.id" :client="client" @view="handleViewClient"
            @edit="handleEditClient" @delete="handleDeleteClient" />
        </div>

        <!-- Pagination -->


      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-lg border border-gray-200 shadow-sm py-16 px-6">
        <div class="flex flex-col items-center gap-6">
          <Noclient />
          <div class="text-center">
            <p class="text-lg font-medium text-gray-900 mb-2">
              {{ search ? 'No customers found' : 'No customers yet' }}
            </p>
            <p class="text-sm text-gray-500 mb-6">
              {{ search ? 'Try adjusting your search terms' : 'Get started by adding your first customer' }}
            </p>
            <button v-if="!search" @click="handleAddClient"
              class="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium flex items-center gap-2 mx-auto transition-colors">
              <PlusIcon class="w-5 h-5" />
              Add Your First Customer
            </button>
            <button v-else @click="search = ''"
              class="px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors">
              Clear Search
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <FromModal :open="showModal" :isEdit="isEditMode" :clientData="selectedClient" :loading="loading" :error="error"
      @close="handleCloseModal" @submit="handleSubmit" />

    <!-- Delete Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showDeleteModal = false">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Delete Customer</h3>
          <div class="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
            <svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd" />
            </svg>
            <p class="text-sm text-amber-800">This action cannot be undone</p>
          </div>
          <p class="text-sm text-gray-600 mb-6">
            Are you sure you want to delete <strong class="text-gray-900">{{ selectedClient?.client_name }}</strong>?
          </p>
          <div class="flex gap-3 justify-end">
            <button @click="showDeleteModal = false"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors">
              Cancel
            </button>
            <button @click="confirmDelete"
              class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { MagnifyingGlassIcon, PlusIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'
import { NSpin } from 'naive-ui'
import { useGlobalModal } from '@/composable/useValidation'
import { useClientStore } from '@/stores/clientStore'
import { useActionMessage } from '@/composable/useActionMessage'
import FromModal from '../components/clients/FromModal.vue'
import ClientCard from '../components/clients/ClientCard.vue'
import Noclient from '@/assets/icon svg/Noclient.vue'
import ValidationButton from '@/components/ui/buttons/ValidationButton.vue'

const { show } = useGlobalModal()
const { showSuccess } = useActionMessage()
const clientStore = useClientStore()

const search = ref('')
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditMode = ref(false)
const selectedClient = ref(null)
const loading = ref(false)
const error = ref('')
const loadingClients = ref(true)
const currentPage = ref(1)
const pageSize = ref(9)

const filteredClients = computed(() => {
  let clients = clientStore.clients

  if (search.value) {
    const searchLower = search.value.toLowerCase()
    clients = clients.filter(
      (c) => c.client_name?.toLowerCase().includes(searchLower) ||
        c.email?.toLowerCase().includes(searchLower) ||
        c.client_signature?.toLowerCase().includes(searchLower)
    )
  }



  return clients
})

const pageCount = computed(() => Math.ceil(filteredClients.value.length / pageSize.value))

const paginatedClients = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredClients.value.slice(start, start + pageSize.value)
})

const visiblePages = computed(() => {
  const total = pageCount.value
  const current = currentPage.value
  const delta = 2
  const pages = []

  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    pages.push(i)
  }

  if (current - delta > 2) pages.unshift('...')
  if (current + delta < total - 1) pages.push('...')
  pages.unshift(1)
  if (total > 1) pages.push(total)

  return pages.filter((p, i, arr) => p !== '...' || arr[i - 1] !== '...')
})

const handleAddClient = () => {
  isEditMode.value = false
  selectedClient.value = null
  showModal.value = true
  error.value = ''
}

const handleViewClient = (client) => {
  console.log('View client:', client)
}

const handleEditClient = (client) => {
  isEditMode.value = true
  selectedClient.value = client
  showModal.value = true
  error.value = ''
}

const handleCloseModal = () => {
  showModal.value = false
  error.value = ''
}

const handleSubmit = async (formData) => {
  loading.value = true
  error.value = ''

  try {
    if (isEditMode.value) {
      await clientStore.updateClient(selectedClient.value.id, formData)
      show('Customer updated successfully!', 'success')
    } else {
      await clientStore.addClient(formData)
      show('Customer created successfully!', 'success')
    }

    showModal.value = false
    await clientStore.fetchClients()
  } catch (err) {
    error.value = err.response?.data?.message || 'Operation failed'
    show('Operation failed: ' + error.value, 'error')
  } finally {
    loading.value = false
  }
}

const handleDeleteClient = (client) => {
  selectedClient.value = client
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    await clientStore.deleteclient(selectedClient.value.id)
    show('Customer deleted successfully!', 'success')
    await clientStore.fetchClients()
  } catch (err) {
    show('Failed to delete customer', 'error')
  } finally {
    showDeleteModal.value = false
    selectedClient.value = null
  }
}

const handleRefresh = async () => {
  loadingClients.value = true
  await clientStore.fetchClients()
  loadingClients.value = false
  showSuccess('Data refreshed!')
}

onMounted(async () => {
  loadingClients.value = true
  await clientStore.fetchClients()
  loadingClients.value = false
})
</script>