# Checklist d'implémentation Offline-First Stockly

## ✅ Fichiers créés

### Services (Backend/Frontend)
- [x] `frontend/Stockly/src/service/stockly-offline-schema.sql` - Schéma SQLite complet
- [x] `frontend/Stockly/src/service/StocklyOfflineService.ts` - Accès local SQLite
- [x] `frontend/Stockly/src/service/LocalStorageService.ts` - Persistance IndexedDB
- [x] `frontend/Stockly/src/service/OfflineSyncService.ts` - Synchronisation bidirectionnelle
- [x] `backend/src/routes/sync.routes.js` - Endpoints API de sync

### Types
- [x] `frontend/Stockly/src/types/offline.ts` - Types TypeScript complets

### Stores Pinia
- [x] `frontend/Stockly/src/stores/productOfflineStore.ts`
- [x] `frontend/Stockly/src/stores/clientOfflineStore.ts`
- [x] `frontend/Stockly/src/stores/purchaseOfflineStore.ts`
- [x] `frontend/Stockly/src/stores/invoiceOfflineStore.ts`
- [x] `frontend/Stockly/src/stores/supplierOfflineStore.ts`
- [x] `frontend/Stockly/src/stores/categoryOfflineStore.ts`
- [x] `frontend/Stockly/src/stores/salesOfflineStore.ts`

### Composables
- [x] `frontend/Stockly/src/composable/useSyncManager.ts` - Hook synchro

### Composants Vue
- [x] `frontend/Stockly/src/components/SyncButton.vue` - Bouton synchro
- [x] `frontend/Stockly/src/components/OfflineIndicator.vue` - Indicateur statut

### Documentation
- [x] `OFFLINE_FIRST_GUIDE.md` - Guide complet
- [x] `IMPLEMENTATION_CHECKLIST.md` - Cette checklist

---

## 🚀 Étapes d'implémentation

### Phase 1 : Installation des dépendances
```bash
# Frontend
npm install sql.js pinia

# Backend
npm install express
```

### Phase 2 : Intégration Backend

1. Copier `backend/src/routes/sync.routes.js` vers votre projet
2. Ajouter dans `backend/app.js` (ou `index.js`) :
   ```javascript
   const syncRoutes = require('./src/routes/sync.routes');
   app.use('/api/sync', syncRoutes);
   ```
3. Vérifier que l'authentification middleware fonctionne (`AuthenticatedUser`)

### Phase 3 : Intégration Frontend

1. Copier tous les fichiers `frontend/Stockly/src/service/*` 
2. Copier les types `frontend/Stockly/src/types/offline.ts`
3. Copier les stores `frontend/Stockly/src/stores/*OfflineStore.ts`
4. Copier le composable `frontend/Stockly/src/composable/useSyncManager.ts`
5. Copier les composants `frontend/Stockly/src/components/SyncButton.vue` et `OfflineIndicator.vue`

### Phase 4 : Configuration .env

```env
# Frontend (.env)
VITE_API_URL=http://localhost:3000/api
VITE_AUTO_SYNC=true

# Backend (.env)
DATABASE_URL=postgresql://...
NODE_ENV=development
```

### Phase 5 : Utiliser dans les composants

```vue
<template>
  <div>
    <!-- Indicateur statut -->
    <OfflineIndicator :offlineService="offlineService" />
    
    <!-- Bouton synchro -->
    <SyncButton :syncService="syncService" />
    
    <!-- Données produits -->
    <div v-for="product in productStore.products" :key="product.id">
      {{ product.Prod_name }}
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
  await productStore.init(syncService);
});
</script>
```

---

## 🧪 Tests

### Test Offline Mode
1. Ouvrir DevTools (F12)
2. Aller à Network → Throttling → Offline
3. Ajouter/modifier des données (stockées localement)
4. Revenir à Online
5. Cliquer "Synchroniser"
6. Vérifier que les données sont synchronisées

### Test Synchronisation
```typescript
// Dans la console du navigateur
const syncService = window.$services.syncService;

// Voir le statut
console.log(syncService.getSyncStatus());

// Forcer la synchro
await syncService.sync({ direction: 'bidirectional' });
```

### Test Persistance
```typescript
// Fermer et rouvrir le navigateur
// Les données doivent être préservées
const products = await offlineService.findAll('Product');
console.log(products.length); // Doit être > 0
```

---

## 📊 Architecture de synchronisation

```
┌─ OFFLINE ─────────────────────────────────────────────┐
│                                                         │
│  Utilisateur modifie donnée                           │
│  ↓                                                     │
│  Store Pinia: offlineStore.addProduct(...)            │
│  ↓                                                     │
│  StocklyOfflineService.insert('Product', data)        │
│  ↓                                                     │
│  SQLite local (sql.js)                                │
│  ↓                                                     │
│  IndexedDB (persistance)                              │
│  ↓                                                     │
│  OfflineSyncService.logChange('Product', 'insert')    │
│  ↓                                                     │
│  Table _sync_changes (queue)                          │
│                                                         │
└─────────────────────────────────────────────────────────┘

         ↕ (clic "Synchroniser" ou auto)

┌─ BACKEND ──────────────────────────────────────────────┐
│                                                         │
│  OfflineSyncService.sync({ direction: 'push' })       │
│  ↓                                                     │
│  Boucle sur _sync_changes (non synchronisé)           │
│  ↓                                                     │
│  POST /api/sync/:table { operation, recordId, data } │
│  ↓                                                     │
│  Express Router (sync.routes.js)                      │
│  ↓                                                     │
│  Model.create() / update() / destroy()                │
│  ↓                                                     │
│  PostgreSQL                                           │
│  ↓                                                     │
│  Marquer _sync_changes comme synced = 1              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Stores disponibles

| Store | Entités | Méthodes |
|-------|---------|----------|
| `useProductStore` | Product | addProduct, updateStock, getLowStock |
| `useClientStore` | Client | addClient, updateClient, searchClients |
| `usePurchaseStore` | Purchase, PurchaseItem | createPurchase, deletePurchase |
| `useInvoiceStore` | Invoice | addInvoice, updateInvoice, getByStatus |
| `useSupplierStore` | Supplier | addSupplier, updateSupplier |
| `useCategoryStore` | Category | addCategory, updateCategory |
| `useSalesStore` | Sales | addSale, getTotalSales, getSalesByDateRange |

---

## 📝 Modèle de données (SQLite)

**21 tables synchronisables :**
- Activity, AllUser, Category, Client, CurrencyRate
- DailyPurchaseReport, DailySalesReport, Entreprise, Invoice, FactureItem
- Notification, Order, Product, Purchase, PurchaseItem
- Role, Sales, Setting, Supplier, User, Worker

**Table système :**
- `_sync_changes` : Queue de synchronisation

---

## ⚡ Points clés

✅ **Complètement offline** : Fonctionne 100% hors ligne
✅ **Synchronisation bidirectionnelle** : Push et pull
✅ **Persistance** : IndexedDB + SQLite
✅ **Reactive** : Pinia stores réactifs
✅ **UI responsive** : Indicateurs + progression
✅ **Type-safe** : TypeScript complet
✅ **Production-ready** : Gestion d'erreurs robuste

---

## 🆘 Troubleshooting

### Les données ne se chargent pas
```typescript
// Réinitialiser la base
await offlineService.reset();
```

### Erreur "Table existe déjà"
```typescript
// Nettoyer IndexedDB
const storage = new LocalStorageService();
await storage.clearDatabase();
```

### Sync bloquée
```typescript
// Vérifier les changements en attente
const changes = await offlineService.select('SELECT * FROM _sync_changes WHERE synced = 0');
console.log(changes);

// Nettoyer
await offlineService.delete('_sync_changes', 'synced = 1');
```

---

## 📚 Ressources

- [sql.js docs](https://sql.js.org/)
- [Pinia docs](https://pinia.vuejs.org/)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

## 🎯 Prochaines étapes

1. ✅ Adapter les endpoints backend `/api/sync/*` pour chaque table
2. ✅ Tester offline/online avec DevTools
3. ✅ Ajouter Service Worker pour PWA (optionnel)
4. ✅ Implémenter gestion des conflits avancée
5. ✅ Ajouter tests unitaires
6. ✅ Monitorer les performances
7. ✅ Ajouter analytics (quelle données quand synchronisées)

---

## 📞 Support

En cas de problème :
1. Vérifier les erreurs console (F12 → Console)
2. Vérifier le statut synchro : `syncService.getSyncStatus()`
3. Vérifier les changements en attente : `SELECT * FROM _sync_changes`
4. Lire le `OFFLINE_FIRST_GUIDE.md` complet

