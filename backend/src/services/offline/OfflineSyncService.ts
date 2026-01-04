/**
 * @file src/services/offline/OfflineSyncService.ts
 * @description Service de synchronisation bidirectionnelle offline ↔ online
 * Gère la queue de sync, les conflits et la versioning
 */

import type {
  ISyncQueueItem,
  ISyncMetadata,
  SyncStatus,
  IEntityVersion
} from '@types/index';

/**
 * Configuration pour la synchronisation offline
 */
export interface SyncConfig {
  batchSize: number;
  maxRetries: number;
  retryDelay: number; // ms
  conflictResolutionStrategy: 'last-write-wins' | 'manual' | 'server-priority';
}

/**
 * Résultat de synchronisation
 */
export interface SyncResult {
  totalItems: number;
  successCount: number;
  failureCount: number;
  conflictCount: number;
  duration: number; // ms
  errors: Array<{ id: number; error: string }>;
}

/**
 * Service de synchronisation offline-first
 * 
 * Responsabilités:
 * - Gérer la queue de synchronisation locale
 * - Détecter et résoudre les conflits
 * - Implémenter le versioning des entités
 * - Assurer l'intégrité des données
 */
export class OfflineSyncService {
  private config: SyncConfig;
  private isSyncing: boolean = false;

  constructor(config: Partial<SyncConfig> = {}) {
    this.config = {
      batchSize: config.batchSize ?? 50,
      maxRetries: config.maxRetries ?? 3,
      retryDelay: config.retryDelay ?? 1000,
      conflictResolutionStrategy: config.conflictResolutionStrategy ?? 'last-write-wins'
    };
  }

  /**
   * Ajoute un changement à la queue de synchronisation
   * @param entityType Type d'entité modifiée
   * @param entityId ID de l'entité
   * @param operation Type d'opération (create/update/delete)
   * @param data Données de l'entité
   * @param oldData Données antérieures (pour update)
   * @returns Item ajouté à la queue
   */
  async addToQueue(
    entityType: string,
    entityId: number,
    operation: 'create' | 'update' | 'delete',
    data: Record<string, any>,
    oldData?: Record<string, any>
  ): Promise<ISyncQueueItem> {
    // À implémenter avec SQLite local ou IndexedDB
    console.log(`[SYNC] Adding ${operation} operation for ${entityType}#${entityId}`);
    
    return {
      id: Date.now(),
      entrepriseId: 1, // À récupérer du contexte
      entityType,
      entityId,
      operation,
      data,
      oldData,
      syncStatus: 'pending',
      createdAt: new Date(),
      localVersion: 1
    };
  }

  /**
   * Synchronise tous les changements en attente vers le serveur
   * @returns Résultat de la synchronisation
   */
  async syncAll(): Promise<SyncResult> {
    if (this.isSyncing) {
      throw new Error('Synchronisation déjà en cours');
    }

    this.isSyncing = true;
    const startTime = Date.now();
    
    try {
      // 1. Récupérer les items en attente depuis le stockage local
      const pendingItems = await this.getPendingItems();
      
      if (pendingItems.length === 0) {
        return {
          totalItems: 0,
          successCount: 0,
          failureCount: 0,
          conflictCount: 0,
          duration: Date.now() - startTime,
          errors: []
        };
      }

      // 2. Traiter par batch
      const errors: Array<{ id: number; error: string }> = [];
      let successCount = 0;
      let conflictCount = 0;

      for (let i = 0; i < pendingItems.length; i += this.config.batchSize) {
        const batch = pendingItems.slice(i, i + this.config.batchSize);
        
        for (const item of batch) {
          try {
            await this.syncItem(item);
            successCount++;
          } catch (error: any) {
            if (error.code === 'CONFLICT') {
              // Gérer les conflits selon la stratégie
              const resolved = await this.resolveConflict(item);
              if (resolved) {
                successCount++;
              } else {
                conflictCount++;
                errors.push({ id: item.id, error: 'Conflit non résolu' });
              }
            } else {
              errors.push({ id: item.id, error: error.message });
            }
          }
        }
      }

      return {
        totalItems: pendingItems.length,
        successCount,
        failureCount: errors.length,
        conflictCount,
        duration: Date.now() - startTime,
        errors
      };
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Synchronise un item unique
   * @param item Item à synchroniser
   */
  private async syncItem(item: ISyncQueueItem): Promise<void> {
    let lastError: any;
    
    for (let attempt = 0; attempt < this.config.maxRetries; attempt++) {
      try {
        // Appeler l'API pour synchroniser
        const response = await this.postToServer(item);
        
        // Mettre à jour le statut local
        await this.updateSyncStatus(item.id, 'synced', response.version);
        return;
      } catch (error: any) {
        lastError = error;
        
        if (error.code === 'CONFLICT') {
          throw error; // Laisser le caller gérer les conflits
        }
        
        if (attempt < this.config.maxRetries - 1) {
          // Attendre avant de réessayer (exponential backoff)
          await this.delay(this.config.retryDelay * Math.pow(2, attempt));
        }
      }
    }
    
    // Marquer comme échoué après les tentatives
    await this.updateSyncStatus(item.id, 'failed', undefined, lastError?.message);
    throw lastError;
  }

  /**
   * Détecte et résout les conflits de synchronisation
   * @param item Item en conflit
   * @returns true si résolu, false sinon
   */
  private async resolveConflict(item: ISyncQueueItem): Promise<boolean> {
    switch (this.config.conflictResolutionStrategy) {
      case 'last-write-wins':
        // Stratégie LWW : la dernière modification gagne
        return await this.resolveLWW(item);
      
      case 'server-priority':
        // Le serveur a toujours raison
        return await this.revertToServerVersion(item);
      
      case 'manual':
        // Marquer comme conflit pour résolution manuelle
        await this.updateSyncStatus(item.id, 'conflict');
        return false;
      
      default:
        return false;
    }
  }

  /**
   * Résout un conflit avec la stratégie Last-Write-Wins
   * Compare les timestamps et gardeère la version la plus récente
   */
  private async resolveLWW(item: ISyncQueueItem): Promise<boolean> {
    try {
      // Récupérer la version serveur
      const serverVersion = await this.getServerVersion(item.entityType, item.entityId);
      
      if (!serverVersion) {
        // Entité supprimée côté serveur
        if (item.operation === 'delete') {
          await this.updateSyncStatus(item.id, 'synced');
          return true;
        }
        // Créer de nouveau
        item.operation = 'create';
        return await this.syncItem(item);
      }

      // Comparer les timestamps
      const localTime = new Date(item.createdAt).getTime();
      const serverTime = new Date(serverVersion.createdAt).getTime();

      if (localTime > serverTime) {
        // Version locale est plus récente
        return await this.syncItem(item);
      } else {
        // Version serveur est plus récente, l'utiliser
        return await this.revertToServerVersion(item);
      }
    } catch (error) {
      console.error('Erreur lors de la résolution LWW:', error);
      return false;
    }
  }

  /**
   * Revient à la version du serveur
   */
  private async revertToServerVersion(item: ISyncQueueItem): Promise<boolean> {
    try {
      const serverVersion = await this.getServerVersion(item.entityType, item.entityId);
      
      // Mettre à jour la copie locale avec les données du serveur
      await this.updateLocalEntity(item.entityType, item.entityId, serverVersion.data);
      
      // Marquer comme synced
      await this.updateSyncStatus(item.id, 'synced', serverVersion.version);
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la reversion:', error);
      return false;
    }
  }

  /**
   * Récupère les items en attente de synchronisation
   */
  private async getPendingItems(): Promise<ISyncQueueItem[]> {
    // À implémenter avec SQLite local
    return [];
  }

  /**
   * Envoie un item au serveur
   */
  private async postToServer(item: ISyncQueueItem): Promise<{ version: number }> {
    // À implémenter avec fetch/axios
    return { version: item.localVersion ?? 1 };
  }

  /**
   * Met à jour le statut de synchronisation
   */
  private async updateSyncStatus(
    itemId: number,
    status: SyncStatus,
    version?: number,
    error?: string
  ): Promise<void> {
    // À implémenter
    console.log(`[SYNC] Updated item ${itemId} status to ${status}`);
  }

  /**
   * Récupère la version serveur d'une entité
   */
  private async getServerVersion(
    entityType: string,
    entityId: number
  ): Promise<IEntityVersion | null> {
    // À implémenter avec appel API
    return null;
  }

  /**
   * Met à jour l'entité locale avec les données du serveur
   */
  private async updateLocalEntity(
    entityType: string,
    entityId: number,
    data: Record<string, any>
  ): Promise<void> {
    // À implémenter
    console.log(`[SYNC] Updated local entity ${entityType}#${entityId}`);
  }

  /**
   * Utilitaire: délai
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Statut de synchronisation
   */
  isSyncingNow(): boolean {
    return this.isSyncing;
  }
}

export default OfflineSyncService;
