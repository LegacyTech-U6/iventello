// src/stores/productStore.ts
// Store Pinia pour gestion des produits en mode offline-first

import { defineStore } from 'pinia';
import { StocklyOfflineService } from '@/service/StocklyOfflineService';
import { OfflineSyncService } from '@/service/OfflineSyncService';
import type { Product } from '@/types/offline';
import schemaSql from '@/service/stockly-offline-schema.sql?raw';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as Product[],
    isLoading: false,
    error: null as string | null,
    offline: null as StocklyOfflineService | null,
    sync: null as OfflineSyncService | null
  }),

  getters: {
    getProductById: (state) => (id: number) => state.products.find(p => p.id === id),
    getProductsByEntreprise: (state) => (entrepriseId: number) => 
      state.products.filter(p => p.entreprise_id === entrepriseId),
    getLowStockProducts: (state) => (entrepriseId: number) =>
      state.products.filter(p => 
        p.entreprise_id === entrepriseId && 
        p.quantity <= (p.min_stock_level || 0)
      )
  },

  actions: {
    // Initialiser le store (connexion SQLite offline)
    async init(syncService: OfflineSyncService) {
      try {
        this.isLoading = true;
        if (!this.offline) {
          this.offline = new StocklyOfflineService(schemaSql);
          await this.offline.waitReady();
        }
        this.sync = syncService;
        await this.fetchProducts();
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },

    // Charger tous les produits depuis SQLite
    async fetchProducts() {
      if (!this.offline) return;
      this.isLoading = true;
      try {
        this.products = await this.offline.findAll<Product>('Product');
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },

    // Ajouter un nouveau produit (offline + queue sync)
    async addProduct(product: Omit<Product, 'id'>) {
      if (!this.offline || !this.sync) throw new Error('Service offline non initialisé');
      
      try {
        const id = await this.offline.insert('Product', {
          ...product,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        // Logger la modification pour la synchro
        await this.sync.logChange('Product', 'insert', id, product);

        // Charger les données mises à jour
        await this.fetchProducts();
      } catch (error: any) {
        this.error = error.message;
        throw error;
      }
    },

    // Modifier un produit
    async updateProduct(id: number, updates: Partial<Product>) {
      if (!this.offline || !this.sync) throw new Error('Service offline non initialisé');
      
      try {
        const data = {
          ...updates,
          updatedAt: new Date().toISOString()
        };
        
        await this.offline.update('Product', data, 'id = ?', [id]);
        await this.sync.logChange('Product', 'update', id, updates);
        await this.loadProducts();
      } catch (error: any) {
        this.error = error.message;
        throw error;
      }
    },

    // Supprimer un produit
    async deleteProduct(id: number) {
      if (!this.offline || !this.sync) throw new Error('Service offline non initialisé');
      
      try {
        await this.offline.delete('Product', 'id = ?', [id]);
        await this.sync.logChange('Product', 'delete', id);
        await this.loadProducts();
      } catch (error: any) {
        this.error = error.message;
        throw error;
      }
    },

    // Rechercher des produits par name
    async searchProducts(query: string, entrepriseId: number) {
      if (!this.offline) return [];
      try {
        const sql = `SELECT * FROM Product 
          WHERE LOWER(Prod_name) LIKE LOWER(?) 
          AND entreprise_id = ?`;
        return await this.offline.select<Product>(sql, [`%${query}%`, entrepriseId]);
      } catch (error: any) {
        this.error = error.message;
        return [];
      }
    },

    // Mettre à jour le stock d'un produit (opération fréquente)
    async updateStock(productId: number, quantityDelta: number) {
      if (!this.offline) throw new Error('Service offline non initialisé');
      
      try {
        const product = await this.offline.findById<Product>('Product', productId);
        if (!product) throw new Error('Produit non trouvé');

        const newQuantity = (product.quantity || 0) + quantityDelta;
        await this.updateProduct(productId, { quantity: newQuantity });
      } catch (error: any) {
        this.error = error.message;
        throw error;
      }
    },

    // Obtenir les produits bas stock pour une entreprise
    async getLowStockAlert(entrepriseId: number) {
      if (!this.offline) return [];
      try {
        const sql = `SELECT * FROM Product 
          WHERE entreprise_id = ? 
          AND quantity <= min_stock_level 
          ORDER BY quantity ASC`;
        return await this.offline.select<Product>(sql, [entrepriseId]);
      } catch (error: any) {
        this.error = error.message;
        return [];
      }
    }
  }
});
