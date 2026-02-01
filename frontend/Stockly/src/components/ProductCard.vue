<template>
  <div
    class="group bg-white rounded-3xl p-3 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer relative flex flex-col h-full">
    <div class="relative w-full aspect-square bg-[#F2F2F2] rounded-2xl overflow-hidden mb-4">
      <div
        class="absolute top-0 left-0 px-4 py-1.5 bg-[#1A1A1A] text-white text-[11px] font-bold uppercase tracking-wider rounded-br-2xl z-10">
        {{ product.quantity }} Stock
      </div>

      <img :src="product.Prod_image" :alt="product.Prod_name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
    </div>

    <div class="flex flex-col flex-1 px-1">
      <div class="mb-2">
        <span v-if="product.category"
          class="text-[10px] font-black text-indigo-600 uppercase tracking-widest block mb-1">
          {{ product.category.name }}
        </span>
        <h3 class="text-lg font-bold text-[#1A1A1A] leading-tight line-clamp-1">
          {{ product.Prod_name }}
        </h3>
      </div>

      <p class="text-gray-400 text-xs line-clamp-2 mb-3 leading-relaxed">
        {{ product.description || 'Modern and elegant design. Perfect for daily use and professional environments.' }}
      </p>

      <div class="mb-4">
        <span class="text-xl font-black text-[#1A1A1A]" :style="getDynamicStyle(product.selling_price)">
          {{ format(product.selling_price) }}
        </span>
      </div>

      <button @click="$emit('add')" :disabled="product.quantity <= 0"
        class="w-full py-3 bg-white border border-gray-200 hover:bg-[#1A1A1A] hover:text-white disabled:opacity-50 text-[#1A1A1A] rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm mt-auto">
        <PlusIcon class="w-5 h-5" />
        <span class="text-sm">Add to Cart</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { PlusIcon } from '@heroicons/vue/24/outline'
import { useCurrency } from '@/composable/useCurrency'

const { format, getDynamicStyle } = useCurrency()

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

defineEmits(['add'])
</script>

<style scoped>
/* Force le format carré peu importe la taille de l'écran */
.aspect-square {
  aspect-ratio: 1 / 1;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>