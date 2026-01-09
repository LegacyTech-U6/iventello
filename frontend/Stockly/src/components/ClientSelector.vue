<!-- 
  ClientSelector.vue
  ===================
  Sélecteur de client avec recherche
  - Recherche en temps réel parmi les clients
  - Navigation au clavier (flèches, Entrée)
  - Option "Walk-in" pour client sans compte
  - Bouton ajouter nouveau client
-->
<template>
  <!-- Wrapper du sélecteur de client -->
  <div class="customer-selection relative">
    <!-- Champ de recherche client -->
    <input
      ref="searchInput"
      v-model="searchQuery"
      @focus="openClientModal"
      @keydown.down.prevent="highlightNext"
      @keydown.up.prevent="highlightPrev"
      @keydown.enter.prevent="selectHighlightedOrWalkIn"
      placeholder="Search clients or type 'walk-in'..."
      class="w-full px-4 py-2 border rounded-lg"
    />
    <!-- Bouton ajouter nouveau client -->
    <button
      @click.stop="addNewClient"
      class="absolute right-2 top-1/2 -translate-y-1/2 bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-700 focus:outline-none transition-colors"
      title="Add New Client"
    >
      <UserPlusIcon class="w-5 h-5" />
    </button>

    <!-- Mini modal / Dropdown avec liste des clients -->
    <div
      v-if="showClientModal"
      class="absolute z-50 mt-2 w-full max-h-64 overflow-y-auto bg-white border border-gray-300 rounded shadow-lg p-2"
    >
      <!-- Liste des clients filtrés -->
      <ul>
        <li
          v-for="(client, index) in filteredClients"
          :key="client.id"
          :class="{
            'bg-teal-500 text-white': index === highlightedIndex,
            'px-2 py-1 cursor-pointer hover:bg-gray-100': true,
          }"
          @mouseenter="highlightedIndex = index"
          @click="selectClient(client)"
        >
          {{ client.client_name }}
        </li>
      </ul>

      <!-- Option client sans compte (Walk-in) -->
      <div
        :class="{ 'bg-teal-500 text-white': highlightedIndex === filteredClients.length }"
        class="mt-2 px-2 py-1 hover:bg-gray-100 cursor-pointer"
        @click="selectWalkIn"
      >
      </div>

      <!-- Add new client -->
      <div
        :class="{ 'bg-teal-500 text-white': highlightedIndex === filteredClients.length + 1 }"
        class="mt-2 px-2 py-1 hover:bg-gray-100 cursor-pointer"
        @click="addNewClient"
      >
        + Add New Client
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useClientStore } from '@/stores/clientOfflineStore'
import { UserPlusIcon } from 'lucide-vue-next'
const clientStore = useClientStore()
const searchQuery = ref('')
const showClientModal = ref(false)
const clients = ref([])
const highlightedIndex = ref(-1)
const selected = ref(null)
const emit = defineEmits(['select-client'])

const openClientModal = async () => {
  showClientModal.value = true
  if (!clients.value.length) {
    await clientStore.fetchClients()
    clients.value = clientStore.clients
  }
  highlightedIndex.value = -1
}

const filteredClients = computed(() => {
  if (!searchQuery.value.trim() || searchQuery.value.toLowerCase() === 'walk-in')
    return clients.value
  const query = searchQuery.value.toLowerCase()
  return clients.value.filter((c) => c.client_name.toLowerCase().includes(query))
})

// Navigation clavier
const highlightNext = () => {
  const total = filteredClients.value.length + 2 // walk-in + add new
  highlightedIndex.value = (highlightedIndex.value + 1) % total
}

const highlightPrev = () => {
  const total = filteredClients.value.length + 2
  highlightedIndex.value = (highlightedIndex.value - 1 + total) % total
}

const selectHighlightedOrWalkIn = () => {
  if (highlightedIndex.value < 0) return
  if (highlightedIndex.value < filteredClients.value.length) {
    selectClient(filteredClients.value[highlightedIndex.value])
  } else if (highlightedIndex.value === filteredClients.value.length) {
    selectWalkIn()
  } else {
    addNewClient()
  }
}

// Sélection client
const selectClient = (client) => {
  selected.value = client
  searchQuery.value = client.client_name
  showClientModal.value = false
  highlightedIndex.value = -1
  emit('select-client', client)
}

// Walk-in
const selectWalkIn = () => {
  selected.value = 'walk-in'
  searchQuery.value = 'Walk-in Customer'
  showClientModal.value = false
  highlightedIndex.value = -1
  emit('select-client', selected.value)
}

// Ajouter nouveau client
const addNewClient = () => {
  selected.value = null
  searchQuery.value = ''
  showClientModal.value = false
  highlightedIndex.value = -1
  emit('select-client', { action: 'add-new-client' })
}
</script>

<style scoped>
.customer-selection input:focus {
  outline: none;
  border-color: #14b8a6;
  box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.3);
}
</style>
