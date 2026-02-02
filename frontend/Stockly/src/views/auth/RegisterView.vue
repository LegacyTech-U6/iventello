<template>
  <div class="h-full max-w-5xl mx-auto items-center grid grid-cols-1 gap-5 lg:grid-cols-2">



    <!-- Section droite (formulaire) -->
    <div class="flex items-center justify-center p-8 lg:px-10 py-12 relative">
      <!-- Language Switcher -->
      <div class="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div class="w-full max-w-lg space-y-8">
        <div class="text-start space-y-4">
          <router-link to="/">
            <img :src=Iventello alt="">
          </router-link>

          <h1 class="text-4xl font-extrabold text-gray-900">
            {{ $t('auth.register.title') }}
          </h1>
        </div>


        <!-- Formulaire -->
        <n-form ref="formRef" :model="user" :show-label="true">

          <!-- Names -->
          <n-grid :cols="2" :x-gap="12">
            <n-form-item-gi :label="$t('auth.register.first_name')">
              <n-input v-model:value="user.username" :placeholder="$t('auth.register.first_name')" size="large" />
            </n-form-item-gi>

            <n-form-item-gi :label="$t('auth.register.last_name')">
              <n-input v-model:value="user.Last_name" :placeholder="$t('auth.register.last_name')" size="large" />
            </n-form-item-gi>
          </n-grid>

          <!-- Email -->
          <n-form-item :label="$t('auth.register.email')" path="email">
            <n-input v-model:value="user.email" :placeholder="$t('auth.register.email')" size="large" />
          </n-form-item>

          <!-- Phone -->
          <n-form-item :label="$t('auth.register.phone')" path="telephone">
            <n-input v-model:value="user.telephone" placeholder="+237 675 453 456" size="large" />
          </n-form-item>

          <!-- Password -->
          <n-form-item :label="$t('auth.register.password')" path="password">
            <n-input type="password" show-password-on="click" v-model:value="user.password"
              :placeholder="$t('auth.register.password')" size="large" />
          </n-form-item>

          <!-- Confirm Password -->
          <n-form-item :label="$t('auth.register.confirm_password')">
            <n-input type="password" show-password-on="click" v-model:value="confirmPassword"
              :placeholder="$t('auth.register.confirm_password')" size="large" />
          </n-form-item>

          <!-- Terms -->
          <div class="flex items-start gap-2 mb-4">
            <n-checkbox v-model:checked="user.accept_terms">
              <span class="text-gray-600 text-sm">
                I agree to the
                <router-link to="/terms" class="text-emerald-600 hover:underline font-medium">Terms of
                  Service</router-link>
                and
                <router-link to="/privacy" class="text-emerald-600 hover:underline font-medium">Privacy
                  Policy</router-link>
              </span>
            </n-checkbox>
          </div>

          <!-- Error -->
          <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">
            {{ error }}
          </div>

          <ValidationButton :text="$t('auth.register.submit')" :loadingText="$t('auth.register.loading')"
            color="#0C333B" size="large" width="100%" :icon="null" :asyncClick="handleRegister" :loading="loading"
            class="py-3 text-white font-semibold rounded-full hover:bg-emerald-600 transition disabled:opacity-50" />


          <!-- Already have account -->
          <p class="text-center mt-6 text-sm text-gray-600">
            {{ $t('auth.register.has_account') }}
            <router-link to="/login" class="text-emerald-600 font-medium hover:underline">
              {{ $t('auth.register.login_link') }}
            </router-link>
          </p>
        </n-form>
      </div>
    </div>
    <!-- Section gauche (texte + image) -->
    <div class="hidden lg:flex flex-col items-center justify-center  space-y-8">
      <!-- PARTIE GAUCHE (Logo + texte) -->
      <div class=" lg:flex flex-col bg-[#0C333B] hidden  rounded-xl h-[600px] p-10 items-center justify-center">
        <img :src="image" alt="">

        <p class="text-white text-lg text-center max-w-sm">
          Join Iventello and manage your stock & sales with powerful tools.
        </p>
      </div>

    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useHead } from '@unhead/vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { CheckIcon } from "@heroicons/vue/24/outline"
import LanguageSwitcher from '@/components/ui/LanguageSwitcher.vue';
import Iventello from "@/assets/iventello.png";
import ValdiationButton from '@/components/ui/buttons/ValidationButton.vue' // ensure correct path/name, file viewed says ValidationButton
import { NInput, NForm, NFormItem, NCheckbox, NGrid, NFormItemGi } from 'naive-ui'
useHead({
  title: 'Register'
})

import image from "@/assets/image/IventelloPlatform.png"
import ValidationButton from '@/components/ui/buttons/ValidationButton.vue';

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)

const marketingOptIn = ref(false)
const imageSlideClass = ref('')

onMounted(() => {
  // Set the animation direction based on navigation history
  const navigationDirection = sessionStorage.getItem('navigation-direction')

  if (navigationDirection === 'from-login') {
    imageSlideClass.value = 'slide-in-from-right'
  } else {
    imageSlideClass.value = 'slide-in-from-left'
  }

  // Clear the navigation direction after use
  sessionStorage.removeItem('navigation-direction')
})

onUnmounted(() => {
  // Set navigation direction for the next page
  if (router.currentRoute.value.path === '/login') {
    sessionStorage.setItem('navigation-direction', 'from-register')
  }
})

const setNavigationDirection = (direction) => {
  sessionStorage.setItem('navigation-direction', direction)
}

const user = ref({
  username: '',
  Last_name: '',
  email: '',
  telephone: '',
  company: '',
  role: '',
  password: '',
  accept_terms: false,
})

const confirmPassword = ref('')
const error = ref(null)

const handleRegister = async () => {
  error.value = null
  loading.value = true

  if (user.value.password !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    loading.value = false
    return
  }

  if (!user.value.accept_terms) {
    error.value = 'You must accept the terms and conditions'
    loading.value = false
    return
  }

  try {
    await authStore.register(
      user.value.username,
      user.value.Last_name,
      user.value.email,
      user.value.telephone,
      user.value.password,
    )

    if (authStore.error) {
      error.value = authStore.error
    } else {
      router.push({ name: 'activation', query: { email: user.value.email } })
    }
  } catch (err) {
    console.error(err)
    error.value = 'Registration failed'
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
/* Slide in from right animation */
.slide-in-from-right {
  animation: slideInFromRight 0.5s ease-in-out forwards;
}

/* Slide in from left animation */
.slide-in-from-left {
  animation: slideInFromLeft 0.5s ease-in-out forwards;
}

@keyframes slideInFromRight {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }

  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInFromLeft {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }

  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Initial state for the image container */
.rounded-2xl {
  opacity: 0;
}
</style>
