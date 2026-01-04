import { defineStore } from 'pinia'
import { importProducts } from '@/service/api'
import * as XLSX from 'xlsx'

export const useProductImportStore = defineStore('productImport', {
  state: () => ({
    file: null,
    previewData: [],
    loading: false,
    error: null,
    success: null,
  }),

  actions: {
    setFile(file) {
      this.file = file
      this.error = null
      this.success = null
      this.previewData = []
      
      if (file) {
        this.generatePreview()
      }
    },

    async generatePreview() {
      if (!this.file) return

      try {
        const data = await this.file.arrayBuffer()
        const workbook = XLSX.read(data)
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        
        // Conversion en JSON (header: 1 pour tableau de tableaux, ou défaut pour objets)
        // On utilise header: 0 pour avoir des objets avec les clés de la première ligne
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 0 })

        // On garde les 20 premiers
        this.previewData = jsonData.slice(0, 20)

        if (jsonData.length === 0) {
          this.error = "Le fichier semble vide."
        }
      } catch (err) {
        console.error("Erreur lecture Excel:", err)
        this.error = "Impossible de lire le fichier Excel. Vérifiez le format."
      }
    },

    async uploadExcel() {
      if (!this.file) return

      this.loading = true
      this.error = null
      this.success = null

      const formData = new FormData()
      formData.append('file', this.file)

      try {
        const response = await importProducts(formData)
        this.success = response.message || "Import réussi !"
        // Retourner le résumé pour affichage éventuel
        return response.summary
      } catch (err) {
        console.error("Erreur upload:", err)
        this.error = err.response?.data?.message || "Erreur lors de l'import."
      } finally {
        this.loading = false
      }
    },

    reset() {
      this.file = null
      this.previewData = []
      this.loading = false
      this.error = null
      this.success = null
      // Reset input file value if needed via ref in component
    }
  }
})