<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div
            class="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 class="text-lg font-bold text-gray-900">Add New Expense</h3>
                <button @click="$emit('close')"
                    class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                    <XMarkIcon class="w-5 h-5" />
                </button>
            </div>

            <div class="p-6 space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Title <span
                            class="text-red-500">*</span></label>
                    <input v-model="form.title" type="text" placeholder="e.g., Office Rent"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Amount <span
                            class="text-red-500">*</span></label>
                    <input v-model.number="form.amount" type="number" step="0.01" placeholder="0.00"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Category <span
                            class="text-red-500">*</span></label>
                    <select v-model="form.category"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white">
                        <option value="">Select Category</option>
                        <option value="Rent">Rent</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Salaries">Salaries</option>
                        <option value="Supplies">Supplies</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Date <span
                            class="text-red-500">*</span></label>
                    <input v-model="form.date" type="date"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea v-model="form.description" rows="3" placeholder="Additional details..."
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-none"></textarea>
                </div>

                <div v-if="error" class="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                    {{ error }}
                </div>
            </div>

            <div class="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
                <button @click="$emit('close')"
                    class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                    Cancel
                </button>
                <button @click="submit" :disabled="loading"
                    class="px-4 py-2 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm shadow-orange-200 transition-all disabled:opacity-50 flex items-center gap-2">
                    <span v-if="loading"
                        class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    <span>Save Expense</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useExpenseStore } from '@/stores/expenseStore'

const emit = defineEmits(['close', 'created'])
const expenseStore = useExpenseStore()

const loading = ref(false)
const error = ref('')

const form = reactive({
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
})

const validate = () => {
    if (!form.title.trim()) return 'Title is required'
    if (!form.amount || form.amount <= 0) return 'Valid amount is required'
    if (!form.category) return 'Category is required'
    if (!form.date) return 'Date is required'
    return null
}

const submit = async () => {
    error.value = ''
    const validationError = validate()
    if (validationError) {
        error.value = validationError
        return
    }

    loading.value = true
    try {
        await expenseStore.addExpense({
            ...form,
            amount: parseFloat(form.amount)
        })
        emit('created')
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Failed to create expense'
    } finally {
        loading.value = false
    }
}
</script>
