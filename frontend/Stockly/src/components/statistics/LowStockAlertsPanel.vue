<template>
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
        <div class="p-6 border-b border-gray-200 flex items-center justify-between bg-white sticky top-0 z-10">
            <div class="flex items-center gap-3">
                <div class="p-2 bg-red-50 rounded-lg text-red-600">
                    <ExclamationTriangleIcon class="w-6 h-6" />
                </div>
                <h2 class="text-lg font-bold text-gray-900 tracking-tight">Low Stock Alerts</h2>
            </div>
            <router-link to="lowStock"
                class="text-sm font-black text-primary hover:text-primary/80 transition-colors uppercase tracking-widest">
                View All
            </router-link>
        </div>

        <div class="flex-1 overflow-y-auto">
            <div v-if="loading" class="p-12 flex flex-col items-center justify-center gap-4">
                <div class="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p class="text-sm font-medium text-gray-400">Checking inventory...</p>
            </div>

            <div v-else-if="products.length > 0" class="divide-y divide-gray-100">
                <div v-for="product in products.slice(0, 6)" :key="product.id"
                    class="p-5 hover:bg-gray-50/80 transition-colors group cursor-pointer"
                    @click="goToRestock(product.id)">
                    <div class="flex items-center gap-4">
                        <div
                            class="w-12 h-12 rounded-xl bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100">
                            <img v-if="product.Prod_image" :src="product.Prod_image"
                                class="w-full h-full object-cover" />
                            <CubeIcon v-else class="w-6 h-6 text-gray-300" />
                        </div>

                        <div class="flex-1 min-w-0">
                            <h3 class="text-sm font-bold text-gray-900 truncate mb-1">
                                {{ product.Prod_name }}
                            </h3>
                            <div class="flex items-center gap-2">
                                <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
                                    :class="product.stockLevel === 'critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'">
                                    {{ product.stockLevel || 'Warning' }}
                                </span>
                                <span class="text-xs font-medium text-gray-400">
                                    {{ product.quantity }} in stock
                                </span>
                            </div>
                        </div>

                        <div class="text-right flex-shrink-0">
                            <div
                                class="p-2 rounded-lg bg-gray-50 text-gray-400 group-hover:bg-primary group-hover:text-white transition-all">
                                <ArrowRightIcon class="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="p-12 flex flex-col items-center justify-center text-center">
                <div class="w-16 h-16 bg-blue-50 text-blue-400 rounded-2xl flex items-center justify-center mb-4">
                    <CheckCircleIcon class="w-10 h-10" />
                </div>
                <h3 class="text-base font-bold text-gray-900 mb-1">Stock Levels Healthy</h3>
                <p class="text-sm font-medium text-gray-400 px-4">
                    All your inventory items are currently above their minimum stock levels.
                </p>
            </div>
        </div>

        <div v-if="products.length > 0" class="p-4 bg-gray-50/50 border-t border-gray-100">
            <p class="text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">
                Total of {{ products.length }} items need attention
            </p>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/stores/productStore'
import {
    ExclamationTriangleIcon,
    CubeIcon,
    CheckCircleIcon,
    ArrowRightIcon,
} from '@heroicons/vue/24/outline'

const productStore = useProductStore()
const router = useRouter()
const loading = ref(false)

const products = computed(() => productStore.lowProducts?.data || [])

onMounted(async () => {
    if (products.value.length === 0) {
        loading.value = true
        await productStore.fetchLowStockProducts()
        loading.value = false
    }
})

const goToRestock = (id) => {
    router.push({ name: 'restock', params: { reStockId: id } })
}
</script>
