<!-- ClientCard.vue -->
<template>
  <n-card class="hover:shadow-md transition-shadow cursor-pointer" :bordered="true" size="small">
    <!-- Header with name and actions -->
    <div class="flex justify-between items-start mb-4">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">{{ client.client_name }}</h3>
        <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
          <n-icon :component="EnvelopeIcon" class="w-3.5 h-3.5" />
          <span>{{ client.email }}</span>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
          <n-icon :component="PhoneIcon" class="w-3.5 h-3.5" />
          <span>{{ client.client_PhoneNumber }}</span>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <n-icon :component="MapPinIcon" class="w-3.5 h-3.5" />
          <span>{{ client.location }}</span>
        </div>
      </div>

      <div class="flex gap-2">
        <n-button size="small" secondary circle @click.stop="$emit('edit', client)">
          <template #icon><n-icon :component="PencilIcon" /></template>
        </n-button>
        <n-button size="small" type="error" secondary circle @click.stop="$emit('delete', client)">
          <template #icon><n-icon :component="TrashIcon" /></template>
        </n-button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
      <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
        <div class="flex items-center gap-2 mb-1">
          <n-icon :component="DocumentTextIcon" class="text-purple-700 dark:text-purple-400" />
          <span class="text-xs text-purple-700 dark:text-purple-400 font-medium">Invoices</span>
        </div>
        <p class="text-lg font-semibold text-purple-900 dark:text-purple-200">{{ invoiceCount }}</p>
      </div>

      <div class="bg-green-100 dark:bg-green-900/20 rounded-lg p-3">
        <div class="flex items-center gap-2 mb-1">
          <n-icon :component="CurrencyDollarIcon" class="text-green-600 dark:text-green-400" />
          <span class="text-xs text-green-600 dark:text-green-400 font-medium">Total Spend</span>
        </div>
        <p class="text-lg font-semibold text-green-900 dark:text-green-200">{{ format(totalSpend) }}</p>
      </div>

      <div class="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
        <div class="flex items-center gap-2 mb-1">
          <n-icon :component="CheckBadgeIcon" class="text-amber-700 dark:text-amber-400" />
          <span class="text-xs text-amber-700 dark:text-amber-400 font-medium">Status</span>
        </div>
        <n-tag :type="getStatusType(client.status)" size="small" :bordered="false">
          {{ client.status ? client.status.charAt(0).toUpperCase() + client.status.slice(1) : 'Active' }}
        </n-tag>
      </div>
    </div>

    <!-- Code badge -->
    <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
      <n-tag size="small" type="default">
        {{ client.client_signature }}
      </n-tag>
    </div>
  </n-card>
</template>

<script setup>
import { computed } from 'vue'
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  CheckBadgeIcon
} from '@heroicons/vue/24/outline'
import { useCurrency } from '@/composable/useCurrency'
import { NCard, NButton, NIcon, NTag } from 'naive-ui'

const { format } = useCurrency()
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

function getStatusType(status) {
  switch (status) {
    case 'active': return 'success'
    case 'inactive': return 'default'
    case 'pending': return 'warning'
    default: return 'success'
  }
}


</script>