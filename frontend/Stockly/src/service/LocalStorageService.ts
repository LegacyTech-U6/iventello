// src/service/LocalStorageService.ts
// Wrapper IndexedDB pour persister SQLite offline et gestion sécurisée

export class LocalStorageService {
  private dbName = 'stockly-offline-db'
  private storeName = 'database'

  async saveDatabase(data: Uint8Array): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const db = request.result
        const tx = db.transaction(this.storeName, 'readwrite')
        const store = tx.objectStore(this.storeName)

        store.put({ key: 'database', data }, 'database')
        tx.oncomplete = () => resolve()
        tx.onerror = () => reject(tx.error)
      }

      request.onupgradeneeded = (e: any) => {
        const db = e.target.result
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName)
        }
      }
    })
  }

  async loadDatabase(): Promise<Uint8Array | null> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const db = request.result
        const tx = db.transaction(this.storeName, 'readonly')
        const store = tx.objectStore(this.storeName)
        const getRequest = store.get('database')

        getRequest.onsuccess = () => {
          resolve(getRequest.result?.data || null)
        }
        getRequest.onerror = () => reject(getRequest.error)
      }

      request.onupgradeneeded = (e: any) => {
        const db = e.target.result
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName)
        }
      }
    })
  }

  async clearDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(this.dbName)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }
}
