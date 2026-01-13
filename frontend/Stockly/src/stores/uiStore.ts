import { defineStore } from 'pinia'
import { ref } from 'vue'

// stores/uiStore.js
export const useUIStore = defineStore('ui', {
  state: () => ({
    loadingCount: 0
  }),
  getters: {
    isLoading: (state) => state.loadingCount > 0
  },
  actions: {
    showLoader() { this.loadingCount++ },
    hideLoader() { if (this.loadingCount > 0) this.loadingCount-- }
  }
})
