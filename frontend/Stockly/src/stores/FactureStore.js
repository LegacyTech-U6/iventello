import { defineStore } from 'pinia'
import { createInvoice, getAllInvoices, getInvoiceById } from '../service/api'

export const useInvoiceStore = defineStore('invoice', {
  state: () => ({
    loading: false,
    invoices: [],
    selectedInvoice: null,
    error: null,
  }),
  actions: {
    async fetchInvoices() {
      this.loading = true
      try {
        const res = await getAllInvoices()
        console.log('📄 API Response:', res) // ✅ Voir la structure exacte

        // ✅ Adapter selon la structure de l'API

        this.invoices = res.data
        console.warn('⚠️ Structure de données inattendue:', res.factures)

        this.error = null
        console.log('📊 Invoices loaded:', this.invoices, 'invoices')
        return this.invoices
      } catch (err) {
        this.error = err.message || 'Erreur lors du chargement des factures'
        console.error('❌ Error fetching invoices:', err)
        this.invoices = [] // ✅ S'assurer que c'est toujours un tableau
      } finally {
        this.loading = false
      }
    },

    async fetchInvoiceById(id) {
      this.loading = true
      try {
        this.selectedInvoice = await getInvoiceById(id)
        this.error = null
        return this.selectedInvoice
      } catch (err) {
        this.error = err.message || 'Erreur lors du chargement de la facture'
        console.error('❌ Error fetching invoice by id:', err)
      } finally {
        this.loading = false
      }
    },

    async createInvoice(invoiceData) {
      console.log('📝 Info received in the store:', invoiceData)
      this.loading = true
      this.error = null
      try {
        const newInvoice = await createInvoice(invoiceData)
        this.invoices.push(newInvoice)
        return newInvoice
      } catch (error) {
        this.error = error.message || 'Erreur lors de la création de la facture'
        console.error('❌ Erreur lors de la création de la facture:', error)
      } finally {
        this.loading = false
      }
    },
    clearInvoices() {
      this.invoices = []
      this.selectedInvoice = null
    },
  },
})
