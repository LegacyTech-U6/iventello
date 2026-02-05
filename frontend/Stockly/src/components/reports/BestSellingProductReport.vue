<template>
  <n-card title="Produit le Plus Vendu" :bordered="false" class="rounded-2xl shadow-sm" content-style="padding: 24px;">
    <n-space vertical size="large">
      <div v-if="product?.name">
        <div class="space-y-4">
          <div class="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p class="text-sm text-gray-600 font-medium">Produit</p>
            <p class="text-xl font-bold text-gray-900 mt-1">{{ product.name }}</p>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="p-3 bg-green-50 rounded-xl border border-green-100">
              <p class="text-[11px] text-gray-600 font-medium uppercase">Quantité</p>
              <p class="text-lg font-bold text-green-600 mt-1">{{ product.totalQuantity }}</p>
            </div>
            <div class="p-3 bg-orange-50 rounded-xl border border-orange-100">
              <p class="text-[11px] text-gray-600 font-medium uppercase">Revenu</p>
              <p class="text-lg font-bold text-orange-600 mt-1">{{ format(product.totalRevenue) }}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-8">
        <n-icon size="48" class="text-gray-300">
          <ShoppingBagIcon />
        </n-icon>
        <p class="text-gray-500 font-medium mt-2">Aucun produit vendu</p>
      </div>
    </n-space>
  </n-card>
</template>

<script setup>
import { NCard, NSpace, NIcon } from 'naive-ui'
import { ShoppingBagIcon } from '@heroicons/vue/24/outline'
import { useCurrency } from '@/composable/useCurrency'

const props = defineProps({
  product: {
    type: Object,
    default: () => null
  }
})

const { format } = useCurrency()
</script>
