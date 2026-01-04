<template>
  <div class="bg-white rounded-lg">
    <!-- Zone de Drop / Sélection -->
    <div 
      class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors"
      :class="{ 'border-blue-500 bg-blue-50': isDragging }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <div v-if="!importStore.file">
        <span class="material-symbols-rounded text-4xl text-gray-400 mb-3">
          upload_file
        </span>
        <p class="text-gray-600 mb-4">Glissez votre fichier Excel ici ou</p>
        <label class="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors inline-block">
          Choisir un fichier
          <input type="file" class="hidden" accept=".xlsx" @change="handleFileSelect">
        </label>
        <p class="text-xs text-gray-400 mt-2">Fichiers .xlsx uniquement</p>
      </div>

      <div v-else class="flex flex-col items-center">
        <span class="material-symbols-rounded text-4xl text-green-500 mb-2">
          description
        </span>
        <p class="font-medium text-gray-800">{{ importStore.file.name }}</p>
        <p class="text-sm text-gray-500 mb-4">{{ formatSize(importStore.file.size) }}</p>
        <button @click="importStore.reset()" class="text-red-500 text-sm hover:underline">
          Changer de fichier
        </button>
      </div>
    </div>

    <!-- Messages d'état -->
    <div v-if="importStore.error" class="mt-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center gap-2">
      <span class="material-symbols-rounded">error</span>
      {{ importStore.error }}
    </div>

    <div v-if="importStore.success" class="mt-4 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-center gap-2">
      <span class="material-symbols-rounded">check_circle</span>
      {{ importStore.success }}
    </div>

    <!-- Prévisualisation -->
    <div v-if="importStore.previewData.length > 0" class="mt-6">
      <h3 class="text-sm font-semibold text-gray-700 mb-2">Prévisualisation (20 premières lignes)</h3>
      <div class="overflow-x-auto border border-gray-200 rounded-lg">
        <table class="w-full text-left text-xs">
          <thead class="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
            <tr>
              <th class="p-2">Nom Produit</th>
              <th class="p-2">Prix Vente</th>
              <th class="p-2">Prix Achat</th>
              <th class="p-2">Qté</th>
              <th class="p-2">Catégorie</th>
              <th class="p-2">Fournisseur</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="(row, index) in importStore.previewData" :key="index">
              <td class="p-2">{{ row['Nom du produit *'] || row.prod_name || '-' }}</td>
              <td class="p-2">{{ row['Prix de vente *'] || row.selling_price || '-' }}</td>
              <td class="p-2">{{ row['Prix d’achat *'] || row.cost_price || '-' }}</td>
              <td class="p-2">{{ row['Quantité'] || row.quantity || '-' }}</td>
              <td class="p-2">{{ row['Catégorie'] || row.category || '-' }}</td>
              <td class="p-2">{{ row['Fournisseur'] || row.supplier || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Actions -->
    <div class="mt-6 flex justify-end gap-3">
      <button 
        @click="$emit('close')" 
        class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      >
        Annuler
      </button>
      <button 
        @click="handleUpload"
        :disabled="!importStore.file || importStore.loading || !!importStore.success"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="importStore.loading" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
        <span v-else class="material-symbols-rounded text-lg">cloud_upload</span>
        {{ importStore.loading ? 'Importation...' : 'Importer' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { useProductImportStore } from '@/stores/productImportStore'

const emit = defineEmits(['close', 'imported'])
const importStore = useProductImportStore()
const isDragging = ref(false)

// Reset store on unmount to clear previous data
onUnmounted(() => {
  importStore.reset()
})

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  processFile(file)
}

const handleDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  processFile(file)
}

const processFile = (file) => {
  if (!file) return
  
  // Validation extension
  if (!file.name.endsWith('.xlsx')) {
    importStore.error = "Format de fichier invalide. Veuillez utiliser un fichier .xlsx"
    return
  }

  importStore.setFile(file)
}

const handleUpload = async () => {
  const result = await importStore.uploadExcel()
  if (importStore.success) {
    setTimeout(() => {
      emit('imported') // Notifier le parent pour rafraîchir la liste
      emit('close')
    }, 1500)
  }
}

const formatSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>