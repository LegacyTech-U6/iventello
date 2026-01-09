import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createHead } from '@unhead/vue/client'
import { isElectron } from '@/utils/isElectron'
import { getSyncService, getOfflineService } from './service/syncProvider'

import './assets/main.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()
const head = createHead()

pinia.use(piniaPluginPersistedstate)
app.use(head)
app.use(pinia)
app.use(router)

// --- LOGIQUE D'INITIALISATION SÉCURISÉE ---
async function initApp() {
  try {
    console.log('🚀 Initialisation des services offline...');
    
    // 1. On force l'initialisation de SQLite avant tout
    const offlineService = await getOfflineService();
    // Optionnel : vérifier les tables pour le debug
    // const tables = await offlineService.select("SELECT name FROM sqlite_master WHERE type='table'");
    // console.log("Tables détectées:", tables);

    // 2. On configure la synchro auto
    const syncService = await getSyncService();

    if (navigator.onLine) {
      console.log('🌐 Online : synchro initiale...');
      syncService.sync();
    }

    window.addEventListener('online', () => {
      console.log('📡 Réseau rétabli : synchro...');
      syncService.sync();
    });

    setInterval(() => {
      if (navigator.onLine) syncService.sync();
    }, 15 * 60 * 1000);

    // 3. SEULEMENT ICI on monte l'application
    app.mount('#app');
    console.log('✅ Application prête et montée');

  } catch (error) {
    console.error('❌ Échec critique de l\'initialisation:', error);
    // On monte quand même l'app pour afficher un message d'erreur si besoin
    app.mount('#app'); 
  }
}

initApp();