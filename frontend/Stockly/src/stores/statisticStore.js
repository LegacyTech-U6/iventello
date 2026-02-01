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
        const data = await getBestSellingProduct(period)
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
    async fetchTopProducts() {
      // Mock API call, replace with your backend API
      this.topProducts = [
        { id: 1, name: 'Product A', quantity_sold: 120, revenue: 2400, profit: 900 },
        { id: 2, name: 'Product B', quantity_sold: 90, revenue: 1800, profit: 700 },
        { id: 3, name: 'Product C', quantity_sold: 75, revenue: 1500, profit: 600 },
        { id: 4, name: 'Product D', quantity_sold: 60, revenue: 1200, profit: 400 },
        { id: 5, name: 'Product E', quantity_sold: 50, revenue: 1000, profit: 350 },
      ]
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
  },
})
