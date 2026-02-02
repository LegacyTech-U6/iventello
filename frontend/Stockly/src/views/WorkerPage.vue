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
  <div class="p-4 lg:p-8 space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Employés</h1>
        <p class="text-gray-500">Gérez vos employés et leurs accès.</p>
      </div>
      <n-button type="primary" size="large" @click="create">
        <template #icon><n-icon>
            <PlusIcon />
          </n-icon></template>
        Ajouter un employé
      </n-button>
    </div>

    <!-- Stats -->
    <n-grid x-gap="12" cols="1 s:2 m:4" responsive="screen" :y-gap="12">
      <n-gi>
        <n-card :bordered="false" class="rounded-xl shadow-sm">
          <n-statistic label="Total Employés" :value="stats.total">
            <template #prefix><n-icon class="text-purple-500">
                <UsersIcon />
              </n-icon></template>
          </n-statistic>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card :bordered="false" class="rounded-xl shadow-sm">
          <n-statistic label="Actifs" :value="stats.active">
            <template #prefix><n-icon class="text-teal-500">
                <UserIcon />
              </n-icon></template>
          </n-statistic>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card :bordered="false" class="rounded-xl shadow-sm">
          <n-statistic label="Inactifs" :value="stats.inactive">
            <template #prefix><n-icon class="text-slate-500">
                <UserMinusIcon />
              </n-icon></template>
          </n-statistic>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card :bordered="false" class="rounded-xl shadow-sm">
          <n-statistic label="Nouveaux" :value="stats.newJoiners">
            <template #prefix><n-icon class="text-blue-500">
                <UserPlusIcon />
              </n-icon></template>
          </n-statistic>
        </n-card>
      </n-gi>
    </n-grid>

    <n-card :bordered="false" class="rounded-xl shadow-sm">
      <div class="flex flex-col sm:flex-row gap-4 mb-6">
        <n-input v-model:value="searchTerm" placeholder="Rechercher un employé..." class="max-w-xs">
          <template #prefix><n-icon>
              <MagnifyingGlassIcon />
            </n-icon></template>
        </n-input>
        <n-select v-model:value="filterDepartment" :options="departmentOptions" placeholder="Filtrer par Département"
          clearable class="w-64" />
      </div>

      <n-data-table :columns="columns" :data="filteredWorkers" :loading="isLoading" :pagination="{ pageSize: 10 }" />
    </n-card>

    <!-- Modal for Create/Edit -->
    <n-modal v-model:show="showModal" preset="card" :title="isEditing ? 'Modifier l\'employé' : 'Nouvel employé'"
      class="max-w-lg">
      <n-form ref="formRef" :model="formModel" :rules="rules" label-placement="top">
        <n-form-item label="Nom complet" path="name">
          <n-input v-model:value="formModel.name" placeholder="John Doe" />
        </n-form-item>
        <n-form-item label="Email" path="email">
          <n-input v-model:value="formModel.email" placeholder="john@example.com" />
        </n-form-item>
        <n-form-item label="Entreprise" path="entreprise_id" v-if="!isEditing">
          <!-- Assuming enterprise selection on creation -->
          <n-select v-model:value="formModel.entreprise_id" :options="enterpriseOptions"
            placeholder="Sélectionner une entreprise" />
        </n-form-item>
        <!-- Add Password field for creation if needed, logic depends on backend -->
        <n-form-item label="Mot de passe" path="password" v-if="!isEditing">
          <n-input type="password" v-model:value="formModel.password" show-password-on="click" />
        </n-form-item>

        <div class="flex justify-end gap-2 mt-4">
          <n-button @click="closeModal">Annuler</n-button>
          <n-button type="primary" :loading="isSubmitting" @click="handleFormSubmit">
            {{ isEditing ? 'Mettre à jour' : 'Créer' }}
          </n-button>
        </div>
      </n-form>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useWorkerStore } from '@/stores/workerStore'
import { useEntrepriseStore } from '@/stores/entrepriseStore'
import { useMessage, useDialog, NButton, NIcon, NGrid, NGi, NCard, NStatistic, NInput, NSelect, NDataTable, NTag, NModal, NForm, NFormItem } from 'naive-ui'
import {
  UsersIcon, UserIcon, UserMinusIcon, UserPlusIcon, MagnifyingGlassIcon, PlusIcon, PencilIcon, TrashIcon
} from '@heroicons/vue/24/outline'

const workerStore = useWorkerStore()
const entrepriseStore = useEntrepriseStore()
const message = useMessage()
const dialog = useDialog()

const { isLoading } = storeToRefs(workerStore)
const showModal = ref(false)
const isEditing = ref(false)
const isSubmitting = ref(false)
const searchTerm = ref('')
const filterDepartment = ref(null)
const formRef = ref(null)

const formModel = reactive({
  id: null,
  name: '',
  email: '',
  entreprise_id: null,
  password: ''
})

const rules = {
  name: { required: true, message: 'Requis', trigger: 'blur' },
  email: { required: true, message: 'Requis', trigger: 'blur' },
  entreprise_id: { required: true, message: 'Requis', trigger: 'blur', type: 'number' },
  password: { required: true, message: 'Requis', trigger: 'blur' }
}

onMounted(async () => {
  await workerStore.fetchAllWorkers()
  await entrepriseStore.fetchEntreprises()
})

const stats = computed(() => {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))
  return {
    total: workerStore.workers.length,
    active: workerStore.workers.filter((w) => w.status === 'active').length,
    inactive: workerStore.workers.filter((w) => w.status === 'inactive').length,
    newJoiners: workerStore.workers.filter((w) => new Date(w.date_hired) >= thirtyDaysAgo).length,
  }
})

const filteredWorkers = computed(() => {
  let w = workerStore.workers
  if (searchTerm.value) {
    const t = searchTerm.value.toLowerCase()
    w = w.filter(x => x.name?.toLowerCase().includes(t) || x.email?.toLowerCase().includes(t))
  }
  if (filterDepartment.value) {
    w = w.filter(x => x.entreprise?.name === filterDepartment.value)
  }
  return w
})

const departmentOptions = computed(() => {
  const depts = [...new Set(workerStore.workers.map((w) => w.entreprise?.name).filter(Boolean))]
  return depts.map(d => ({ label: d, value: d }))
})

const enterpriseOptions = computed(() => {
  return entrepriseStore.entreprises.map(e => ({ label: e.name, value: e.id }))
})

const columns = [
  { title: 'Nom', key: 'name', sorter: 'default' },
  { title: 'Email', key: 'email' },
  { title: 'Entreprise', key: 'entreprise.name' },
  {
    title: 'Statut',
    key: 'status',
    render(row) {
      return h(NTag, { type: row.status === 'active' ? 'success' : 'error', size: 'small' }, { default: () => row.status })
    }
  },
  {
    title: 'Actions',
    key: 'actions',
    render(row) {
      return h('div', { class: 'flex gap-2' }, [
        h(NButton, { size: 'small', secondary: true, onClick: () => prepareEdit(row) }, { icon: () => h(NIcon, null, { default: () => h(PencilIcon) }) }),
        h(NButton, { size: 'small', type: 'error', secondary: true, onClick: () => confirmDelete(row) }, { icon: () => h(NIcon, null, { default: () => h(TrashIcon) }) })
      ])
    }
  }
]

const create = () => {
  isEditing.value = false
  Object.assign(formModel, { id: null, name: '', email: '', entreprise_id: null, password: '' })
  showModal.value = true
}

const prepareEdit = (row) => {
  isEditing.value = true
  Object.assign(formModel, {
    id: row.id,
    name: row.name,
    email: row.email,
    entreprise_id: row.entreprise?.id
    // Password usually left blank on edit
  })
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const handleFormSubmit = (e) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      isSubmitting.value = true
      try {
        if (isEditing.value) {
          await workerStore.updateWorker(formModel.id, formModel)
          message.success('Employé mis à jour')
        } else {
          await workerStore.addWorker(formModel)
          message.success('Employé créé')
        }
        closeModal()
        workerStore.fetchAllWorkers() // Refresh list
      } catch (err) {
        message.error('Une erreur est survenue')
      } finally {
        isSubmitting.value = false
      }
    }
  })
}

const confirmDelete = (row) => {
  dialog.warning({
    title: 'Confirmer la suppression',
    content: `Êtes-vous sûr de vouloir supprimer ${row.name} ?`,
    positiveText: 'Supprimer',
    negativeText: 'Annuler',
    onPositiveClick: async () => {
      await workerStore.removeWorker(row.id)
      message.success('Employé supprimé')
    }
  })
}
</script>
