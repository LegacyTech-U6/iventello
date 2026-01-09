# Installation et configuration des dépendances

## 🔧 npm/yarn packages

### Frontend (Stockly)

```bash
cd frontend/Stockly

# Dépendances essentielles
npm install sql.js@1.8.0 pinia@2.1.0

# Types TypeScript
npm install --save-dev @types/sql.js

# Optionnel mais recommandé pour PWA
npm install workbox-precache workbox-routing workbox-strategies
```

### Backend

```bash
cd backend

# Optionnel - déjà probablement installé
npm install express sequelize pg

# Pour validation API (recommandé)
npm install joi zod
```

---

## 📋 Configuration .env

### Frontend (.env)

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000

# Offline Features
VITE_AUTO_SYNC=true
VITE_AUTO_SYNC_INTERVAL=5000
VITE_MAX_OFFLINE_CHANGES=1000

# Debug
VITE_DEBUG_OFFLINE=false
```

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/stockly
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=stockly

# Server
NODE_ENV=development
PORT=3000

# Sync Configuration
SYNC_BATCH_SIZE=100
SYNC_TIMEOUT=30000

# JWT Auth
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRY=7d
```

---

## 🏗️ Structure de fichiers ajoutée

```
frontend/Stockly/src/
├── service/
│   ├── stockly-offline-schema.sql       # Schéma SQLite
│   ├── StocklyOfflineService.ts         # CRUD local
│   ├── LocalStorageService.ts           # Persistance
│   └── OfflineSyncService.ts            # Synchronisation
├── types/
│   └── offline.ts                       # Types entités
├── stores/
│   ├── productOfflineStore.ts
│   ├── clientOfflineStore.ts
│   ├── purchaseOfflineStore.ts
│   ├── invoiceOfflineStore.ts
│   ├── supplierOfflineStore.ts
│   ├── categoryOfflineStore.ts
│   └── salesOfflineStore.ts
├── composable/
│   └── useSyncManager.ts                # Hook synchro
└── components/
    ├── SyncButton.vue                   # UI synchro
    └── OfflineIndicator.vue             # Indicateur statut

backend/src/
└── routes/
    └── sync.routes.js                   # Endpoints /api/sync/*
```

---

## 🚀 Déploiement

### Frontend (Vite build)

```bash
npm run build

# Le dist/ contiendra l'app prête à la production
# Servir avec: npx serve dist
```

### Backend (Express)

```bash
# Démarrage développement
npm run dev

# Démarrage production
npm start
```

### PWA (Service Worker)

Pour une PWA complète, ajouter un `public/manifest.json` :

```json
{
  "name": "Stockly",
  "short_name": "Stockly",
  "description": "Gestion de stock offline-first",
  "start_url": "/",
  "display": "standalone",
  "scope": "/",
  "theme_color": "#667eea",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

Et enregistrer le Service Worker dans `main.ts` :

```typescript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

---

## ✅ Vérification post-installation

### Test Frontend

```bash
npm run dev

# Ouvrir http://localhost:5173
# Vérifier dans DevTools → Application → IndexedDB → stockly-offline-db
```

### Test Backend

```bash
curl http://localhost:3000/api/sync/status

# Réponse attendue:
# { "success": true, "message": "Serveur Stockly en ligne", ... }
```

### Test Offline

1. Ouvrir DevTools (F12)
2. Aller à Network → Throttling → Offline
3. Ajouter un produit
4. Vérifier dans IndexedDB que les données sont stockées
5. Revenir à Online
6. Cliquer "Synchroniser"

---

## 📊 Base de données (Backend)

Assurez-vous que les models Sequelize existent (ne sont pas modifiés) :

```javascript
// backend/src/models/ - Les 20+ models existants
// Ils sont utilisés par sync.routes.js via db[table]
```

Les tables sont créées automatiquement par Sequelize migration.

---

## 🔐 Sécurité

### Points importants

1. **Authentication** : `sync.routes.js` utilise `authenticateToken` middleware
2. **Validation** : Le nom de table est whitelist-validé
3. **Authorization** : Filtrage par `entreprise_id` automatique
4. **Data sanitization** : Sequelize gère les injections SQL

### À faire

- [ ] Ajouter rate limiting sur `/api/sync/*`
- [ ] Chiffrer les données en transit (HTTPS obligatoire)
- [ ] Valider les données avec Joi/Zod côté backend
- [ ] Ajouter logs d'audit des synchronisations

---

## 📈 Performance

### Optimisations incluses

- ✅ Batch insert/update/delete
- ✅ Transactions SQLite
- ✅ IndexedDB caching
- ✅ Lazy loading des stores
- ✅ Requêtes filtrées par entreprise

### À monitorer

```typescript
// Nombre de changements en attente
const pendingCount = await offlineService.count('_sync_changes', 'synced = 0');
console.log(`${pendingCount} changements en attente`);

// Taille de la base SQLite
const exported = await offlineService.export();
console.log(`Taille base: ${(exported.byteLength / 1024 / 1024).toFixed(2)} MB`);
```

---

## 🐛 Debugging

### Activer le debug

`.env`:
```env
VITE_DEBUG_OFFLINE=true
```

### Logs utiles

```typescript
// Statut service
console.log('Offline:', offlineService);
console.log('Sync:', syncService.getSyncStatus());

// Changements en attente
const changes = await offlineService.select('SELECT * FROM _sync_changes');
console.table(changes);

// État IndexedDB
const indexedDB = window.indexedDB;
console.log('IndexedDB stores:', indexedDB);
```

---

## 📞 Support

- Documentation : `OFFLINE_FIRST_GUIDE.md`
- Checklist : `IMPLEMENTATION_CHECKLIST.md`
- Issues : Vérifier DevTools Console et Network

