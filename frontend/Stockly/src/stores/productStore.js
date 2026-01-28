import { defineStore } from 'pinia'
import {
  getProduct,
  getOneProduct,
  updateProduct,
  createProduct,
  OutOfStock,
  LowStock,
  addProductStock,
  downloadProductExcel,
} from '@/service/api'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    selectedProduct: null,
    totalProducts: null,
    productForm: {
      Prod_name: '',
      quantity: '',
      cost_price: '',
      selling_price: '',
      category_id: '',
      Prod_Description: '',
      code_bar: '',
      date_of_arrival: '',
      supplier: '',
      Prod_image: null,
      min_stock_level: '',
      max_stock_level: '',
    },
    finishedProducts: null,
    lowProducts: null,
    loading: false,
    error: null,
    isFormOpen: false,
    isDetailsOpen: false,
  }),
  actions: {
    async fetchProducts() {
      this.loading = true
      try {
        const product = await getProduct()
        this.error = null
        this.products = product.data
        this.totalProducts = product.count || 0
        console.log(this.products)
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    async fetchProductById(id) {
      this.loading = true
      try {
        this.selectedProduct = await getOneProduct(id)
        this.error = null
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    async addProduct(productData) {
      this.loading = true
      this.error = null

      try {
        console.log('📦 Store: Product data received:', productData)

        // Ensure numeric fields are properly formatted
        const processedData = {
          ...productData,
          quantity: parseInt(productData.quantity) || 0,
          cost_price: parseFloat(productData.cost_price) || 0,
          selling_price: parseFloat(productData.selling_price) || 0,
          category_id: parseInt(productData.category_id),
          supplier:
            productData.supplier && !isNaN(parseInt(productData.supplier))
              ? parseInt(productData.supplier)
              : null,
          min_stock_level: parseInt(productData.min_stock_level) || 10,
          max_stock_level: parseInt(productData.max_stock_level) || 100,
        }

        console.log('🔧 Store: Processed data:', processedData)

        await createProduct(processedData)

        // Refresh products list after successful addition
        await this.fetchProducts()
      } catch (error) {
        this.error = error.message
        console.error('❌ Store: Error adding product:', error)

        // Log detailed error info
        if (error.response) {
          console.error('📋 Store: Response data:', error.response.data)
          console.error('🔧 Store: Response status:', error.response.status)
        }

        throw error // Re-throw to handle in component
      } finally {
        this.loading = false
      }
    },

    async updateProduct(productId, productData) {
      this.loading = true
      this.error = null
      try {
        await updateProduct(productId, productData)
      } catch (error) {
        this.error = error.message
        console.error('Erreur lors de la mise à jour du produit:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchFinishedProducts() {
      this.loading = true
      try {
        this.finishedProducts = (await OutOfStock()) || 0
        this.error = null
        console.log(this.finishedProducts)
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    async fetchLowStockProducts() {
      this.loading = true
      try {
        const data = await LowStock()
        console.log('Structure reçue:', data)

        // Enriched products data
        if (data && data.data) {
          data.data = data.data.map((p) => ({
            ...p,
            stockLevel: p.quantity <= p.min_stock_level * 0.2 ? 'critical' : 'warning',
            category_name: p.category?.name || 'N/A',
            supplier_name: p.supplierInfo?.supplier_name || 'N/A',
          }))
        }

        this.lowProducts = data
        this.error = null
        console.log('✅ Low products loaded and enriched:', data)
      } catch (err) {
        this.error = err
        this.lowProducts = []
      } finally {
        this.loading = false
      }
    },

    async addStockLevel(productId, quantityAdd) {
      this.loading = true
      try {
        console.log('====================================')
        console.log(productId, ',', quantityAdd)
        console.log('====================================')
        await addProductStock(productId, quantityAdd)
        this.error = null
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    async exportProducts() {
      this.loading = true
      try {
        const blob = await downloadProductExcel()
        // Créer un lien de téléchargement temporaire
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute(
          'download',
          `produits_iventello_${new Date().toISOString().split('T')[0]}.xlsx`,
        )
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
      } catch (err) {
        this.error = err.message || "Erreur lors de l'export Excel"
        console.error('Export failed', err)
      } finally {
        this.loading = false
      }
    },
  },
})
