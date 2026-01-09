import { StocklyOfflineService } from './StocklyOfflineService'
import { OfflineSyncService } from './OfflineSyncService'
import schemaSql from './stockly-offline-schema.sql?raw'

let offlineInstance: StocklyOfflineService | null = null
let syncInstance: OfflineSyncService | null = null

export async function getOfflineService(): Promise<StocklyOfflineService> {
  if (offlineInstance) return offlineInstance
  offlineInstance = new StocklyOfflineService(schemaSql)
  // waitReady may be implemented; if not, it's harmless
  if (typeof (offlineInstance as any).waitReady === 'function') {
    try {
      await (offlineInstance as any).waitReady()
    } catch (e) {
      // ignore
    }
  }
  return offlineInstance
}
// Dans syncProvider.ts
export async function getSyncService(): Promise<OfflineSyncService> {
  if (syncInstance) return syncInstance;
  
  const offline = await getOfflineService();
  // On ne passe plus que l'instance offline !
  syncInstance = new OfflineSyncService(offline); 
  
  return syncInstance;
}

export function resetSyncProvider() {
  offlineInstance = null
  syncInstance = null
}
