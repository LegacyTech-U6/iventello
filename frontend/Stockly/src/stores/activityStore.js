import { defineStore } from 'pinia'
import {
  getAllActivities,
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
        console.error = error
      }
    },
   
   
  },
})
