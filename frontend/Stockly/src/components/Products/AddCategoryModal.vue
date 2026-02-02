<template>
  <div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
    @click.self="$emit('close')">
    <div class="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-lg animate-slide-up">
      <!-- Header -->
      <div class="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">
          {{ editingCategory ? 'Edit Category' : 'Add New Category' }}
        </h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-700 text-2xl font-bold transition">
          ✕
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div>
          <label for="category-name" class="block text-sm font-medium text-gray-700 mb-1">
            Category Name
          </label>
          <input id="category-name" v-model="formData.name" type="text" placeholder="Enter category name" required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition" />
        </div>

        <div>
          <label for="category-description" class="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea id="category-description" v-model="formData.description" rows="3"
            placeholder="Enter category description"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 resize-y transition"></textarea>
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <button type="button" @click="$emit('close')"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition">
            Cancel
          </button>
          <button type="submit" :disabled="loading"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50">
            <n-spin v-if="loading" size="small" stroke="white" />
            {{ editingCategory ? 'Update' : 'Create' }} Category
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { NSpin } from 'naive-ui'

const props = defineProps({
  category: { type: Object, default: null },
  loading: { type: Boolean, default: false }
})
const emit = defineEmits(['save', 'close'])

const formData = ref({ name: '', description: '' })
const editingCategory = ref(props.category)

watch(
  () => props.category,
  (newCategory) => {
    editingCategory.value = newCategory
    formData.value = newCategory
      ? { name: newCategory.name, description: newCategory.description }
      : { name: '', description: '' }
  },
  { immediate: true },
)

const handleSubmit = () => {
  emit('save', { ...formData.value, id: editingCategory.value?.id })
}
</script>

<style>
@keyframes slide-up {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }

  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slide-up 0.25s ease-out;
}
</style>
