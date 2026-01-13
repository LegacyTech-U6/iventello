<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-10 space-y-3">
    <!-- Personal Information -->
    <section class="w-full max-w-4xl bg-white rounded-lg shadow p-8">
      <h2 class="text-xl font-semibold text-gray-700 mb-6">Personal Information</h2>

      <div class="grid grid-cols-2 gap-6">
        <div>
          <label class="block text-sm text-gray-500 mb-2">First Name</label>
          <input
            v-model="profileForm.username"
            type="text"
            class="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            placeholder="Ruxel"
          />
        </div>

        <div>
          <label class="block text-sm text-gray-500 mb-2">Last Name</label>
          <input
            v-model="profileForm.Last_name"
            type="text"
            class="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            placeholder="Djeutchou"
          />
        </div>

        <div>
          <label class="block text-sm text-gray-500 mb-2">Email</label>
          <input
            v-model="profileForm.email"
            type="email"
            class="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            placeholder="djeutchouruxel@gmail.com"
          />
        </div>

        <div>
          <label class="block text-sm text-gray-500 mb-2">Phone Number</label>
          <input
            v-model="profileForm.telephone"
            type="text"
            class="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            placeholder="+237..."
          />
        </div>
      </div>

      <div class="flex justify-start mt-6">
        <button
          @click="updateProfile"
          :disabled="authStore.isLoading"
          class="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
        >
          {{ authStore.isLoading ? 'Saving...' : 'SAVE CHANGES' }}
        </button>
      </div>
    </section>

    <!-- Change Password -->
    <section class="w-full max-w-4xl bg-white rounded-lg shadow p-8">
      <h2 class="text-lg font-semibold text-gray-700 mb-6">Change Password</h2>

      <div class="grid grid-cols-2 gap-6">
        <div>
          <label class="block text-sm text-gray-500 mb-2">Current Password</label>
          <input
            v-model="passwordForm.oldPassword"
            type="password"
            class="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            placeholder="Current Password"
          />
        </div>

        <div>
          <label class="block text-sm text-gray-500 mb-2">New Password</label>
          <input
            v-model="passwordForm.newPassword"
            type="password"
            class="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            placeholder="New Password"
          />
        </div>
      </div>

      <div class="flex justify-between items-center mt-6">
        <button
          @click="changePassword"
          :disabled="authStore.isLoading"
          class="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
        >
          {{ authStore.isLoading ? 'Updating...' : 'SAVE CHANGES' }}
        </button>
        <router-link to="/forgotPassword" class="text-sm text-gray-500 hover:underline">
          Forgot password?
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
const authStore = useAuthStore()

const profileForm = ref({
  username: '',
  Last_name: '',
  email: '',
  telephone: '',
  jobFunction: '',
  role: '',
})

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
})

watch(
  () => authStore.user,
  (user) => {
    if (user) {
      Object.assign(profileForm.value, user)
    }
  },
  { immediate: true },
)

const updateProfile = async () => {
  await authStore.updateProfile(profileForm.value)
}

const changePassword = async () => {
  await authStore.changePassword(passwordForm.value.oldPassword, passwordForm.value.newPassword)
  passwordForm.value = { oldPassword: '', newPassword: '' }
}
</script>
