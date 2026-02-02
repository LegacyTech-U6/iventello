<template>
    <n-card :bordered="false" class="overflow-visible shadow-md rounded-2xl h-full"
        content-style="padding: 1.5rem; display: flex; align-items: flex-start; justify-content: space-between;"
        style="background-color: #0C333B; color: white;">

        <!-- TEXT -->
        <div class="flex-1 relative z-10">
            <h2 class="text-3xl font-bold mb-3 text-white">
                Welcome back, {{ user }}
                <SparklesIcon class="w-8 h-8 text-yellow-400 inline-block mb-1" />
            </h2>

            <p class="text-xl mb-2 text-white">
                Your enterprise <span class="font-extrabold text-green-400">{{ enterprise }}</span> is making waves! 🌟
            </p>

            <p class="text-sm opacity-90 text-white">
                Keep pushing forward — the sky is the limit this week!
            </p>
        </div>

        <!-- IMAGE -->
        <div class="relative w-56 flex-shrink-0 static">
            <img :src="image" alt="Mascot"
                class="absolute -top-20 right-0 w-56 h-auto select-none pointer-events-none" />
        </div>
    </n-card>
</template>

<script setup>
import { SparklesIcon } from '@heroicons/vue/24/outline'
import { NCard } from 'naive-ui'

defineProps({
    user: {
        type: String,
        default: "User"
    },
    enterprise: {
        type: String,
        default: "Your Company"
    },
    image: {
        type: String,
        required: true
    }
});
</script>
