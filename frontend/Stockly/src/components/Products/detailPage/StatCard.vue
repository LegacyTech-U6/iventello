<template>
    <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-5 space-y-3 h-full flex flex-col justify-between transition-all hover:shadow-lg">
        <div class="flex items-center justify-between">
            <span class="text-md font-medium text-gray-400 capitalize">{{ label }}</span>
            <span class="material-symbols-outlined text-xl text-blue-500">{{ icon }}</span>
        </div>
        
        <div v-if="isEditing" class="flex items-center gap-2">
            <input 
                :value="modelValue" 
                @input="$emit('update:value', isCurrency ? parseFloat($event.target.value) : parseInt($event.target.value))"
                :type="isCurrency ? 'number' : 'number'" 
                :min="0" 
                :step="isCurrency ? '0.01' : '1'"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right text-lg font-semibold" 
            />
        </div>
        <span v-else class="text-3xl font-bold" :class="isCurrency ? 'text-green-700' : 'text-gray-900'">
            {{ formatter(modelValue) }}
            <span v-if="isCurrency" class="text-xl text-green-500 font-normal ml-1">FCFA</span>
        </span>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
    icon: string
    label: string
    modelValue: string | number
    isEditing: boolean
    isCurrency?: boolean
    formatter?: (value: string | number) => string
}>()

const emit = defineEmits(['update:value'])

// Utilise la fonction formatter si elle est fournie, sinon affiche la valeur brute
const formatter = (value: string | number) => {
    if (props.formatter) {
        return props.formatter(value)
    }
    return value.toString()
}
</script>