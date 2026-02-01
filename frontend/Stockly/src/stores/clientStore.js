import { defineStore } from 'pinia'
import { getClient, getClientById, updateClient, CreateClient, deleteClient } from '@/service/api'

export const useClientStore = defineStore('client', {
  state: () => ({
    clients: [],
    selectedClient: null,
    clientForm: {
      client_name: '',
      client_Signature: '',
      client_PhoneNumber: '',
      email: '',
      location: '',
      image: '',
    },
    loading: false,
    error: null,
    isFormOpen: false,
    isDetailsOpen: false,
    submitLoading: false, // Separate loading state for form submission
    submitError: null, // Separate error state for form submission
  }),

  actions: {
    async fetchClients() {
      this.loading = true
      this.error = null
      try {
        const data = await getClient()
        this.clients = data.data
        console.log(this.clients)
      } catch (err) {
        this.error = err.response?.data?.message || err.message || 'Failed to fetch clients'
        console.error('Error fetching clients:', err)
        throw err // Re-throw for component handling
      } finally {
        this.loading = false
      }
    },

    async fetchClientById(id) {
      this.loading = true
      this.error = null
      try {
        this.selectedClient = await getClientById(id)
        console.log('====================================')
        console.log(this.selectedClient)
        console.log('====================================')
      } catch (err) {
        this.error = err.response?.data?.message || err.message || 'Failed to fetch client details'
        console.error('Error fetching client:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async addClient(formData) {
      this.submitLoading = true
      this.submitError = null
      try {
        console.log('====================================')
        console.log(formData)
        console.log('====================================')

        await CreateClient(formData)
        await this.fetchClients() // Refresh the list
        this.fermerFormulaire() // Close form on success
        return { success: true }
      } catch (error) {
        this.submitError = error.response?.data?.message || error.message || 'Failed to add client'
        console.error('Error adding client:', error)
        throw error
      } finally {
        this.submitLoading = false
      }
    },

    async updateClient(clientId, clientData) {
      this.submitLoading = true
      this.submitError = null
      try {
        await updateClient(clientId, clientData)
        await this.fetchClients()
        return { success: true }
      } catch (err) {
        this.submitError = err.response?.data?.message || err.message || 'Failed to update client'
        console.error('Error updating client:', err)
        throw err
      } finally {
        this.submitLoading = false
      }
    },
    async deleteclient(clientId) {
      this.submitLoading = true
      this.submitError = null
      try {
        await deleteClient(clientId)
        await this.fetchClients()
        return { success: true }
      } catch (err) {
        this.submitError = err.response?.data?.message || err.message || 'Failed to update client'
        console.error('Error deletint the client:', err)
        throw err
      } finally {
        this.submitLoading = false
      }
    },

    ouvrirFormulaire() {
      this.isFormOpen = true
      this.submitError = null // Clear previous errors
    },

    fermerFormulaire() {
      this.isFormOpen = false
      this.resetForm()
      this.submitError = null // Clear errors when closing
    },

    resetForm() {
      this.clientForm = {
        client_name: '',
        client_Signature: '',
        client_PhoneNumber: '',
        email: '',
        location: '',
        image: '',
      }
    },

    // Clear errors manually if needed
    clearErrors() {
      this.error = null
      this.submitError = null
    },
    clearClients() {
      this.clients = []
      this.selectedClient = null
    },
  },
})
