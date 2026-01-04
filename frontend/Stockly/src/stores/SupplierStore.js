// stores/supplierStore.js
import { defineStore } from 'pinia'
import {
  createSupplier,
  getSuppliers,
  getOneSupplier,
  updateSupplier,
  deleteSupplier,
} from '@/service/api' // adjust the path if needed

export const useSupplierStore = defineStore('supplier', {
  state: () => ({
    suppliers: [],
    selectedSupplier: null,
    loading: false,
    submitError: null,
    submitLoading: false,
  }),

  actions: {
    // ✅ Fetch all suppliers
    async fetchSuppliers() {
      this.loading = true
      this.submitError = null
      try {
        const res = await getSuppliers()
        this.suppliers = res.data || []
        console.log(res)
      } catch (error) {
        console.error('Error fetching suppliers:', error)
        this.submitError = error
      } finally {
        this.loading = false
      }
    },

    // ✅ Fetch one supplier by ID
    async fetchSupplier(id) {
      this.loading = true
      this.submitError = null
      try {
        const data = await getOneSupplier(id)
        this.selectedSupplier = data
        return data
      } catch (error) {
        console.error('Error fetching supplier:', error)
        this.submitError = error
      } finally {
        this.loading = false
      }
    },

    // ✅ Create a new supplier
    async createSupplier(supplierData) {
      this.submitLoading = true
      this.submitError = null
      try {
        const data = await createSupplier(supplierData)
        this.suppliers.push(data) // add to state
        return data
      } catch (error) {
        console.error('Error creating supplier:', error)
        this.submitError = error
      } finally {
        this.submitLoading = false
      }
    },

    // ✅ Update an existing supplier
    async updateSupplier(id, supplierData) {
      this.submitLoading = true
      this.submitError = null
      try {
        const updated = await updateSupplier(id, supplierData)
        const index = this.suppliers.findIndex((s) => s.id === id)
        if (index !== -1) this.suppliers[index] = updated
        return updated
      } catch (error) {
        console.error('Error updating supplier:', error)
        this.submitError = error
      } finally {
        this.submitLoading = false
      }
    },

    // ✅ Delete a supplier
    async deleteSupplier(id) {
      this.submitLoading = true
      this.submitError = null
      try {
        await deleteSupplier(id)
        this.suppliers = this.suppliers.filter((s) => s.id !== id)
      } catch (error) {
        console.error('Error deleting supplier:', error)
        this.submitError = error
      } finally {
        this.submitLoading = false
      }
    },
  },
})
