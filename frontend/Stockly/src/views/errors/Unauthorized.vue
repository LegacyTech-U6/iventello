<template>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div class="max-w-md w-full text-center">
            <div class="mb-8 relative">
                <h1 class="text-[120px] font-black text-gray-200 leading-none">401</h1>
                <div class="absolute inset-0 flex items-center justify-center">
                    <div class="bg-red-500 p-4 rounded-3xl shadow-xl shadow-red-100 -rotate-12">
                        <LockClosedIcon class="w-16 h-16 text-white" />
                    </div>
                </div>
            </div>

            <h2 class="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Accès non autorisé</h2>
            <p class="text-gray-500 mb-10 font-medium leading-relaxed">
                Vous n'avez pas les permissions nécessaires pour accéder à cette ressource. Veuillez vous connecter avec
                un compte approprié.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <button @click="handleLogout"
                    class="w-full sm:w-auto px-8 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all active:scale-95">
                    Se déconnecter
                </button>
                <router-link to="/"
                    class="w-full sm:w-auto px-8 py-3 bg-red-500 text-white font-bold rounded-2xl shadow-lg shadow-red-100 hover:bg-red-600 transition-all active:scale-95">
                    Tableau de bord
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { LockClosedIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
    await authStore.logout()
    router.push('/login')
}
</script>
