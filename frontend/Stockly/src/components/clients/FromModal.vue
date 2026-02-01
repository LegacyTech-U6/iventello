<template>
  <Teleport to="body">
    <Transition name="modal" appear>
      <div v-if="open" class="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50"
        @click="handleBackdropClick">
        <div class="bg-white w-full max-w-xl rounded-lg shadow-xl transform transition-all duration-300 ease-out"
          @click.stop>
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">
              {{ isEdit ? 'Modifier le client' : 'Add Customer' }}
            </h2>
            <button @click="$emit('close')" :disabled="loading"
              class="w-8 h-8 rounded-full flex items-center justify-center bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-center gap-2 text-red-700">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-sm font-medium">{{ error }}</span>
            </div>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="p-6 space-y-4 max-h-[calc(90vh-140px)] overflow-y-auto">
            <!-- Image Upload Section -->
            <div class="flex items-center gap-4 pb-4 border-b border-gray-200">
              <div class="flex flex-col items-center gap-2">
                <div
                  class="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span class="text-xs text-gray-600">Add Image</span>
              </div>
              <div class="flex flex-col gap-2">
                <button type="button"
                  class="px-6 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded-md font-medium transition-colors text-sm"
                  :disabled="loading">
                  <ImageUploader v-model="formData.image" :maxSize="5" accept="image/png, image/jpeg" :preview="true" />
                </button>
                <span class="text-xs text-gray-500">JPEG, PNG up to 2 MB</span>
              </div>
            </div>

            <!-- First Name and Last Name -->
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="block text-sm font-medium text-gray-700">
                  First Name <span class="text-red-500">*</span>
                </label>
                <input v-model="formData.first_name" type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                  :disabled="loading" required />
              </div>
              <div class="space-y-1.5">
                <label class="block text-sm font-medium text-gray-700">
                  Last Name <span class="text-red-500">*</span>
                </label>
                <input v-model="formData.last_name" type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                  :disabled="loading" required />
              </div>
            </div>

            <!-- Email -->
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-gray-700">
                Email <span class="text-red-500">*</span>
              </label>
              <input v-model="formData.email" type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                :disabled="loading" required />
            </div>

            <!-- Phone -->
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-gray-700">
                Phone <span class="text-red-500">*</span>
              </label>
              <input v-model="formData.client_PhoneNumber" type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                :disabled="loading" required />
            </div>

            <!-- Address -->
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-gray-700">
                Address <span class="text-red-500">*</span>
              </label>
              <input v-model="formData.location" type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                :disabled="loading" required />
            </div>

            <!-- City and State -->
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="block text-sm font-medium text-gray-700">
                  City <span class="text-red-500">*</span>
                </label>
                <select v-model="formData.city"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm bg-white"
                  :disabled="loading" required>
                  <option value="">Select</option>
                  <option value="paris">Paris</option>
                  <option value="lyon">Lyon</option>
                  <option value="marseille">Marseille</option>
                </select>
              </div>
              <div class="space-y-1.5">
                <label class="block text-sm font-medium text-gray-700">
                  State <span class="text-red-500">*</span>
                </label>
                <select v-model="formData.state"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm bg-white"
                  :disabled="loading" required>
                  <option value="">Select</option>
                  <option value="idf">Île-de-France</option>
                  <option value="ara">Auvergne-Rhône-Alpes</option>
                  <option value="paca">Provence-Alpes-Côte d'Azur</option>
                </select>
              </div>
            </div>

            <!-- Country and Postal Code -->
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="block text-sm font-medium text-gray-700">
                  Country <span class="text-red-500">*</span>
                </label>
                <select v-model="formData.country"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm bg-white"
                  :disabled="loading" required>
                  <option value="">Select</option>
                  <option value="france">France</option>
                  <option value="belgium">Belgium</option>
                  <option value="switzerland">Switzerland</option>
                </select>
              </div>
              <div class="space-y-1.5">
                <label class="block text-sm font-medium text-gray-700">
                  Postal Code <span class="text-red-500">*</span>
                </label>
                <input v-model="formData.postal_code" type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                  :disabled="loading" required />
              </div>
            </div>

            <!-- Status -->
            <div class="flex items-center justify-between py-2">
              <label class="block text-sm font-medium text-gray-700">Status</label>
              <label class="relative inline-flex items-center cursor-pointer">
                <input v-model="formData.status" type="checkbox" class="sr-only peer" :disabled="loading" />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500">
                </div>
              </label>
            </div>
          </form>

          <!-- Actions -->
          <div class="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button type="button" @click="$emit('close')" :disabled="loading"
              class="px-6 py-2 text-gray-700 bg-gray-800 hover:bg-gray-900 text-white rounded-md font-medium transition-colors disabled:opacity-50 text-sm">
              Cancel
            </button>
            <button type="submit" @click="handleSubmit" :disabled="loading"
              class="px-6 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded-md font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm">
              <n-spin v-if="loading" size="small" stroke="white" />
              <span>{{ isEdit ? 'Update Customer' : 'Add Customer' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { NSpin } from 'naive-ui'
import ImageUploader from '../main/ImageUploader.vue'
const props = defineProps({
  open: Boolean,
  isEdit: Boolean,
  clientData: Object,
  loading: Boolean,
  error: String,
})

const emit = defineEmits(['close', 'submit'])

const formData = ref({
  first_name: '',
  last_name: '',
  email: '',
  client_PhoneNumber: '',
  location: '',
  city: '',
  state: '',
  country: '',
  postal_code: '',
  status: true,
  client_Signature: '',
})

// Initialiser le formulaire
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      if (props.isEdit && props.clientData) {
        // Mode édition - split client_name if it exists
        const nameParts = props.clientData.client_name
          ? props.clientData.client_name.split(' ')
          : ['', '']
        formData.value = {
          ...props.clientData,
          first_name: nameParts[0] || '',
          last_name: nameParts.slice(1).join(' ') || '',
          city: props.clientData.city || '',
          state: props.clientData.state || '',
          country: props.clientData.country || '',
          postal_code: props.clientData.postal_code || '',
          status: props.clientData.status !== undefined ? props.clientData.status : true,
        }
      } else {
        // Mode création
        formData.value = {
          first_name: '',
          last_name: '',
          email: '',
          client_PhoneNumber: '',
          location: '',
          city: '',
          state: '',
          country: '',
          postal_code: '',
          status: true,
          client_Signature: '',
          image: '',
        }
      }
    }
  },
)

const handleSubmit = () => {
  // Combine first and last name back into client_name for compatibility
  const submitData = {
    ...formData.value,
    client_name: `${formData.value.first_name} ${formData.value.last_name}`.trim(),
  }
  emit('submit', submitData)
}

const handleBackdropClick = () => {
  if (!props.loading) {
    emit('close')
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
