import { defineStore } from 'pinia'
import {
  getAllActivities,
  getDailyPurchaseReport,
  getDailySalesReport,
  getSellingReport,
} from '@/service/api'
export const useActivityStore = defineStore('Activity', {
  state: () => ({
    activities: [],
    salesReport: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchActivities() {
      try {
        const data = await getAllActivities()
        console.log('====================================')
        console.log(data)
        console.log('====================================')
        this.activities = data.activities
        console.log('====================================')
        console.log(this.activities)
        console.log('====================================')
      } catch (error) {
        console.error(error)
      }
    },
    async fetchDailySalesReport() {
      try {
        const data = await getDailySalesReport()
        console.log('====================================')
        console.log('report :', data)
        console.log('====================================')
        return data
      } catch (error) {
        console.error(error)
      }
    },
    async fetchDailyPurchaseReport(date) {
      try {
        const data = await getDailyPurchaseReport(date)
        return data
      } catch (error) {
        console.error(error)
      }
    },
    async fetchSalesReports() {
      this.loading = true
      this.error = null
      try {
        const data = await getSellingReport()
        console.log(data)

        this.salesReport = data
      } catch (err) {
        this.error = err.response?.data?.message
      } finally {
        this.loading = false
      }
    },
  },
})
