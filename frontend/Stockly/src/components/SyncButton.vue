<!-- src/components/SyncButton.vue -->
<!-- Bouton de synchronisation avec indicateur de statut -->

<template>
  <div class="sync-container">
    <!-- Bouton principal -->
    <button
      @click="handleSync"
      :disabled="isSyncing"
      :class="['sync-btn', { 'is-syncing': isSyncing }]"
    >
      <!-- Icône chargement -->
      <svg v-if="isSyncing" class="spinner" viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="3" />
      </svg>
      
      <!-- Icône sync -->
      <svg v-else class="sync-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polyline points="1 4 1 10 7 10"></polyline>
        <polyline points="23 20 23 14 17 14"></polyline>
        <path d="M20.354 9.354A9 9 0 0 0 5.646 14.646"></path>
        <path d="M18.354 15.354A9 9 0 0 1 3.646 9.646"></path>
      </svg>
      
      <span class="btn-text">
        {{ isSyncing ? syncMessage : 'Synchroniser' }}
      </span>
    </button>

    <!-- Barre de progression -->
    <div v-if="isSyncing" class="progress-bar">
      <div class="progress-fill" :style="{ width: syncProgress + '%' }"></div>
    </div>

    <!-- Statut détaillé -->
    <div v-if="syncStatus.lastSyncTime" class="sync-info">
      <span class="last-sync">
        Dernière synchro: {{ formatTime(syncStatus.lastSyncTime) }}
      </span>
    </div>

    <!-- Message d'erreur -->
    <div v-if="syncError" class="sync-error">
      <span class="error-icon">⚠️</span>
      {{ syncError }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { OfflineSyncService } from '@/service/OfflineSyncService';

interface Props {
  syncService: OfflineSyncService;
  direction?: 'push' | 'pull' | 'bidirectional';
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'bidirectional'
});

const isSyncing = ref(false);
const syncProgress = ref(0);
const syncMessage = ref('');
const syncError = ref('');
const lastSyncTime = ref<number | null>(null);

const syncStatus = computed(() => ({
  isSyncing: isSyncing.value,
  progress: syncProgress.value,
  message: syncMessage.value,
  error: syncError.value,
  lastSyncTime: lastSyncTime.value
}));

const handleSync = async () => {
  if (!props.syncService) return;
  isSyncing.value = true;
  syncProgress.value = 0;
  syncMessage.value = 'Synchronisation...';
  syncError.value = '';
  try {
    await props.syncService.sync({
      direction: props.direction,
      onProgress: (msg: string) => {
        syncMessage.value = msg;
        syncProgress.value = Math.min(syncProgress.value + 10, 100); // simple progress
      }
    });
    lastSyncTime.value = Date.now();
    syncMessage.value = 'Synchronisation terminée';
    syncProgress.value = 100;
  } catch (err: any) {
    syncError.value = err?.message || 'Erreur lors de la synchronisation';
    syncMessage.value = '';
    syncProgress.value = 0;
  } finally {
    isSyncing.value = false;
  }
};

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
  if (diffMinutes < 1) return 'À l\'instant';
  if (diffMinutes < 60) return `Il y a ${diffMinutes}m`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  return date.toLocaleDateString('fr-FR');
};
</script>

<style scoped>
.sync-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.sync-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sync-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.sync-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.sync-btn.is-syncing {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.spinner {
  width: 1rem;
  height: 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.sync-icon {
  width: 1rem;
  height: 1rem;
  stroke-width: 2;
}

.btn-text {
  font-weight: 600;
}

.progress-bar {
  height: 3px;
  background: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.3s ease;
}

.sync-info {
  font-size: 0.75rem;
  color: #6b7280;
}

.last-sync {
  display: block;
}

.sync-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.error-icon {
  font-size: 1rem;
}
</style>
