<template>
  <div class="p-4 lg:p-8">
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Paramètres du Compte</h1>
        <p class="text-gray-500">Gérez vos informations personnelles et la sécurité de votre compte.</p>
      </div>

      <n-card class="rounded-2xl shadow-sm" :bordered="false">
        <n-tabs type="line" animated>
          <!-- Tab 1: Profile -->
          <n-tab-pane name="profile" tab="Profile">
            <n-form :model="profileForm" label-placement="top" class="mt-4">
              <div class="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-xl">
                <div
                  class="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-2xl font-bold">
                  {{ userInitials }}
                </div>
                <div>
                  <h3 class="font-bold text-lg">{{ userFullName }}</h3>
                  <p class="text-gray-500 text-sm">{{ profileForm.role || 'Admin' }}</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <n-form-item label="Prénom">
                  <n-input v-model:value="profileForm.username" placeholder="Votre prénom" />
                </n-form-item>
                <n-form-item label="Nom">
                  <n-input v-model:value="profileForm.Last_name" placeholder="Votre nom" />
                </n-form-item>
                <n-form-item label="Email">
                  <n-input v-model:value="profileForm.email" placeholder="email@exemple.com" />
                </n-form-item>
                <n-form-item label="Téléphone">
                  <n-input v-model:value="profileForm.telephone" placeholder="+237..." />
                </n-form-item>
              </div>
              <div class="flex justify-end mt-6">
                <n-button type="primary" :loading="authStore.isLoading" @click="updateProfile" size="large">
                  Enregistrer les modifications
                </n-button>
              </div>
            </n-form>
          </n-tab-pane>

          <!-- Tab 2: Security -->
          <n-tab-pane name="security" tab="Sécurité">
            <div class="max-w-xl">
              <n-alert title="Sécurité du compte" type="info" class="mb-6">
                Assurez-vous d'utiliser un mot de passe fort pour protéger votre compte administrateur.
              </n-alert>

              <n-form :model="passwordForm" label-placement="top">
                <n-form-item label="Mot de passe actuel">
                  <n-input v-model:value="passwordForm.oldPassword" type="password" show-password-on="click"
                    placeholder="••••••••" />
                </n-form-item>
                <n-form-item label="Nouveau mot de passe">
                  <n-input v-model:value="passwordForm.newPassword" type="password" show-password-on="click"
                    placeholder="••••••••" />
                </n-form-item>

                <div class="flex items-center justify-between mt-6">
                  <router-link to="/forgotPassword" class="text-orange-600 hover:underline text-sm font-medium">
                    Mot de passe oublié ?
                  </router-link>
                  <n-button type="primary" :loading="authStore.isLoading" @click="changePassword">
                    Modifier le mot de passe
                  </n-button>
                </div>
              </n-form>
            </div>
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useMessage, NCard, NTabs, NTabPane, NForm, NFormItem, NInput, NButton, NAlert } from 'naive-ui'

const authStore = useAuthStore()
const message = useMessage()

const profileForm = ref({
  username: '',
  Last_name: '',
  email: '',
  telephone: '',
  jobFunction: '',
  role: '',
})

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
})

const userInitials = computed(() => {
  const f = profileForm.value.username?.[0] || ''
  const l = profileForm.value.Last_name?.[0] || ''
  return (f + l).toUpperCase()
})

const userFullName = computed(() => {
  return `${profileForm.value.username} ${profileForm.value.Last_name}`
})

watch(
  () => authStore.user,
  (user) => {
    if (user) {
      Object.assign(profileForm.value, user)
    }
  },
  { immediate: true },
)

const updateProfile = async () => {
  try {
    await authStore.updateProfile(profileForm.value)
    message.success("Profil mis à jour avec succès")
  } catch (e) {
    message.error("Erreur lors de la mise à jour du profil")
  }
}

const changePassword = async () => {
  try {
    if (!passwordForm.value.oldPassword || !passwordForm.value.newPassword) {
      message.warning("Veuillez remplir tous les champs")
      return
    }
    await authStore.changePassword(passwordForm.value.oldPassword, passwordForm.value.newPassword)
    message.success("Mot de passe modifié avec succès")
    passwordForm.value = { oldPassword: '', newPassword: '' }
  } catch (e) {
    message.error("Erreur lors du changement de mot de passe")
  }
}
</script>
