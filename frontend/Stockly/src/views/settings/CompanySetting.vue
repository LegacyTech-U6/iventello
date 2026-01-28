<template>
    <div class="min-h-screen bg-background p-4 lg:p-8">
        <div class="max-w-5xl mx-auto">
            <!-- Header -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div class="space-y-1">
                    <h1 class="text-3xl md:text-4xl font-black text-on-surface tracking-tight">Ma Compagnie</h1>
                    <p class="text-on-surface-variant font-medium">Gérez votre identité d'entreprise et vos paramètres
                        globaux.</p>
                </div>
                <div class="flex items-center gap-3">
                    <button @click="router.back()"
                        class="p-3 rounded-2xl bg-white border border-outline-variant text-on-surface-variant hover:bg-surface-variant transition-all hover:scale-105 active:scale-95">
                        <ArrowLeftIcon class="w-6 h-6" />
                    </button>
                    <button @click="handleSave" :disabled="entrepriseStore.isLoading"
                        class="flex-1 md:flex-none px-8 py-3.5 bg-primary text-on-primary rounded-2xl font-bold shadow-lg shadow-primary/30 transition-all hover:brightness-110 active:scale-95 flex items-center justify-center gap-2">
                        <CheckIcon v-if="!entrepriseStore.isLoading" class="w-6 h-6" />
                        <n-spin v-else size="small" />
                        <span class="text-lg">{{ entrepriseStore.isLoading ? 'Enregistrement...' : 'Enregistrer'
                            }}</span>
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <!-- Sidebar / Navigation -->
                <div class="lg:col-span-4 flex flex-col gap-8 order-2 lg:order-1">
                    <!-- Company Card Preview -->
                    <div
                        class="bg-white rounded-[2.5rem] p-8 border border-outline-variant shadow-sm relative overflow-hidden group">
                        <div
                            class="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-primary/20">
                        </div>

                        <div class="relative flex flex-col items-center text-center">
                            <div class="relative mb-6">
                                <div
                                    class="w-32 h-32 rounded-3xl bg-surface-variant/30 border-2 border-dashed border-outline-variant flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/50 relative">
                                    <img v-if="formData.logo_url" :src="formData.logo_url"
                                        class="w-full h-full object-contain p-2" />
                                    <BuildingOfficeIcon v-else class="w-14 h-14 text-outline-variant" />

                                    <label
                                        class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white text-[10px] font-black uppercase tracking-widest backdrop-blur-[2px]">
                                        <CameraIcon class="w-8 h-8 mb-1" />
                                        Changer
                                        <input type="file" @change="handleLogoChange" class="hidden" accept="image/*" />
                                    </label>
                                </div>
                            </div>

                            <h2 class="text-2xl font-black text-on-surface mb-1">{{ formData.name || 'Ma Compagnie' }}
                            </h2>
                            <p class="text-sm text-on-surface-variant font-medium mb-6 uppercase tracking-wider">{{
                                formData.email_contact || 'Email non défini' }}</p>

                            <div class="flex flex-wrap justify-center gap-2">
                                <span
                                    class="px-4 py-1.5 bg-tertiary-container text-on-tertiary-container rounded-full text-[11px] font-black uppercase tracking-wider">Actif</span>
                                <span
                                    class="px-4 py-1.5 bg-primary-container text-on-primary-container rounded-full text-[11px] font-black uppercase tracking-wider">{{
                                        formData.currency }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Tip -->
                    <div
                        class="bg-primary rounded-[2.5rem] p-8 text-on-primary overflow-hidden relative shadow-xl shadow-primary/20">
                        <SparklesIcon class="absolute -right-6 -bottom-6 w-32 h-32 text-white/10 rotate-12" />
                        <h4 class="text-xl font-black mb-3">Conseil Pro</h4>
                        <p class="text-on-primary/80 text-sm leading-relaxed font-medium">
                            Utilisez un logo haute résolution avec un fond transparent (PNG) pour un rendu optimal sur
                            vos factures et rapports.
                        </p>
                    </div>
                </div>

                <!-- Main Form -->
                <div class="lg:col-span-8 order-1 lg:order-2">
                    <div
                        class="bg-white rounded-[2.5rem] border border-outline-variant shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                        <!-- Tabs -->
                        <div class="flex overflow-x-auto border-b border-outline-variant px-4 lg:px-8 scrollbar-hide">
                            <button @click="activeTab = 'general'"
                                :class="['py-6 text-xs lg:text-sm font-black uppercase tracking-widest transition-all border-b-4 shrink-0 px-4',
                                    activeTab === 'general' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface']">
                                Informations Générales
                            </button>
                            <button @click="activeTab = 'contact'"
                                :class="['py-6 text-xs lg:text-sm font-black uppercase tracking-widest transition-all border-b-4 shrink-0 px-4',
                                    activeTab === 'contact' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface']">
                                Contact & Localisation
                            </button>
                        </div>

                        <div class="p-6 lg:p-10 flex-1">
                            <Transition name="fade" mode="out-in">
                                <!-- General Section -->
                                <div v-if="activeTab === 'general'" class="space-y-8" key="general">
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div class="space-y-3">
                                            <label
                                                class="text-[12px] font-black text-on-surface-variant uppercase tracking-widest px-1">Nom
                                                commercial</label>
                                            <input v-model="formData.name" type="text"
                                                class="w-full px-6 py-4 bg-surface-variant/20 border-2 border-transparent rounded-[1.25rem] text-sm lg:text-base font-bold text-on-surface focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary/20 transition-all outline-none placeholder:text-outline-variant"
                                                placeholder="Ex: My Awesome Company" />
                                        </div>
                                        <div class="space-y-3">
                                            <label
                                                class="text-[12px] font-black text-on-surface-variant uppercase tracking-widest px-1">Devise
                                                Locale</label>
                                            <div class="relative">
                                                <select v-model="formData.currency"
                                                    class="w-full px-6 py-4 bg-surface-variant/20 border-2 border-transparent rounded-[1.25rem] text-sm lg:text-base font-bold text-on-surface focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary/20 transition-all outline-none appearance-none cursor-pointer">
                                                    <option value="XAF">Franc CFA (XAF)</option>
                                                    <option value="USD">US Dollar (USD)</option>
                                                    <option value="EUR">Euro (EUR)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="space-y-3">
                                        <label
                                            class="text-[12px] font-black text-on-surface-variant uppercase tracking-widest px-1">Description</label>
                                        <textarea v-model="formData.description" rows="5"
                                            class="w-full px-6 py-4 bg-surface-variant/20 border-2 border-transparent rounded-[1.25rem] text-sm lg:text-base font-bold text-on-surface focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary/20 transition-all outline-none resize-none placeholder:text-outline-variant"
                                            placeholder="Décrivez brièvement votre activité et vos services..."></textarea>
                                    </div>

                                    <div class="pt-4 grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div class="space-y-3">
                                            <label
                                                class="text-[12px] font-black text-on-surface-variant uppercase tracking-widest px-1">Numéro
                                                Fiscal</label>
                                            <input v-model="formData.numero_fiscal" type="text"
                                                class="w-full px-6 py-4 bg-surface-variant/20 border-2 border-transparent rounded-[1.25rem] text-sm lg:text-base font-bold text-on-surface focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary/20 transition-all outline-none"
                                                placeholder="NIF / RCCM" />
                                        </div>
                                        <div class="space-y-3">
                                            <label
                                                class="text-[12px] font-black text-on-surface-variant uppercase tracking-widest px-1">NUI</label>
                                            <input v-model="formData.nui" type="text"
                                                class="w-full px-6 py-4 bg-surface-variant/20 border-2 border-transparent rounded-[1.25rem] text-sm lg:text-base font-bold text-on-surface focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary/20 transition-all outline-none"
                                                placeholder="Numéro Unique d'Identification" />
                                        </div>
                                    </div>

                                    <div class="space-y-3">
                                        <label
                                            class="text-[12px] font-black text-on-surface-variant uppercase tracking-widest px-1">Informations
                                            Bancaires</label>
                                        <input v-model="formData.informations_bancaires" type="text"
                                            class="w-full px-6 py-4 bg-surface-variant/20 border-2 border-transparent rounded-[1.25rem] text-sm lg:text-base font-bold text-on-surface focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary/20 transition-all outline-none"
                                            placeholder="IBAN / Swift / Coordonnées bancaires" />
                                    </div>
                                </div>

                                <!-- Contact Section -->
                                <div v-else class="space-y-8" key="contact">
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div class="space-y-3">
                                            <label
                                                class="text-[12px] font-black text-on-surface-variant uppercase tracking-widest px-1">Email
                                                de Contact</label>
                                            <input v-model="formData.email_contact" type="email"
                                                class="w-full px-6 py-4 bg-surface-variant/20 border-2 border-transparent rounded-[1.25rem] text-sm lg:text-base font-bold text-on-surface focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary/20 transition-all outline-none"
                                                placeholder="contact@entreprise.com" />
                                        </div>
                                        <div class="space-y-3">
                                            <label
                                                class="text-[12px] font-black text-on-surface-variant uppercase tracking-widest px-1">Téléphone
                                                de Contact</label>
                                            <input v-model="formData.telephone_contact" type="tel"
                                                class="w-full px-6 py-4 bg-surface-variant/20 border-2 border-transparent rounded-[1.25rem] text-sm lg:text-base font-bold text-on-surface focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary/20 transition-all outline-none"
                                                placeholder="+237 ..." />
                                        </div>
                                    </div>

                                    <div class="space-y-3">
                                        <label
                                            class="text-[12px] font-black text-on-surface-variant uppercase tracking-widest px-1">Adresse
                                            Siège Social</label>
                                        <input v-model="formData.adresse" type="text"
                                            class="w-full px-6 py-4 bg-surface-variant/20 border-2 border-transparent rounded-[1.25rem] text-sm lg:text-base font-bold text-on-surface focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary/20 transition-all outline-none"
                                            placeholder="Ex: Rue 102, Quartier Bonanjo, BP 1234" />
                                    </div>

                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div class="space-y-3">
                                            <label
                                                class="text-[12px] font-black text-on-surface-variant uppercase tracking-widest px-1">Ville</label>
                                            <input v-model="formData.ville" type="text"
                                                class="w-full px-6 py-4 bg-surface-variant/20 border-2 border-transparent rounded-[1.25rem] text-sm lg:text-base font-bold text-on-surface focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary/20 transition-all outline-none"
                                                placeholder="Ex: Douala" />
                                        </div>
                                        <div class="space-y-3">
                                            <label
                                                class="text-[12px] font-black text-on-surface-variant uppercase tracking-widest px-1">Code
                                                Postal</label>
                                            <input v-model="formData.code_postal" type="text"
                                                class="w-full px-6 py-4 bg-surface-variant/20 border-2 border-transparent rounded-[1.25rem] text-sm lg:text-base font-bold text-on-surface focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary/20 transition-all outline-none"
                                                placeholder="Ex: 8021" />
                                        </div>
                                    </div>
                                </div>
                            </Transition>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEntrepriseStore } from '@/stores/entrepriseStore'
import { useActionMessage } from '@/composable/useActionMessage'
import {
    ArrowLeftIcon, CheckIcon, BuildingOfficeIcon,
    SparklesIcon, CameraIcon
} from '@heroicons/vue/24/solid'
import { NSpin } from 'naive-ui'

const router = useRouter()
const entrepriseStore = useEntrepriseStore()
const { showSuccess, showError } = useActionMessage()

const activeTab = ref('general')

const formData = reactive({
    id: '',
    name: '',
    description: '',
    logo_url: '',
    logo_file: null,
    currency: 'XAF',
    numero_fiscal: '',
    nui: '',
    email_contact: '',
    telephone_contact: '',
    adresse: '',
    ville: '',
    code_postal: '',
    informations_bancaires: ''
})

onMounted(async () => {
    const active = entrepriseStore.activeEntreprise
    if (active) {
        Object.assign(formData, active)
    }

    if (active?.id) {
        try {
            const data = await entrepriseStore.fetchEntrepriseById(active.id)
            if (data) {
                Object.assign(formData, data)
            }
        } catch (err) {
            console.error("Erreur chargement entreprise:", err)
        }
    }
})

const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
        formData.logo_url = URL.createObjectURL(file)
        formData.logo_file = file
    }
}

const handleSave = async () => {
    if (!formData.name) {
        showError("Le nom de l'entreprise est requis")
        return
    }

    try {
        const active = entrepriseStore.activeEntreprise
        let result = null

        if (active?.uuid || active?.id) {
            const idOrUuid = active.uuid || active.id
            result = await entrepriseStore.updateEntreprise(idOrUuid, formData)
            if (result) {
                showSuccess("Configuration mise à jour!")
                entrepriseStore.setActiveEntreprise(result)
            }
        } else {
            result = await entrepriseStore.createEntreprise(formData)
            if (result) {
                showSuccess("Compagnie créée!")
                entrepriseStore.setActiveEntreprise(result)
            }
        }
    } catch (error) {
        console.error("Erreur sauvegarde:", error)
        showError("Erreur lors de la sauvegarde")
    }
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
}

.shadow-sm {
    box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.05);
}

select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23006879'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1.5rem center;
    background-size: 1.25em;
}

@media (max-width: 768px) {
    .bg-white {
        border-radius: 2rem !important;
    }
}
</style>
