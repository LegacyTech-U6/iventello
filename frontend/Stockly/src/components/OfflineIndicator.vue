<!-- src/components/OfflineIndicator.vue -->
<!-- Indicateur du statut offline/online et synchronisation -->

<template>
  <div class="offline-indicator">
    <!-- Statut connexion -->
    <div :class="['status-badge', isOnline ? 'online' : 'offline']">
      <span class="status-dot"></span>
      <span class="status-text">
        {{ isOnline ? 'En ligne' : 'Hors ligne' }}
      </span>
    </div>

    <!-- Nombre de changements en attente -->
    <div v-if="pendingChanges > 0" class="pending-badge">
      {{ pendingChanges }} modification{{ pendingChanges > 1 ? 's' : '' }} en attente
    </div>

    <!-- Message d'info -->
    <div v-if="!isOnline" class="offline-message">
      Les modifications seront synchronisées une fois la connexion rétablie.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { StocklyOfflineService } from '@/service/StocklyOfflineService';

interface Props {
  offlineService?: StocklyOfflineService;
}

const props = defineProps<Props>();

const isOnline = ref(navigator.onLine);
const pendingChanges = ref(0);

// Écouter les changements de statut réseau
const handleOnline = () => {
  isOnline.value = true;
};

const handleOffline = () => {
  isOnline.value = false;
};

// Compter les changements en attente
const countPendingChanges = async () => {
  if (!props.offlineService) return;
  
  try {
    await props.offlineService.waitReady();
    const count = await props.offlineService.count('_sync_changes', 'synced = 0');
    pendingChanges.value = count;
  } catch (error) {
    console.error('Erreur comptage changements:', error);
  }
};

onMounted(() => {
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  // Compter les changements au démarrage
  countPendingChanges();
  
  // Actualiser toutes les 5 secondes
  const interval = setInterval(countPendingChanges, 5000);
  
  return () => {
    clearInterval(interval);
  };
});

onUnmounted(() => {
  window.removeEventListener('online', handleOnline);
  window.removeEventListener('offline', handleOffline);
});
</script>

<style scoped>
.offline-indicator {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge.online {
  background: #dbeafe;
  color: #0c4a6e;
}

.status-badge.offline {
  background: #fecaca;
  color: #7f1d1d;
}

.status-dot {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
}

.status-badge.online .status-dot {
  background: #0ea5e9;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.status-badge.offline .status-dot {
  background: #f87171;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-text {
  font-size: 0.875rem;
}

.pending-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  background: #fef3c7;
  color: #92400e;
  border-radius: 0.25rem;
  font-size: 0.8125rem;
  font-weight: 500;
}

.offline-message {
  font-size: 0.8125rem;
  color: #6b7280;
  padding: 0.5rem 0;
  border-top: 1px solid #e5e7eb;
  padding-top: 0.75rem;
}
</style>
