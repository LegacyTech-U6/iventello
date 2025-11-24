<template>
  <div class="min-h-screen max-w-7xl mx-auto items-center grid grid-cols-1 gap-5 lg:grid-cols-2">



    <!-- Section droite (formulaire) -->
    <div class="flex items-center justify-center p-8 lg:px-10 py-12">
      <div class="w-full max-w-lg space-y-8">
        <div class="text-start space-y-6">
          <router-link to="/">
            <img :src=Iventello alt="">
          </router-link>

          <h1 class="text-4xl font-extrabold text-gray-900">
            Sign up
          </h1>
        </div>


        <!-- Formulaire -->
        <form @submit.prevent="handleRegister" class="space-y-6">

          <!-- Names -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-gray-700 text-sm font-medium">First Name</label>
              <input v-model="user.username" placeholder="John"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
            </div>

            <div>
              <label class="text-gray-700 text-sm font-medium">Last Name</label>
              <input v-model="user.Last_name" placeholder="Doe"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label class="text-gray-700 text-sm font-medium">Email</label>
            <input type="email" v-model="user.email" placeholder="john@example.com"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
          </div>


          <!-- Role + Phone -->
          <div class="">
            <div>
              <label class="text-gray-700 text-sm font-medium">Phone</label>
              <input v-model="user.telephone" placeholder="+237 675 453 456"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="text-gray-700 text-sm font-medium">Password</label>
            <div class="relative">
              <input :type="showPassword ? 'text' : 'password'" v-model="user.password" placeholder="Create a password"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />

              <button type="button" @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                <Eye v-if="!showPassword" class="w-5 h-5" />
                <EyeOff v-else class="w-5 h-5" />
              </button>

            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="text-gray-700 text-sm font-medium">Confirm Password</label>
            <div class="relative">
              <input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword"
                placeholder="Confirm password"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />

              <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                <Eye v-if="!showConfirmPassword" class="w-5 h-5" />
                <EyeOff v-else class="w-5 h-5" />
              </button>

            </div>
          </div>

          <!-- Terms -->
          <div class="flex items-start gap-2">
            <input type="checkbox" v-model="user.accept_terms" class="mt-1" />
            <label class="text-gray-600 text-sm">
              I agree to the
              <span class="text-emerald-600 hover:underline cursor-pointer">Terms</span>
              and
              <span class="text-emerald-600 hover:underline cursor-pointer">Privacy Policy</span>
            </label>
          </div>

          <!-- Error -->
          <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {{ error }}
          </div>

          <ValidationButton text="Create Account" loadingText="Loading…" color="#0C333B" size="large" width="100%"
            :icon="null" :asyncClick="handleRegister" :loading="loading"
            class="py-3 text-white font-semibold rounded-full hover:bg-emerald-600 transition disabled:opacity-50" />


          <!-- Already have account -->
          <p class="text-center mt-6 text-sm text-gray-600">
            Already have an account?
            <router-link to="/login" class="text-emerald-600 font-medium hover:underline">
              Sign in
            </router-link>
          </p>
        </form>
      </div>
    </div>
    <!-- Section gauche (texte + image) -->
    <div class="hidden lg:flex flex-col items-center justify-center  space-y-8">
      <!-- PARTIE GAUCHE (Logo + texte) -->
      <div class=" lg:flex flex-col bg-[#0C333B] hidden  rounded-xl h-[800px] p-10 items-center justify-center">
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
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { Eye, EyeOff, Check } from "lucide-vue-next"
import Iventello from "@/assets/iventello.png";

import image from "@/assets/image/IventelloPlatform.png"
import ValidationButton from '@/components/ui/buttons/ValidationButton.vue';

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)

const showPassword = ref(false)
const showConfirmPassword = ref(false)
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
