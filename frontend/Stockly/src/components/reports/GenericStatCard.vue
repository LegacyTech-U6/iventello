<template>
    <n-card :bordered="false" class="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
        <n-statistic :label="label">
            <template #prefix>
                <n-icon :class="iconColorClass">
                    <component :is="icon" />
                </n-icon>
            </template>
            <template #default>
                <span :class="valueColorClass">{{ formattedValue }}</span>
            </template>
        </n-statistic>
    </n-card>
</template>

<script setup>
import { computed } from 'vue'
import { NCard, NStatistic, NIcon } from 'naive-ui'
import { useCurrency } from '@/composable/useCurrency'

const props = defineProps({
    label: String,
    value: [Number, String],
    icon: [Object, Function],
    color: {
        type: String,
        default: 'blue' // 'blue', 'green', 'red', 'orange', 'purple'
    },
    isCurrency: {
        type: Boolean,
        default: true
    }
})

const { format } = useCurrency()

const formattedValue = computed(() => {
    return props.isCurrency ? format(props.value) : props.value
})

const iconColorClass = computed(() => {
    const colors = {
        blue: 'text-blue-500',
        green: 'text-green-500',
        red: 'text-red-500',
        orange: 'text-orange-500',
        purple: 'text-purple-500',
        gray: 'text-gray-500'
    }
    return colors[props.color] || 'text-gray-500'
})

const valueColorClass = computed(() => {
    // Optional: color the value same as icon, or keep black
    return ''
})
</script>
