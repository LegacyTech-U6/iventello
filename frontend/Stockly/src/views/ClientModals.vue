<script setup>
defineProps({
  clientLoading: {},
  clientStore: {},
  closeCreateClientModal: {},
  newClientForm: {},
  showCreateClientModal: {},
  submitCreateClient: {},
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="showCreateClientModal"
           class="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4"
           @click.self="closeCreateClientModal">
        <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <!-- Modal Header -->
          <div class="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 class="text-2xl font-bold text-gray-900">Create</h2>
            <button @click="closeCreateClientModal"
                    class="text-white bg-red-500 hover:bg-red-600 rounded-full w-8 h-8 flex items-center justify-center transition-colors">
              &times;
            </button>
          </div>

          <!-- Modal Body -->
          <form @submit.prevent="submitCreateClient" class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Customer Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name <span class="text-red-500">*</span>
                </label>
                <input v-model="newClientForm.client_name" type="text" required
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                       placeholder="Enter customer name"/>
              </div>

              <!-- Phone -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Phone <span class="text-red-500">*</span>
                </label>
                <input v-model="newClientForm.client_PhoneNumber" type="tel" required
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                       placeholder="Enter phone number"/>
              </div>

              <!-- Email -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1"> Email </label>
                <input v-model="newClientForm.email" type="email"
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                       placeholder="Enter email address"/>
              </div>

              <!-- Address -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1"> Address </label>
                <input v-model="newClientForm.location" type="text"
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                       placeholder="Enter address"/>
              </div>

              <!-- City -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"> City </label>
                <input v-model="newClientForm.city" type="text"
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                       placeholder="Enter city"/>
              </div>

              <!-- Country -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"> Country </label>
                <input v-model="newClientForm.country" type="text"
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                       placeholder="Enter country"/>
              </div>
            </div>

            <!-- Error Message -->
            <!-- Error Message -->
            <div v-if="clientStore.submitError" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-700">{{ clientStore.submitError }}</p>
            </div>

            <!-- Modal Footer -->
            <div class="flex justify-end gap-3 mt-6">
              <button type="button" @click="closeCreateClientModal"
                      class="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium">
                Cancel
              </button>
              <button type="submit" :disabled="clientLoading"
                      class="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed transition-colors font-medium">
                {{ clientLoading ? 'Creating...' : 'Submit' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>