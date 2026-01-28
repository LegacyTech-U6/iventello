<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow">
    <!-- Three Dots Menu -->
    <div class="flex justify-end mb-2">
      <div class="relative">
        <button @click="showMenu = !showMenu" class="p-1 text-gray-400 hover:text-gray-600 transition">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>
        <div v-if="showMenu"
          class="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <button @click="handleEdit"
            class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg">
            Edit
          </button>
          <button @click="handleDelete"
            class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-b-lg">
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Avatar -->
    <div class="flex flex-col items-center mb-6">
      <div :class="[
        'w-20 h-20 rounded-full flex items-center justify-center text-white font-semibold text-2xl mb-4',
        getColorForWorker(worker.worker_id),
      ]">
        {{ worker?.name?.charAt(0)?.toUpperCase() }}
      </div>

      <!-- Worker Info -->
      <span class="text-sm text-orange-500 font-medium mb-2">EMP ID : {{ worker.id }}</span>
      <h3 class="font-bold text-gray-900 text-lg text-center mb-1">{{ worker?.name }}</h3>
      <span class="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
        {{ worker?.position }}
      </span>
    </div>

    <!-- Card Body -->
    <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
      <div class="text-center">
        <p class="text-gray-500 text-sm font-medium mb-1">Joined</p>
        <p class="text-gray-900 font-semibold">{{ formatDate(worker.date_hired) }}</p>
      </div>
      <div class="text-center">
        <p class="text-gray-500 text-sm font-medium mb-1">Department</p>
        <p class="text-gray-900 font-semibold">{{ worker.entreprise.name || 'N/A' }}</p>
      </div>
    </div>

    <!-- Roles Section -->
    <div class="mt-4 pt-4 border-t border-gray-100">
      <p class="text-gray-500 text-sm font-medium mb-2 text-center">Roles</p>
      <div class="flex flex-wrap gap-2 justify-center">
        <span class="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-medium">
          {{ worker.role.name }}
        </span>
        <span v-if="!worker.role || worker.role.length === 0" class="text-gray-400 text-sm">
          No roles assigned
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  worker: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['edit', 'delete'])

const showMenu = ref(false)

const colors = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-red-500',
  'bg-yellow-500',
  'bg-teal-500',
  'bg-cyan-500',
]

const getColorForWorker = (workerId) => {
  let hash = 0
  const str = workerId?.toString() || ''

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  const index = Math.abs(hash % colors.length)
  return colors[index]
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const handleEdit = () => {
  showMenu.value = false
  emit('edit', props.worker)
}

const handleDelete = () => {
  showMenu.value = false
  emit('delete', props.worker.worker_id)
}
</script>
