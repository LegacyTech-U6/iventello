import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router'
import { useEntrepriseStore } from './entrepriseStore'



// Définition centralisée des permissions
const ROLE_PERMISSIONS = {
  admin: {
    canViewDashboard: true,
    canManageUsers: true,
    canManageStock: true,
    canViewInvoices: true,
    canMakeSales: true,
    canAccessSettings: true,
  },
  StockManager: {
    canViewDashboard: true,
    canManageStock: true,
    canViewInvoices: false,
    canMakeSales: false,
    canManageUsers: false,
    canAccessSettings: false,
  },
  SalesPoint: {
    canViewDashboard: false,
    canMakeSales: true,
    canViewInvoices: true,
    canManageStock: false,
    canManageUsers: true,
    canAccessSettings: false,
  },
  default: {
    canViewDashboard: false,
    canMakeSales: false,
    canViewInvoices: false,
    canManageStock: false,
    canManageUsers: false,
    canAccessSettings: false,
  },
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null, // FIXED: Removed duplicate
    token: localStorage.getItem('token') || null,
    isLoading: false,
    error: null,
    successMessage: null,
     API_URL : import.meta.env.API_URL || 'http://localhost:3002/api'|| "https://stock-management-app-jq0h.onrender.com/api"
  }),
  

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.type === 'admin',
    isWorker: (state) => state.user?.type === 'worker',
    hasEntreprise: (state) => !!state.user?.entreprise_id,

    roleName: (state) => {
      if (state.user?.type === 'admin') return 'admin'
      return state.user?.role?.name || 'default'
    },

    permissions(state) {
      return ROLE_PERMISSIONS[this.roleName] || ROLE_PERMISSIONS.default
    },

    
  },

  actions: {
    can: (state) => (permission) => {
      const role = state.user?.type === 'admin' ? 'admin' : state.user?.role?.name || 'default'
      return ROLE_PERMISSIONS[role]?.[permission] || false
    },
    async register(username, Last_name, email, telephone, password) {
      this.isLoading = true
      this.error = null
      this.successMessage = null
      console.log("📝 Registering user:", { username, Last_name, email, telephone })

      try {
        const res = await axios.post(`${this.API_URL}/auth/register`, {
          username,
          Last_name,
          email,
          telephone,
          password,
        })

        // ⚠️ backend ne renvoie que { message }
        this.successMessage = res.data.message || 'Inscription réussie 🎉'
      } catch (err) {
        this.error = err.response?.data?.message || "Erreur d'inscription ❌"
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Connexion utilisateur
     */
    async login(email, password) {
      this.isLoading = true
      this.error = null

      try {
        const res = await axios.post(`${this.API_URL}/auth/login`, { email, password })
        this.token = res.data.token
        localStorage.setItem('token', this.token)

        await this.getAccount() // ⬅️ récupère et met à jour user + type
        this.redirectAfterLogin() // ⬅️ redirection selon le type
      } catch (err) {
        this.error = err.response?.data?.message || 'Erreur de connexion ❌'
        this.user = null
        this.token = null
      } finally {
        this.isLoading = false
      }
    },
    /**
     * Récupérer les infos utilisateur connecté
     */
    async getAccount() {
      if (!this.token) return

      try {
        const res = await axios.get(`${this.API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${this.token}` },
        })
        this.user = res.data

        const entrepriseStore = useEntrepriseStore() // 👈 obtenir le store entreprise

        if (this.user.type === 'worker') {
          this.user.displayName = this.user.name || this.user.username
          this.user.roleName = this.user.role?.name || 'Employé'
          this.user.entrepriseName = this.user.entreprise?.name || 'Inconnue'
          this.user.entrepriseUuid = this.user.entreprise?.uuid

          // ⚡ Définir automatiquement l’entreprise active
          if (this.user.entreprise) {
            entrepriseStore.setActiveEntreprise(this.user.entreprise)
          }
        } else if (this.user.type === 'admin') {
          this.user.displayName = this.user.username
          this.user.roleName = 'Admin'
        }
      } catch (err) {
        this.error = err.response?.data?.message || 'Impossible de récupérer le compte ❌'
        this.user = null
        this.token = null
        localStorage.removeItem('token')
      }
    },
    /**
     * Déconnexion utilisateur
     */
logout(mode = 'default') {
  const entrepriseStore = useEntrepriseStore()
  const userType = this.user?.type
  console.log("👤 User type at logout:", userType)
  console.log("🔁 Logout mode:", mode)

  // 🧩 Cas 1 : Admin veut juste retourner à son tableau de bord admin
  if (userType === 'admin' && mode === 'backToAdmin') {
    console.log("➡️ Redirection vers /ad/admin sans déconnexion complète")
    router.push('/ad/admin')
    return
  }

  // 🧩 Cas 2 : Déconnexion complète (admin ou worker)
  entrepriseStore.clearActiveEntreprise()
  localStorage.removeItem('token')
  localStorage.removeItem('entreprise')
  this.user = null
  this.token = null

  // Attendre un peu pour que le router ait le temps de se mettre à jour
  setTimeout(() => {
    console.log("🚪 Déconnexion complète → redirection /login")
    router.push('/login')
  }, 100)
},
    /**
     * Mot de passe oublié
     */
    async forgotPassword(email) {
      this.isLoading = true
      this.error = null
      this.successMessage = null

      try {
        const res = await axios.post(`${this.API_URL}/auth/forgot-password`, { email })
        this.successMessage = res.data.message || 'Lien envoyé 📩'
      } catch (err) {
        this.error = err.response?.data?.message || 'Erreur lors de la demande ❌'
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Réinitialiser le mot de passe
     */
    async resetPassword(token, newPassword) {
      this.isLoading = true
      this.error = null

      try {
        const res = await axios.post(`${this.API_URL}/auth/reset-password`, {
          token,
          newPassword,
        })
        this.successMessage = res.data.message
      } catch (err) {
        this.error = err.response?.data?.error || 'Erreur réinitialisation ❌'
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Changer le mot de passe (utilisateur connecté)
     */
    async changePassword(oldPassword, newPassword) {
      this.isLoading = true
      this.error = null

      try {
        const res = await axios.post(
          `${this.API_URL}/auth/change-password`,
          { oldPassword, newPassword },
          { headers: { Authorization: `Bearer ${this.token}` } },
        )
        this.successMessage = res.data.message
      } catch (err) {
        this.error = err.response?.data?.message || 'Erreur changement mot de passe ❌'
      } finally {
        this.isLoading = false
      }
    },
    /**
     * Vérification du compte par email
     */
    async verifyEmail(token) {
      this.isLoading = true
      this.error = null
      this.successMessage = null

      try {
        const res = await axios.get(`${this.API_URL}/auth/activate/${token}`)
        this.successMessage = res.data.message || 'Compte activé avec succès 🎉'
      } catch (err) {
        this.error = err.response?.data?.message || 'Lien invalide ou expiré ❌'
      } finally {
        this.isLoading = false
      }
    },
    // src/stores/authStore.js
    async updateProfile(updatedData) {
      this.isLoading = true
      this.error = null
      this.successMessage = null

      try {
        const res = await axios.put(`${this.API_URL}/auth/update-profile`, updatedData, {
          headers: { Authorization: `Bearer ${this.token}` },
        })

        this.user = res.data.user || res.data // selon ta réponse backend
        this.successMessage = res.data.message || 'Profil mis à jour ✅'
      } catch (err) {
        this.error = err.response?.data?.message || 'Erreur de mise à jour ❌'
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Redirection après connexion
     */
    async redirectAfterLogin() {
      const entrepriseStore = useEntrepriseStore()
      if (!this.user) return
      console.log(this.user.entrepriseUuid)

      // Worker: Redirect directly to company dashboard
      if (this.user.type === 'worker' && entrepriseStore.activeEntreprise?.uuid) {
        router.push(`/${entrepriseStore.activeEntreprise.uuid}/dashboard`)
      }
      // Admin: Redirect to admin dashboard (you might need to adjust this route)
      else if (this.user.type === 'admin') {
        router.push('/ad/admin') // Adjust this route as needed
      }
      // Fallback
      else {
        router.push('/login')
      }
    },
  },
})
