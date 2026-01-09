import { StocklyOfflineService } from './StocklyOfflineService';
import API from '@/api/axios'; // Import de ton instance Axios

export class OfflineSyncService {
  private isSyncing = false;

  constructor(private offline: StocklyOfflineService) {}

  public async logChange(entity: string, op: 'INSERT' | 'UPDATE' | 'DELETE', id: number, data?: any) {
    await this.offline.insert('SyncQueue', {
      entity_type: entity,
      entity_id: id,
      operation: op,
      change_data: data ? JSON.stringify(data) : null,
      synced: 0
    });
  }

  public async sync(onProgress?: (msg: string) => void) {
    if (this.isSyncing) return;
    this.isSyncing = true;

    try {
      await this.processPushQueue(onProgress);
      await this.processPull(onProgress);
      onProgress?.("Synchronisation réussie.");
    } catch (error) {
      console.error("Erreur synchro:", error);
      onProgress?.("Erreur de connexion au serveur.");
    } finally {
      this.isSyncing = false;
    }
  }

  private async processPushQueue(onProgress?: (msg: string) => void) {
    const pending = await this.offline.findAll('SyncQueue', 'synced = 0');
    
    for (const item of pending) {
      onProgress?.(`Envoi ${item.operation} : ${item.entity_type}...`);
      try {
        // Utilisation de Axios : les headers (Token, Entreprise) sont mis automatiquement
        const response = await API.post(`/sync/${item.entity_type.toLowerCase()}`, {
          operation: item.operation,
          id: item.entity_id,
          data: JSON.parse(item.change_data || '{}')
        });

        if (response.status === 200 || response.status === 201) {
          await this.offline.delete('SyncQueue', 'id = ?', [item.id]);
        }
      } catch (e) {
        console.error("Échec push item:", item.id, e);
      }
    }
  }

  private async processPull(onProgress?: (msg: string) => void) {
    const tables = ['Product', 'Client', 'Category'];

    for (const table of tables) {
      onProgress?.(`Récupération ${table}...`);
      try {
        // Pas besoin de headers ici non plus, Axios gère tout
        const res = await API.get(`/sync/${table.toLowerCase()}`);
        
        if (res.data) {
          for (const row of res.data) {
            const localExists = await this.offline.findById(table, row.id);
            if (localExists) {
              await this.offline.update(table, row, 'id = ?', [row.id]);
            } else {
              await this.offline.insert(table, row);
            }
          }
        }
      } catch (e) {
        console.error(`Erreur pull ${table}:`, e);
      }
    }
  }
}