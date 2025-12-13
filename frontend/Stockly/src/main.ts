import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createHead } from '@unhead/vue/client'

// Styles globaux
import './assets/main.css'
import '@fontsource/nunito/400.css'
import '@fontsource/nunito/700.css'

// App & router
import App from './App.vue'
import router from './router'

// UI components
import { Toaster } from 'vue-sonner'
import FloatingButton from '@/components/ui/FloatingActionButton.vue'

const app = createApp(App)

// Head manager (SEO, title, meta)
const head = createHead()
app.use(head)

// Pinia + persisted state
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

// // Components globaux
// app.component('FloatingButton', FloatingButton)
// app.component('Toaster', Toaster)

// Router
app.use(router)

// Mount
app.mount('#app')
