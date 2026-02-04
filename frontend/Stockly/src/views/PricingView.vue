<template>
    <div class=" min-h-screen bg-background relative overflow-hidden">
        <!-- Header Section -->
        <section class="pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 text-center relative overflow-hidden">
            <!-- Background Shapes -->
            <div class="absolute inset-0 opacity-10 pointer-events-none">
                <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" stroke-width="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100" height="100" fill="url(#grid)" />
                </svg>
            </div>
            <div
                class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10">
            </div>

            <h1 class="text-4xl md:text-5xl font-extrabold text-on-surface mb-6 relative">
                Des tarifs simples pour <span class="text-primary">toutes les tailles</span>
            </h1>
            <p class="text-lg text-on-surface-variant max-w-2xl mx-auto mb-10 relative">
                Choisissez le plan qui correspond le mieux à vos besoins. Changez ou annulez à tout moment.
            </p>

            <!-- Billing Cycle Toggle -->
            <div
                class="inline-flex items-center bg-surface border border-outline-variant p-1 rounded-full mb-16 relative z-10 shadow-sm">
                <div class="absolute inset-y-1 bg-primary/10 rounded-full transition-all duration-300 ease-in-out"
                    :class="billingCycle === 'monthly' ? 'left-1 w-[calc(50%-4px)]' : 'left-[calc(50%+2px)] w-[calc(50%-4px)]'">
                </div>

                <button @click="billingCycle = 'monthly'"
                    class="relative z-10 px-6 py-2 rounded-full text-sm font-bold transition-colors duration-300"
                    :class="billingCycle === 'monthly' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'">
                    Mensuel
                </button>
                <button @click="billingCycle = 'yearly'"
                    class="relative z-10 px-6 py-2 rounded-full text-sm font-bold transition-colors duration-300"
                    :class="billingCycle === 'yearly' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'">
                    Annuel <span class="text-xs text-green-600 font-normal ml-1">-20%</span>
                </button>
            </div>
        </section>

        <!-- Pricing Cards -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 pb-32">
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                <div v-for="plan in plans" :key="plan.id"
                    class="relative bg-surface border rounded-2xl p-8 flex flex-col transition-all duration-300 hover:shadow-xl hover:border-primary/50 group"
                    :class="[
                        plan.popular ? 'border-primary shadow-lg scale-105 z-10' : 'border-outline-variant'
                    ]">

                    <!-- Popular Badge -->
                    <div v-if="plan.popular"
                        class="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wide">
                        Le plus populaire
                    </div>

                    <!-- Header -->
                    <div class="mb-6">
                        <h3 class="text-xl font-bold text-on-surface mb-2">{{ plan.name }}</h3>
                        <p class="text-sm text-on-surface-variant min-h-[40px]">{{ plan.description }}</p>
                    </div>

                    <!-- Price -->
                    <div class="mb-8">
                        <div class="flex items-end gap-1">
                            <span class="text-4xl font-extrabold text-on-surface">
                                {{ formatPrice(plan.price) }}
                            </span>
                            <span v-if="typeof plan.price[billingCycle] === 'number'"
                                class="text-on-surface-variant mb-1">
                                /{{ billingCycle === 'monthly' ? 'mois' : 'an' }}
                            </span>
                        </div>
                    </div>

                    <!-- Features -->
                    <ul class="space-y-4 mb-8 flex-grow">
                        <li v-for="feature in plan.features" :key="feature"
                            class="flex items-start gap-3 text-sm text-on-surface-variant">
                            <CheckCircleIcon class="size-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>{{ feature }}</span>
                        </li>
                    </ul>

                    <!-- Action Button -->
                    <button class="w-full py-3 rounded-xl font-bold transition-all duration-300" :class="[
                        plan.popular
                            ? 'bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-primary/30'
                            : 'bg-surface border-2 border-primary text-primary hover:bg-primary hover:text-white'
                    ]">
                        {{ plan.buttonText }}
                    </button>
                </div>
            </div>
        </section>
        <div
            class="absolute bottom-0 right-0 w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10 translate-y-1/2 translate-x-1/4 pointer-events-none">
        </div>
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useSubscriptionStore } from '@/stores/subscriptionStore'
import { CheckCircleIcon } from '@heroicons/vue/24/outline'

const store = useSubscriptionStore()
const { plans, billingCycle } = storeToRefs(store)

const formatPrice = (priceObj) => {
    const value = priceObj[billingCycle.value]
    if (typeof value === 'number') {
        return `${value}€`
    }
    return value
}
</script>

<style scoped></style>
