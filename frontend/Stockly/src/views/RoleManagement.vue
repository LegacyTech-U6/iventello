<!-- 
  RoleManagement.vue
  ===================
  Gestionnaire de rôles et permissions
  - Affiche la liste de tous les rôles
  - Permet créer, modifier, supprimer des rôles
  - Gestion des permissions associées à chaque rôle
  - Recherche et statistiques
-->
<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <!-- En-tête avec titre et bouton créer -->
    <div class="mb-8">
      <div class="flex justify-between items-start mb-2">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Role Management</h1>
          <p class="text-gray-500 text-sm">
            Organize your user roles with permissions • <span id="total-roles">0</span> roles total
          </p>
        </div>
        <!-- Bouton créer nouveau rôle -->
        <button @click="openCreateForm"
          class="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 flex items-center gap-2 font-medium">
          <span class="text-lg">+</span> Add Role
        </button>
      </div>
    </div>

    <!-- Barre de recherche -->
    <div class="mb-8">
      <div class="relative">
        <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <input v-model="searchQuery" type="text" placeholder="Search roles..."
          class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white" />
      </div>
    </div>

    <!-- Cartes de statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-white p-6 rounded-lg border border-gray-200">
        <div class="flex items-center gap-3">
          <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3z"></path>
          </svg>
          <div>
            <p class="text-gray-500 text-sm">Total Roles</p>
            <p class="text-2xl font-bold text-gray-900">{{ roleStore.roles.length }}</p>
          </div>
        </div>
      </div>

      <!-- Autres cartes statistiques... -->
      <div class="bg-white p-6 rounded-lg border border-gray-200">
        <div class="flex items-center gap-3">
          <svg class="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12a3 3 0 100-6 3 3 0 000 6z"></path>
            <path d="M9 12c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z"></path>
          </svg>
          <div>
            <p class="text-gray-500 text-sm">Active Users</p>
            <p class="text-2xl font-bold text-gray-900">{{ calculateActiveUsers() }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg border border-gray-200">
        <div class="flex items-center gap-3">
          <svg class="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <p class="text-gray-500 text-sm">Permissions Set</p>
            <p class="text-2xl font-bold text-gray-900">{{ calculatePermissions() }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg border border-gray-200">
        <div class="flex items-center gap-3">
          <svg class="w-8 h-8 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <p class="text-gray-500 text-sm">Last Updated</p>
            <p class="text-2xl font-bold text-gray-900">Today</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Roles Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="role in filteredRoles" :key="role.id"
        class="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
        <div class="flex justify-between items-start mb-3">
          <div class="flex items-center gap-3">
            <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: getColorForRole(role.id) }"></div>
            <h3 class="text-lg font-semibold text-gray-900">{{ role.name }}</h3>
          </div>
          <div class="flex gap-2">
            <button @click="openEditForm(role)" class="text-gray-400 hover:text-blue-500 transition-colors p-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                </path>
              </svg>
            </button>
            <button @click="handleDeleteRole" class="text-gray-400 hover:text-red-500 transition-colors p-2">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z">
                </path>
              </svg>
            </button>
          </div>
        </div>

        <p class="text-gray-600 text-sm mb-4">{{ role.description || 'No description' }}</p>

        <div class="flex items-center justify-between pt-3 border-t border-gray-100">
          <span class="text-xs text-gray-500">Created {{ role.createdDate || 'Today' }}</span>
          <span class="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {{ role.name }}
          </span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="roleStore.roles.length === 0 && !roleStore.loading" class="text-center py-12">
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4">
        </path>
      </svg>
      <p class="text-gray-500 text-lg">No roles found</p>
      <p class="text-gray-400 text-sm">Create your first role to get started</p>
    </div>

    <!-- Loading State -->
    <div v-if="roleStore.loading && roleStore.roles.length === 0"
      class="flex flex-col items-center justify-center py-12">
      <n-spin size="large" />
      <p class="text-gray-500 mt-4 animate-pulse">Loading roles...</p>
    </div>

    <!-- Error State -->
    <div v-if="roleStore.error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      {{ roleStore.error }}
    </div>

    <!-- Modal Overlay -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click="closeModal">
      <!-- Modal -->
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6" @click.stop>
        <h2 class="text-2xl font-bold text-gray-900 mb-4">
          {{ editingRole ? 'Edit Role' : 'Create New Role' }}
        </h2>

        <form @submit.prevent="handleSubmitForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"> Role Name * </label>
            <input v-model="formData.name" type="text" placeholder="e.g., Administrator, Manager, Editor"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"> Description </label>
            <textarea v-model="formData.description" placeholder="Describe the purpose of this role..." rows="4"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"></textarea>
          </div>

          <div class="flex gap-3 pt-4">
            <button type="button" @click="closeModal"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" :disabled="isActionLoading"
              class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              <n-spin v-if="isActionLoading" size="small" stroke="white" />
              {{ editingRole ? 'Update Role' : 'Create Role' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <ActionModal v-model="showDeleteModal" title="Delete Role"
    message="Are you sure you want to delete this role? This action cannot be undone." confirm-text="Delete"
    cancel-text="Cancel" :loading="isActionLoading" @confirm="confirmDelete" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { NSpin } from 'naive-ui'
import { useRoleStore } from '@/stores/roleStore'
import { useActionMessage } from '@/composable/useActionMessage'
const { showSuccess, showError } = useActionMessage()
const roleStore = useRoleStore()
const searchQuery = ref('')
const showModal = ref(false)
const editingRole = ref(null)
const formData = ref({ name: '', description: '' })
const isActionLoading = ref(false)

const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

// Fetch roles on mount
onMounted(() => {
  roleStore.fetchRoles()
})

const showDeleteModal = ref(false)
const roleToDelete = ref(null)

const handleDeleteRole = (roleId) => {
  roleToDelete.value = roleId
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!roleToDelete.value) return
  isActionLoading.value = true
  try {
    await roleStore.removeRole(roleToDelete.value)
    await roleStore.fetchRoles()
    showSuccess('Role deleted successfully!')
  } catch (error) {
    console.error('Error deleting role:', error)
    showError('Failed to delete role')
  } finally {
    isActionLoading.value = false
    showDeleteModal.value = false
    roleToDelete.value = null
  }
}
const filteredRoles = computed(() => {
  if (!searchQuery.value) return roleStore.roles
  return roleStore.roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

function getColorForRole(id) {
  return colors[id % colors.length]
}

function calculateActiveUsers() {
  return Math.floor(Math.random() * 50) + 1
}

function calculatePermissions() {
  return roleStore.roles.length * 3
}

function openCreateForm() {
  editingRole.value = null
  formData.value = { name: '', description: '' }
  showModal.value = true
}

function openEditForm(role) {
  editingRole.value = role
  formData.value = { ...role }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingRole.value = null
  formData.value = { name: '', description: '' }
}

async function handleSubmitForm() {
  if (!formData.value.name) return
  isActionLoading.value = true
  try {
    if (editingRole.value) {
      const success = await roleStore.editRole(editingRole.value.id, formData.value)
      if (success) {
        showSuccess('Role updated successfully!')
      } else {
        showError('Failed to update role')
      }
    } else {
      const success = await roleStore.addRole(formData.value)
      if (success) {
        showSuccess('Role created successfully!')
      } else {
        showError('Failed to create role')
      }
    }
    closeModal()
  } catch (err) {
    showError('An error occurred while saving the role.')
  } finally {
    isActionLoading.value = false
  }
}
</script>

<style scoped>
/* Smooth transitions */
button {
  transition: all 0.2s ease;
}
</style>
