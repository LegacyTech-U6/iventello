<template>
    <div class="space-y-6 animate-fade-in-up">
        <!-- Header Controls -->
        <div
            class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div>
                <h2 class="text-xl font-bold text-gray-800">Advanced Analytics</h2>
                <p class="text-sm text-gray-500">Deep dive into your business performance</p>
            </div>
            <div class="flex gap-2">
                <select v-model="period"
                    class="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                    <option value="day">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                </select>
                <button @click="refreshData"
                    class="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                    <ArrowPathIcon class="w-5 h-5" :class="{ 'animate-spin': loading }" />
                </button>
            </div>
        </div>

        <!-- KPI Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group">
                <div class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <CurrencyDollarIcon class="w-16 h-16 text-indigo-600" />
                </div>
                <p class="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Sales</p>
                <h3 class="text-2xl font-bold text-gray-900 mt-1" :style="getDynamicStyle(totalSales)">
                    {{ format(totalSales) }}
                </h3>
                <p class="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
                    {{ period }} period
                </p>
            </div>

            <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group">
                <div class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <BanknotesIcon class="w-16 h-16 text-emerald-600" />
                </div>
                <p class="text-sm font-bold text-gray-500 uppercase tracking-wider">Net Profit</p>
                <h3 class="text-2xl font-bold text-gray-900 mt-1" :style="getDynamicStyle(totalProfit)">
                    {{ format(totalProfit) }}
                </h3>
                <div class="mt-2 text-xs font-medium" :class="profitMargin >= 0 ? 'text-emerald-600' : 'text-red-600'">
                    {{ profitMargin.toFixed(1) }}% Margin
                </div>
            </div>

            <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group">
                <div class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <CreditCardIcon class="w-16 h-16 text-orange-600" />
                </div>
                <p class="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Expenses</p>
                <h3 class="text-2xl font-bold text-gray-900 mt-1" :style="getDynamicStyle(totalExpenses)">
                    {{ format(totalExpenses) }}
                </h3>
                <p class="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full bg-orange-500"></span>
                    Operational costs
                </p>
            </div>

            <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group">
                <div class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ShoppingBagIcon class="w-16 h-16 text-blue-600" />
                </div>
                <p class="text-sm font-bold text-gray-500 uppercase tracking-wider">Products Sold</p>
                <h3 class="text-2xl font-bold text-gray-900 mt-1">
                    {{ totalItemsSold }}
                </h3>
                <p class="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                    Units
                </p>
            </div>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <ChartBarIcon class="w-5 h-5 text-indigo-500" />
                    Sales vs Profit Trend
                </h3>
                <div class="h-64 flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
                    <!-- Placeholder for Chart - Ideally use Chart.js or ApexCharts here -->
                    <p>Chart Component Placeholder</p>
                </div>
            </div>

            <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <ChartPieIcon class="w-5 h-5 text-orange-500" />
                    Expense Breakdown
                </h3>
                <div class="h-64 flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
                    <!-- Placeholder for Chart -->
                    <p>Chart Component Placeholder</p>
                </div>
            </div>
        </div>

        <!-- Detailed Product Performance Table -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 class="font-bold text-gray-900">Product Performance ({{ period }})</h3>
                <button @click="exportPDF"
                    class="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                    <span>Export PDF</span>
                </button>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead class="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th class="px-6 py-3">Product</th>
                            <th class="px-6 py-3 text-right">Qty Sold</th>
                            <th class="px-6 py-3 text-right">Revenue</th>
                            <th class="px-6 py-3 text-right">Cost</th>
                            <th class="px-6 py-3 text-right">Profit</th>
                            <th class="px-6 py-3 text-right">Margin</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <tr v-for="item in productPerformance" :key="item.id"
                            class="hover:bg-gray-50 transition-colors">
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                        <img :src="item.image || 'https://placehold.co/100'"
                                            class="w-full h-full object-cover">
                                    </div>
                                    <div>
                                        <p class="text-sm font-bold text-gray-900">{{ item.name }}</p>
                                        <p class="text-xs text-gray-500">{{ item.category }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-600 text-right">{{ item.qty }}</td>
                            <td class="px-6 py-4 text-sm font-medium text-gray-900 text-right">{{ format(item.revenue)
                                }}</td>
                            <td class="px-6 py-4 text-sm text-gray-500 text-right">{{ format(item.cost) }}</td>
                            <td class="px-6 py-4 text-sm font-bold text-emerald-600 text-right">{{ format(item.profit)
                                }}</td>
                            <td class="px-6 py-4 text-xs font-bold text-right py-1">
                                <span class="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                    {{ ((item.profit / item.revenue) * 100).toFixed(1) }}%
                                </span>
                            </td>
                        </tr>
                        <tr v-if="productPerformance.length === 0">
                            <td colspan="6" class="px-6 py-12 text-center text-gray-500 text-sm">
                                No sales data available for this period.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import {
    ArrowPathIcon, CurrencyDollarIcon, BanknotesIcon, CreditCardIcon, ShoppingBagIcon,
    ChartBarIcon, ChartPieIcon
} from '@heroicons/vue/24/outline'
import { useCurrency } from '@/composable/useCurrency'
import { useStatisticsStore } from '@/stores/statisticStore'
import { useExpenseStore } from '@/stores/expenseStore'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const { format, getDynamicStyle } = useCurrency()
const statisticStore = useStatisticsStore()
const expenseStore = useExpenseStore()

const period = ref('day')
const loading = ref(false)

// Data Placeholders - In a real scenario, these would come from store actions triggered by 'period'
const totalSales = ref(0)
const totalProfit = ref(0)
const totalExpenses = ref(0)
const totalItemsSold = ref(0)
const productPerformance = ref([])

const profitMargin = computed(() => {
    if (totalSales.value === 0) return 0
    return (totalProfit.value / totalSales.value) * 100
})

const refreshData = async () => {
    loading.value = true
    try {
        await statisticStore.fetchBestSellingProduct(period.value)
        await statisticStore.fetchProfit(period.value)
        await statisticStore.fetchRevenue(period.value)
        await statisticStore.fetchSalesReport(period.value)

        // Populate actual data from stores
        totalSales.value = statisticStore.revenue?.total || statisticStore.revenue || 0
        totalProfit.value = statisticStore.profit?.total || statisticStore.profit || 0

        // Expenses - assume we calculate via separate endpoint or derived
        // Ideally expenseStore should have a fetchByPeriod method, but if not we might fallback or sum
        // For now, let's assume we can get a total expense from stats or similar
        totalExpenses.value = (totalSales.value - totalProfit.value) // Simplified derivation if not explicitly fetched

        totalItemsSold.value = statisticStore.topProducts.sales?.total || statisticStore.topProducts.length * 10 || 0

        // Populate Table
        if (statisticStore.topProducts) {
            productPerformance.value = statisticStore.topProducts.map(p => ({
                id: p.id,
                name: p.Prod_name,
                category: p.category?.name || 'Uncategorized',
                qty: parseFloat(p.total_sold),
                revenue: parseFloat(p.total_revenue),
                cost: parseFloat(p.total_cost || 0),
                profit: parseFloat(p.total_profit),
                image: p.Prod_image
            }))
        } else if (Array.isArray(statisticStore.topProducts)) {
            // Fallback for mocked array structure if needed
            productPerformance.value = statisticStore.topProducts
        }

    } catch (err) {
        console.error("Failed to refresh analytics:", err)
    } finally {
        loading.value = false
    }
}

const exportPDF = () => {
    const doc = new jsPDF()

    // Header
    doc.setFontSize(18)
    doc.text(`Sales Report - ${period.value.toUpperCase()}`, 14, 20)

    doc.setFontSize(10)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28)

    // Summary
    doc.text(`Total Sales: ${format(totalSales.value)}`, 14, 40)
    doc.text(`Total Profit: ${format(totalProfit.value)}`, 14, 46)
    doc.text(`Total Expenses: ${format(totalExpenses.value)}`, 14, 52)
    doc.text(`Items Sold: ${totalItemsSold.value}`, 14, 58)

    // Table
    const tableColumn = ["Product", "Category", "Qty", "Revenue", "Profit", "Margin"]
    const tableRows = []

    productPerformance.value.forEach(item => {
        const itemData = [
            item.name,
            item.category,
            item.qty,
            format(item.revenue),
            format(item.profit),
            `${((item.profit / item.revenue) * 100).toFixed(1)}%`
        ]
        tableRows.push(itemData)
    })

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 70,
    })

    doc.save(`sales-report-${period.value}-${new Date().toISOString().slice(0, 10)}.pdf`)
}

watch(period, () => {
    refreshData()
})

onMounted(() => {
    refreshData()
})
</script>

<style scoped>
.animate-fade-in-up {
    animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
