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
          <n-input v-model:value="search" placeholder="Search customers..." size="large" clearable>
            <template #prefix>
              <n-icon :component="MagnifyingGlassIcon" />
            </template>
          </n-input>
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

          <div class="text-center">
            <p class="text-lg font-medium text-gray-900 mb-2">
              {{ search ? 'No customers found' : 'No customers yet' }}
            </p>
            <p class="text-sm text-gray-500 mb-6">
              {{ search ? 'Try adjusting your search terms' : 'Get started by adding your first customer' }}
            </p>
            <n-button v-if="!search" @click="handleAddClient" type="primary" size="large">
              <template #icon><n-icon :component="PlusIcon" /></template>
              Add Your First Customer
            </n-button>
            <n-button v-else @click="search = ''" secondary size="large">
              Clear Search
            </n-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <FromModal :open="showModal" :isEdit="isEditMode" :clientData="selectedClient" :loading="loading" :error="error"
      @close="handleCloseModal" @submit="handleSubmit" />

    <!-- Delete Modal -->
    <ActionModal v-model="showDeleteModal" title="Delete Customer"
      :message="'Are you sure you want to delete ' + (selectedClient?.client_name || 'this customer') + '? This action cannot be undone.'"
      confirm-text="Delete" cancel-text="Cancel" :loading="loading" @confirm="confirmDelete" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { MagnifyingGlassIcon, PlusIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'
import { NSpin, NInput, NButton, NIcon } from 'naive-ui'
import { useGlobalModal } from '@/composable/useValidation'
import { useClientStore } from '@/stores/clientStore'
import { useActionMessage } from '@/composable/useActionMessage'
import FromModal from '../components/clients/FromModal.vue'
import ClientCard from '../components/clients/ClientCard.vue'
import ValidationButton from '@/components/ui/buttons/ValidationButton.vue'
import ActionModal from '@/components/ui/ActionModal.vue'

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
  loading.value = true
  try {
    await clientStore.deleteclient(selectedClient.value.id)
    show('Customer deleted successfully!', 'success')
    await clientStore.fetchClients()
  } catch (err) {
    show('Failed to delete customer', 'error')
  } finally {
    loading.value = false
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