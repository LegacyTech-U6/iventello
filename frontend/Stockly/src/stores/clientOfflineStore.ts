// src/stores/clientStore.ts
// Store Pinia pour gestion des clients en mode offline-first

import { defineStore } from 'pinia';
import { StocklyOfflineService } from '@/service/StocklyOfflineService';
import { OfflineSyncService } from '@/service/OfflineSyncService';
import type { Client } from '@/types/offline';
import schemaSql from '@/service/stockly-offline-schema.sql?raw';

export const useClientStore = defineStore('client', {
  state: () => ({
    clients: [] as Client[],
    isLoading: false,
    error: null as string | null,
    offline: null as StocklyOfflineService | null,
    sync: null as OfflineSyncService | null
  }),

  getters: {
    getClientById: (state) => (id: number) => state.clients.find(c => c.id === id),
    getTotalClients: (state) => state.clients.length
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
        await this.fetchClients();
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },

    // Charger tous les clients
    async fetchClients() {
      if (!this.offline) return;
      this.isLoading = true;
      try {
        this.clients = await this.offline.findAll<Client>('Client');
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },

    // Ajouter un client
    async addClient(client: Omit<Client, 'id'>) {
      if (!this.offline || !this.sync) throw new Error('Service offline non initialisé');
      
      try {
        const id = await this.offline.insert('Client', {
          ...client,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        await this.sync.logChange('Client', 'insert', id, client);
        await this.loadClients();
      } catch (error: any) {
        this.error = error.message;
        throw error;
      }
    },

    // Modifier un client
    async updateClient(id: number, updates: Partial<Client>) {
      if (!this.offline || !this.sync) throw new Error('Service offline non initialisé');
      
      try {
        const data = {
          ...updates,
          updatedAt: new Date().toISOString()
        };
        
        await this.offline.update('Client', data, 'id = ?', [id]);
        await this.sync.logChange('Client', 'update', id, updates);
        await this.loadClients();
      } catch (error: any) {
        this.error = error.message;
        throw error;
      }
    },

    // Supprimer un client
    async deleteClient(id: number) {
      if (!this.offline || !this.sync) throw new Error('Service offline non initialisé');
      
      try {
        await this.offline.delete('Client', 'id = ?', [id]);
        await this.sync.logChange('Client', 'delete', id);
        await this.loadClients();
      } catch (error: any) {
        this.error = error.message;
        throw error;
      }
    },

    // Rechercher des clients
    async searchClients(query: string) {
      if (!this.offline) return [];
      try {
        const sql = `SELECT * FROM Client 
          WHERE LOWER(client_name) LIKE LOWER(?) 
          OR LOWER(email) LIKE LOWER(?)`;
        return await this.offline.select<Client>(sql, [`%${query}%`, `%${query}%`]);
      } catch (error: any) {
        this.error = error.message;
        return [];
      }
    }
  }
});
