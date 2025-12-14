<template>
  <div
    class="card flex flex-col h-full transition-all duration-300 ease-in-out hover:elevation-3 hover:-translate-y-1 cursor-pointer "
    @click="$emit('view', category.id)"
  >
    <div class="flex items-start gap-4 mb-4">
      <div
        class="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center text-xl font-bold flex-shrink-0 shadow-md"
      >
        {{ category.name.charAt(0).toUpperCase() }}
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="card-title truncate text-primary" :title="category.name">{{ category.name }}</h3>
        <div
          class="badge-success inline-flex items-center gap-1.5"
          title="Number of products in this category"
        >
          <Package class="w-3.5 h-3.5" />
          <span>{{ category.productCount }} Products</span>
        </div>
      </div>
      <div class="flex gap-1">
        <button
          class="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-secondary-container hover:text-on-secondary-container transition-colors"
          @click.stop="$emit('edit', category)"
          title="Edit"
        >
          <Pencil class="w-5 h-5" />
        </button>
        <button
          class="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors"
          @click.stop="$emit('delete', category.id)"
          title="Delete"
        >
          <Trash2 class="w-5 h-5" />
        </button>
      </div>
    </div>

    <div class="flex-grow text-on-surface-variant text-sm mb-4 border-t border-primary/20 pt-4">
      <p class="line-clamp-2 italic">{{ category.description || 'No description provided.' }}</p>
    </div>

    <div class="flex justify-between items-center text-sm text-on-surface-variant">
      <div class="flex items-center gap-2" title="Creation Date">
        <CalendarPlus class="w-4 h-4 text-tertiary" />
        <span class="font-semibold text-on-surface">{{ formatDate(category.createdAt) }}</span>
      </div>
      <div class="flex items-center gap-2" title="Last Updated">
        <History class="w-4 h-4 text-secondary" />
        <span class="font-semibold text-on-surface">{{ formatDate(category.updatedAt) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Pencil, Trash2, Package, CalendarPlus, History } from 'lucide-vue-next'

defineProps({
  category: {
    type: Object,
    required: true,
  },
})

defineEmits(['edit', 'delete', 'view'])

const formatDate = (dateString) => {
  if (!dateString || new Date(dateString).toString() === 'Invalid Date') {
    return 'N/A'
  }
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}
</script>

<style scoped></style>
