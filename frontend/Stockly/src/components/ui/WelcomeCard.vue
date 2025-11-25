<template>
    <div
        class="relative bg-[#0C333B] text-white rounded-2xl p-6 flex items-start justify-between overflow-visible shadow-md">

        <!-- TEXT -->
        <div class="flex-1">
            <h2 class="text-3xl font-bold mb-3">
                Welcome back, {{ user }}
                <!-- Utilisation -->
                <span class="material-icons">
                    waving_hand
                </span>
            </h2>

            <p class="text-xl mb-2">
                Your enterprise <span class="font-extrabold text-green-400">{{ enterprise }}</span> is making waves! 🌟
            </p>

            <p class="text-sm opacity-90">
                Keep pushing forward — the sky is the limit this week!
            </p>
        </div>

        <!-- IMAGE qui dépasse uniquement en haut et plus grande -->
        <div class="relative w-56 flex-shrink-0">
            <img :src="image" alt="Mascot" class="absolute -top-20 right-0 w-56 h-auto select-none" />
        </div>

    </div>
</template>

<script setup>
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
<style>
.material-symbols-outlined {
    font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 0,
        'opsz' 24
}
</style>
