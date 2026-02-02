<template>
  <div class="  min-h-screen max-w-5xl mx-auto items-center grid grid-cols-1 gap-10 lg:grid-cols-2">


    <div class=" lg:flex bg-[#0C333B] hidden  rounded-xl h-[600px] p-10 items-center justify-center">
      <img :src="image" alt="iventello illustration">
    </div>

    <!-- PARTIE DROITE (Formulaire) -->
    <div class="flex items-center justify-center px-10 py-20 relative">
      <!-- Language Switcher -->
      <div class="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div class="w-full max-w-lg space-y-10">
        <div class="text-start space-y-6">
          <router-link to="/">
            <img :src=Iventello alt="">
          </router-link>

          <h1 class="text-4xl font-extrabold text-gray-900">
            {{ $t('auth.login.title') }}
          </h1>
        </div>

        <n-form ref="formRef" :model="loginData" :show-label="true">
          <!-- Email -->
          <n-form-item :label="$t('auth.login.email') + ' *'" path="email">
            <n-input v-model:value="loginData.email" :placeholder="$t('auth.login.email')" size="large" />
          </n-form-item>

          <!-- Password -->
          <n-form-item :label="$t('auth.login.password') + ' *'" path="password">
            <n-input type="password" show-password-on="click" v-model:value="loginData.password"
              :placeholder="$t('auth.login.password')" size="large" />
          </n-form-item>

          <div class="text-right -mt-4 mb-6">
            <router-link to="/forgot-password" class="text-sm text-gray-700 dark:text-gray-300 hover:underline">
              {{ $t('auth.login.forgot_password') }}
            </router-link>
          </div>
        </n-form>

        <!-- Error -->
        <div v-if="loginError" class="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg">
          {{ loginError }}
        </div>
        <div class=" justify-center">
          <ValidationButton :text="$t('auth.login.submit')" width="100%" :loadingText="$t('auth.login.loading')"
            color="#0C333B" variant="flat" :icon="CheckIcon" size="large" :asyncClick="handleLogin"
            :loading="isLoading" />
        </div>
        <!-- Links -->
        <p class="text-center text-sm text-gray-700">
          {{ $t('auth.login.no_account') }}
          <router-link to="/register">
            <a href="#" class="text-[#538994] hover:underline font-medium">{{ $t('auth.login.register_link') }}</a>

          </router-link>
        </p>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useHead } from '@unhead/vue'
import { useAuthStore } from "@/stores/authStore";
import Iventello from "@/assets/iventello.png";
import IventelloPlatform from "@/assets/image/IventelloPlatform.png";
import { CheckIcon } from "@heroicons/vue/24/outline"
import image from "@/assets/image/IventelloPlatform.png"
import ValidationButton from "@/components/ui/buttons/ValidationButton.vue";
import { NInput, NForm, NFormItem } from 'naive-ui'
const authStore = useAuthStore();
const loginError = ref('');
const isLoading = ref(false);
useHead({
  title: 'Login'
})

const loginData = ref({
  email: '',
  password: ''
});

const handleLogin = async () => {
  loginError.value = "";
  if (!loginData.value.email || !loginData.value.password) {
    loginError.value = "Veuillez remplir tous les champs obligatoires.";
    return;
  }

  isLoading.value = true;
  await authStore.login(loginData.value.email, loginData.value.password);

  if (authStore.error) {
    loginError.value = authStore.error;
  }

  isLoading.value = false;
};
</script>

<style scoped></style>
