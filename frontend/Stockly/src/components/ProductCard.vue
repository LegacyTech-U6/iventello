<template>
  <div
    class="group bg-white rounded-lg p-3 sm:p-4 border border-gray-200 shadow-sm hover:shadow-lg hover:border-indigo-500 transition-all duration-300 cursor-pointer relative overflow-hidden hover:-translate-y-0.5">
    <!-- Image du produit -->
    <div class="relative w-full h-24 sm:h-28 bg-gray-50 rounded-lg overflow-hidden mb-2">
      <img :src="product.Prod_image" :alt="product.Prod_name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      <!-- Badge de stock -->
      <div class="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide text-white" :class="{
        'bg-green-500': product.quantity > 10,
        'bg-orange-500': product.quantity > 0 && product.quantity <= 10,
        'bg-red-500': product.quantity === 0
      }">
        {{ product.quantity > 10 ? 'In Stock' : product.quantity > 0 ? 'Low Stock' : 'Out of Stock' }}
      </div>
    </div>

    <!-- Contenu -->
    <div class="mb-1.5 sm:mb-2 space-y-1 sm:space-y-1.5">
      <!-- Nom et SKU -->
      <div>
        <h3 class="text-xs sm:text-sm font-semibold text-gray-900 mb-0.5 line-clamp-2 leading-snug">
          {{ product.Prod_name }}
        </h3>
        <p class="text-xs text-gray-400 font-mono tracking-wider">
          SKU: {{ product.code_bar || 'N/A' }}
        </p>
      </div>

      <!-- Prix et Coût -->
      <div class="space-y-1.5 bg-gray-50 p-2 rounded">
        <div class="flex items-baseline justify-between gap-1 min-h-6">
          <p class="text-xs text-gray-500 font-medium shrink-0">Sell:</p>
          <span class="text-xs sm:text-sm font-bold text-green-600 text-right truncate">
            {{ format(product.selling_price) }}
          </span>
        </div>
        <div class="flex items-baseline justify-between gap-1 min-h-6">
          <p class="text-xs text-gray-500 font-medium shrink-0">Cost:</p>
          <span class="text-xs sm:text-sm font-semibold text-gray-700 text-right truncate">
            {{ format(product.cost_price) }}
          </span>
        </div>
      </div>

      <!-- Stock Status -->
      <div class="flex items-center justify-between pt-1 border-t border-gray-100">
        <span class="text-xs text-gray-600 font-medium">
          Stock: <strong>{{ product.quantity }}</strong>
        </span>
        <span v-if="product.quantity > 10" class="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded font-semibold">
          In Stock
        </span>
        <span v-else-if="product.quantity > 0" class="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded font-semibold animate-pulse">
          Low
        </span>
        <span v-else class="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded font-semibold">
          Out
        </span>
      </div>
    </div>

    <!-- Bouton d'action -->
    <button @click="$emit('add')" :disabled="product.quantity <= 0"
      class="w-full mt-1.5 sm:mt-2 py-1.5 sm:py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 hover:scale-102 active:scale-95 group/btn disabled:opacity-60">
      <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:rotate-90 transition-transform" fill="none" stroke="currentColor"
        viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      <span class="hidden sm:inline">Add to Sale</span>
      <span class="sm:hidden">Add</span>
    </button>

    <!-- Indicateur de sélection -->
    <div v-if="quantity > 0"
      class="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg z-10">
      <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
      </svg>
      <span class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCurrency } from '@/composable/useCurrency'
const { format } = useCurrency()
const props = defineProps({
  product: {
    type: Object,
    required: true,
    default: () => ({
      Prod_name: '',
      Prod_image: '',
      selling_price: 0,
      cost_price: 0,
      quantity: 0,
      code_bar: ''
    })
  }
})

defineEmits(['add'])
const quantity = ref(0)
</script>