// stores/statistics.store.js
import { defineStore } from 'pinia'
import {
  getProductSales,
  getSalesReport,
  getBestSellingProduct,
  getBestCategory,
  getBestByCategory,
  getRevenue,
  getProfit,
  compareSales,
  getQuarterlySales,
  getSalesTrend,
  getRevenueByCategory,
  getProductDistributionByCategory,
  getClientsTats,
  getAdminDashboard,
  getExpenseStats,
  getReportDiscounts,
} from '@/service/api'

export const useStatisticsStore = defineStore('statistics', {
  state: () => ({
    productSales: [],
    salesReport: [],
    bestSellingProduct: null,
    bestCategory: null,
    bestByCategory: {},
    revenue: { total: 0, history: [] },
    profit: { total: 0, history: [] },
    profit: { total: 0, history: [] },
    expenses: { total: 0, history: [] },
    discounts: { totalDiscount: 0 },
    salesComparison: null,
    quarterlySales: [],
    salesTrend: [],
    loading: false,
    error: null,
    revenueByCategory: [],
    topProducts: [],
    client: [],
    // Admin Global Stats
    adminStats: {
      totalRevenue: 0,
      totalProfit: 0,
      totalSales: 0,
      totalEnterprises: 0,
      totalProducts: 0,
      totalWorkers: 0,
      totalClients: 0,
    },
    enterprisePerformance: [],
    globalActivities: [],
  }),

  actions: {
    // 🔹 Fetch total product sales
    async fetchProductSales(period = 'month') {
      this.loading = true
      try {
        // Pass the selected period to your backend API
        const data = await getProductSales(period)

        // Store the returned stats
        this.topProducts = data || []

        console.log(data)
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    // 🔹 Fetch sales report for a given period
    async fetchSalesReport(period = 'month') {
      this.loading = true
      try {
        const data = await getSalesReport(period)
        console.log('====================================')
        console.log(data)
        console.log('====================================')
        this.salesReport = data.report || []
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    // 🔹 Fetch the best-selling product for a given period
    async fetchBestSellingProduct(period = 'month') {
      this.loading = true
      try {
        const data = await getBestSellingProduct(period, 5)
        this.bestSellingProduct = data
        console.log('====================================')
        console.log(data)
        console.log('====================================')
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    // 🔹 Fetch the best-selling category
    async fetchBestCategory() {
      this.loading = true
      try {
        this.bestCategory = await getBestCategory()
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    // 🔹 Fetch best products by category
    async fetchBestByCategory(categoryId) {
      this.loading = true
      try {
        const data = await getBestByCategory(categoryId)
        this.bestByCategory[categoryId] = data.bestProducts || []
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    // 🔹 Fetch revenue for a period
    async fetchRevenue(period = 'day') {
      this.loading = true
      try {
        const data = await getRevenue(period)
        console.log('====================================')
        console.log(data)
        console.log('====================================')
        this.revenue = data.revenue || 0
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    // 🔹 Fetch profit for a period
    async fetchProfit(period = 'month') {
      this.loading = true
      try {
        const data = await getProfit(period)
        console.log('====================================')
        console.log(data)
        console.log('====================================')
        this.profit = data || 0
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    // 🔹 Compare sales with previous period
    async fetchCompareSales(period = 'month') {
      this.loading = true
      try {
        const data = await compareSales(period)
        this.salesComparison = data
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    // 🔹 Fetch quarterly sales
    async fetchQuarterlySales() {
      this.loading = true
      try {
        this.quarterlySales = await getQuarterlySales()
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    // 🔹 Fetch sales trend (for charting)
    async fetchSalesTrend(period = 'month') {
      this.loading = true
      try {
        const data = await getSalesTrend(period)
        this.salesTrend = data.trend || []
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
    async fetchRevenueByCategory(period = 'month') {
      const data = await getRevenueByCategory(period)
      console.log(data)

      this.revenueByCategory = data.revenue
    },

    async fetchProductDistributionByCategory() {
      try {
        const data = await getProductDistributionByCategory()
        this.productDistributionByCategory = data
      } catch (err) {
        console.error('Erreur distribution produits:', err)
      }
    },
    async fetclient(period = 'month') {
      try {
        const data = await getClientsTats(period)
        console.log(data)
        this.client = data
      } catch (err) {
        console.error('Erreur', err)
      }
    },

    async fetchAdminDashboard() {
      this.loading = true
      try {
        const { data } = await getAdminDashboard()
        this.adminStats = data.stats
        this.enterprisePerformance = data.performance
        this.globalActivities = data.activities
        return data
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
    clearStats() {
      this.productSales = []
      this.salesReport = []
      this.bestSellingProduct = null
      this.bestCategory = null
      this.bestByCategory = {}
      this.revenue = { total: 0, history: [] }
      this.profit = { total: 0, history: [] }
      this.salesComparison = null
      this.quarterlySales = []
      this.salesTrend = []
      this.revenueByCategory = []
      this.topProducts = []
      this.client = []
    },
    // 🔹 Fetch expenses for a period
    async fetchExpenseStats(period = 'month') {
      this.loading = true
      try {
        const data = await getExpenseStats(period)
        console.log('====================================')
        console.log('Expenses:', data)
        console.log('====================================')
        this.expenses = data.expenses || { total: 0, history: [] }
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    // 🔹 Fetch discounts for a period
    async fetchDiscountReport(period = 'month') {
      this.loading = true
      try {
        const data = await getReportDiscounts(period)
        this.discounts = data.data || { totalDiscount: 0 }
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
  },
})
