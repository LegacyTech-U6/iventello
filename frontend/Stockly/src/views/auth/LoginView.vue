<template>
  <div class="  min-h-screen max-w-5xl mx-auto items-center grid grid-cols-1 gap-10 lg:grid-cols-2">


    <div class=" lg:flex bg-[#0C333B] hidden  rounded-xl h-[600px] p-10 items-center justify-center">
      <img :src="image" alt="iventello illustration">
    </div>

    <!-- PARTIE DROITE (Formulaire) -->
    <div class="flex items-center justify-center px-10 py-20">
      <div class="w-full max-w-lg space-y-10">
        <div class="text-start space-y-6">
          <router-link to="/">
            <img :src=Iventello alt="">
          </router-link>

          <h1 class="text-4xl font-extrabold text-gray-900">
            Sign in
          </h1>
        </div>

        <!-- Email -->
        <div class="space-y-2">
          <label class="text-gray-700 font-medium text-sm">Email <span class="text-red-500">*</span></label>
          <input type="email" v-model="loginData.email" placeholder="Entrer votre adresse email"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            required />
        </div>

        <!-- Password -->
        <div class="space-y-2">
          <label class="text-gray-700 font-medium text-sm">Password <span class="text-red-500">*</span></label>
          <div class="relative">
            <input :type="showPassword ? 'text' : 'password'" v-model="loginData.password"
              placeholder="Indiquez votre mot de passe"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required />

            <!-- Icone oeil -->
            <button type="button" @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <Eye v-if="!showPassword" class="w-5 h-5" />
              <EyeOff v-else class="w-5 h-5" />
            </button>

          </div>

          <div class="text-right">
            <a href="#" class="text-sm text-gray-700 hover:underline">
              Forgotten password?
            </a>
          </div>
        </div>

        <!-- Error -->
        <div v-if="loginError" class="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg">
          {{ loginError }}
        </div>
        <div class=" justify-center">
          <ValidationButton
            
            text="Sign in" width="100%"  loadingText="Signing in" color="#0C333B" variant="flat" :icon="Check" size="large" :asyncClick="handleLogin"
            :loading="isLoading" />
        </div>
        <!-- Links -->
        <p class="text-center text-sm text-gray-700">
          You don't have an account?
          <router-link to="/register">
            <a href="#" class="text-[#538994] hover:underline font-medium">Sign up here</a>

          </router-link>
        </p>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore";
import Iventello from "@/assets/iventello.png";
import IventelloPlatform from "@/assets/image/IventelloPlatform.png";
import { Eye, EyeOff, Check } from "lucide-vue-next"
import image from "@/assets/image/IventelloPlatform.png"
import ValidationButton from "@/components/ui/buttons/ValidationButton.vue";
const authStore = useAuthStore();
const showPassword = ref(false);
const loginError = ref('');
const isLoading = ref(false);

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
  try {
    await authStore.login(loginData.value.email, loginData.value.password);
  } catch (error) {
    loginError.value = error.message || "Échec de connexion.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped></style>
