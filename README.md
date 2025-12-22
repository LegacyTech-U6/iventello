# 📦 Iventello - Stock Management App

Une **application moderne de gestion de stock multi-entreprises** construite avec **Vue 3**, **Node.js/Express**, et **Sequelize**.

---

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Stack Technologique](#stack-technologique)
- [Architecture](#architecture)
- [Installation et Setup](#installation-et-setup)
- [Variables d'environnement](#variables-denvironnement)
- [Guide de démarrage](#guide-de-démarrage)
- [Structure du projet](#structure-du-projet)
- [API Endpoints](#api-endpoints)
- [Features principales](#features-principales)
- [Dépannage](#dépannage)
- [Performance et Optimisations](#performance-et-optimisations)
- [Contributing](#contributing)

---

## 🎯 Vue d'ensemble

Iventello est une **plateforme SaaS de gestion de stock** qui permet aux entreprises de :

- ✅ Gérer plusieurs entreprises avec rôles et permissions
- ✅ Tracker l'inventaire en temps réel avec WebSocket
- ✅ Générer des rapports de vente et d'achat
- ✅ Gérer les clients, fournisseurs, et workers
- ✅ Créer et gérer les factures
- ✅ Authentification sécurisée avec JWT
- ✅ Support offline avec PWA
- ✅ Export en PDF et gestion des fichiers (Cloudinary)

**Déploiement**: Backend sur Render, Frontend statique (Vercel/Netlify/GitHub Pages)

---

## 🛠 Stack Technologique

### Frontend
| Technologie | Version | Usage |
|---|---|---|
| **Vue.js** | 3.5.18 | Framework UI |
| **TypeScript** | ~5.8.0 | Typage statique |
| **Vite** | 7.0.6 | Build tool & dev server |
| **TailwindCSS** | 4.1.16 | Styling |
| **Naive UI** | 2.43.1 | Composants UI |
| **Pinia** | 3.0.3 | State management |
| **Vue Router** | 4.5.1 | Routing |
| **Axios** | 1.12.2 | HTTP client |
| **Socket.io Client** | 4.8.1 | Real-time updates |
| **Chart.js** | 4.5.0 | Graphiques |
| **GSAP** | 3.13.0 | Animations |
| **Print.js** | 1.6.0 | Impression PDF |

### Backend
| Technologie | Version | Usage |
|---|---|---|
| **Node.js** | 20.19.0+ ou 22.12.0+ | Runtime |
| **Express.js** | 5.1.0 | Framework web |
| **Sequelize** | 6.37.7 | ORM |
| **MySQL** | 3.14.3 | Base de données |
| **Socket.io** | 4.8.1 | Real-time communication |
| **JWT** | 9.0.2 | Authentification |
| **Bcrypt** | 6.0.0 | Hashing de mots de passe |
| **Multer** | 2.0.2 | Upload de fichiers |
| **Cloudinary** | 1.41.3 | Stockage d'images cloud |
| **Node-cron** | 4.2.1 | Tâches planifiées |
| **Nodemailer** | 7.0.5 | Envoi d'emails |

### DevDependencies clés
- **Vitest** + **Playwright**: Testing (unit & e2e)
- **ESLint** + **Prettier**: Code quality
- **Vue TSC**: Type checking
- **Vite PWA Plugin**: Progressive Web App

---

## 🏗 Architecture

```
iventello/
├── frontend/Stockly/          # Application Vue 3
│   ├── src/
│   │   ├── components/        # Composants réutilisables
│   │   │   ├── clients/       # Composants client
│   │   │   ├── Enterprise/    # Gestion entreprise
│   │   │   ├── invoices/      # Factures
│   │   │   ├── Products/      # Produits
│   │   │   ├── reports/       # Rapports
│   │   │   ├── statistics/    # Statistiques
│   │   │   ├── workers/       # Travailleurs
│   │   │   ├── icons/         # Icônes SVG
│   │   │   └── ui/            # Composants UI génériques
│   │   ├── views/             # Pages/Vues
│   │   ├── stores/            # Pinia stores (state)
│   │   │   ├── authStore.js   # Auth & user
│   │   │   ├── productStore.js
│   │   │   ├── clientStore.js
│   │   │   ├── entrepriseStore.js
│   │   │   └── ...
│   │   ├── router/            # Vue Router config
│   │   ├── composable/        # Composables réutilisables
│   │   ├── api/               # Axios instance
│   │   ├── assets/            # Images, styles, icônes
│   │   └── main.ts            # Entry point
│   ├── e2e/                   # Tests Playwright
│   ├── vite.config.ts         # Config Vite
│   ├── tailwind.config.js     # Config TailwindCSS
│   ├── tsconfig.json          # Config TypeScript
│   └── package.json
│
├── backend/                   # API Express
│   ├── src/
│   │   ├── controller/        # Contrôleurs (logique métier)
│   │   │   ├── product.controller.js
│   │   │   ├── client.controller.js
│   │   │   ├── facture.controller.js
│   │   │   ├── purchase.controller.js
│   │   │   ├── orders.controller.js
│   │   │   ├── user.controller.js
│   │   │   └── ...
│   │   ├── models/            # Modèles Sequelize
│   │   │   ├── product.model.js
│   │   │   ├── client.model.js
│   │   │   ├── invoice.model.js
│   │   │   ├── purchase.model.js
│   │   │   ├── user.model.js
│   │   │   └── ...
│   │   ├── routes/            # Définitions des routes
│   │   │   ├── product.route.js
│   │   │   ├── client.route.js
│   │   │   ├── facture.route.js
│   │   │   ├── Auths.route.js
│   │   │   ├── entreprise.routes.js
│   │   │   └── ...
│   │   ├── middleware/        # Middlewares
│   │   │   ├── AuthenticatedUser.js
│   │   │   ├── Role.js
│   │   │   ├── activeEntreprise.js
│   │   │   ├── upload.js
│   │   │   └── ...
│   │   ├── config/            # Configuration
│   │   │   ├── db.js          # Connexion DB
│   │   │   ├── socket.js      # Socket.io config
│   │   │   ├── mail.config.js # Mailjet config
│   │   │   └── ...
│   │   ├── crons/             # Tâches planifiées
│   │   │   ├── dailyReports.js
│   │   │   └── cronCurrencyUpdater.js
│   │   ├── utils/             # Utilitaires
│   │   │   ├── cleanupInactiveUsers.js
│   │   │   ├── currency.service.js
│   │   │   ├── demo-data-generator.js
│   │   │   └── ...
│   │   └── migrations/        # Migrations DB
│   ├── app.js                 # Express app setup
│   ├── index.js               # Entry point + Socket.io init
│   ├── config/                # Config files
│   ├── database.sql           # SQL initial
│   ├── .env                   # Variables d'env
│   └── package.json
│
└── README.md                  # Ce fichier
```

---

## ⚡ Installation et Setup

### Prérequis

- **Node.js** >= 20.19.0 ou >= 22.12.0
- **npm** ou **yarn**
- **MySQL** 8.0+ (local ou cloud)
- **Git**

### 1. Cloner le projet

```bash
git clone https://github.com/LegacyTech-U6/iventello.git
cd iventello
```

### 2. Setup Backend

```bash
cd backend

# Installer les dépendances
npm install

# Créer le fichier .env (voir section Variables d'environnement)
cp .env.example .env

# Démarrer le serveur (mode développement avec nodemon)
npm run dev

# Ou mode production
npm start
```

**Backend tourne sur**: `http://localhost:5000` (ou port défini dans .env)

### 3. Setup Frontend

```bash
cd ../frontend/Stockly

# Installer les dépendances
npm install

# Créer le fichier .env (voir section Variables d'environnement)
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Démarrer le dev server
npm run dev

# Build pour la production
npm run build
```

**Frontend tourne sur**: `http://localhost:5173` (Vite default)

---

## 🔐 Variables d'environnement

### Backend (`.env`)

```env
# Server
PORT=5000
NODE_ENV=development

# Database - Development (local)
MYSQL_USER_local=root
MYSQL_PASSWORD_local=
MYSQL_DATABASE_local=iventello_dev
MYSQL_HOST_local=127.0.0.1

# Database - Production (Railway, Render, etc.)
MYSQL_USER=<production_user>
MYSQL_PASSWORD=<production_password>
MYSQL_DATABASE=<production_db>
MYSQL_HOST=<production_host>
MYSQL_PORT=3306

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d

# Email (Mailjet)
MAILJET_API_KEY=<your-mailjet-api-key>
MAILJET_API_SECRET=<your-mailjet-api-secret>
MAILJET_SENDER_EMAIL=noreply@iventello.com

# Cloudinary (Image upload)
CLOUDINARY_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>

# Currency API (optional)
CURRENCY_API_KEY=<your-currency-api-key>

# Supabase (optional)
SUPABASE_URL=<your-supabase-url>
SUPABASE_KEY=<your-supabase-anon-key>
```

### Frontend (`.env`)

```env
# Production API
VITE_API_URL=https://your-backend-domain.com/api

# Development (local)
# VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Guide de démarrage

### Mode Développement (Complète)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Backend démarre sur http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend/Stockly
npm run dev
# Frontend démarre sur http://localhost:5173
```

### Accès à l'application

```
Frontend: http://localhost:5173
Backend API: http://localhost:5000/api
```

### Credentials par défaut (si seed data disponible)

```
Email: admin@example.com
Password: Admin123!
```

---

## 📊 Structure du projet en détail

### Frontend Stores (Pinia)

Chaque store gère une entité métier :

```typescript
// Exemple: src/stores/productStore.js
export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    selectedProduct: null,
    loading: false,
  }),
  actions: {
    async fetchProducts(enterpriseId) {
      // Appel API
    },
    async createProduct(data) {
      // POST /api/products
    },
  },
  getters: {
    lowStockProducts() {
      // Produits avec stock bas
    },
  },
})
```

**Stores disponibles:**
- `authStore.js` - Authentification & user
- `productStore.js` - Gestion produits
- `clientStore.js` - Gestion clients
- `entrepriseStore.js` - Gestion entreprises
- `FactureStore.js` - Factures
- `activityStore.js` - Logs d'activité
- `statisticStore.js` - Statistiques
- `roleStore.js` - Rôles & permissions
- `workerStore.js` - Travailleurs
- `SupplierStore.js` - Fournisseurs

### Backend Routes

```
POST   /api/auth/register         - Inscription
POST   /api/auth/login            - Connexion
POST   /api/auth/logout           - Déconnexion
POST   /api/auth/verify/:token    - Vérifier email

GET    /api/products              - Lister produits
POST   /api/products              - Créer produit
PUT    /api/products/:id          - Modifier produit
DELETE /api/products/:id          - Supprimer produit

GET    /api/clients               - Lister clients
POST   /api/clients               - Créer client
PUT    /api/clients/:id           - Modifier client

GET    /api/factures              - Lister factures
POST   /api/factures              - Créer facture
GET    /api/factures/:id/pdf      - Export PDF

GET    /api/purchase              - Lister achats
POST   /api/purchase              - Créer achat

GET    /api/stats                 - Statistiques
GET    /api/stats/reports         - Rapports

GET    /api/entreprise            - Lister entreprises
POST   /api/entreprise            - Créer entreprise
PUT    /api/entreprise/:id        - Modifier entreprise

GET    /api/workers               - Lister workers
POST   /api/workers               - Créer worker

GET    /api/roles                 - Lister rôles
POST   /api/roles                 - Créer rôle
```

---

## 🎮 Features principales

### ✅ Authentification & Multi-Entreprise

- Inscription avec vérification email
- Login avec JWT
- Support multi-entreprises
- Système de rôles (Admin, StockManager, SalesPoint)
- Permissions granulaires par action

### ✅ Gestion de Stock

- CRUD complet pour produits
- Tracking quantité/prix
- Alertes stock bas
- Catégories de produits
- Support images (Cloudinary)

### ✅ Ventes & Factures

- Créer factures avec articles
- Calcul automatique TVA/totaux
- Export PDF
- Historique ventes
- Multi-devise

### ✅ Achats & Approvisionnement

- Gestion fournisseurs
- Commandes d'achat
- Reçus d'achat
- Rapports achat

### ✅ Rapports & Analytics

- Graphiques ventes (Chart.js)
- Rapports par période
- KPI dashboard
- Export données

### ✅ Autres

- Gestion clients/workers
- Historique activités
- Notifications real-time (Socket.io)
- Mode offline (PWA)
- Responsive design
- Dark mode support (TailwindCSS)

---

## 🔌 API Endpoints - Détail

### Authentification

```
POST /api/auth/register
Body: { email, password, firstName, lastName }
Response: { token, user }

POST /api/auth/login
Body: { email, password }
Response: { token, user }

POST /api/auth/verify/:token
Response: { success, message }
```

### Produits

```
GET /api/products?enterpriseId=1&category=2&sortBy=name
Response: { products: [...], total }

POST /api/products
Body: { name, sku, price, quantity, categoryId, entrepriseId, ... }
Response: { product }

PUT /api/products/:id
Body: { ...updated fields }
Response: { product }

DELETE /api/products/:id
Response: { success }
```

### Factures

```
GET /api/factures?enterpriseId=1
Response: { factures: [...] }

POST /api/factures
Body: { clientId, items: [{productId, qty, price}], ... }
Response: { facture }

GET /api/factures/:id/pdf
Response: PDF file
```

---

## 🐛 Dépannage

### Le backend ne démarre pas

**Problème**: Port déjà utilisé
```bash
# Linux/Mac
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Problème**: Erreur de connexion DB
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
- Vérifier que MySQL tourne
- Vérifier credentials dans `.env`
- Vérifier host/port

### Le frontend ne charge pas l'API

```
CORS error ou 404 on /api/...
```

**Solutions:**
1. Vérifier que backend tourne sur le bon port
2. Vérifier `VITE_API_URL` dans `.env`
3. Vérifier CORS middleware dans `backend/index.js`

```javascript
// Si erreur CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
```

### Page blanche au démarrage

```bash
# Nettoyer cache Vite
rm -rf frontend/Stockly/node_modules/.vite
npm run dev
```

### Erreur type TypeScript

```bash
# Re-valider types
npm run type-check

# Rebuild
rm -rf dist
npm run build
```

---

## ⚡ Performance et Optimisations

### Frontend

✅ **Code Splitting** - Chunks automatiques par route (Vite)
✅ **Lazy Loading** - Composants chargés à la demande
✅ **Image Optimization** - PNG optimisés, Cloudinary CDN
✅ **Compression** - Gzip + Brotli activés
✅ **PWA** - Offline support, installable
✅ **Bundle** - 59MB dist (assets optimisés)

### Backend

✅ **Connection Pooling** - MySQL2 avec pool
✅ **Caching** - Node-cache pour données fréquentes
✅ **Cron Jobs** - Cleanup inactifs, générer rapports
✅ **Validation** - Express-validator sur toutes routes
✅ **Rate Limiting** - À implémenter pour production

### Recommandations pour la production

```bash
# Frontend (Vercel, Netlify, etc.)
npm run build
# Déployer le dossier 'dist'

# Backend (Render, Railway, Heroku, etc.)
NODE_ENV=production npm start
# Configurer les variables d'env sur la plateforme
```

---

## 🧪 Tests

### Tests unitaires (Vitest)

```bash
cd frontend/Stockly
npm run test:unit
```

### Tests E2E (Playwright)

```bash
cd frontend/Stockly
npm run test:e2e
```

### Linting & Formatting

```bash
# Frontend
npm run lint    # ESLint avec fix
npm run format  # Prettier

# Backend
# À ajouter (actuellement pas configuré)
```

---

## 📚 Ressources utiles

### Documentation officielle

- [Vue 3](https://vuejs.org)
- [Vite](https://vitejs.dev)
- [Pinia](https://pinia.vuejs.org)
- [Sequelize](https://sequelize.org)
- [Express.js](https://expressjs.com)
- [Socket.io](https://socket.io)
- [TailwindCSS](https://tailwindcss.com)
- [Naive UI](https://www.naiveui.com)

### Outils recommandés

- **VS Code** extensions:
  - Vetur / Volar (Vue 3)
  - Tailwind CSS IntelliSense
  - ESLint
  - Prettier
  - Thunder Client (API testing)

---

## 🔒 Sécurité

### ✅ Implémenté

- JWT pour authentification
- Bcrypt pour hashing password
- CORS configuré
- Helmet pour headers sécurité
- Validation input (express-validator)
- Protection entreprise (activeEntreprise middleware)

### 🔜 À faire

- [ ] Rate limiting (express-rate-limit)
- [ ] HTTPS en production
- [ ] CSRF protection
- [ ] SQL injection prevention (déjà Sequelize ORM)
- [ ] XSS protection
- [ ] API Key management
- [ ] Audit logging complet

---

## 📝 Contributing

Voici comment contribuer:

1. Fork le repo
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

**Conventions:**

```bash
# Commit messages
feat: Add new dashboard
fix: Fix product filter bug
docs: Update README
style: Format code
test: Add unit tests

# Branche names
feature/product-filtering
bugfix/login-issue
docs/api-documentation
```

---

## 📄 License

ISC - Voir `LICENSE` pour détails

---

## 👨‍💻 Auteur

**LegacyTech** - Équipe de développement

---

## 📞 Support

Pour des questions ou problèmes:

1. Vérifier la section [Dépannage](#dépannage)
2. Ouvrir une issue GitHub
3. Contacter l'équipe dev

---

## 🎉 Conclusion

Tu as maintenant une **documentation complète** qui te permettra de:

✅ Reprendre le projet dans 5 ans  
✅ Onboarder de nouveaux développeurs  
✅ Déployer en production rapidement  
✅ Déboguer efficacement  
✅ Étendre les features  

Garde ce README **à jour** à chaque changement majeur! 🚀

---

**Dernière mise à jour**: 22 Novembre 2025  
**Version du projet**: 1.0.0
