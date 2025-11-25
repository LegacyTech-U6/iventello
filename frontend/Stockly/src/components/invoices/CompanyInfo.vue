<template>
  <div class="company-info flex items-start justify-between p-5 ">
    
    <!-- Logo -->
    <div class="flex-shrink-0 w-24 h-24 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
      <img v-if="entreprise.logo_url" :src="entreprise.logo_url" :alt="entreprise.name" class="object-contain w-full h-full" />
      <span v-else class="text-gray-300 text-xs">Logo</span>
    </div>

    <!-- Info principale -->
    <div class="flex-1 ml-4 space-y-1">
      <!-- Nom entreprise -->
      <h1 class="text-xl font-bold text-gray-900">{{ entreprise.name }}</h1>
      <!-- Description / tagline -->
      <div v-if="entreprise.description" class="text-sm text-gray-500">{{ entreprise.description }}</div>

      <!-- Adresse -->
      <div v-if="entreprise.adresse || entreprise.ville || entreprise.code_postal" class="text-sm text-gray-700">
        {{ entreprise.adresse }}
        <span v-if="entreprise.ville"> {{ entreprise.ville }}</span>
        <span v-if="entreprise.code_postal"> {{ entreprise.code_postal }}</span>
      </div>

      <!-- Contact -->
      <div v-if="entreprise.telephone_contact || entreprise.email_contact" class="text-sm text-gray-700">
        <span v-if="entreprise.telephone_contact">📞 {{ entreprise.telephone_contact }}</span>
        <span v-if="entreprise.telephone_contact && entreprise.email_contact"> • </span>
        <span v-if="entreprise.email_contact">✉️ {{ entreprise.email_contact }}</span>
      </div>

      <!-- Site web -->
      <div v-if="entreprise.site_web" class="text-sm text-gray-700">
        🌐 {{ entreprise.site_web }}
      </div>

      <!-- Numéro fiscal / NUI -->
      <div v-if="entreprise.numero_fiscal || entreprise.nui" class="text-sm text-gray-700">
        <span v-if="entreprise.numero_fiscal">NIF : {{ entreprise.numero_fiscal }}</span>
        <span v-if="entreprise.numero_fiscal && entreprise.nui"> • </span>
        <span v-if="entreprise.nui">NUI : {{ entreprise.nui }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  entreprise: {
    type: Object,
    required: true,
    default: () => ({
      name: 'Nom Entreprise',
      logo_url: '',
      description: '',
      adresse: '',
      ville: '',
      code_postal: '',
      telephone_contact: '',
      email_contact: '',
      site_web: '',
      numero_fiscal: '',
      nui: '',
    }),
  },
})
</script>

<style scoped>
.company-info {
  font-family: 'Inter', sans-serif;
}
</style>
