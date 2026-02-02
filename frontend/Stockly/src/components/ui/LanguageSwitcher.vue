<template>
    <div class="relative">
        <n-dropdown trigger="click" :options="options" @select="handleSelect" placement="bottom-end">
            <n-button quaternary circle size="small">
                <template #icon>
                    <span class="text-lg">{{ currentFlag }}</span>
                </template>
            </n-button>
        </n-dropdown>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NDropdown, NButton } from 'naive-ui'

const { locale } = useI18n()

const options = [
    { label: 'Français 🇫🇷', key: 'fr' },
    { label: 'English 🇬🇧', key: 'en' }
]

const currentFlag = computed(() => {
    return locale.value === 'fr' ? '🇫🇷' : '🇬🇧'
})

const handleSelect = (key: string) => {
    locale.value = key
    // Optional: Persist to localStorage
    localStorage.setItem('user-locale', key)
}
</script>
