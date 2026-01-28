import { defineStore } from 'pinia'
import {
  getAllWorkers,
  getWorkerById,
  createWorker,
  updateWorker,
  deleteWorker,
} from '../service/api'

export const useWorkerStore = defineStore('worker', {
  // -----------------------------
  state: () => ({
    // -----------------------------
    workers: [],
    loading: false,
    error: null,
    currentWorker: null,
  }),
  // -----------------------------
  actions: {
    // -----------------------------

    // 🔹 Récupérer tous les workers
    async fetchAllWorkers() {
      this.loading = true
      this.error = null
      try {
        const data = await getAllWorkers()
        console.log(data)
        this.workers = data.data
      } catch (err) {
        this.error = err.message || 'Erreur lors du chargement des workers'
      } finally {
        this.loading = false
      }
    },

    // 🔹 Récupérer un worker spécifique
    async fetchWorkerById(id) {
      this.loading = true
      this.error = null
      try {
        this.currentWorker = await getWorkerById(id)
      } catch (err) {
        this.error = err.message || 'Erreur lors du chargement du worker'
      } finally {
        this.loading = false
      }
    },
    // 🔹 Créer un worker
    async addWorker(workerData) {
      this.loading = true
      this.error = null
      try {
        const newWorker = await createWorker(workerData)
        this.workers.push(newWorker)
        return newWorker
      } catch (err) {
        this.error = err.message || 'Erreur lors de la création du worker'
        throw err
      } finally {
        this.loading = false
      }
    },
    // 🔹 Mettre à jour un worker
    async updateWorker(id, updatedData) {
      this.loading = true
      this.error = null
      try {
        const response = await updateWorker(id, updatedData)

        // Si le backend renvoie un message de succès plutôt que l'objet mis à jour
        // On fusionne les données mises à jour dans notre liste locale
        const index = this.workers.findIndex((w) => w.id === id || w.worker_id === id)
        if (index !== -1) {
          this.workers[index] = { ...this.workers[index], ...updatedData }
        }
        return response
      } catch (err) {
        this.error = err.message || 'Erreur lors de la mise à jour du worker'
        throw err
      } finally {
        this.loading = false
      }
    },
    // 🔹 Supprimer un worker
    async removeWorker(id) {
      this.loading = true
      this.error = null
      try {
        await deleteWorker(id)
        this.workers = this.workers.filter((w) => w.id !== id)
      } catch (err) {
        this.error = err.message || 'Erreur lors de la suppression du worker'
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
