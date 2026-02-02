<template>
  <div class="h-screen flex items-center justify-center bg-gray-50/50 p-4">
    <n-card class="max-w-md w-full shadow-lg rounded-2xl" :bordered="false" size="large">
      <template #header>
        <div class="text-center pb-2">
          <h2 class="text-2xl font-bold text-gray-900">Nouvelle Entreprise</h2>
          <p class="text-sm text-gray-500 mt-2">Créez et configurez votre nouvelle entité commerciale.</p>
        </div>
      </template>

      <n-form ref="formRef" :model="entreprise" :rules="rules" size="medium" label-placement="top">
        <n-form-item label="Nom de l'entreprise" path="name">
          <n-input v-model:value="entreprise.name" placeholder="Ex: Ma Super Entreprise" />
        </n-form-item>

        <n-form-item label="Description" path="description">
          <n-input type="textarea" v-model:value="entreprise.description"
            placeholder="Description courte de l'activité..." :autosize="{ minRows: 3, maxRows: 5 }" />
        </n-form-item>

        <n-form-item label="Logo URL" path="logo_url">
          <n-input v-model:value="entreprise.logo_url" placeholder="https://example.com/logo.png" />
        </n-form-item>

        <div class="mt-4">
          <n-button type="primary" block :loading="store.isLoading" @click="handleSubmit" size="large">
            Créer l'entreprise
          </n-button>
        </div>
      </n-form>
    </n-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useEntrepriseStore } from '@/stores/entrepriseStore'
import { useMessage, NCard, NForm, NFormItem, NInput, NButton } from 'naive-ui'

const router = useRouter()
const store = useEntrepriseStore()
const message = useMessage()
const formRef = ref(null)

const entreprise = ref({
  name: '',
  description: '',
  logo_url: '',
})

const rules = {
  name: {
    required: true,
    message: "Le nom de l'entreprise est requis",
    trigger: 'blur'
  }
}

const handleSubmit = (e) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      store.error = null
      store.successMessage = null

      // Assuming store.createEntreprise returns boolean or throws
      const result = await store.createEntreprise(entreprise.value)

      if (result) {
        message.success('Entreprise créée avec succès !')
        router.push('/entreprises')
      } else {
        message.error(store.error || 'Échec de la création de l’entreprise')
      }
    } else {
      message.error('Veuillez remplir correctement le formulaire')
    }
  })
}
</script>
