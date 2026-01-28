<template>
  <div class="min-h-screen bg-background p-4 lg:p-8">
    <div class="max-w-4xl mx-auto flex flex-col gap-10">

      <!-- Header -->
      <div class="space-y-1">
        <h1 class="text-3xl md:text-4xl font-black text-on-surface tracking-tight">Paramètres du Profil</h1>
        <p class="text-on-surface-variant font-medium">Gérez vos informations personnelles et la sécurité de votre
          compte.</p>
      </div>

      <!-- Personal Information -->
      <section class="bg-white rounded-[2.5rem] border border-outline-variant shadow-sm overflow-hidden">
        <div class="p-8 lg:p-10">
          <div class="flex items-center gap-4 mb-8">
            <div class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <UserIcon class="w-6 h-6" />
            </div>
            <h2 class="text-2xl font-black text-on-surface">Informations Personnelles</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-2">
              <label
                class="text-[12px] font-black text-on-surface-variant uppercase tracking-widest px-1">Prénom</label>
              <input v-model="profileForm.username" type="text"
                class="w-full px-6 py-4 bg-surface-variant/20 border-2 border-transparent rounded-[1.25rem] text-sm lg:text-base font-bold text-on-surface focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary/20 transition-all outline-none placeholder:text-outline-variant"
                placeholder="Prénom" />
            </div>

            <div class="space-y-2">
              <label class="text-[12px] font-black text-on-surface-variant uppercase tracking-widest px-1">Nom</label>
              <input v-model="profileForm.Last_name" type="text"
                class="w-full px-6 py-4 bg-surface-variant/20 border-2 border-transparent rounded-[1.25rem] text-sm lg:text-base font-bold text-on-surface focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary/20 transition-all outline-none placeholder:text-outline-variant"
                placeholder="Nom" />
            </div>

            <div class="space-y-2">
              <label class="text-[12px] font-black text-on-surface-variant uppercase tracking-widest px-1">Email</label>
              <input v-model="profileForm.email" type="email"
                class="w-full px-6 py-4 bg-surface-variant/20 border-2 border-transparent rounded-[1.25rem] text-sm lg:text-base font-bold text-on-surface focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary/20 transition-all outline-none placeholder:text-outline-variant"
                placeholder="email@exemple.com" />
            </div>

            <div class="space-y-2">
              <label class="text-[12px] font-black text-on-surface-variant uppercase tracking-widest px-1">Numéro de
                Téléphone</label>
              <input v-model="profileForm.telephone" type="text"
                class="w-full px-6 py-4 bg-surface-variant/20 border-2 border-transparent rounded-[1.25rem] text-sm lg:text-base font-bold text-on-surface focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary/20 transition-all outline-none placeholder:text-outline-variant"
                placeholder="+237..." />
            </div>
          </div>

          <div class="flex justify-start mt-10">
            <button @click="updateProfile" :disabled="authStore.isLoading"
              class="px-8 py-3.5 bg-primary text-on-primary rounded-2xl font-bold shadow-lg shadow-primary/30 transition-all hover:brightness-110 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50">
              <CheckIcon v-if="!authStore.isLoading" class="w-5 h-5" />
              <n-spin v-else size="small" />
              {{ authStore.isLoading ? 'Enregistrement...' : 'Enregistrer les Modifications' }}
            </button>
          </div>
        </div>
      </section>

      <!-- Change Password -->
      <section class="bg-white rounded-[2.5rem] border border-outline-variant shadow-sm overflow-hidden">
        <div class="p-8 lg:p-10">
          <div class="flex items-center gap-4 mb-8">
            <div class="w-12 h-12 rounded-2xl bg-tertiary/10 flex items-center justify-center text-tertiary">
              <LockClosedIcon class="w-6 h-6" />
            </div>
            <h2 class="text-2xl font-black text-on-surface">Sécurité du Compte</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-2">
              <label class="text-[12px] font-black text-on-surface-variant uppercase tracking-widest px-1">Mot de passe
                actuel</label>
              <input v-model="passwordForm.oldPassword" type="password"
                class="w-full px-6 py-4 bg-surface-variant/20 border-2 border-transparent rounded-[1.25rem] text-sm lg:text-base font-bold text-on-surface focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary/20 transition-all outline-none placeholder:text-outline-variant"
                placeholder="••••••••" />
            </div>

            <div class="space-y-2">
              <label class="text-[12px] font-black text-on-surface-variant uppercase tracking-widest px-1">Nouveau mot
                de passe</label>
              <input v-model="passwordForm.newPassword" type="password"
                class="w-full px-6 py-4 bg-surface-variant/20 border-2 border-transparent rounded-[1.25rem] text-sm lg:text-base font-bold text-on-surface focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary/20 transition-all outline-none placeholder:text-outline-variant"
                placeholder="••••••••" />
            </div>
          </div>

          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mt-10">
            <button @click="changePassword" :disabled="authStore.isLoading"
              class="px-8 py-3.5 bg-tertiary text-on-tertiary rounded-2xl font-bold shadow-lg shadow-tertiary/30 transition-all hover:brightness-110 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50">
              <KeyIcon v-if="!authStore.isLoading" class="w-5 h-5" />
              <n-spin v-else size="small" />
              {{ authStore.isLoading ? 'Mise à jour...' : 'Modifier le Mot de Passe' }}
            </button>
            <router-link to="/forgotPassword"
              class="text-sm font-black text-primary hover:text-primary/70 uppercase tracking-widest transition-colors">
              Mot de passe oublié ?
            </router-link>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { UserIcon, LockClosedIcon, CheckIcon, KeyIcon } from '@heroicons/vue/24/solid'
import { NSpin } from 'naive-ui'

const authStore = useAuthStore()

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
  await authStore.updateProfile(profileForm.value)
}

const changePassword = async () => {
  await authStore.changePassword(passwordForm.value.oldPassword, passwordForm.value.newPassword)
  passwordForm.value = { oldPassword: '', newPassword: '' }
}
</script>
