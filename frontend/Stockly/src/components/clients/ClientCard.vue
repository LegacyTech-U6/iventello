<!-- ClientCard.vue -->
<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <!-- Header with name and actions -->
    <div class="flex justify-between items-start mb-4">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ client.client_name }}</h3>
        <div class="flex items-center gap-2 text-sm text-gray-600 mb-1">
          <Mail :size="14" />
          <span>{{ client.email }}</span>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-600 mb-1">
          <Phone :size="14" />
          <span>{{ client.client_PhoneNumber }}</span>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <MapPin :size="14" />
          <span>{{ client.location }}</span>
        </div>
      </div>

      <div class="flex gap-1">

        <button @click="$emit('edit', client)"
          class="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors">
          <Edit2 :size="16" class="text-gray-600" />
        </button>
        <button @click="$emit('delete', client)"
          class="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors">
          <Trash2 :size="16" class="text-red-500" />
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
      <div class="bg-purple-50 rounded-lg p-3">
        <div class="flex items-center gap-2 mb-1">
          <span class="material-symbols-rounded">
            receipt
          </span>
          <span class="text-xs text-purple-700 font-medium">Invoices</span>
        </div>
        <p class="text-lg font-semibold text-purple-900">{{ invoiceCount }}</p>
      </div>

      <div class="bg-green-100 rounded-lg p-3">
        <div class="flex items-center gap-2 mb-1">
          <span class="material-symbols-rounded">
            paid
          </span>
          <span class="text-xs text-green-500 font-medium">Total Spend</span>
        </div>
        <p class="text-lg font-semibold text-green-900">{{ format(totalSpend) }}</p>
      </div>

      <div class="bg-amber-50 rounded-lg p-3">
        <div class="flex items-center gap-2 mb-1">
          <span class="material-symbols-rounded">
            done_all
          </span>
          <span class="text-xs text-amber-700 font-medium">Status</span>
        </div>
        <span :class="{
          'text-emerald-700 bg-emerald-100 border border-emerald-200': client.status === 'active',
          'text-gray-700 bg-gray-100 border border-gray-200': client.status === 'inactive',
          'text-amber-700 bg-amber-100 border border-amber-200': client.status === 'pending',
        }" class="inline-flex items-center px-2 py-1 rounded text-xs font-semibold">
          {{ client.status ? client.status.charAt(0).toUpperCase() + client.status.slice(1) : 'Active' }}
        </span>
      </div>
    </div>

    <!-- Code badge -->
    <div class="mt-4 pt-4 border-t border-gray-200">
      <span class="inline-flex items-center px-2.5 py-1 rounded bg-gray-100 text-xs font-medium text-gray-700">
        {{ client.client_signature }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCurrency } from '@/composable/useCurrency'

const {format} = useCurrency()
const props = defineProps({
  client: {
    type: Object,
    required: true
  }
})

defineEmits(['view', 'edit', 'delete'])

// Mock data - À remplacer par les vraies données de votre API
const invoiceCount = computed(() => props.client.invoices?.length || 0)
const totalSpend = computed(() => props.client.invoices?.reduce((sum, invoice) => sum + invoice.total, 0) || 0)


</script>