<template>
  <div class="min-h-screen bg-gray-50/50">
    <n-spin :show="loadingClients">
      <template #description>
        <p class="text-gray-500 text-xs animate-pulse font-medium">Récupération des données...</p>
      </template>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <!-- Header -->
        <div class="flex items-end justify-between mb-6">
          <div>
            <h1 class="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">Entreprises</h1>
            <p class="text-[11px] sm:text-sm text-gray-500 font-medium">{{ store.totalEntreprise }} entités au total</p>
          </div>
          <n-button type="warning" size="medium" @click="openCreateModal" class="shadow-md shadow-orange-200">
            <template #icon>
              <PlusIcon class="w-4 h-4 stroke-[3]" />
            </template>
            <span class="font-bold">Ajouter</span>
          </n-button>
        </div>

        <!-- Stats Grid -->
        <n-grid x-gap="12" y-gap="12" :cols="4" item-responsive responsive="screen" class="mb-8">
          <n-gi span="2 l:1" v-for="(stat, idx) in stats" :key="idx">
            <GridCard :title="stat.title" :value="stat.value" :icon="stat.icon" :gradientFrom="stat.gradientFrom"
              :gradientTo="stat.gradientTo" class="!p-3 sm:!p-5 border-none shadow-sm" />
          </n-gi>
        </n-grid>

        <!-- Main Content -->
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="p-4 bg-white border-b border-gray-100">
            <div class="w-full sm:max-w-xs">
              <n-input v-model:value="searchQuery" placeholder="Rechercher..." size="large" round>
                <template #prefix>
                  <MagnifyingGlassIcon class="w-4 h-4 text-gray-400" />
                </template>
              </n-input>
            </div>
          </div>

          <div class="overflow-x-auto">
            <EnterpriseTable v-if="!isMobile" :enterprises="filteredEntreprises" @view="handleOpenEnterprise"
              @edit="handleEditEnterprise" />
            <EnterpriseGrid v-else :enterprises="filteredEntreprises" @view="handleOpenEnterprise"
              @edit="handleEditEnterprise" />
          </div>

          <div v-if="filteredEntreprises.length === 0" class="py-16 text-center">
            <BuildingOfficeIcon class="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p class="text-sm font-bold text-gray-900">Aucune entreprise</p>
            <p class="text-xs text-gray-400">Votre recherche ne donne aucun résultat.</p>
          </div>
        </div>
      </div>
    </n-spin>

    <!-- Modal -->
    <n-modal v-model:show="showCreateModal">
      <n-card style="width: 650px; max-width: 95vw;"
        :title="isEditing ? 'Modifier l\'entreprise' : 'Nouvelle Entreprise'" :bordered="false" size="huge"
        role="dialog" aria-modal="true">
        <template #header-extra>
          <div class="w-2 h-6 bg-orange-500 rounded-full mr-2"></div>
        </template>

        <n-form ref="formRef" :model="entrepriseData" size="medium" label-placement="top">
          <div class="flex justify-center sm:justify-start mb-6">
            <ImageUploader v-model="entrepriseData.logo_url" label="Logo" :preview-size="80" />
          </div>

          <n-grid :cols="2" :x-gap="24">
            <n-gi :span="2">
              <n-form-item label="Nom de l'entreprise" path="name" :required="true">
                <n-input v-model:value="entrepriseData.name" placeholder="Ex: Acme Corp" />
              </n-form-item>
            </n-gi>

            <n-gi :span="1">
              <n-form-item label="Devise" path="currency">
                <n-select v-model:value="entrepriseData.currency" :options="currencyOptions" />
              </n-form-item>
            </n-gi>

            <n-gi :span="1">
              <n-form-item label="Téléphone" path="telephone_contact">
                <n-input v-model:value="entrepriseData.telephone_contact" placeholder="+123..." />
              </n-form-item>
            </n-gi>

            <n-gi :span="2">
              <n-form-item label="Email Contact" path="email_contact">
                <n-input v-model:value="entrepriseData.email_contact" placeholder="contact@example.com" />
              </n-form-item>
            </n-gi>

            <n-gi :span="2">
              <n-form-item label="Adresse" path="adresse">
                <n-input v-model:value="entrepriseData.adresse" />
              </n-form-item>
            </n-gi>

            <n-gi :span="1">
              <n-form-item label="Ville" path="ville">
                <n-input v-model:value="entrepriseData.ville" />
              </n-form-item>
            </n-gi>

            <n-gi :span="1">
              <n-form-item label="Code Postal" path="code_postal">
                <n-input v-model:value="entrepriseData.code_postal" />
              </n-form-item>
            </n-gi>

            <n-gi :span="1">
              <n-form-item label="N° Fiscal" path="numero_fiscal">
                <n-input v-model:value="entrepriseData.numero_fiscal" />
              </n-form-item>
            </n-gi>

            <n-gi :span="1">
              <n-form-item label="NUI" path="nui">
                <n-input v-model:value="entrepriseData.nui" />
              </n-form-item>
            </n-gi>

            <n-gi :span="2">
              <n-form-item label="Infos Bancaires" path="informations_bancaires">
                <n-input v-model:value="entrepriseData.informations_bancaires" />
              </n-form-item>
            </n-gi>

            <n-gi :span="2">
              <n-form-item label="Description" path="description">
                <n-input v-model:value="entrepriseData.description" type="textarea" placeholder="Description..." />
              </n-form-item>
            </n-gi>
          </n-grid>
        </n-form>

        <template #footer>
          <div class="flex flex-col-reverse sm:flex-row gap-3 justify-end mt-4">
            <n-button @click="closeModal" quaternary>Annuler</n-button>
            <n-button type="warning" :loading="isSubmitting" @click="saveEntreprise">
              {{ isEditing ? 'Mettre à jour' : 'Créer l\'entreprise' }}
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  NSpin, NButton, NGrid, NGi, NInput, NSelect, NModal, NCard, NForm, NFormItem, NIcon
} from 'naive-ui'
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
const formRef = ref(null)

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

const currencyOptions = [
  { label: 'XAF (FCFA)', value: 'XAF' },
  { label: 'EUR (€)', value: 'EUR' },
  { label: 'USD ($)', value: 'USD' }
]

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

const handleOpenEnterprise = async (enterprise) => {
  await store.setActiveEntreprise(enterprise)
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