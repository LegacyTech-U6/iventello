<template>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div class="max-w-md w-full text-center">
            <div class="mb-8 relative">
                <h1 class="text-[120px] font-black text-gray-200 leading-none">404</h1>
                <div class="absolute inset-0 flex items-center justify-center">
                    <div class="bg-orange-500 p-4 rounded-3xl shadow-xl shadow-orange-200 rotate-12">
                        <FaceFrownIcon class="w-16 h-16 text-white" />
                    </div>
                </div>
            </div>

            <h2 class="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Page introuvable</h2>
            <p class="text-gray-500 mb-10 font-medium leading-relaxed">
                Désolé, la page que vous recherchez semble avoir disparu ou n'a jamais existé.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <button @click="router.back()"
                    class="w-full sm:w-auto px-8 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all active:scale-95">
                    Retour
                </button>
                <router-link to="/"
                    class="w-full sm:w-auto px-8 py-3 bg-orange-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all active:scale-95">
                    Accueil
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { FaceFrownIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>
