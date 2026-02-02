<template>
    <div class="main-container bg-gray-50/50 min-h-screen">
        <div class="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <!-- En-tête -->
            <div class="text-center mb-12">
                <router-link to="/">
                    <div
                        class="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-6 shadow-sm">
                        <img :src="Iventello" alt="Logo" class="w-10 h-10 object-contain" />
                    </div>
                </router-link>
                <h1 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    Conditions Générales d'Utilisation
                </h1>
                <p class="mt-4 text-lg text-gray-500">
                    Dernière mise à jour : 02 Février 2026
                </p>
            </div>

            <!-- Contenu -->
            <n-card class="shadow-sm border-gray-100 mb-8 rounded-2xl overflow-hidden">
                <div class="prose prose-emerald max-w-none p-4 sm:p-8">
                    <h3 class="font-bold text-gray-900">1. Acceptation des conditions</h3>
                    <p>
                        En accédant et en utilisant la plateforme Iventello ("le Service"), vous acceptez d'être lié par
                        ces Conditions Générales d'Utilisation ("CGU"). Si vous n'acceptez pas ces termes, veuillez ne
                        pas utiliser le Service.
                    </p>

                    <h3 class="font-bold text-gray-900 mt-8">2. Description du Service</h3>
                    <p>
                        Iventello est une solution logicielle de gestion de stock, de vente et de facturation destinée
                        aux entreprises. Nous nous réservons le droit de modifier ou d'interrompre le Service à tout
                        moment, avec ou sans préavis.
                    </p>

                    <h3 class="font-bold text-gray-900 mt-8">3. Comptes Utilisateurs</h3>
                    <p>
                        Pour utiliser certaines fonctionnalités, vous devez créer un compte. Vous êtes responsable du
                        maintien de la confidentialité de vos identifiants de connexion et de toutes les activités qui
                        se produisent sous votre compte.
                    </p>

                    <h3 class="font-bold text-gray-900 mt-8">4. Propriété Intellectuelle</h3>
                    <p>
                        Le Service et son contenu original, ses caractéristiques et ses fonctionnalités sont et
                        resteront la propriété exclusive d'Iventello et de ses concédants de licence.
                    </p>

                    <h3 class="font-bold text-gray-900 mt-8">5. Limitation de Responsabilité</h3>
                    <p>
                        En aucun cas, Iventello, ses administrateurs, employés, partenaires ou agents, ne pourront être
                        tenus responsables des dommages indirects, accessoires, spéciaux, consécutifs ou punitifs
                        résultant de votre utilisation du Service.
                    </p>

                    <h3 class="font-bold text-gray-900 mt-8">6. Nous contacter</h3>
                    <p>
                        Si vous avez des questions concernant ces Conditions, veuillez nous contacter à l'adresse
                        support@iventello.com.
                    </p>
                </div>
            </n-card>

            <!-- Footer action -->
            <div class="text-center">
                <n-button @click="$router.push('/register')" type="primary" size="large"
                    class="shadow-lg shadow-emerald-200">
                    <template #icon><n-icon :component="ArrowLeftIcon" /></template>
                    Retour à l'inscription
                </n-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { NCard, NButton, NIcon } from 'naive-ui'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import Iventello from '@/assets/iventello.png'
</script>

<style scoped>
.prose h3 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
}

.prose p {
    color: #4b5563;
    line-height: 1.625;
}
</style>
