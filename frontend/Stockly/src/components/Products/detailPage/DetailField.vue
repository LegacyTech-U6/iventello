<template>
    <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-700">{{ label }}</label>
        <div v-if="isEditing">
            <input 
                :value="modelValue"
                @input="onInput"
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

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number): void
    (e: 'update:value', value: string | number): void
}>()

const valueDisplay = computed(() => props.value !== undefined ? props.value : props.modelValue)

function onInput(e: Event) {
    const input = e.target as HTMLInputElement
    let val: string | number = input.value
    if (props.type === 'number') {
        const n = Number(val)
        val = Number.isNaN(n) ? val : n
    }
    emit('update:modelValue', val)
    emit('update:value', val)
}
</script>