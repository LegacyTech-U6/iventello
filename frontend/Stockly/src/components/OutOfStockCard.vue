<template>
  <div
    class="card flex flex-col h-full transition-all duration-300 ease-in-out hover:elevation-3 hover:-translate-y-1 border-t-4 border-error">
    <!-- Header -->
    <div class="flex justify-between items-start mb-3">
      <div class="flex-1 min-w-0">
        <h3 class="card-title truncate text-on-surface" :title="product.Prod_name">{{ product.Prod_name }}</h3>
        <div class="badge-error inline-flex items-center gap-1.5 font-mono text-xs">
          <QrCodeIcon class="w-4 h-4" />
          <span>{{ product.sku }}</span>
        </div>
      </div>
      <div v-if="product.isHighValue" class="badge-warning inline-flex items-center gap-1.5 ml-2 flex-shrink-0"
        title="High Value Product">
        <SparklesIcon class="w-3.5 h-3.5" />
        <span>HIGH VALUE</span>
      </div>
    </div>

    <!-- Details -->
    <div class="flex-grow space-y-2 mb-4 text-sm border-t border-outline-variant pt-4">
      <div class="flex justify-between">
        <span class="text-on-surface-variant">Category</span>
        <span class="font-medium text-on-surface">{{ product.category_name }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-on-surface-variant">Supplier</span>
        <span class="font-medium text-on-surface">{{ product.supplier_name }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-on-surface-variant">Selling Price</span>
        <span class="font-semibold text-tertiary">${{ formatNumber(product.selling_price) }}</span>
      </div>
    </div>

    <!-- Cost Info -->
    <div class="bg-error-container rounded-lg p-3 mb-4 text-center">
      <p class="text-xs text-on-error-container font-semibold uppercase tracking-wider">Reorder Cost</p>
      <p class="text-2xl font-bold text-on-error-container">${{ formatNumber(product.cost_price) }}</p>
    </div>

    <!-- Action Button -->
    <button @click="$emit('restock', product)"
      class="btn-primary w-full py-3 text-sm font-semibold flex items-center justify-center gap-2">
      <ArchiveBoxArrowDownIcon class="w-5 h-5" />
      Restock Now
    </button>
  </div>
</template>

<script setup>
import { QrCodeIcon, SparklesIcon, ArchiveBoxArrowDownIcon } from '@heroicons/vue/24/outline'

defineProps({
  product: {
    type: Object,
    required: true,
  },
})

defineEmits(['restock'])

/**
 * Formats a number into USD currency format.
 * @param {number} num - The number to format.
 * @returns {string} The formatted currency string.
 */
const formatNumber = (num) => {
  if (typeof num !== 'number') {
    return '0.00'
  }
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}
</script>

<style scoped>
/* Scoped styles can be added here if needed */
</style>