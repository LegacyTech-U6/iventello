<!-- 
  WorkerPage.vue
  ===============
  Gestionnaire des employés
  - Affiche la liste des employés
  - Permet ajouter, modifier, supprimer des employés
  - Statistiques sur les employés
  - Options d'export (PDF, CSV)
  - Vue liste et grille
-->
<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-8xl mx-auto">
      <!-- En-tête avec titre et actions -->
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-semibold text-gray-800 mb-1">Employees</h1>
          <p class="text-sm text-gray-500">Manage your employees</p>
        </div>
        <!-- Boutons d'action: Vue, Export, Ajouter -->
        <div class="flex items-center gap-3">
        
        
          <!-- Bouton rafraîchir -->
          <button class="p-2 hover:bg-gray-100 rounded-lg transition">
            <RefreshCw class="w-5 h-5 text-gray-600" />
          </button>
          <!-- Bouton trier -->
          
          <!-- Bouton ajouter employé -->
            <ValidationButton
            
            text="Add Employer" width="100%"   color="#0C333B" variant="flat" :size="large" :asyncClick="create"
            :loading="isLoading" />
          <button
            @click="showModal = true"
            class="bg-orange-500 text-white px-5 py-2.5 rounded-lg hover:bg-orange-600 transition flex items-center gap-2 text-sm font-medium shadow-sm"
          >
            <Plus class="w-4 h-4" />
            Add Employee
          </button>
        </div>
      </div>

      <!-- Cartes de statistiques -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <GridCard
          title="Total Employee"
          :value="stats.total"
          :icon="Users"
          gradientFrom="purple-500"
          gradientTo="purple-600"
        />
        <GridCard
          title="Active"
          :value="stats.active"
          :icon="UserCheck"
          gradientFrom="teal-500"
          gradientTo="teal-600"
        />
        <GridCard
          title="Inactive"
          :value="stats.inactive"
          :icon="UserX"
          gradientFrom="slate-700"
          gradientTo="slate-800"
        />
        <GridCard
          title="New Joiners"
          :value="stats.newJoiners"
          :icon="UserPlus"
          gradientFrom="blue-500"
          gradientTo="blue-600"
        />
      </div>

      <!-- Search and Filters -->
      <div class="mb-6 flex gap-3">
        <div class="flex-1 max-w-1/2 relative">
          <Search
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
          />
          <input
            type="text"
            placeholder="Search"
            v-model="searchTerm"
            class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-sm"
          />
        </div>
        <select
          v-model="filterDepartment"
          class="border border-gray-200 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-sm text-gray-600"
        >
          <option value="">Select department</option>
          <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
        </select>
      
      </div>

      <!-- Workers Grid -->
      <div
        v-if="filteredWorkers.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <WorkersCard
          v-for="worker in filteredWorkers"
          :key="worker.worker_id"
          :worker="worker"
          @edit="handleEditWorker"
          @delete="handleDeleteWorker"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16 bg-white rounded-xl">
        <Users class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500 text-base">No workers found matching your search</p>
      </div>
    </div>

    <!-- Create/Edit Worker Modal -->
    <WorkerModals
      v-if="showModal"
      :show="showModal"
      :worker="selectedWorker"
      :is-editing="isEditing"
      @close="closeModal"
      @submit="handleSubmit"
    />

    <!-- Delete Confirmation Modal -->
    <ActionModal
      v-model="showDeleteModal"
      title="Delete Worker"
      message="Are you sure you want to delete this worker? This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
/**
 * WorkerPage.vue - Page de Gestion des Employés
 * 
 * Responsabilités principales:
 * - Affiche la liste complète des employés avec filtres
 * - Permet ajouter, modifier, supprimer des employés
 * - Affiche statistiques: Total, Actifs, Inactifs, Nouveaux
 * - Recherche par nom/email/poste
 * - Filtre par département (entreprise) et désignation
 * - Export PDF et CSV (UI prête)
 * 
 * Architecture:
 * - Utilise workerStore pour gestion des états employés
 * - Utilise roleStore et entrepriseStore pour données contextuelles
 * - Modal WorkerModals pour créer/éditer
 * - ActionModal pour confirmation suppression
 */

// ========================================
// IMPORTS & DÉPENDANCES
// ========================================

import { ref, computed, onMounted } from 'vue'

/** Icônes lucide pour l'interface utilisateur */
import {
  Users,          // Icône affichage total employés
  UserCheck,      // Icône employés actifs
  UserX,          // Icône employés inactifs
  UserPlus,       // Icône nouveaux employés
  Search,         // Icône barre de recherche
  Plus,           // Icône bouton ajouter
  List,           // Icône vue liste
  Grid3x3,        // Icône vue grille
  FileText,       // Icône export PDF
  FileSpreadsheet,// Icône export Excel
  RefreshCw,      // Icône rafraîchir
  ChevronUp,      // Icône trier
} from 'lucide-vue-next'

/** Stores Pinia pour gestion d'état */
import { useWorkerStore } from '@/stores/workerStore'
import { useEntrepriseStore } from '@/stores/entrepriseStore'
import { useRoleStore } from '@/stores/roleStore'

/** Composables pour actions et validations */
import { useActionMessage } from '@/composable/useActionMessage'
import { useGlobalModal } from '@/composable/useValidation'

/** Composants réutilisables */
import ActionModal from '@/components/ui/ActionModal.vue'
import WorkersCard from '@/components/workers/WorkersCard.vue'
import WorkerModals from '@/components/workers/WorkerModals.vue'
import GridCard from '@/components/ui/cards/GridCard.vue'

// ========================================
// COMPOSABLES & STORES
// ========================================

/** Composable pour afficher notifications de succès/erreur */
const { show } = useGlobalModal()
const { showSuccess, showError } = useActionMessage()

/** Store Pinia contenant la liste des employés et méthodes CRUD */
const store = useWorkerStore()

/** Store pour accéder aux entreprises (départements) */
const enterpriseStore = useEntrepriseStore()

/** Store pour accéder aux rôles disponibles */
const roleStore = useRoleStore()

// ========================================
// DONNÉES RÉACTIVES
// ========================================

/** Affiche/masque le modal de création/édition d'employé */
const showModal = ref(false)

/** Terme de recherche saisi par l'utilisateur */
const searchTerm = ref('')

/** Filtre sélectionné par département/entreprise */
const filterDepartment = ref('')

/** Filtre sélectionné par désignation/poste */
const filterDesignation = ref('')

/** Indique si on est en mode édition (true) ou création (false) */
const isEditing = ref(false)

/** Objet employé sélectionné pour édition */
const selectedWorker = ref(null)

/** Affiche/masque le modal de confirmation suppression */
const showDeleteModal = ref(false)

/** ID de l'employé à supprimer (stocké avant confirmation) */
const workerToDelete = ref(null)

// ========================================
// LIFECYCLE HOOKS
// ========================================

/**
 * Initialisation au montage du composant
 * 
 * Actions:
 * 1. Récupère la liste complète des employés depuis le store
 * 2. Charge la liste des rôles disponibles
 * 3. Charge la liste des entreprises (pour filtrer par département)
 * 
 * @async
 */
onMounted(async () => {
  store.fetchAllWorkers()
  await roleStore.fetchRoles()
  await enterpriseStore.fetchEntreprises()
})

// ========================================
// PROPRIÉTÉS CALCULÉES
// ========================================

/**
 * Génère les statistiques affichées dans les cartes
 * 
 * Calculs:
 * - Total: nombre total d'employés dans le store
 * - Actifs: employés avec status = 'active'
 * - Inactifs: employés avec status = 'inactive'
 * - Nouveaux: employés embauchés depuis 30 jours
 * 
 * @returns {Object} Objet avec propriétés {total, active, inactive, newJoiners}
 */
const stats = computed(() => {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))

  return {
    total: store.workers.length,
    active: store.workers.filter((w) => w.status === 'active').length,
    inactive: store.workers.filter((w) => w.status === 'inactive').length,
    newJoiners: store.workers.filter((w) => new Date(w.date_hired) >= thirtyDaysAgo).length,
  }
})
const create = () => {
  showModal.value = true
}

/**
 * Extrait la liste unique des départements
 * 
 * Utilisé pour remplir le select de filtre département
 * Basé sur le champ 'entreprise_name' de chaque employé
 * 
 * @returns {Array<string>} Liste unique des noms d'entreprises
 */
const departments = computed(() => {
  return [...new Set(store.workers.map((w) => w.entreprise_name).filter(Boolean))]
})

/**
 * Extrait la liste unique des postes/désignations
 * 
 * Utilisé pour remplir le select de filtre désignation
 * Basé sur le champ 'position' de chaque employé
 * 
 * @returns {Array<string>} Liste unique des postes
 */
const positions = computed(() => {
  return [...new Set(store.workers.map((w) => w.position).filter(Boolean))]
})

/**
 * Filtre les employés selon critères actifs
 * 
 * Applique 3 niveaux de filtrage en cascade:
 * 1. Recherche texte: cherche dans name, email, position
 * 2. Filtre département: par entreprise sélectionnée
 * 3. Filtre désignation: par poste sélectionné
 * 
 * Exemple avec searchTerm='jean' et filterDepartment='IT':
 * - Affiche employés dont le nom contient 'jean' ET entreprise = 'IT'
 * 
 * @returns {Array<Object>} Liste filtrée des employés
 */
const filteredWorkers = computed(() => {
  let workers = store.workers

  // Filtre 1: Recherche texte (case-insensitive)
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    workers = workers.filter(
      (worker) =>
        worker.name?.toLowerCase().includes(term) ||
        worker.email?.toLowerCase().includes(term) ||
        worker.position?.toLowerCase().includes(term),
    )
  }

  // Filtre 2: Département/Entreprise
  if (filterDepartment.value) {
    workers = workers.filter((w) => w.entreprise_name === filterDepartment.value)
  }

  // Filtre 3: Désignation/Poste
  if (filterDesignation.value) {
    workers = workers.filter((w) => w.position === filterDesignation.value)
  }

  return workers
})

// ========================================
// MÉTHODES - GESTION FORMULAIRES
// ========================================

/**
 * Prépare l'édition d'un employé
 * 
 * Actions:
 * 1. Active le mode édition
 * 2. Copie les données de l'employé sélectionné
 * 3. Ouvre le modal de modification
 * 
 * @param {Object} worker - Objet employé à éditer
 */
const handleEditWorker = (worker) => {
  isEditing.value = true
  selectedWorker.value = { ...worker }
  showModal.value = true
}

/**
 * Sauvegarde employé (création ou mise à jour)
 * 
 * Flux:
 * 1. Vérifie si on est en édition ou création
 * 2. Si édition: appelle store.updateWorker()
 * 3. Si création: appelle store.addWorker()
 * 4. Affiche message succès/erreur
 * 5. Ferme le modal
 * 
 * @async
 * @param {Object} formData - Données du formulaire employé
 * @throws {Error} Si la sauvegarde échoue (affiche message erreur)
 */
const handleSubmit = async (formData) => {
  try {
    if (isEditing.value) {
      const success = await store.updateWorker(formData.worker_id, formData)
      if (success) {
        show('Worker updated successfully!', 'success')
      } else {
        show('Failed to update worker', 'error')
      }
    } else {
      const success = await store.addWorker(formData)
      if (success) {
        show('Worker created successfully!', 'success')
      } else {
        show('Failed to create worker', 'error')
      }
    }
    closeModal()
  } catch (error) {
    console.error('Error saving worker:', error)
    show('Error saving worker. Please try again.', 'error')
  }
}

// ========================================
// MÉTHODES - GESTION SUPPRESSION
// ========================================

/**
 * Ouvre le modal de confirmation avant suppression
 * 
 * Actions:
 * 1. Stocke l'ID de l'employé à supprimer
 * 2. Affiche le modal de confirmation
 * 
 * @param {number} workerId - ID de l'employé à supprimer
 */
const handleDeleteWorker = (workerId) => {
  workerToDelete.value = workerId
  showDeleteModal.value = true
}

/**
 * Confirme et exécute la suppression d'un employé
 * 
 * Flux:
 * 1. Appelle store.removeWorker() avec l'ID stocké
 * 2. Si succès: affiche message confirmation
 * 3. Si erreur: affiche message d'erreur
 * 4. Dans tous les cas: ferme le modal et réinitialise
 * 
 * @async
 * @throws {Error} Affiche message erreur en cas d'échec API
 */
const confirmDelete = async () => {
  try {
    const success = await store.removeWorker(workerToDelete.value)
    if (success) {
      show('Worker deleted successfully!', 'success')
    } else {
      show('Failed to delete worker', 'error')
    }
  } catch (error) {
    console.error('Error deleting worker:', error)
    show('Failed to delete worker', 'error')
  } finally {
    showDeleteModal.value = false
    workerToDelete.value = null
  }
}

// ========================================
// MÉTHODES - UTILITAIRES
// ========================================

/**
 * Ferme le modal et réinitialise l'état du formulaire
 * 
 * Actions:
 * 1. Masque le modal
 * 2. Désactive le mode édition
 * 3. Réinitialise l'employé sélectionné (null)
 */
const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  selectedWorker.value = null
}
</script>
