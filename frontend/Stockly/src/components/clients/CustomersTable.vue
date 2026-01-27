<template>
  <n-card v-if="!loading && clients.length" :bordered="false" class="shadow-sm mt-6">
    <n-data-table :columns="columns" :data="paginatedClients" :bordered="false" :single-line="false" class="text-sm" />

    <div class="flex flex-col md:flex-row justify-between items-center gap-4 mt-4 pt-4 border-t border-gray-100">
      <div class="flex items-center gap-3">
        <n-text depth="3">Row Per Page</n-text>
        <n-select :value="pageSize" @update:value="$emit('update:pageSize', $event)" :options="pageSizeOptions"
          size="small" class="w-20" />

        <n-text depth="3">Entries</n-text>
      </div>

      <n-pagination :page="currentPage" @update:page="$emit('update:currentPage', $event)" :page-count="pageCount"
        :page-slot="5" />
    </div>
  </n-card>

  <div v-else-if="loading" class="flex justify-center items-center min-h-[400px] bg-white rounded-lg shadow-sm mt-6">
    <n-space vertical align="center" :size="24">
      <n-spin size="large" />
      <n-text depth="3">Loading customers...</n-text>
    </n-space>
  </div>

  <n-card v-else :bordered="false" class="shadow-sm mt-6">
    <n-empty class="py-16 px-6" :description="search ? 'No customers found' : 'No customers yet'" size="large">
      <template #icon><n-icon size="64" :component="InboxIcon" /></template>
      <template #extra>
        <n-space vertical :size="12" align="center">
          <n-text depth="3">{{
            search ? 'Try adjusting your search terms' : 'Get started by adding your first customer'
          }}</n-text>
          <n-button v-if="!search" type="success" @click="$emit('add')" size="large"
            class="bg-emerald-500 hover:bg-emerald-600 text-white">
            <template #icon><n-icon :component="PlusIcon" /></template>
            Add Your First Customer
          </n-button>
          <n-button v-else @click="$emit('clear-search')" size="large" class="bg-gray-100 hover:bg-gray-200">
            Clear Search
          </n-button>
        </n-space>
      </template>
    </n-empty>
  </n-card>
</template>

<script setup>
import {
  NCard,
  NDataTable,
  NPagination,
  NSelect,
  NSpin,
  NSpace,
  NEmpty,
  NButton,
  NIcon,
  NText,
} from 'naive-ui'
import { InboxIcon, PlusIcon } from '@heroicons/vue/24/outline'

defineProps({
  loading: Boolean,
  clients: Array,
  columns: Array,
  paginatedClients: Array,
  pageSize: Number,
  currentPage: Number,
  pageCount: Number,
  pageSizeOptions: Array,
  search: String,
})

defineEmits(['update:page', 'update:pageSize', 'add', 'clear-search'])
</script>
