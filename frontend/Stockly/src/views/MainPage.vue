<template>
  <div class="min-h-screen bg-gray-50/50">
    <div v-if="loadingClients" class="flex flex-col items-center justify-center min-h-[60vh]">
      <n-spin size="large" />
      <p class="mt-4 text-gray-500 text-xs animate-pulse font-medium">Récupération des données...</p>
    </div>

    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      
      <div class="flex items-end justify-between mb-6">
        <div>
          <h1 class="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">Entreprises</h1>
          <p class="text-[11px] sm:text-sm text-gray-500 font-medium">{{ store.totalEntreprise }} entités au total</p>
        </div>
        <button @click="openCreateModal"
          class="flex items-center gap-1.5 px-3 py-2 sm:px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all shadow-md shadow-orange-200 active:scale-95">
          <PlusIcon class="w-4 h-4 stroke-[3]" />
          <span class="text-xs sm:text-sm font-bold">Ajouter</span>
        </button>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <GridCard v-for="(stat, idx) in stats" :key="idx" 
          :title="stat.title" :value="stat.value" :icon="stat.icon" 
          :gradientFrom="stat.gradientFrom" :gradientTo="stat.gradientTo" 
          class="!p-3 sm:!p-5 border-none shadow-sm" />
      </div>

      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="p-4 bg-white border-b border-gray-100">
          <div class="relative w-full sm:max-w-xs">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input v-model="searchQuery" type="text" placeholder="Rechercher..."
              class="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all bg-gray-50/30" />
          </div>
        </div>

        <div class="overflow-x-auto">
          <EnterpriseTable v-if="!isMobile" :enterprises="filteredEntreprises" @view="handleOpenEnterprise" @edit="handleEditEnterprise" />
          <EnterpriseGrid v-else :enterprises="filteredEntreprises" @view="handleOpenEnterprise" @edit="handleEditEnterprise" />
        </div>

        <div v-if="filteredEntreprises.length === 0" class="py-16 text-center">
          <BuildingOfficeIcon class="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p class="text-sm font-bold text-gray-900">Aucune entreprise</p>
          <p class="text-xs text-gray-400">Votre recherche ne donne aucun résultat.</p>
        </div>
      </div>
    </div>

    <TransitionRoot appear :show="showCreateModal" as="template">
      <Dialog as="div" @close="closeModal" class="relative z-50">
        <TransitionChild enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
              <DialogPanel class="w-full max-w-2xl transform rounded-2xl bg-white p-6 shadow-2xl transition-all border border-gray-100 max-h-[90vh] overflow-y-auto">
                <DialogTitle class="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                  <div class="w-2 h-6 bg-orange-500 rounded-full" />
                  {{ isEditing ? 'Modifier l\'entreprise' : 'Nouvelle Entreprise' }}
                </DialogTitle>

                <div class="space-y-6">
                  <div class="flex justify-center sm:justify-start">
                    <ImageUploader v-model="entrepriseData.logo_url" label="Logo" :preview-size="80" />
                  </div>
                  
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
                    <div class="sm:col-span-2">
                      <label class="block text-[10px] uppercase tracking-[0.1em] font-black text-gray-500 mb-1.5 ml-1">Nom de l'entreprise *</label>
                      <input v-model="entrepriseData.name" type="text" placeholder="Ex: Acme Corp"
                        class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all bg-gray-50/50">
                    </div>

                    <div>
                      <label class="block text-[10px] uppercase tracking-[0.1em] font-black text-gray-500 mb-1.5 ml-1">Devise</label>
                      <select v-model="entrepriseData.currency" class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all bg-gray-50/50 appearance-none">
                        <option value="XAF">XAF (FCFA)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="USD">USD ($)</option>
                      </select>
                    </div>

                    <div>
                      <label class="block text-[10px] uppercase tracking-[0.1em] font-black text-gray-500 mb-1.5 ml-1">Téléphone</label>
                      <input v-model="entrepriseData.telephone_contact" type="tel"
                        class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all bg-gray-50/50">
                    </div>

                    <div class="sm:col-span-2">
                      <label class="block text-[10px] uppercase tracking-[0.1em] font-black text-gray-500 mb-1.5 ml-1">Email Contact</label>
                      <input v-model="entrepriseData.email_contact" type="email"
                        class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all bg-gray-50/50">
                    </div>

                    <div class="sm:col-span-2">
                      <label class="block text-[10px] uppercase tracking-[0.1em] font-black text-gray-500 mb-1.5 ml-1">Adresse</label>
                      <input v-model="entrepriseData.adresse" type="text"
                        class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all bg-gray-50/50">
                    </div>

                    <div>
                      <label class="block text-[10px] uppercase tracking-[0.1em] font-black text-gray-500 mb-1.5 ml-1">Ville</label>
                      <input v-model="entrepriseData.ville" type="text"
                        class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all bg-gray-50/50">
                    </div>

                    <div>
                      <label class="block text-[10px] uppercase tracking-[0.1em] font-black text-gray-500 mb-1.5 ml-1">Code Postal</label>
                      <input v-model="entrepriseData.code_postal" type="text"
                        class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all bg-gray-50/50">
                    </div>

                    <div>
                      <label class="block text-[10px] uppercase tracking-[0.1em] font-black text-gray-500 mb-1.5 ml-1">N° Fiscal</label>
                      <input v-model="entrepriseData.numero_fiscal" type="text"
                        class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all bg-gray-50/50">
                    </div>

                    <div>
                      <label class="block text-[10px] uppercase tracking-[0.1em] font-black text-gray-500 mb-1.5 ml-1">NUI</label>
                      <input v-model="entrepriseData.nui" type="text"
                        class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all bg-gray-50/50">
                    </div>

                    <div class="sm:col-span-2">
                      <label class="block text-[10px] uppercase tracking-[0.1em] font-black text-gray-500 mb-1.5 ml-1">Infos Bancaires</label>
                      <input v-model="entrepriseData.informations_bancaires" type="text"
                        class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all bg-gray-50/50">
                    </div>

                    <div class="sm:col-span-2">
                      <label class="block text-[10px] uppercase tracking-[0.1em] font-black text-gray-500 mb-1.5 ml-1">Description</label>
                      <textarea v-model="entrepriseData.description" rows="3"
                        class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all bg-gray-50/50 resize-none"></textarea>
                    </div>
                  </div>
                </div>

                <div class="mt-8 flex flex-col-reverse sm:flex-row gap-3">
                  <button @click="closeModal" class="flex-1 px-4 py-3 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
                    Annuler
                  </button>
                  <button @click="saveEntreprise" :disabled="isSubmitting" 
                    class="flex-1 px-4 py-3 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-lg shadow-orange-100 disabled:opacity-50 transition-all active:scale-95">
                    {{ isSubmitting ? 'Traitement...' : (isEditing ? 'Mettre à jour' : 'Créer l\'entreprise') }}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { PlusIcon, MagnifyingGlassIcon, BuildingOfficeIcon, UsersIcon, CheckCircleIcon, MapPinIcon } from '@heroicons/vue/24/outline'

// Stores & Composables
import { useEntrepriseStore } from '@/stores/entrepriseStore'
import { useActionMessage } from '@/composable/useActionMessage'

// Components
import EnterpriseGrid from '@/components/Enterprise/EnterpriseGrid.vue'
import EnterpriseTable from '@/components/Enterprise/EnterpriseTable.vue'
import ImageUploader from '@/components/main/ImageUploader.vue'
import GridCard from '@/components/ui/cards/GridCard.vue'

const store = useEntrepriseStore()
const router = useRouter()
const { showSuccess, showError } = useActionMessage()

// State
const loadingClients = ref(true)
const isSubmitting = ref(false)
const isEditing = ref(false)
const showCreateModal = ref(false)
const searchQuery = ref('')
const isMobile = ref(false)

const entrepriseData = ref({
  name: '',
  currency: 'XAF',
  description: '',
  logo_url: '',
  numero_fiscal: '',
  nui: '',
  adresse: '',
  ville: '',
  code_postal: '',
  email_contact: '',
  telephone_contact: '',
  informations_bancaires: ''
})

// Logic
const checkMobile = () => isMobile.value = window.innerWidth < 768

onMounted(async () => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  await store.fetchEntreprises()
  loadingClients.value = false
})

onUnmounted(() => window.removeEventListener('resize', checkMobile))

const filteredEntreprises = computed(() => {
  const items = store.entreprises || []
  if (!searchQuery.value) return items
  const q = searchQuery.value.toLowerCase()
  return items.filter(e => e.name?.toLowerCase().includes(q) || e.ville?.toLowerCase().includes(q))
})

const stats = computed(() => [
  { title: 'Total', value: store.totalEntreprise || 0, icon: UsersIcon, gradientFrom: 'orange-500', gradientTo: 'orange-600' },
  { title: 'Actives', value: store.totalEntreprise || 0, icon: CheckCircleIcon, gradientFrom: 'green-500', gradientTo: 'green-600' },
  { title: 'Villes', value: '1', icon: MapPinIcon, gradientFrom: 'cyan-500', gradientTo: 'cyan-600' }
].slice(0, isMobile.value ? 2 : 4))

const openCreateModal = () => {
  isEditing.value = false
  resetForm()
  showCreateModal.value = true
}

const handleEditEnterprise = (enterprise) => {
  isEditing.value = true
  entrepriseData.value = { ...enterprise }
  showCreateModal.value = true
}

const handleOpenEnterprise = (enterprise) => {
  store.setActiveEntreprise(enterprise)
  router.push(`/${enterprise.uuid}/dashboard`)
}

const saveEntreprise = async () => {
  if (!entrepriseData.value.name) return showError('Le nom est requis')
  isSubmitting.value = true
  try {
    const success = isEditing.value 
      ? await store.updateEntreprise(entrepriseData.value.id, entrepriseData.value)
      : await store.createEntreprise(entrepriseData.value)
    
    if (success) {
      showSuccess(isEditing.value ? 'Mis à jour avec succès !' : 'Entreprise créée !')
      closeModal()
    }
  } catch (error) {
    showError('Une erreur est survenue.')
  } finally {
    isSubmitting.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
}

const resetForm = () => {
  entrepriseData.value = {
    name: '', currency: 'XAF', description: '', logo_url: '', numero_fiscal: '', 
    nui: '', adresse: '', ville: '', code_postal: '', email_contact: '', 
    telephone_contact: '', informations_bancaires: ''
  }
}
</script>