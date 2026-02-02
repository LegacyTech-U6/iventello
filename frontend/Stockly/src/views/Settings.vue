<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">{{ $t('settings.title') }}</h1>
      <p class="text-gray-500">{{ $t('settings.subtitle') }}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

      <!-- COLONNE GAUCHE : PROFIL & SÉCURITÉ -->
      <div class="md:col-span-1 space-y-6">

        <!-- SECTION 1: PROFIL UTILISATEUR -->
        <n-card class="shadow-sm rounded-xl" :bordered="false">
          <div class="flex items-center gap-4 mb-6">
            <n-avatar :size="64" class="bg-blue-100 text-blue-600 font-bold border-2 border-white shadow-sm">
              {{ userInitials }}
            </n-avatar>
            <div>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ userProfile.name }}</h2>
              <n-tag type="info" size="small" round class="mt-1">
                {{ userProfile.role }}
              </n-tag>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-medium text-gray-500 uppercase mb-1">{{ $t('settings.profile.email')
                }}</label>
              <div class="text-gray-900 dark:text-gray-300 font-medium break-all">{{ userProfile.email }}</div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 uppercase mb-1">{{ $t('settings.profile.phone')
                }}</label>
              <div class="text-gray-900 dark:text-gray-300">{{ userProfile.phone }}</div>
            </div>
          </div>

          <div class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
            <n-button disabled block secondary>
              <template #icon><n-icon :component="PencilIcon" /></template>
              {{ $t('settings.profile.edit') }}
            </n-button>
          </div>
        </n-card>

        <!-- SECTION 4: SÉCURITÉ -->
        <n-card class="shadow-sm rounded-xl" :bordered="false">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{{ $t('settings.security.title') }}
          </h3>
          <div class="space-y-3">
            <n-button disabled block class="justify-between" icon-placement="right">
              <template #icon><n-icon :component="LockClosedIcon" /></template>
              {{ $t('settings.security.change_password') }}
            </n-button>

            <n-button @click="handleLogout" block type="error" ghost class="justify-between" icon-placement="right">
              <template #icon><n-icon :component="ArrowRightOnRectangleIcon" /></template>
              {{ $t('settings.security.logout') }}
            </n-button>
          </div>
        </n-card>
      </div>

      <!-- COLONNE DROITE : ENTREPRISE & PRÉFÉRENCES -->
      <div class="md:col-span-2 space-y-6">

        <!-- SECTION 2: ENTREPRISE -->
        <n-card class="shadow-sm rounded-xl" :bordered="false">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ $t('settings.company.title') }}</h3>
              <p class="text-sm text-gray-500">{{ $t('settings.company.subtitle') }}</p>
            </div>
            <n-avatar shape="square" :size="56" :src="companySettings.logo" class="bg-gray-50 border border-gray-200">
              <template #fallback>
                <n-icon :component="BuildingOfficeIcon" class="text-gray-400" />
              </template>
            </n-avatar>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{
                $t('settings.company.name')
                }}</label>
              <n-input v-model:value="companySettings.name" readonly placeholder="Company Name" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{
                $t('settings.company.vat')
                }}</label>
              <n-input v-model:value="companySettings.vatNumber" readonly />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{
                $t('settings.company.currency') }}</label>
              <n-input v-model:value="companySettings.currency" readonly />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{
                $t('settings.company.country')
                }}</label>
              <n-input v-model:value="companySettings.country" readonly />
            </div>
          </div>
        </n-card>

        <!-- SECTION 3: PRÉFÉRENCES -->
        <n-card class="shadow-sm rounded-xl" :bordered="false">
          <div class="flex items-start justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ $t('settings.preferences.title') }}
            </h3>

            <div class="w-full max-w-sm space-y-6">
              <!-- Langue -->
              <div class="flex items-center justify-between">
                <div>
                  <label class="block text-sm font-medium text-gray-900 dark:text-gray-100">{{
                    $t('settings.preferences.language.label') }}</label>
                  <p class="text-sm text-gray-500">{{ $t('settings.preferences.language.desc') }}</p>
                </div>
                <n-select v-model:value="preferences.language" class="w-40" :options="[
                  { label: 'Français', value: 'fr' },
                  { label: 'English', value: 'en' },
                  { label: 'Español', value: 'es' }
                ]" />
              </div>

              <!-- Thème -->
              <div class="border-t border-gray-100 dark:border-gray-700 pt-6 flex items-center justify-between">
                <div>
                  <label class="block text-sm font-medium text-gray-900 dark:text-gray-100">{{
                    $t('settings.preferences.theme.label') }}</label>
                  <p class="text-sm text-gray-500">{{ $t('settings.preferences.theme.desc') }}</p>
                </div>
                <!-- Theme Toggler using NButton group concept or just buttons -->
                <div class="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                  <n-button size="small" :type="preferences.theme === 'light' ? 'default' : 'tertiary'"
                    @click="preferences.theme = 'light'" class="text-xs">
                    <template #icon><n-icon :component="SunIcon" /></template>
                    {{ $t('settings.preferences.theme.light') }}
                  </n-button>
                  <n-button size="small" :type="preferences.theme === 'dark' ? 'default' : 'tertiary'"
                    @click="preferences.theme = 'dark'" class="text-xs">
                    <template #icon><n-icon :component="MoonIcon" /></template>
                    {{ $t('settings.preferences.theme.dark') }}
                  </n-button>
                </div>
              </div>

              <!-- Fuseau horaire -->
              <div class="border-t border-gray-100 dark:border-gray-700 pt-6 flex items-center justify-between">
                <div>
                  <label class="block text-sm font-medium text-gray-900 dark:text-gray-100">{{
                    $t('settings.preferences.timezone.label') }}</label>
                  <p class="text-sm text-gray-500">{{ $t('settings.preferences.timezone.desc') }}</p>
                </div>
                <n-select v-model:value="preferences.timezone" class="w-40" :options="[
                  { label: 'Africa/Douala', value: 'Africa/Douala' },
                  { label: 'Europe/Paris', value: 'Europe/Paris' },
                  { label: 'UTC', value: 'UTC' }
                ]" />
              </div>
            </div>
          </div>
        </n-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useEntrepriseStore } from '@/stores/entrepriseStore';
import {
  PencilIcon,
  LockClosedIcon,
  ArrowRightOnRectangleIcon,
  BuildingOfficeIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/vue/24/outline'
import { useI18n } from 'vue-i18n'
import { NCard, NAvatar, NButton, NIcon, NInput, NSelect, NTag, NDivider, NSwitch } from 'naive-ui'

const { t } = useI18n()

const router = useRouter();
const authStore = useAuthStore();
const entrepriseStore = useEntrepriseStore();

// --- 1. Vérification de l'authentification ---
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
  }
});

// --- 2. Données Réactives (Initialisées avec le store ou valeurs par défaut) ---

// Profil Utilisateur
const userProfile = reactive({
  // Mapping des données du store auth
  name: authStore.user?.username || authStore.user?.name || 'Utilisateur',
  email: authStore.user?.email || 'email@exemple.com',
  phone: authStore.user?.telephone || 'Non renseigné',
  role: authStore.user?.roleName || authStore.user?.type || 'Rôle inconnu'
});

const userInitials = computed(() => {
  return userProfile.name.substring(0, 2).toUpperCase();
});

// Entreprise (Données statiques pour l'instant, connectées au store si dispo)
const companySettings = reactive({
  name: entrepriseStore.activeEntreprise?.name || 'Mon Entreprise',
  currency: entrepriseStore.activeEntreprise?.currency || 'XAF',
  vatNumber: entrepriseStore.activeEntreprise?.numero_fiscal || 'Non défini',
  country: 'Cameroun', // Valeur statique pour l'exemple
  logo: entrepriseStore.activeEntreprise?.logo_url || null
});

// Préférences (Entièrement statique pour le moment)
const preferences = reactive({
  language: 'fr',
  theme: 'light',
  timezone: 'Africa/Douala'
});

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
  }
});

// --- 3. Actions ---

const handleLogout = () => {
  // Appel à l'action de déconnexion du store
  authStore.logout();
  // Redirection vers login
  router.push('/login');
};

</script>