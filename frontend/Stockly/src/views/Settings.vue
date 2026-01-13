<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Paramètres</h1>
      <p class="text-gray-500">Gérez vos préférences et les informations de votre entreprise.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- COLONNE GAUCHE : PROFIL & SÉCURITÉ -->
      <div class="md:col-span-1 space-y-6">
        
        <!-- SECTION 1: PROFIL UTILISATEUR -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center gap-4 mb-6">
            <div class="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold border-2 border-white shadow-sm">
              {{ userInitials }}
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-900">{{ userProfile.name }}</h2>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                {{ userProfile.role }}
              </span>
            </div>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-medium text-gray-500 uppercase mb-1">Email</label>
              <div class="text-gray-900 font-medium break-all">{{ userProfile.email }}</div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 uppercase mb-1">Téléphone</label>
              <div class="text-gray-900">{{ userProfile.phone }}</div>
            </div>
          </div>

          <div class="mt-6 pt-6 border-t border-gray-100">
            <button disabled class="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-400 bg-gray-50 cursor-not-allowed flex justify-center items-center gap-2">
              <span class="material-symbols-rounded text-sm">edit</span>
              Modifier le profil
            </button>
          </div>
        </div>

        <!-- SECTION 4: SÉCURITÉ -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Sécurité</h3>
          <div class="space-y-3">
            <button disabled class="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors cursor-not-allowed">
              <span class="text-sm font-medium">Changer le mot de passe</span>
              <span class="material-symbols-rounded text-sm">lock</span>
            </button>
            
            <button @click="handleLogout" class="w-full flex items-center justify-between p-3 text-left border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-colors group">
              <span class="text-sm font-medium">Déconnexion</span>
              <span class="material-symbols-rounded text-sm group-hover:translate-x-1 transition-transform">logout</span>
            </button>
          </div>
        </div>
      </div>

      <!-- COLONNE DROITE : ENTREPRISE & PRÉFÉRENCES -->
      <div class="md:col-span-2 space-y-6">
        
        <!-- SECTION 2: ENTREPRISE -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Information de l'entreprise</h3>
              <p class="text-sm text-gray-500">Ces détails apparaissent sur vos factures et documents.</p>
            </div>
            <div class="h-14 w-14 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden">
               <img v-if="companySettings.logo" :src="companySettings.logo" alt="Logo" class="h-full w-full object-contain" />
               <span v-else class="material-symbols-rounded text-gray-400 text-2xl">domain</span>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom de l'entreprise</label>
              <input type="text" v-model="companySettings.name" readonly class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 focus:outline-none cursor-default" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Numéro Fiscal / TVA</label>
              <input type="text" v-model="companySettings.vatNumber" readonly class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 focus:outline-none cursor-default" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Devise</label>
              <input type="text" v-model="companySettings.currency" readonly class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 focus:outline-none cursor-default" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Pays</label>
              <input type="text" v-model="companySettings.country" readonly class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 focus:outline-none cursor-default" />
            </div>
          </div>
        </div>

        <!-- SECTION 3: PRÉFÉRENCES -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-start justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Préférences de l'application</h3>
            

          <div class="space-y-6">
            <!-- Langue -->
            <div class="flex items-center justify-between">
              <div>
                <label class="block text-sm font-medium text-gray-900">Langue</label>
                <p class="text-sm text-gray-500">Langue de l'interface utilisateur</p>
              </div>
              <select v-model="preferences.language" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-sm min-w-[140px]">
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>

            <!-- Thème -->
            <div class="border-t border-gray-100 pt-6 flex items-center justify-between">
              <div>
                <label class="block text-sm font-medium text-gray-900">Thème</label>
                <p class="text-sm text-gray-500">Apparence de l'application</p>
              </div>
              <div class="flex bg-gray-100 p-1 rounded-lg">
                <button 
                  @click="preferences.theme = 'light'"
                  class="px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2"
                  :class="preferences.theme === 'light' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
                >
                  <span class="material-symbols-rounded text-xs">light_mode</span> Clair
                </button>
                <button 
                  @click="preferences.theme = 'dark'"
                  class="px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2"
                  :class="preferences.theme === 'dark' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
                >
                  <span class="material-symbols-rounded text-xs">dark_mode</span> Sombre
                </button>
              </div>
            </div>

            <!-- Fuseau horaire -->
            <div class="border-t border-gray-100 pt-6 flex items-center justify-between">
              <div>
                <label class="block text-sm font-medium text-gray-900">Fuseau horaire</label>
                <p class="text-sm text-gray-500">Pour l'affichage des dates et heures</p>
              </div>
              <select v-model="preferences.timezone" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-sm min-w-[140px]">
                <option value="Africa/Douala">Africa/Douala</option>
                <option value="Europe/Paris">Europe/Paris</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, computed ,ref} from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useEntrepriseStore } from '@/stores/entrepriseStore';


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