<!-- 
  MainPage.vue
  =============
  Gestionnaire d'entreprises / Dashboard multi-entreprise
  - Affiche la liste de toutes les entreprises/sociétés
  - Permet la création/modification d'entreprises
  - Filtrage, recherche et multi-vues (grid/table)
  - Statistiques résumées par entreprise
-->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 
      SECTION CHARGEMENT
      Affiche un spinner si les données se chargent encore
    -->
    <div v-if="store.isLoading" class="max-w-7xl mx-auto">
      <LazyLoader :loading="loadingClients" :skeleton-count="6">
        <template #icon>
          <n-spin size="40" />
        </template>
        <template #message>
          <p class="text-lg font-semibold text-gray-800">Loading clients...</p>
        </template>
      </LazyLoader>
    </div>

    <!-- 
      SECTION PRINCIPALE
      Affichée une fois les données chargées
    -->
    <div v-else class="max-w-8xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <!-- Header: Titre et description -->
      <div class="mb-4 sm:mb-6">
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Companies</h1>
        <p class="text-sm text-gray-500">Manage your companies</p>
      </div>

      <!-- Statistiques: Cartes résumées en grille -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <GridCard v-for="(stat, idx) in stats ?? []" :key="idx" :title="stat.title" :value="stat.value"
          :icon="stat.icon" :gradientFrom="stat.gradientFrom" :gradientTo="stat.gradientTo" />
      </div>
      <div class="border rounded-xl border-gray-200">
        <!-- SECTION CONTRÔLES: Recherche, filtres, ajouter -->
        <div class="bg-white rounded-t-xl shadow-sm border border-gray-200 p-3 sm:p-4">
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <!-- Champ de recherche -->
            <div class="flex-1">
              <div class="relative">
                <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input v-model="searchQuery" type="text" placeholder="Search"
                  class="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 bg-white transition-all" />
              </div>
            </div>
            <!-- Boutons de filtrage et ajout -->
            <div class="flex items-center gap-2">
              <!-- Filtre par statut -->
              <button
                class="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2">
                <span class="hidden sm:inline">Select Status</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Bouton paramètres (mobile only) -->
              <button class="p-2 sm:hidden bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </button>
              <!-- Bouton créer/ajouter entreprise -->
              <button @click="showCreateModal = true"
                class="px-3 sm:px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all text-sm font-medium flex items-center gap-2 whitespace-nowrap">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <span class="hidden sm:inline">Add Company</span>
                <span class="sm:hidden">Add</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Sélecteur de vue: Grid ou Table (mobile only) -->
        <div class="flex gap-2 mb-4 sm:hidden">
          <!-- Bouton vue grille -->
          <button @click="viewMode = 'grid'" :class="[
            'flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all',
            viewMode === 'grid'
              ? 'bg-orange-500 text-white'
              : 'bg-white text-gray-700 border border-gray-200',
          ]">
            Grid View
          </button>
          <!-- Bouton vue tableau -->
          <button @click="viewMode = 'table'" :class="[
            'flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all',
            viewMode === 'table'
              ? 'bg-orange-500 text-white'
              : 'bg-white text-gray-700 border border-gray-200',
          ]">
            Table View
          </button>
        </div>

        <!-- Affichage tableau (défaut desktop, sélectionnable mobile) -->
        <EnterpriseTable v-if="viewMode === 'table' || !isMobile" :enterprises="filteredEntreprises"
          @view="handleOpenEnterprise" @edit="handleEditEnterprise" />

        <!-- Affichage grille (mobile seulement quand sélectionné) -->
        <EnterpriseGrid v-if="viewMode === 'grid' && isMobile" :enterprises="filteredEntreprises"
          @view="handleOpenEnterprise" @edit="handleEditEnterprise" />

        <!-- État vide: Aucune entreprise trouvée -->
        <div v-if="filteredEntreprises.length === 0" class="text-center py-12 sm:py-16">
          <div class="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">No companies found</h3>
          <p class="text-sm text-gray-600 mb-6">Create your first company to get started</p>
          <button @click="showCreateModal = true"
            class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all text-sm font-medium">
            Add Company
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: Créer/Modifier une entreprise -->
    <div v-if="showCreateModal"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="closeModal">
      <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl max-h-[95vh] overflow-y-auto">
        <!-- Titre du modal (création ou édition) -->
        <h2 class="text-xl font-bold text-gray-900 mb-6">
          {{ isEditing ? 'Edit Company' : 'Add New Company' }}
        </h2>

        <div class="space-y-4">
          <!-- Champ: Nom de l'entreprise -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1.5">Company Name *</label>
            <input v-model="entrepriseData.name" type="text" placeholder="Enter company name"
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all" />
          </div>

          <!-- Upload logo -->
          <ImageUploader v-model="entrepriseData.logo_url" label="Company Logo" :preview-size="80" />

          <!-- Champ: Description -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1.5">Description</label>
            <textarea v-model="entrepriseData.description" placeholder="Enter description"
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
              rows="3"></textarea>
          </div>

          <!-- Champs: Ville et Code postal -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1.5">City</label>
              <input v-model="entrepriseData.ville" type="text" placeholder="City"
                class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1.5">Postal Code</label>
              <input v-model="entrepriseData.code_postal" type="text" placeholder="Postal code"
                class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all" />
            </div>
          </div>

          <!-- Champ: Email -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1.5">Email</label>
            <input v-model="entrepriseData.email_contact" type="email" placeholder="company@email.com"
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all" />
          </div>

          <!-- Champ: Téléphone -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1.5">Phone</label>
            <input v-model="entrepriseData.telephone_contact" type="text" placeholder="Phone number"
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all" />
          </div>

          <!-- Champ: Numéro fiscal -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1.5">Numero fiscal</label>
            <input v-model="entrepriseData.numero_fiscal" type="text" placeholder="Phone number"
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all" />
          </div>

          <!-- Champ: Informations bancaires -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1.5">Information bancaire</label>
            <input v-model="entrepriseData.informations_bancaires" type="text" placeholder="optionel"
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all" />
          </div>

          <!-- Champ: Identifiant unique NUI -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1.5">numero d'identifiant unique</label>
            <input v-model="entrepriseData.nui" type="text" placeholder="Phone number"
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all" />
          </div>

          <!-- Boutons d'action: Annuler et Sauvegarder -->
          <div class="flex gap-3 mt-6">
            <button @click="closeModal"
              class="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-all text-sm font-medium">
              Cancel
            </button>
            <button @click="createEntreprise" :disabled="isSubmitting"
              class="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium">
              {{ isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Create' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- 
  Script Setup
  ==============
  Logique et état de la page MainPage
-->
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import EnterpriseGrid from '@/components/Enterprise/EnterpriseGrid.vue'
import EnterpriseTable from '@/components/Enterprise/EnterpriseTable.vue'
import { useEntrepriseStore } from '@/stores/entrepriseStore'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { useActionMessage } from '@/composable/useActionMessage'
import LazyLoader from '@/components/ui/LazyLoader.vue'
import ImageUploader from '@/components/main/ImageUploader.vue'
import GridCard from '@/components/ui/cards/GridCard.vue'
import { UsersIcon, CheckCircleIcon, XCircleIcon, MapPinIcon } from '@heroicons/vue/24/outline'

// ========================================
// COMPOSITION API - HOOKS ET STORES
// ========================================

// Action message: Affiche des notifications de succès/erreur
const { showSuccess, showError } = useActionMessage()

// Stores Pinia
const store = useEntrepriseStore()        // Gère les entreprises
const authStore = useAuthStore()          // Gère l'authentification
const router = useRouter()                // Navigation

// ========================================
// DONNÉES RÉACTIVES
// ========================================

const isSubmitting = ref(false)           // Bouton désactivé pendant la soumission
const isEditing = ref(false)              // Mode édition du modal
const searchQuery = ref('')               // Terme de recherche
const showCreateModal = ref(false)        // Affichage du modal create/edit
const viewMode = ref('table')             // Vue: 'table' ou 'grid'
const loadingClients = ref(true)          // État de chargement
const isMobile = ref(window.innerWidth < 640)  // Détection mobile

// Objet pour gérer les données du formulaire
const entrepriseData = ref({
  name: '',
  description: '',
  adresse: '',
  ville: '',
  code_postal: '',
  logo_url: '',
  numero_fiscal: '',
  nui: '',
  email_contact: '',
  telephone_contact: '',
  informations_bancaires: '',
})

// ========================================
// ÉVÉNEMENTS ET LISTENERS
// ========================================

// Détecte le changement de taille d'écran (responsive)
const handleResize = () => {
  isMobile.value = window.innerWidth < 640
}

// ========================================
// FONCTIONS UTILITAIRES
// ========================================

// Convertit la couleur de gradient en couleur hex pour les graphiques
const getChartColor = (gradient) => {
  const colorMap = {
    'from-orange-400 to-orange-500': '#fb923c',
    'from-green-400 to-green-500': '#4ade80',
    'from-red-400 to-red-500': '#f87171',
    'from-cyan-400 to-cyan-500': '#22d3ee',
  }
  return colorMap[gradient] || '#fb923c'
}

// ========================================
// LIFECYCLE HOOKS
// ========================================

onMounted(() => {
  // Ajoute le listener de redimensionnement
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // Nettoie le listener lors de la destruction du composant
  window.removeEventListener('resize', handleResize)
})

// ========================================
// PROPRIÉTÉS CALCULÉES (COMPUTED)
// ========================================

// Récupère le nom de l'utilisateur connecté
const userName = computed(() => {
  return authStore.user?.username || 'User'
})

// Filtre les entreprises selon la recherche
const filteredEntreprises = computed(() => {
  const entreprises = store.entreprises || []
  if (!searchQuery.value) return entreprises
  return entreprises.filter(
    (e) =>
      e.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      e.description?.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

// Génère les cartes de statistiques
const stats = computed(() => {
  return [
    {
      title: 'Total Companies',
      value: (store?.totalEntreprise ?? 0).toString(),
      icon: UsersIcon,
      gradientFrom: 'orange-500',
      gradientTo: 'orange-600',
    },
    {
      title: 'Active Companies',
      value: (store?.totalEntreprise ?? 0).toString(),
      icon: CheckCircleIcon,
      gradientFrom: 'green-500',
      gradientTo: 'green-600',
    },
    {
      title: 'Inactive Companies',
      value: '30',
      icon: XCircleIcon,
      gradientFrom: 'red-500',
      gradientTo: 'red-600',
    },
    {
      title: 'Company Locations',
      value: '180',
      icon: MapPinIcon,
      gradientFrom: 'cyan-500',
      gradientTo: 'cyan-600',
    },
  ]
})

// ========================================
// MÉTHODES DE GESTION
// ========================================

// Ouvre le modal en mode édition
const handleEditEnterprise = (enterprise) => {
  isEditing.value = true
  entrepriseData.value = { ...enterprise }
  showCreateModal.value = true
}

// Ouvre le dashboard de l'entreprise sélectionnée
const handleOpenEnterprise = (enterprise) => {
  store.setActiveEntreprise(enterprise)
  router.push(`/${store.activeEntreprise.uuid}/dashboard`)
}

// Crée ou modifie une entreprise
const createEntreprise = async () => {
  isSubmitting.value = true
  try {
    if (isEditing.value) {
      const success = await store.updateEntreprise(entrepriseData.value.id, entrepriseData.value)
      if (success) {
        showSuccess('Company updated successfully')
      } else {
        showError('Failed to update company')
      }
    } else {
      const success = await store.createEntreprise(entrepriseData.value)
      if (success) {
        showSuccess('Company created successfully')
      } else {
        showError('Failed to create company')
      }
    }
    closeModal()
  } catch (error) {
    console.error('Error creating/updating company:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Ferme le modal et réinitialise les données
const closeModal = () => {
  showCreateModal.value = false
  isEditing.value = false
  entrepriseData.value = {
    name: '',
    description: '',
    adresse: '',
    ville: '',
    code_postal: '',
    logo_url: '',
    numero_fiscal: '',
    nui: '',
    email_contact: '',
    telephone_contact: '',
    informations_bancaires: '',
  }
}

// ========================================
// INITIALISATION
// ========================================

onMounted(async () => {
  loadingClients.value = true
  await store.fetchEntreprises()  // Récupère toutes les entreprises
  loadingClients.value = false
})
</script>
