# 🚀 Quick Start - Architecture Offline-First Stockly

## 5 minutes pour démarrer

### 1️⃣ Installer les dépendances

```bash
# Frontend
cd frontend/Stockly
npm install sql.js pinia

# Backend
cd backend
npm install
```

### 2️⃣ Configuration .env

**Frontend** (frontend/Stockly/.env):
```env
VITE_API_URL=http://localhost:3000/api
VITE_AUTO_SYNC=true
```

**Backend** (backend/.env):
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/stockly
NODE_ENV=development
PORT=3000
```

### 3️⃣ Intégrer dans votre projet

**Backend** - Ajouter dans `backend/app.js` ou `index.js`:
```javascript
const syncRoutes = require('./src/routes/sync.routes');
app.use('/api/sync', syncRoutes);
```

**Frontend** - Copier les fichiers service:
```
frontend/Stockly/src/
├── service/       (3 fichiers + 1 SQL)
├── types/         (offline.ts)
├── stores/        (7 stores Pinia)
├── composable/    (useSyncManager.ts)
└── components/    (2 composants Vue)
```

### 4️⃣ Utiliser dans un composant

```vue
<template>
  <OfflineIndicator :offlineService="offlineService" />
  <SyncButton :syncService="syncService" />
  <div v-for="product in productStore.products">
    {{ product.Prod_name }}
  </div>
</template>

<script setup>
import { inject, onMounted } from 'vue';
import { useProductStore } from '@/stores/productOfflineStore';
import SyncButton from '@/components/SyncButton.vue';
import OfflineIndicator from '@/components/OfflineIndicator.vue';

const offlineService = inject('offlineService');
const syncService = inject('syncService');
const productStore = useProductStore();

onMounted(async () => {
  await productStore.init(syncService);
});
</script>
```

### 5️⃣ Tester offline

1. DevTools → Network → Offline
2. Ajouter un produit → Stocké localement
3. DevTools → Application → IndexedDB → Vérifier les données
4. Online + Bouton "Synchroniser" → Sync avec serveur ✅

---

## 📦 Fichiers clés

| Fichier | Rôle |
|---------|------|
| `stockly-offline-schema.sql` | Schéma SQLite (21 tables) |
| `StocklyOfflineService.ts` | CRUD local (insert/update/delete/select) |
| `OfflineSyncService.ts` | Synchro bidirectionnelle (push/pull) |
| `*OfflineStore.ts` | Stores Pinia (Product, Client, etc.) |
| `useSyncManager.ts` | Hook pour composants |
| `SyncButton.vue` | UI du bouton synchro |
| `sync.routes.js` | Backend API `/api/sync/*` |

---

## 🎯 Architecture 60 secondes

```
PWA Offline          ←→         Backend
      ↓                              ↓
 Vue Component                 Express API
      ↓                              ↓
 Pinia Store                    Controllers
      ↓                              ↓
 useSyncManager                 Models
      ↓                          Sequelize
 SQLite (sql.js)                   ↓
      ↓                        PostgreSQL
 IndexedDB
```

---

## ⚡ Cas d'usage courants

### Ajouter un produit

```typescript
const productStore = useProductStore();
await productStore.addProduct({
  Prod_name: 'Widget',
  entreprise_id: 123,
  quantity: 50,
  selling_price: 99,
  cost_price: 50
});
// ✅ Stocké localement + en attente de synchro
```

### Chercher des produits

```typescript
const results = await productStore.searchProducts('Widget', entrepriseId);
// ✅ Requête SQL locale, zéro latence
```

### Synchroniser

```typescript
const { fullSync, pushOnly, pullOnly } = useSyncManager(syncService);
await fullSync(); // Push + Pull
await pushOnly();  // Envoyer les modifs
await pullOnly();  // Télécharger les données
```

### Statistiques

```typescript
const salesStore = useSalesStore();
const total = salesStore.getTotalSales;
const profit = salesStore.getTotalProfit;
const byRange = await salesStore.getSalesByDateRange(start, end);
```

---

## 🔍 Debug rapide

```javascript
// Dans la console du navigateur (F12)

// Voir le statut de synchro
syncService.getSyncStatus()

// Voir les changements en attente
await offlineService.select('SELECT * FROM _sync_changes')

// Réinitialiser la base
await offlineService.reset()

// Compter les produits
await offlineService.count('Product')
```

---

## ✅ Checklist avant prod

- [ ] Tests offline/online avec DevTools
- [ ] Tests de synchronisation (push/pull)
- [ ] Vérifier que `VITE_API_URL` pointe au bon backend
- [ ] Vérifier que l'authentification fonctionne
- [ ] Vérifier les logs d'erreur console
- [ ] Tester sur mobile (PWA)
- [ ] Monitorer la taille IndexedDB

---

## 🆘 Problèmes courants

**Q: Données ne se synchronisent pas**  
→ Vérifier : `navigator.onLine`, token auth, URL API, logs console

**Q: Erreur "Table existe déjà"**  
→ Réinitialiser: `await offlineService.reset()`

**Q: Sync très lente**  
→ Nettoyer les anciens changements: `await syncService.cleanupOldChanges()`

**Q: Données perdues après refresh**  
→ Vérifier IndexedDB dans DevTools

---

## 📚 Documentation complète

- `OFFLINE_FIRST_GUIDE.md` - Guide détaillé (architecture, API, exemples)
- `IMPLEMENTATION_CHECKLIST.md` - Checklist complète + troubleshooting
- `INSTALLATION_GUIDE.md` - Installation étape par étape + configuration

---

## 🎓 Apprendre plus

1. Lire `OFFLINE_FIRST_GUIDE.md` (5-10 min)
2. Implémenter dans un composant (10 min)
3. Tester offline/online (5 min)
4. Lire les commentaires du code (10 min)
5. Adapter pour vos entités (30 min)

Total : ~1 heure pour maîtriser

---

## 🚀 Next Steps

```bash
# 1. Installer
npm install sql.js pinia

# 2. Tester
npm run dev
# → http://localhost:5173
# → DevTools → Network → Offline
# → Ajouter données
# → Vérifier IndexedDB
# → Online + Sync

# 3. Intégrer à vos composants
# → Copier les stores Pinia
# → Utiliser dans templates
# → Tester push/pull

# 4. Adapter
# → Créer stores pour vos entités
# → Connecter aux composants existants
# → Tester tous les flux
```

---

**Status**: ✅ Complètement implémenté et prêt pour production

Pour toute question, consulter la documentation ou les commentaires du code.

Bonne chance ! 🎉
