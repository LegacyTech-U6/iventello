// src/stores/salesOfflineStore.ts
// Store Pinia pour gestion des ventes en mode offline-first

import { defineStore } from 'pinia';
import { StocklyOfflineService } from '@/service/StocklyOfflineService';
import { OfflineSyncService } from '@/service/OfflineSyncService';
import type { Sales } from '@/types/offline';
import schemaSql from '@/service/stockly-offline-schema.sql?raw';

export const useSalesStore = defineStore('sales', {
  state: () => ({
    sales: [] as Sales[],
    isLoading: false,
    error: null as string | null,
    offline: null as StocklyOfflineService | null,
    sync: null as OfflineSyncService | null
  }),

  getters: {
    getSaleById: (state) => (id: number) => state.sales.find(s => s.id === id),
    getTotalSales: (state) => state.sales.reduce((sum, s) => sum + (s.total_price || 0), 0),
    getTotalProfit: (state) => state.sales.reduce((sum, s) => sum + (s.total_profit || 0), 0),
    getSalesCount: (state) => state.sales.length
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
        await this.loadSales();
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },

    async loadSales() {
      if (!this.offline) return;
      this.isLoading = true;
      try {
        this.sales = await this.offline.findAll<Sales>('Sales');
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },

    async addSale(sale: Omit<Sales, 'id'>) {
      if (!this.offline || !this.sync) throw new Error('Service offline non initialisé');
      
      try {
        const id = await this.offline.insert('Sales', {
          ...sale,
          sale_date: sale.sale_date || new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        await this.sync.logChange('Sales', 'insert', id, sale);
        await this.loadSales();
      } catch (error: any) {
        this.error = error.message;
        throw error;
      }
    },

    async updateSale(id: number, updates: Partial<Sales>) {
      if (!this.offline || !this.sync) throw new Error('Service offline non initialisé');
      
      try {
        const data = {
          ...updates,
          updatedAt: new Date().toISOString()
        };
        
        await this.offline.update('Sales', data, 'id = ?', [id]);
        await this.sync.logChange('Sales', 'update', id, updates);
        await this.loadSales();
      } catch (error: any) {
        this.error = error.message;
        throw error;
      }
    },

    async deleteSale(id: number) {
      if (!this.offline || !this.sync) throw new Error('Service offline non initialisé');
      
      try {
        await this.offline.delete('Sales', 'id = ?', [id]);
        await this.sync.logChange('Sales', 'delete', id);
        await this.loadSales();
      } catch (error: any) {
        this.error = error.message;
        throw error;
      }
    },

    // Statistiques de ventes
    async getSalesByDateRange(startDate: string, endDate: string) {
      if (!this.offline) return [];
      try {
        const sql = `SELECT * FROM Sales 
          WHERE sale_date BETWEEN ? AND ? 
          ORDER BY sale_date DESC`;
        return await this.offline.select<Sales>(sql, [startDate, endDate]);
      } catch (error: any) {
        this.error = error.message;
        return [];
      }
    }
  }
});
