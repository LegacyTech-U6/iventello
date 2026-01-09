// src/stores/invoiceOfflineStore.ts
// Store Pinia pour gestion des factures en mode offline-first

import { defineStore } from 'pinia';
import { StocklyOfflineService } from '@/service/StocklyOfflineService';
import { OfflineSyncService } from '@/service/OfflineSyncService';
import type { Invoice } from '@/types/offline';
import schemaSql from '@/service/stockly-offline-schema.sql?raw';

export const useInvoiceStore = defineStore('invoice', {
  state: () => ({
    invoices: [] as Invoice[],
    isLoading: false,
    error: null as string | null,
    offline: null as StocklyOfflineService | null,
    sync: null as OfflineSyncService | null
  }),

  getters: {
    getInvoiceById: (state) => (id: number) => state.invoices.find(i => i.id === id),
    getTotalAmount: (state) => state.invoices.reduce((sum, i) => sum + (i.general_total || 0), 0),
    getByStatus: (state) => (status: string) => state.invoices.filter(i => i.status === status)
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
        await this.fetchInvoices();
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchInvoices() {
      if (!this.offline) return;
      this.isLoading = true;
      try {
        this.invoices = await this.offline.findAll<Invoice>('Invoice');
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },

    async addInvoice(invoice: Omit<Invoice, 'id'>) {
      if (!this.offline || !this.sync) throw new Error('Service offline non initialisé');
      
      try {
        const id = await this.offline.insert('Invoice', {
          ...invoice,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        await this.sync.logChange('Invoice', 'insert', id, invoice);
        await this.loadInvoices();
      } catch (error: any) {
        this.error = error.message;
        throw error;
      }
    },

    async updateInvoice(id: number, updates: Partial<Invoice>) {
      if (!this.offline || !this.sync) throw new Error('Service offline non initialisé');
      
      try {
        const data = {
          ...updates,
          updatedAt: new Date().toISOString()
        };
        
        await this.offline.update('Invoice', data, 'id = ?', [id]);
        await this.sync.logChange('Invoice', 'update', id, updates);
        await this.loadInvoices();
      } catch (error: any) {
        this.error = error.message;
        throw error;
      }
    },

    async deleteInvoice(id: number) {
      if (!this.offline || !this.sync) throw new Error('Service offline non initialisé');
      
      try {
        await this.offline.delete('Invoice', 'id = ?', [id]);
        await this.sync.logChange('Invoice', 'delete', id);
        await this.loadInvoices();
      } catch (error: any) {
        this.error = error.message;
        throw error;
      }
    }
  }
});
