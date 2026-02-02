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
                    Politique de Confidentialité
                </h1>
                <p class="mt-4 text-lg text-gray-500">
                    Dernière mise à jour : 02 Février 2026
                </p>
            </div>

            <!-- Contenu -->
            <n-card class="shadow-sm border-gray-100 mb-8 rounded-2xl overflow-hidden">
                <div class="prose prose-emerald max-w-none p-4 sm:p-8">
                    <h3 class="font-bold text-gray-900">1. Collecte des informations</h3>
                    <p>
                        Nous recueillons des informations lorsque vous vous inscrivez sur notre site, lorsque vous vous
                        connectez à votre compte, faites un achat, et / ou lorsque vous vous déconnectez. Les
                        informations recueillies incluent votre nom, votre adresse e-mail, numéro de téléphone, et
                        informations de facturation.
                    </p>

                    <h3 class="font-bold text-gray-900 mt-8">2. Utilisation des informations</h3>
                    <p>
                        Toutes les informations que nous recueillons auprès de vous peuvent être utilisées pour :
                    <ul class="list-disc pl-5 mt-2 space-y-1">
                        <li>Personnaliser votre expérience et répondre à vos besoins individuels</li>
                        <li>Fournir un contenu publicitaire personnalisé</li>
                        <li>Améliorer notre site Web</li>
                        <li>Améliorer le service client et vos besoins de prise en charge</li>
                        <li>Vous contacter par e-mail</li>
                        <li>Administrer un concours, une promotion, ou une enquête</li>
                    </ul>
                    </p>

                    <h3 class="font-bold text-gray-900 mt-8">3. Confidentialité du commerce en ligne</h3>
                    <p>
                        Nous sommes les seuls propriétaires des informations recueillies sur ce site. Vos informations
                        personnelles ne seront pas vendues, échangées, transférées, ou données à une autre société pour
                        n’importe quelle raison, sans votre consentement, en dehors de ce qui est nécessaire pour
                        répondre à une demande et / ou une transaction.
                    </p>

                    <h3 class="font-bold text-gray-900 mt-8">4. Divulgation à des tiers</h3>
                    <p>
                        Nous ne vendons, n’échangeons et ne transférons pas vos informations personnelles identifiables
                        à des tiers. Cela ne comprend pas les tierce parties de confiance qui nous aident à exploiter
                        notre site Web ou à mener nos affaires, tant que ces parties conviennent de garder ces
                        informations confidentielles.
                    </p>

                    <h3 class="font-bold text-gray-900 mt-8">5. Protection des informations</h3>
                    <p>
                        Nous mettons en œuvre une variété de mesures de sécurité pour préserver la sécurité de vos
                        informations personnelles. Nous utilisons un cryptage à la pointe de la technologie pour
                        protéger les informations sensibles transmises en ligne.
                    </p>

                    <h3 class="font-bold text-gray-900 mt-8">6. Consentement</h3>
                    <p>
                        En utilisant notre site, vous consentez à notre politique de confidentialité.
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

.prose p,
.prose ul {
    color: #4b5563;
    line-height: 1.625;
}
</style>
