<template>
    <n-card title="Analyse des Profits" :bordered="false" class="rounded-2xl shadow-sm" content-style="padding: 24px;">
        <n-space vertical size="large">
            <div class="space-y-4">
                <div class="p-4 bg-green-50 rounded-xl border border-green-100">
                    <p class="text-sm text-gray-600 font-medium">Profit Total</p>
                    <p class="text-2xl font-bold text-green-600 mt-1">{{ format(totalProfit) }}</p>
                </div>
                <div class="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p class="text-sm text-gray-600 font-medium">Profit Moyen par Vente</p>
                    <p class="text-2xl font-bold text-blue-600 mt-1">{{ format(averageProfit) }}</p>
                </div>
            </div>
        </n-space>
    </n-card>
</template>

<script setup>
import { NCard, NSpace } from 'naive-ui'
import { useCurrency } from '@/composable/useCurrency'

const props = defineProps({
    totalProfit: {
        type: Number,
        default: 0
    },
    averageProfit: {
        type: Number,
        default: 0
    }
})

const { format } = useCurrency()
</script>
