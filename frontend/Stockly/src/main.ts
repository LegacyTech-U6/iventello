import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createHead } from '@unhead/vue/client'

// Styles globaux
import './assets/main.css'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'

// App & router
import App from './App.vue'
import router from './router'
import i18n from './i18n' // <--- Import i18n

// UI components
import { Toaster } from 'vue-sonner'
import FloatingButton from '@/components/ui/FloatingActionButton.vue'

const app = createApp(App)

// Head manager (SEO, title, meta)
const head = createHead()
app.use(head)
app.use(i18n) // <--- Use i18n

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
