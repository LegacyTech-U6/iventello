<template>
    <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-700">{{ label }}</label>
        <div v-if="isEditing">
            <input 
                :value="modelValue"
                @input="$emit('update:value', $event.target.value)"
                :type="type" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" 
            />
        </div>
        <p v-else class="text-gray-900 font-semibold bg-gray-50 p-2 rounded-md border border-gray-100">
            {{ valueDisplay }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    label: string
    modelValue: string | number
    value?: string | number // Utilisé pour afficher le formaté si différent du modelValue (ex: date)
    isEditing: boolean
    type?: string // 'text', 'number', 'date', etc.
}>()

const emit = defineEmits(['update:value'])

const valueDisplay = computed(() => props.value !== undefined ? props.value : props.modelValue)
</script>