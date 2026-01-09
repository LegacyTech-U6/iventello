// src/stores/supplierOfflineStore.ts
// Store Pinia pour gestion des fournisseurs en mode offline-first

import { defineStore } from 'pinia';
import { StocklyOfflineService } from '@/service/StocklyOfflineService';
import { OfflineSyncService } from '@/service/OfflineSyncService';
import type { Supplier } from '@/types/offline';
import schemaSql from '@/service/stockly-offline-schema.sql?raw';

export const useSupplierStore = defineStore('supplier', {
  state: () => ({
    suppliers: [] as Supplier[],
    isLoading: false,
    error: null as string | null,
    offline: null as StocklyOfflineService | null,
    sync: null as OfflineSyncService | null
  }),

  getters: {
    getSupplierById: (state) => (id: number) => state.suppliers.find(s => s.id === id),
    getTotalSuppliers: (state) => state.suppliers.length
  },

  actions: {
    async init(syncService: OfflineSyncService) {
      try {
        this.isLoading = true;
        if (!this.offline) {
          this.offline = new StocklyOfflineService(schemaSql);
          await this.offline.waitReady();
        }
        this.sync = syncService;
        await this.fetchSuppliers();
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchSuppliers() {
      if (!this.offline) return;
      this.isLoading = true;
      try {
        this.suppliers = await this.offline.findAll<Supplier>('Supplier');
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },

    async addSupplier(supplier: Omit<Supplier, 'id'>) {
      if (!this.offline || !this.sync) throw new Error('Service offline non initialisé');
      
      try {
        const id = await this.offline.insert('Supplier', {
          ...supplier,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        await this.sync.logChange('Supplier', 'insert', id, supplier);
        await this.loadSuppliers();
      } catch (error: any) {
        this.error = error.message;
        throw error;
      }
    },

    async updateSupplier(id: number, updates: Partial<Supplier>) {
      if (!this.offline || !this.sync) throw new Error('Service offline non initialisé');
      
      try {
        const data = {
          ...updates,
          updatedAt: new Date().toISOString()
        };
        
        await this.offline.update('Supplier', data, 'id = ?', [id]);
        await this.sync.logChange('Supplier', 'update', id, updates);
        await this.loadSuppliers();
      } catch (error: any) {
        this.error = error.message;
        throw error;
      }
    },

    async deleteSupplier(id: number) {
      if (!this.offline || !this.sync) throw new Error('Service offline non initialisé');
      
      try {
        await this.offline.delete('Supplier', 'id = ?', [id]);
        await this.sync.logChange('Supplier', 'delete', id);
        await this.loadSuppliers();
      } catch (error: any) {
        this.error = error.message;
        throw error;
      }
    }
  }
});
