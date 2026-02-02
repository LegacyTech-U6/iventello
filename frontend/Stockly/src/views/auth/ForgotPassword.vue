<template>
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <div class="flex justify-center mb-6">
                <div class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <img :src="Iventello" alt="Logo" class="w-8 h-8 object-contain" />
                </div>
            </div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Mot de passe oublié ?
            </h2>
            <p class="mt-2 text-center text-sm text-gray-600">
                Entrez votre email pour recevoir un lien de réinitialisation.
            </p>
        </div>

        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <n-card class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border-0">
                <n-form ref="formRef" :model="formValue" :rules="rules">
                    <n-form-item label="Adresse Email" path="email">
                        <n-input v-model:value="formValue.email" placeholder="exemple@entreprise.com" size="large">
                            <template #prefix>
                                <n-icon :component="EnvelopeIcon" />
                            </template>
                        </n-input>
                    </n-form-item>

                    <n-button type="primary" class="w-full mt-4 bg-emerald-600 hover:bg-emerald-700" size="large"
                        :loading="authStore.isLoading" @click="handleSubmit">
                        Envoyer le lien
                    </n-button>
                </n-form>

                <div class="mt-6 text-center">
                    <router-link to="/login"
                        class="font-medium text-emerald-600 hover:text-emerald-500 flex items-center justify-center gap-2">
                        <n-icon :component="ArrowLeftIcon" /> Retour à la connexion
                    </router-link>
                </div>
            </n-card>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useMessage, NCard, NForm, NFormItem, NInput, NButton, NIcon } from 'naive-ui'
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/vue/24/outline'
import Iventello from '@/assets/iventello.png'

const authStore = useAuthStore()
const message = useMessage()
const formRef = ref(null)

const formValue = ref({
    email: ''
})

const rules = {
    email: {
        required: true,
        message: 'Veuillez entrer votre email',
        trigger: ['input', 'blur']
    }
}

const handleSubmit = (e) => {
    e.preventDefault()
    formRef.value?.validate(async (errors) => {
        if (!errors) {
            await authStore.forgotPassword(formValue.value.email)
            if (authStore.successMessage) {
                message.success(authStore.successMessage)
            } else if (authStore.error) {
                message.error(authStore.error)
            }
        }
    })
}
</script>
