<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
      <!-- Close Button -->
      <button @click="closeModal" class="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
        ✕
      </button>

      <h2 class="text-xl font-bold mb-4">Restock Product</h2>

      <p class="text-gray-700 mb-2"><strong>Product:</strong> {{ product?.name || product?.Prod_name || 'N/A' }}</p>
      <p class="text-gray-700 mb-4"><strong>Current Stock:</strong> {{ product?.currentStock ?? product?.quantity ?? 0
        }}</p>

      <div class="mb-4">
        <label class="block text-gray-700 mb-1">Add Quantity</label>
        <input type="number" min="1" v-model.number="quantity"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 mb-1">Supplier</label>
        <select v-model="supplier"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Select Supplier</option>
          <option v-for="s in suppliers" :key="s.id" :value="s.name">{{ s.name }}</option>
        </select>
      </div>

      <div class="flex justify-end gap-3">
        <button @click="closeModal" class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">
          Cancel
        </button>
        <button @click="confirmRestock" class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, reactive } from 'vue'

const props = defineProps({
  product: { type: Object, required: false },
  isOpen: { type: Boolean, default: false },
  suppliers: { type: Array, default: () => [] },
})

const emit = defineEmits(['close', 'restock'])

const quantity = ref(1)
const supplier = ref('')

// Reset fields when modal opens
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      quantity.value = 1
      supplier.value = ''
    }
  },
)

function closeModal() {
  emit('close')
}

function confirmRestock() {
  if (quantity.value < 1) return alert('Quantity must be at least 1')
  emit('restock', {
    productId: props.product.id,
    quantity: quantity.value,
    supplier: supplier.value,
  })
  closeModal()
}
</script>

<style scoped>
/* optional: add smooth fade-in/out */
</style>
