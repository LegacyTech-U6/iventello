<!-- components/EnterpriseCard.vue -->
<template>
  <div v-if="enterprise"
    class="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <!-- Edit Button -->
    <div class="flex justify-end mb-2">
      <button @click="handleEditEnterprise"
        class="p-2 text-gray-400 hover:text-blue-600 transition rounded hover:bg-blue-50" title="Edit">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
    </div>

    <!-- Header with logo/icon and basic info -->
    <div class="flex items-start justify-between mb-6">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
          <BuildingOffice2Icon class="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 class="font-bold text-xl text-gray-900">
            {{ enterprise.name || 'Unnamed enterprise' }}
          </h3>
          <p class="text-sm text-gray-500 mt-1">ID: {{ enterprise.id }}</p>
        </div>
      </div>

      <div class="text-right">
        <span class="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
          Active
        </span>
        <p class="text-xs text-gray-500 mt-2">Created recently</p>
      </div>
    </div>

    <!-- Description -->
    <p class="text-gray-600 mb-6 line-clamp-2">
      {{ enterprise.description || 'No description provided' }}
    </p>

    <!-- Stats Grid - Using REAL data from backend -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <!-- Revenue -->
      <div class="bg-green-50 rounded-lg p-4 border border-green-100">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold text-green-700">REVENUE</span>
          <ArrowTrendingUpIcon class="w-4 h-4 text-green-600" />
        </div>
        <p class="text-lg font-bold text-gray-900">
          ${{ formatCurrency(enterprise.totalRevenue) }}
        </p>
        <p class="text-xs text-green-600 mt-1">Total sales</p>
      </div>

      <!-- Inventory Value -->
      <div class="bg-blue-50 rounded-lg p-4 border border-blue-100">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold text-blue-700">INVENTORY</span>
          <CubeIcon class="w-4 h-4 text-blue-600" />
        </div>
        <p class="text-lg font-bold text-gray-900">
          ${{ formatCurrency(enterprise.inventoryValue) }}
        </p>
        <p class="text-xs text-blue-600 mt-1">Stock value</p>
      </div>

      <!-- Team Members -->
      <div class="bg-purple-50 rounded-lg p-4 border border-purple-100">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold text-purple-700">TEAM</span>
          <UsersIcon class="w-4 h-4 text-purple-600" />
        </div>
        <p class="text-lg font-bold text-gray-900">
          {{ enterprise.totalMembers || 0 }}
        </p>
        <p class="text-xs text-purple-600 mt-1">Members</p>
      </div>

      <!-- Health Score -->
      <div class="bg-orange-50 rounded-lg p-4 border border-orange-100">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold text-orange-700">HEALTH</span>
          <ChartBarIcon class="w-4 h-4 text-orange-600" />
        </div>
        <p class="text-lg font-bold text-gray-900">{{ calculateHealthScore() }}%</p>
        <p class="text-xs text-orange-600 mt-1">Performance</p>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="border-t border-gray-200 pt-4 mb-4">
      <p class="text-xs font-semibold text-gray-600 mb-3">QUICK STATS</p>
      <div class="grid grid-cols-3 gap-2 text-center">
        <div class="p-2 bg-gray-50 rounded">
          <p class="text-sm font-bold text-gray-900">{{ getRevenueGrowth() }}</p>
          <p class="text-xs text-gray-500">Revenue Growth</p>
        </div>
        <div class="p-2 bg-gray-50 rounded">
          <p class="text-sm font-bold text-gray-900">{{ getInventoryStatus() }}</p>
          <p class="text-xs text-gray-500">Stock Status</p>
        </div>
        <div class="p-2 bg-gray-50 rounded">
          <p class="text-sm font-bold text-gray-900">{{ getTeamStatus() }}</p>
          <p class="text-xs text-gray-500">Team Size</p>
        </div>
      </div>
    </div>

    <!-- Action Button -->
    <button @click="handleView"
      class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md">
      <EyeIcon class="w-4 h-4" />
      Open Dashboard
    </button>
  </div>

  <!-- Fallback for null enterprise -->
  <div v-else class="text-gray-400 text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
    <Building2 class="w-12 h-12 mx-auto mb-3 opacity-50" />
    <p>No enterprise data available</p>
  </div>
</template>

<script setup>
import { BuildingOffice2Icon, EyeIcon, ArrowTrendingUpIcon, CubeIcon, UsersIcon, ChartBarIcon } from '@heroicons/vue/24/outline' // Heroicons

const props = defineProps({
  enterprise: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['view', 'edit'])

const handleView = () => {
  emit('view', props.enterprise)
}

const handleEditEnterprise = () => {
  emit('edit', props.enterprise)
}

// Format currency properly
function formatCurrency(value) {
  const numValue = Number(value) || 0
  return numValue.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

// Calculate health score based on real data
function calculateHealthScore() {
  const revenue = Number(props.enterprise.totalRevenue) || 0
  const inventory = Number(props.enterprise.inventoryValue) || 0
  const members = Number(props.enterprise.totalMembers) || 0

  let score = 50 // Base score

  if (revenue > 0) score += 25
  if (inventory > 0) score += 15
  if (members > 0) score += 10

  return Math.min(score, 100)
}

// Helper functions for quick stats
function getRevenueGrowth() {
  const revenue = Number(props.enterprise.totalRevenue) || 0
  if (revenue === 0) return '0%'
  return revenue > 1000 ? 'High' : 'Growing'
}

function getInventoryStatus() {
  const inventory = Number(props.enterprise.inventoryValue) || 0
  if (inventory === 0) return 'Empty'
  return inventory > 5000 ? 'High' : 'Good'
}

function getTeamStatus() {
  const members = Number(props.enterprise.totalMembers) || 0
  if (members === 0) return 'Solo'
  return members > 5 ? 'Large' : 'Small'
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
