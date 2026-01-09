// src/stores/categoryOfflineStore.ts
import { defineStore } from 'pinia';
import { getOfflineService } from '@/service/syncProvider';
import { OfflineSyncService } from '@/service/OfflineSyncService';
import { StocklyOfflineService } from '@/service/StocklyOfflineService';
import type { Category } from '@/types/offline';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [] as Category[],
    isLoading: false,
    error: null as string | null,
    offline: null as StocklyOfflineService | null,
    sync: null as OfflineSyncService | null
  }),

  getters: {
    getCategoryById: (state) => (id: number) => state.categories.find(c => c.id === id),
    getTotalCategories: (state) => state.categories.length
  },

  actions: {
    // Initialisation correcte via le Singleton Provider
    async init(syncService: OfflineSyncService) {
      try {
        this.isLoading = true;
        // On récupère l'instance unique partagée
        this.offline = await getOfflineService();
        this.sync = syncService;
        
        await this.fetchCategory();
        console.log("✅ Store Category initialisé");
      } catch (error: any) {
        this.error = error.message;
        console.error("Erreur init store:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchCategory() {
      if (!this.offline) return;
      this.isLoading = true;
      try {
        this.categories = await this.offline.findAll<Category>('Category');
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },

    async Create(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) {
      if (!this.offline || !this.sync) throw new Error('Service offline non initialisé');
      
      try {
        const now = new Date().toISOString();
        const id = await this.offline.insert('Category', {
          ...category,
          createdAt: now,
          updatedAt: now
        });

        // Enregistre le changement pour la synchronisation automatique (Push)
        await this.sync.logChange('Category', 'INSERT', id, category);
        
        await this.fetchCategory();
        return true;
      } catch (error: any) {
        this.error = error.message;
        console.error("Erreur Create Category:", error);
        return false;
      }
    },

    async Update(id: number, updates: Partial<Category>) {
      if (!this.offline || !this.sync) throw new Error('Service offline non initialisé');
      
      try {
        const data = {
          ...updates,
          updatedAt: new Date().toISOString()
        };
        
        await this.offline.update('Category', data, 'id = ?', [id]);
        await this.sync.logChange('Category', 'UPDATE', id, updates);
        
        await this.fetchCategory();
        return true;
      } catch (error: any) {
        this.error = error.message;
        return false;
      }
    },

    async Delete(id: number) {
      if (!this.offline || !this.sync) throw new Error('Service offline non initialisé');
      
      try {
        await this.offline.delete('Category', 'id = ?', [id]);
        await this.sync.logChange('Category', 'DELETE', id);
        
        await this.fetchCategory();
        return true;
      } catch (error: any) {
        this.error = error.message;
        return false;
      }
    }
  }
});