// src/composable/useSyncManager.ts
// Hook composable pour gérer la synchronisation dans les composants Vue

import { ref, computed, onMounted, onUnmounted } from 'vue';
import { OfflineSyncService } from '@/service/OfflineSyncService';
import type { SyncStatus } from '@/types/offline';

export function useSyncManager(syncService: OfflineSyncService) {
  const syncStatus = ref<SyncStatus>(syncService.getSyncStatus());
  const isSyncing = computed(() => syncStatus.value.isSyncing);
  const syncProgress = computed(() => syncStatus.value.progress);
  const syncMessage = computed(() => syncStatus.value.message);
  const syncError = computed(() => syncStatus.value.error);

  // Écouter les changements de statut
  let unsubscribe: (() => void) | null = null;

  onMounted(() => {
    unsubscribe = syncService.onSyncStatusChange((newStatus) => {
      syncStatus.value = newStatus;
    });
  });

  onUnmounted(() => {
    unsubscribe?.();
  });

  // Fonction pour déclencher la synchronisation
  const triggerSync = async (options?: { tables?: string[]; direction?: 'push' | 'pull' | 'bidirectional' }) => {
    try {
      await syncService.sync(options);
    } catch (error: any) {
      console.error('Erreur synchronisation:', error);
    }
  };

  // Forcer une synchronisation complète
  const fullSync = () => triggerSync({ direction: 'bidirectional' });

  // Synchroniser uniquement les envois
  const pushOnly = () => triggerSync({ direction: 'push' });

  // Synchroniser uniquement les téléchargements
  const pullOnly = () => triggerSync({ direction: 'pull' });

  return {
    isSyncing,
    syncProgress,
    syncMessage,
    syncError,
    triggerSync,
    fullSync,
    pushOnly,
    pullOnly
  };
}
