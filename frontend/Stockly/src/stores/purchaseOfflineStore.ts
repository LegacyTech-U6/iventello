// src/stores/purchaseStore.ts
// Store Pinia pour gestion des achats en mode offline-first

import { defineStore } from 'pinia';
import { StocklyOfflineService } from '@/service/StocklyOfflineService';
import { OfflineSyncService } from '@/service/OfflineSyncService';
import type { Purchase, PurchaseItem } from '@/types/offline';
import schemaSql from '@/service/stockly-offline-schema.sql?raw';

export const usePurchaseStore = defineStore('purchase', {
  state: () => ({
    purchases: [] as (Purchase & { items?: PurchaseItem[] })[],
    isLoading: false,
    error: null as string | null,
    offline: null as StocklyOfflineService | null,
    sync: null as OfflineSyncService | null
  }),

  getters: {
    getPurchaseById: (state) => (id: number) => state.purchases.find(p => p.id === id),
    getTotalPurchaseAmount: (state) => state.purchases.reduce((sum, p) => sum + (p.total || 0), 0)
  },

  actions: {
    // Initialiser le store
    async init(syncService: OfflineSyncService) {
      try {
        this.isLoading = true;
        if (!this.offline) {
          this.offline = new StocklyOfflineService(schemaSql);
          await this.offline.waitReady();
        }
        this.sync = syncService;
        await this.loadPurchases();
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },

    // Charger tous les achats avec items associés
    async loadPurchases() {
      if (!this.offline) return;
      this.isLoading = true;
      try {
        const purchases = await this.offline.findAll<Purchase>('Purchase');
        
        // Charger les items pour chaque achat
        for (const purchase of purchases) {
          const items = await this.offline.findAll<PurchaseItem>(
            'PurchaseItem',
            'purchase_id = ?',
            [purchase.id]
          );
          (purchase as any).items = items;
        }

        this.purchases = purchases as any;
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },

    // Créer un nouvel achat avec items
    async createPurchase(
      purchase: Omit<Purchase, 'id'>,
      items: Omit<PurchaseItem, 'id' | 'purchase_id'>[]
    ) {
      if (!this.offline || !this.sync) throw new Error('Service offline non initialisé');
      
      try {
        await this.offline.transaction(async () => {
          // Créer l'achat
          const purchaseId = await this.offline!.insert('Purchase', {
            ...purchase,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });

          // Créer les items
          for (const item of items) {
            await this.offline!.insert('PurchaseItem', {
              ...item,
              purchase_id: purchaseId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          }

          // Logger pour la synchro
          await this.sync!.logChange('Purchase', 'insert', purchaseId, purchase);
          items.forEach((item, idx) => {
            this.sync!.logChange('PurchaseItem', 'insert', idx, item);
          });
        });

        await this.loadPurchases();
      } catch (error: any) {
        this.error = error.message;
        throw error;
      }
    },

    // Modifier un achat
    async updatePurchase(id: number, updates: Partial<Purchase>) {
      if (!this.offline || !this.sync) throw new Error('Service offline non initialisé');
      
      try {
        const data = {
          ...updates,
          updatedAt: new Date().toISOString()
        };
        
        await this.offline.update('Purchase', data, 'id = ?', [id]);
        await this.sync.logChange('Purchase', 'update', id, updates);
        await this.loadPurchases();
      } catch (error: any) {
        this.error = error.message;
        throw error;
      }
    },

    // Supprimer un achat et ses items
    async deletePurchase(id: number) {
      if (!this.offline || !this.sync) throw new Error('Service offline non initialisé');
      
      try {
        await this.offline.transaction(async () => {
          // Supprimer les items d'abord
          await this.offline!.delete('PurchaseItem', 'purchase_id = ?', [id]);
          // Puis l'achat
          await this.offline!.delete('Purchase', 'id = ?', [id]);
          // Logger
          await this.sync!.logChange('Purchase', 'delete', id);
        });

        await this.loadPurchases();
      } catch (error: any) {
        this.error = error.message;
        throw error;
      }
    }
  }
});
