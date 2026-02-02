<template>
  <div class="bg-white rounded-b-xl shadow-sm border border-gray-200 overflow-hidden">
    <n-data-table :columns="columns" :data="enterprises" :pagination="pagination" :row-key="row => row.id"
      :row-props="rowProps" :bordered="false" size="small" />
  </div>
</template>

<script setup>
import { h, ref } from 'vue'
import { NDataTable, NButton, NTag, NAvatar, NSpace, NIcon } from 'naive-ui'
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  enterprises: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['view', 'edit'])

const pagination = ref({ pageSize: 10 })

function formatDate(date) {
  if (!date) return 'Recently'
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

function getAccountUrl(enterprise) {
  if (!enterprise.name) return 'No URL'
  const slug = enterprise.name.toLowerCase().replace(/\s+/g, '')
  return `${slug.substring(0, 3)}.example.com`
}

const columns = [
  { type: 'selection' },
  {
    title: 'Company Name',
    key: 'name',
    render(row) {
      return h(NSpace, { align: 'center', size: 'small' }, {
        default: () => [
          h(NAvatar, {
            src: row.logo_url,
            fallbackSrc: 'https://placehold.co/100', // fallback
            size: 'small',
            style: { backgroundColor: getGradientColor(row.id) } // simple color hash if no logo?
          }),
          h('span', { class: 'font-medium text-gray-900' }, { default: () => row.name || 'Unnamed' })
        ]
      })
    }
  },
  {
    title: 'Email',
    key: 'email_contact',
    render: (row) => row.email_contact || 'No email'
  },
  {
    title: 'Account URL',
    key: 'account',
    render: (row) => h('span', { class: 'text-gray-500 italic' }, { default: () => getAccountUrl(row) })
  },
  {
    title: 'Location',
    key: 'ville',
    render(row) {
      return h(NTag, { type: 'info', bordered: false, size: 'small' }, { default: () => row.ville || 'N/A' })
    }
  },
  {
    title: 'Created Date',
    key: 'created_at',
    render: (row) => formatDate(row.created_at)
  },
  {
    title: 'Status',
    key: 'status',
    render(row) {
      // Logic from previous code: id 8 is Inactive
      const isActive = row.id !== 8
      return h(
        NTag,
        { type: isActive ? 'success' : 'error', bordered: false, size: 'small' },
        { default: () => (isActive ? 'Active' : 'Inactive') }
      )
    }
  },
  {
    title: 'Actions',
    key: 'actions',
    render(row) {
      return h(NSpace, { size: 'small' }, {
        default: () => [
          h(NButton, {
            size: 'tiny',
            quaternary: true,
            circle: true,
            onClick: (e) => {
              e.stopPropagation()
              emit('view', row)
            }
          }, { icon: () => h(NIcon, null, { default: () => h(EyeIcon) }) }),
          h(NButton, {
            size: 'tiny',
            quaternary: true,
            circle: true,
            onClick: (e) => {
              e.stopPropagation()
              emit('edit', row)
            }
          }, { icon: () => h(NIcon, null, { default: () => h(PencilIcon) }) }),
          h(NButton, {
            size: 'tiny',
            quaternary: true,
            circle: true,
            type: 'error',
            onClick: (e) => {
              e.stopPropagation()
            }
            // Add delete logic here if needed
          }, { icon: () => h(NIcon, null, { default: () => h(TrashIcon) }) })
        ]
      })
    }
  }
]

const rowProps = (row) => {
  return {
    style: 'cursor: pointer;',
    onClick: () => emit('view', row)
  }
}

function getGradientColor(id) {
  // Just return a hex color for Avatar background if needed, or keep logic.
  // Using transparent for NAvatar usually if src exists.
  return undefined
}
</script>
