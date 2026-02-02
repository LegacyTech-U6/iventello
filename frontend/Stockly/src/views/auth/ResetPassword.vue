<template>
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <div class="flex justify-center mb-6">
                <div class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <img :src="Iventello" alt="Logo" class="w-8 h-8 object-contain" />
                </div>
            </div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                {{ $t('auth.reset.title') }}
            </h2>
            <p class="mt-2 text-center text-sm text-gray-600">
                {{ $t('auth.reset.subtitle') }}
            </p>
        </div>

        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <n-card class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border-0">
                <n-form ref="formRef" :model="formValue" :rules="rules">
                    <n-form-item :label="$t('auth.reset.password')" path="password">
                        <n-input v-model:value="formValue.password" type="password" show-password-on="click"
                            placeholder="••••••••" size="large" />
                    </n-form-item>

                    <n-form-item :label="$t('auth.reset.confirm_password')" path="confirmPassword">
                        <n-input v-model:value="formValue.confirmPassword" type="password" show-password-on="click"
                            placeholder="••••••••" size="large" />
                    </n-form-item>

                    <n-button type="primary" class="w-full mt-4 bg-emerald-600 hover:bg-emerald-700" size="large"
                        :loading="authStore.isLoading" @click="handleSubmit">
                        {{ $t('auth.reset.submit') }}
                    </n-button>
                </n-form>
            </n-card>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useMessage, NCard, NForm, NFormItem, NInput, NButton } from 'naive-ui'
import Iventello from '@/assets/iventello.png'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const message = useMessage()
const formRef = ref(null)

const formValue = ref({
    password: '',
    confirmPassword: ''
})

const validatePasswordSame = (rule, value) => {
    return value === formValue.value.password
}

const rules = computed(() => ({
    password: {
        required: true,
        message: t('auth.reset.validation.required'),
        trigger: ['input', 'blur']
    },
    confirmPassword: [
        {
            required: true,
            message: t('auth.reset.validation.confirm_required'),
            trigger: ['input', 'blur']
        },
        {
            validator: validatePasswordSame,
            message: t('auth.reset.validation.mismatch'),
            trigger: ['blur', 'password-input']
        }
    ]
}))

const handleSubmit = (e) => {
    e.preventDefault()
    formRef.value?.validate(async (errors) => {
        if (!errors) {
            const token = route.params.token
            await authStore.resetPassword(token, formValue.value.password)

            if (authStore.successMessage) {
                message.success(authStore.successMessage)
                setTimeout(() => router.push('/login'), 2000)
            } else if (authStore.error) {
                message.error(authStore.error)
            }
        }
    })
}
</script>
