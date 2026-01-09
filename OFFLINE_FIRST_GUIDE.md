# Architecture Offline-First Stockly

## 📋 Table des matières
1. [Vue d'ensemble](#vue-densemble)
2. [Architecture](#architecture)
3. [Composants](#composants)
4. [Guide d'intégration](#guide-dintégration)
5. [Exemples d'utilisation](#exemples-dutilisation)
6. [API de synchronisation](#api-de-synchronisation)
7. [Dépannage](#dépannage)

---

## 🎯 Vue d'ensemble

L'architecture offline-first Stockly permet au PWA de fonctionner complètement hors ligne avec une synchronisation bidirectionnelle vers le backend lorsque la connexion est rétablie.

### Caractéristiques clés :
- **SQLite local** : Base de données locale via sql.js (WebAssembly)
- **Persistance IndexedDB** : Données conservées en cas de fermeture de l'app
- **Synchronisation bidirectionnelle** : Push (envoi) et pull (téléchargement)
- **Gestion des conflits** : Timestamps et versioning pour les modifications concurrentes
- **Queue de synchronisation** : Table `_sync_changes` pour tracker les opérations offline
- **Reactive Stores (Pinia)** : Gestion d'état centralisée et réactive
- **UI Responsive** : Indicateurs de statut, bouton synchro, progression

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      PWA Stockly                        │
├─────────────────────────────────────────────────────────┤
│  Vue Components (SyncButton, OfflineIndicator)         │
│                     ↓                                    │
│  Pinia Stores (productStore, clientStore, etc.)        │
│                     ↓                                    │
│  Composables (useSyncManager)                           │
│                     ↓                                    │
├─────────────────────────────────────────────────────────┤
│  Services (Offline & Sync)                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │  StocklyOfflineService                           │  │
│  │  - CRUD SQL local                                │  │
│  │  - Transactions                                  │  │
│  │  - Import/Export                                 │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  OfflineSyncService                              │  │
│  │  - Push/Pull/Bidirectional sync                  │  │
│  │  - Change tracking                               │  │
│  │  - Error handling                                │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  LocalStorageService                             │  │
│  │  - IndexedDB persistence                         │  │
│  └──────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│  Stockage Local                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  sql.js (WebAssembly SQLite)                     │  │
│  │  + IndexedDB (persistance)                       │  │
│  │  ├─ Product, Client, Purchase...                │  │
│  │  └─ _sync_changes (queue sync)                  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
         ↕ (synchronisation bidirectionnelle)
┌─────────────────────────────────────────────────────────┐
│               Backend Stockly (Express)                 │
├─────────────────────────────────────────────────────────┤
│  POST /api/sync/:table (push changes)                   │
│  GET  /api/sync/:table (pull data)                      │
│  ↓                                                       │
│  Controllers & Models Sequelize (PostgreSQL)            │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Composants

### 1. **StocklyOfflineService** (`src/service/StocklyOfflineService.ts`)

Service d'accès à la base SQLite locale.

```typescript
// Initialisation
const offlineService = new StocklyOfflineService(schemaSql);
await offlineService.waitReady();

// CRUD
const productId = await offlineService.insert('Product', { Prod_name: 'Widget' });
await offlineService.update('Product', { quantity: 50 }, 'id = ?', [productId]);
await offlineService.delete('Product', 'id = ?', [productId]);

// Requêtes
const products = await offlineService.select('SELECT * FROM Product WHERE entreprise_id = ?', [123]);
const count = await offlineService.count('Product');

// Transactions
await offlineService.transaction(async () => {
  await offlineService.insert('Purchase', {...});
  await offlineService.insert('PurchaseItem', {...});
});

// Persistance
const exported = await offlineService.export(); // Uint8Array
await offlineService.import(exported);
await offlineService.reset(); // Nettoyer
```

### 2. **OfflineSyncService** (`src/service/OfflineSyncService.ts`)

Service de synchronisation bidirectionnelle.

```typescript
// Initialisation
const syncService = new OfflineSyncService(
  offlineService,
  'https://api.stockly.com',
  async () => localStorage.getItem('authToken') // Obtenir token
);

// Synchronisation
await syncService.sync({
  direction: 'bidirectional', // ou 'push' | 'pull'
  tables: ['Product', 'Client'] // optionnel
});

// Tracking des changements
await syncService.logChange('Product', 'insert', productId, productData);

// Écoute du statut
syncService.onSyncStatusChange((status) => {
  console.log(status.message); // "Téléchargement Product..."
  console.log(status.progress); // 0-100
  console.log(status.isSyncing); // boolean
});

// Nettoyage
await syncService.cleanupOldChanges();
```

### 3. **Pinia Stores** (`src/stores/*OfflineStore.ts`)

Gestion d'état réactive pour chaque entité.

```typescript
// Utilisation dans composant
import { useProductStore } from '@/stores/productOfflineStore';
import { useSyncManager } from '@/composable/useSyncManager';

export default {
  setup() {
    const productStore = useProductStore();
    const { isSyncing, triggerSync } = useSyncManager(syncService);

    return { productStore, isSyncing, triggerSync };
  }
};
```

### 4. **Composants Vue** (`src/components/`)

- **SyncButton.vue** : Bouton avec indicateur de progression
- **OfflineIndicator.vue** : Affiche le statut online/offline

---

## 📱 Guide d'intégration

### Étape 1 : Initialisation (main.ts)

```typescript
import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import schemaSql from '@/service/stockly-offline-schema.sql?raw';
import { StocklyOfflineService } from '@/service/StocklyOfflineService';
import { OfflineSyncService } from '@/service/OfflineSyncService';

const app = createApp(App);
const pinia = createPinia();

// Initialiser les services
const offlineService = new StocklyOfflineService(schemaSql);
const syncService = new OfflineSyncService(
  offlineService,
  import.meta.env.VITE_API_URL,
  async () => {
    // Récupérer le token depuis le store auth
    const authStore = useAuthStore();
    return authStore.token;
  }
);

// Fournir les services
app.provide('offlineService', offlineService);
app.provide('syncService', syncService);

app.use(pinia).mount('#app');
```

### Étape 2 : Utiliser dans un composant

```vue
<template>
  <div>
    <!-- Indicateur statut -->
    <OfflineIndicator :offlineService="offlineService" />
    
    <!-- Bouton synchro -->
    <SyncButton :syncService="syncService" direction="bidirectional" />
    
    <!-- Liste des produits -->
    <div v-for="product in productStore.products" :key="product.id">
      {{ product.Prod_name }} - {{ product.quantity }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted } from 'vue';
import { useProductStore } from '@/stores/productOfflineStore';
import { StocklyOfflineService } from '@/service/StocklyOfflineService';
import { OfflineSyncService } from '@/service/OfflineSyncService';
import SyncButton from '@/components/SyncButton.vue';
import OfflineIndicator from '@/components/OfflineIndicator.vue';

const offlineService = inject<StocklyOfflineService>('offlineService')!;
const syncService = inject<OfflineSyncService>('syncService')!;
const productStore = useProductStore();

onMounted(async () => {
  // Initialiser le store
  await productStore.init(syncService);
});
</script>
```

### Étape 3 : Backend (Express)

Ajouter les endpoints de synchronisation :

```javascript
// routes/sync.routes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/AuthenticatedUser');

// GET /api/sync/:table - Récupérer les données
router.get('/:table', authenticateToken, async (req, res) => {
  try {
    const { table } = req.params;
    const db = require('../config/db');
    
    // Valider le nom de la table
    const allowedTables = ['Product', 'Client', 'Purchase', ...];
    if (!allowedTables.includes(table)) {
      return res.status(400).json({ error: 'Table invalide' });
    }
    
    // Récupérer les données
    const data = await db[table].findAll({
      where: { entreprise_id: req.user.entrepriseId }
    });
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/sync/:table - Appliquer les changements
router.post('/:table', authenticateToken, async (req, res) => {
  try {
    const { table } = req.params;
    const { operation, recordId, data } = req.body;
    const db = require('../config/db');
    
    const allowedTables = ['Product', 'Client', 'Purchase', ...];
    if (!allowedTables.includes(table)) {
      return res.status(400).json({ error: 'Table invalide' });
    }
    
    switch (operation) {
      case 'insert':
        await db[table].create({ ...data, entreprise_id: req.user.entrepriseId });
        break;
      case 'update':
        await db[table].update(data, { where: { id: recordId } });
        break;
      case 'delete':
        await db[table].destroy({ where: { id: recordId } });
        break;
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

---

## 💡 Exemples d'utilisation

### Ajouter un produit (offline)

```typescript
const productStore = useProductStore();

try {
  await productStore.addProduct({
    Prod_name: 'Widget Pro',
    entreprise_id: 123,
    quantity: 50,
    selling_price: 99.99,
    cost_price: 50.00
  });
  // Stocké localement + en attente de synchro
} catch (error) {
  console.error('Erreur:', error);
}
```

### Chercher des produits

```typescript
const results = await productStore.searchProducts('Widget', entrepriseId);
```

### Mettre à jour le stock

```typescript
await productStore.updateStock(productId, -5); // Diminuer de 5
```

### Déclencher la synchronisation

```typescript
const { fullSync, pushOnly, pullOnly } = useSyncManager(syncService);

// Synchronisation complète
await fullSync();

// Envoyer les modifications locales
await pushOnly();

// Télécharger les données du serveur
await pullOnly();
```

---

## 🔄 API de synchronisation

### Table `_sync_changes`

Stockage local des opérations en attente de synchronisation :

```sql
CREATE TABLE _sync_changes (
  id INTEGER PRIMARY KEY,
  table_name TEXT,
  operation TEXT, -- 'insert' | 'update' | 'delete'
  record_id INTEGER,
  data TEXT, -- JSON stringifié
  timestamp INTEGER,
  synced INTEGER -- 0 | 1
);
```

### Endpoints API Backend

**GET /api/sync/:table**
- Récupère toutes les données de la table (côté PWA)
- Filtrage par `entreprise_id`

**POST /api/sync/:table**
- Applique les changements (insert/update/delete)
- Body : `{ operation, recordId, data }`

---

## 🐛 Dépannage

### Q: Les données ne se synchronisent pas
A: Vérifiez :
1. La connexion réseau (`navigator.onLine`)
2. Le token d'authentification
3. L'URL API dans `.env`
4. Les erreurs console (F12)

### Q: Conflit lors de la synchronisation
A: Les timestamps (`createdAt`, `updatedAt`) gèrent automatiquement. Mises à jour récentes = gagnantes.

### Q: Réinitialiser les données offline
```typescript
await offlineService.reset();
```

### Q: Exporter les données pour debug
```typescript
const exported = await offlineService.export();
// Convertir en blob et télécharger
```

---

## 📦 Dépendances

```json
{
  "sql.js": "^1.8.0",
  "pinia": "^2.1.0",
  "vue": "^3.3.0"
}
```

Installer :
```bash
npm install sql.js pinia
```

---

## 🚀 Prochaines étapes

1. Adapter les autres stores (Order, Invoice, Sales, etc.)
2. Implémenter les endpoints backend `/api/sync/*`
3. Tester offline/online avec les DevTools (F12 → Network → Offline)
4. Monitorer les performances (DevTools → Performance)
5. Ajouter des tests unitaires pour les services

