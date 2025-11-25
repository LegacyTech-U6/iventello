<template>
  <div
    class="group bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-500 transition-all duration-300 cursor-pointer relative overflow-hidden hover:-translate-y-1">
    <!-- Image du produit -->
    <div class="relative w-full h-28 bg-gray-50 rounded-lg overflow-hidden mb-3">
      <img :src="product.Prod_image" :alt="product.Prod_name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      <!-- Badge de stock -->
      <div class="absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide text-white" :class="{
        'bg-green-500': product.quantity > 10,
        'bg-orange-500': product.quantity > 0 && product.quantity <= 10,
        'bg-red-500': product.quantity === 0
      }">
        {{ product.quantity > 10 ? 'In Stock' : product.quantity > 0 ? 'Low Stock' : 'Out of Stock' }}
      </div>
    </div>

    <!-- Contenu -->
    <div class="mb-3">
      <!-- Nom et SKU -->
      <h3 class="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 leading-tight">
        {{ product.Prod_name }}
      </h3>
      <p class="text-xs text-gray-500 mb-2 font-mono">
        SKU: {{ product.code_bar || 'N/A' }}
      </p>

      <!-- Prix -->
      <div class="flex justify-between items-center mb-2">
        <span class="text-base font-bold text-green-600">
          {{ format(product.selling_price) }}
        </span>
        <span class="text-xs text-gray-500 italic">
          Cost: {{format(product.cost_price) }}
        </span>
      </div>

      <!-- Stock -->
      <div class="flex justify-between items-center text-xs">
        <span class="text-gray-500">
          Qty: {{ product.quantity }}
        </span>
        <span v-if="product.quantity > 0 && product.quantity <= 10" class="text-red-600 font-semibold animate-pulse">
          Low Stock
        </span>
        <span v-else-if="product.quantity === 0" class="text-red-600 font-semibold">
          Out of Stock
        </span>
      </div>
    </div>

    <!-- Bouton -->
    <button @click="$emit('add')" :disabled="product.quantity <= 0"
      class="w-full py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-1 hover:scale-105 active:scale-95 group/btn">
      <svg class="w-4 h-4 group-hover/btn:rotate-90 transition-transform" fill="none" stroke="currentColor"
        viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Add to Sale
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