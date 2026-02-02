<template>
  <n-space vertical size="medium">
    <n-card v-for="enterprise in enterprises" :key="enterprise.id" size="small"
      class="shadow-sm hover:shadow-md transition-all rounded-xl border-gray-200">
      <!-- Header -->
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center gap-3">
          <n-avatar :src="enterprise.logo_url" fallback-src="https://placehold.co/100" size="medium"
            class="flex-shrink-0" :style="{ backgroundColor: getGradientColor(enterprise.id) ? undefined : '#ccc' }" />
          <div class="min-w-0">
            <h3 class="font-semibold text-gray-900 text-sm truncate">
              {{ enterprise.name || 'Unnamed' }}
            </h3>
            <p class="text-xs text-gray-500 truncate">{{ enterprise.email_contact || 'No email' }}</p>
          </div>
        </div>
        <n-tag :type="enterprise.id === 8 ? 'error' : 'success'" size="small" :bordered="false">
          {{ enterprise.id === 8 ? 'Inactive' : 'Active' }}
        </n-tag>
      </div>

      <!-- Info Grid -->
      <n-grid :cols="2" x-gap="12" class="mb-3 pb-3 border-b border-gray-100">
        <n-gi>
          <p class="text-xs text-gray-500 mb-1">Ville</p>
          <n-tag type="info" size="small" :bordered="false">
            {{ enterprise.ville || 'N/A' }}
          </n-tag>
        </n-gi>
        <n-gi>
          <p class="text-xs text-gray-500 mb-1">Created</p>
          <p class="text-xs font-medium text-gray-900">{{ formatDate(enterprise.created_at) }}</p>
        </n-gi>
      </n-grid>

      <!-- Location -->
      <div class="flex items-center gap-2 mb-4 text-xs text-gray-600">
        <MapPinIcon class="w-3.5 h-3.5 text-gray-400" />
        <span>{{ enterprise.adresse || 'No address' }}</span>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2">
        <n-button class="flex-1" size="small" secondary @click="$emit('view', enterprise)">
          <template #icon>
            <EyeIcon />
          </template>
          View
        </n-button>
        <n-button class="flex-1" size="small" type="warning" secondary @click="$emit('edit', enterprise)">
          <template #icon>
            <PencilIcon />
          </template>
          Edit
        </n-button>
        <n-button size="small" type="error" secondary>
          <template #icon>
            <TrashIcon />
          </template>
        </n-button>
      </div>
    </n-card>
  </n-space>
</template>

<script setup>
import { NSpace, NCard, NAvatar, NTag, NGrid, NGi, NButton } from 'naive-ui'
import { MapPinIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'

defineProps({
  enterprises: {
    type: Array,
    required: true,
  },
})

defineEmits(['view', 'edit'])

function formatDate(date) {
  if (!date) return 'Recently'
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

function getGradientColor(id) {
  // Keeping rudimentary color logic if needed, or rely on image
  return undefined
}
</script>
