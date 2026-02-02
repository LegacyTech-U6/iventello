<template>
    <div class="h-full bg-gray-50/50">
        <div class="border-b border-gray-200 bg-white sticky top-0 z-30">
            <div class="px-4 py-4 sm:px-8 sm:py-6">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 class="text-xl sm:text-2xl font-bold text-gray-900">{{ $t('expenses.title') }}</h1>
                        <p class="text-xs sm:text-sm text-gray-500 mt-1">{{ $t('expenses.subtitle') }}</p>
                    </div>

                    <div class="flex items-center gap-2">
                        <button @click="isCreateModalOpen = true"
                            class="flex-shrink-0 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold rounded-lg shadow-sm shadow-orange-200 transition-all flex items-center gap-2">
                            <PlusIcon class="w-5 h-5" />
                            <span>{{ $t('expenses.add_button') }}</span>
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <GridCard :title="$t('expenses.total_expenses')" :value="format(totalAmount)" :icon="BanknotesIcon"
                        bgColor="#ea580c" />
                    <GridCard :title="$t('expenses.expense_count')" :value="expenseStore.totalExpenses"
                        :icon="DocumentTextIcon" bgColor="#2563eb" />
                </div>
            </div>
        </div>

        <div class="px-4 py-6 sm:px-8">
            <div v-if="loading" class="flex flex-col justify-center items-center py-32 gap-4">
                <n-spin size="large" />
                <p class="text-gray-500 animate-pulse">{{ $t('expenses.loading') }}</p>
            </div>

            <div v-else-if="expenseStore.expenses.length === 0"
                class="bg-white border-2 border-dashed border-gray-200 rounded-3xl py-20 px-6 text-center">
                <div class="w-20 h-20 bg-gray-50 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <DocumentTextIcon class="w-10 h-10 text-gray-300" />
                </div>
                <h3 class="text-lg font-bold text-gray-900 mb-1">{{ $t('expenses.empty.title') }}</h3>
                <p class="text-gray-500 mb-6 max-w-xs mx-auto text-sm">{{ $t('expenses.empty.subtitle') }}</p>
                <button @click="isCreateModalOpen = true"
                    class="px-6 py-2 bg-gray-900 text-white rounded-full text-sm font-medium">
                    {{ $t('expenses.add_button') }}
                </button>
            </div>

            <div v-else class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead class="bg-gray-50 border-b border-gray-200">
                            <tr class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                <th class="px-6 py-4">{{ $t('expenses.table.title') }}</th>
                                <th class="px-6 py-4">{{ $t('expenses.table.category') }}</th>
                                <th class="px-6 py-4">{{ $t('expenses.table.date') }}</th>
                                <th class="px-6 py-4 text-right">{{ $t('expenses.table.amount') }}</th>
                                <th class="px-6 py-4">{{ $t('expenses.table.description') }}</th>
                                <th class="px-6 py-4 text-right">{{ $t('expenses.table.actions') }}</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr v-for="expense in expenseStore.expenses" :key="expense.id"
                                class="hover:bg-gray-50 transition-colors">
                                <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ expense.title }}</td>
                                <td class="px-6 py-4 text-sm text-gray-500">
                                    <span
                                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        {{ expense.category }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(expense.date) }}</td>
                                <td class="px-6 py-4 text-sm font-bold text-gray-900 text-right"
                                    :style="getDynamicStyle(expense.amount)">
                                    {{ format(expense.amount) }}
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{{ expense.description ||
                                    '-' }}</td>
                                <td class="px-6 py-4 text-right">
                                    <button @click="deleteExpense(expense.id)"
                                        class="text-red-600 hover:text-red-900 text-sm font-medium">Delete</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Create Expense Modal -->
        <CreateExpenseModal v-if="isCreateModalOpen" @close="isCreateModalOpen = false" @created="refreshExpenses" />
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useExpenseStore } from '@/stores/expenseStore'
import { PlusIcon, BanknotesIcon, DocumentTextIcon } from '@heroicons/vue/24/outline'
import { NSpin } from 'naive-ui'
import GridCard from '@/components/ui/cards/GridCard.vue'
import CreateExpenseModal from '@/components/expenses/CreateExpenseModal.vue'
import { useCurrency } from '@/composable/useCurrency'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { format, getDynamicStyle } = useCurrency()
const expenseStore = useExpenseStore()
const isCreateModalOpen = ref(false)
const loading = computed(() => expenseStore.loading)

const totalAmount = computed(() => {
    return expenseStore.expenses.reduce((sum, e) => sum + e.amount, 0)
})

const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString()
}

const deleteExpense = async (id) => {
    if (confirm(t('expenses.delete_confirm'))) {
        await expenseStore.deleteExpense(id)
    }
}

const refreshExpenses = async () => {
    await expenseStore.fetchExpenses()
    isCreateModalOpen.value = false
}

onMounted(() => {
    expenseStore.fetchExpenses()
})
</script>
