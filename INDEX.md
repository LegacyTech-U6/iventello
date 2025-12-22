# 📑 Index de Documentation - Iventello

Navigation rapide vers tous les guides.

---

## 🎯 Par Objectif

### 🚀 Je veux démarrer vite
→ Lire: **[QUICKSTART.md](./QUICKSTART.md)** (5 minutes)

### 👨‍💻 Je veux développer une nouvelle feature
→ Lire: **[DEVELOPMENT.md](./DEVELOPMENT.md)** (30 minutes)

### 📖 Je veux comprendre l'architecture
→ Lire: **[README.md](./README.md)** Section "Architecture" (20 minutes)

### 🔌 Je veux utiliser l'API
→ Lire: **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** (30 minutes)

### 🔧 Je dois maintenir le projet
→ Lire: **[MAINTENANCE.md](./MAINTENANCE.md)** (40 minutes)

### 🚨 Il y a un bug/erreur
→ Lire: **[README.md](./README.md)** Section "Dépannage" + logs

---

## 📚 Par Technologie

### Vue 3
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Section "Écrire un composant"
- [README.md](./README.md) - Section "Frontend Stores"

### TypeScript
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Section "Style guide"

### Node.js / Express
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Section "Ajouter une route"
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Tous les endpoints

### Sequelize / MySQL
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Section "Ajouter une colonne"
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Section "Migrations"

### TailwindCSS
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Section "Style guide"

### Pinia
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Section "Créer un store"
- [README.md](./README.md) - Section "Frontend Stores"

---

## 🔍 Par Fichier Important

### Frontend
| Fichier | Description | Voir |
|---------|-------------|------|
| `src/router/index.ts` | Routes & navigation | [DEVELOPMENT.md](./DEVELOPMENT.md) |
| `src/stores/` | State management | [README.md](./README.md) |
| `src/components/` | Composants réutilisables | [DEVELOPMENT.md](./DEVELOPMENT.md) |
| `vite.config.ts` | Build config | [README.md](./README.md) |
| `tailwind.config.js` | Styling config | [README.md](./README.md) |

### Backend
| Fichier | Description | Voir |
|---------|-------------|------|
| `index.js` | Entry point | [README.md](./README.md) |
| `src/routes/` | Endpoints | [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) |
| `src/controller/` | Logique métier | [DEVELOPMENT.md](./DEVELOPMENT.md) |
| `src/models/` | Schéma DB | [DEVELOPMENT.md](./DEVELOPMENT.md) |
| `.env` | Configuration | [README.md](./README.md) |

---

## ⚡ Commandes Rapides

### Setup
```bash
# Frontend
cd frontend/Stockly && npm install

# Backend
cd backend && npm install
```

### Développement
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend/Stockly && npm run dev
```

### Build
```bash
# Frontend
npm run build

# Backend
npm start
```

### Tests
```bash
npm run test:unit
npm run test:e2e
npm run lint
```

Plus de commandes → [DEVELOPMENT.md](./DEVELOPMENT.md)

---

## 🔐 Configuration

### Variables d'environnement
- **Backend**: `backend/.env` → [README.md](./README.md)
- **Frontend**: `frontend/Stockly/.env` → [README.md](./README.md)

### Configuration files
- Vite: `vite.config.ts`
- TypeScript: `tsconfig.json`
- TailwindCSS: `tailwind.config.js`
- Database: `config/config.js`

---

## 🚀 Déploiement

### Frontend
- Platform: Vercel, Netlify, GitHub Pages
- Steps: `npm run build` → Upload `dist/`
- Plus d'infos: [README.md](./README.md) Section "Déploiement"

### Backend
- Platform: Render, Railway, Heroku
- Env vars: MYSQL_*, JWT_SECRET, MAILJET_*, CLOUDINARY_*
- Plus d'infos: [README.md](./README.md) Section "Déploiement"

---

## 📊 API Reference

### Authentication
- POST `/auth/register`
- POST `/auth/login`
- POST `/auth/verify/:token`

### Products
- GET `/products`
- POST `/products`
- PUT `/products/:id`
- DELETE `/products/:id`

### Clients
- GET `/clients`
- POST `/clients`
- PUT `/clients/:id`

### Invoices
- GET `/factures`
- POST `/factures`
- GET `/factures/:id/pdf`

### More...
→ [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## 🐛 Dépannage

### Problèmes Courants

#### Backend ne démarre pas
- Voir: [README.md](./README.md) Section "Dépannage"
- Solution: Port déjà utilisé → `lsof -i :5000`

#### Frontend affiche page blanche
- Voir: [README.md](./README.md) Section "Dépannage"
- Solution: Nettoyer cache → `rm -rf node_modules/.vite`

#### CORS Error
- Voir: [README.md](./README.md) Section "Dépannage"
- Solution: Vérifier VITE_API_URL et CORS middleware

#### Erreur DB
- Voir: [README.md](./README.md) Section "Dépannage"
- Solution: Vérifier MySQL + credentials

---

## ✅ Maintenance

### Checklist quotidienne
- [ ] Vérifier les logs

### Checklist hebdomadaire
- [ ] Exécuter les tests
- [ ] Vérifier les dépendances obsolètes
- [ ] Vérifier les vulnérabilités

### Checklist mensuelle
- [ ] Mettre à jour les dépendances
- [ ] Faire une sauvegarde BD
- [ ] Vérifier les utilisateurs inactifs

→ [MAINTENANCE.md](./MAINTENANCE.md)

---

## 📖 Documentation Complète

1. **[README.md](./README.md)** - Complet (vue d'ensemble, setup, API)
2. **[QUICKSTART.md](./QUICKSTART.md)** - Rapide (5 minutes)
3. **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Développement
4. **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Endpoints API
5. **[MAINTENANCE.md](./MAINTENANCE.md)** - Maintenance & checklist

---

## 🤔 Ou trouver une info?

### Je veux savoir si...

**Le projet supporte X feature?**
→ [README.md](./README.md) Section "Features principales"

**Comment ajouter Y feature?**
→ [DEVELOPMENT.md](./DEVELOPMENT.md)

**Comment appeler l'API?**
→ [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

**Comment dépanner Z bug?**
→ [README.md](./README.md) Section "Dépannage" ou [DEVELOPMENT.md](./DEVELOPMENT.md)

**Comment maintenir le projet?**
→ [MAINTENANCE.md](./MAINTENANCE.md)

**Quelle est la structure?**
→ [README.md](./README.md) Section "Architecture"

---

## 📌 Points Clés à Retenir

1. **Démarrage**: `npm run dev` dans backend & frontend
2. **API URL**: `http://localhost:5000/api` (local) ou env var
3. **Types**: Utiliser TypeScript partout (sauf JS legacy)
4. **Tests**: Exécuter avant chaque commit
5. **Commits**: Messages clairs (`feat:`, `fix:`, `docs:`)
6. **Branches**: `feature/`, `bugfix/`, `docs/`

---

## 🎓 Apprentissage

### Pour apprendre Vue 3
- [Vue 3 Docs](https://vuejs.org)
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Exemples

### Pour apprendre Express
- [Express Docs](https://expressjs.com)
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Exemples

### Pour apprendre Sequelize
- [Sequelize Docs](https://sequelize.org)
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Section DB

### Pour apprendre TailwindCSS
- [TailwindCSS Docs](https://tailwindcss.com)
- [README.md](./README.md) - Exemples

---

## 🚀 Next Steps

1. **Lisez [QUICKSTART.md](./QUICKSTART.md)** pour démarrer
2. **Explorez le code** avec les guides
3. **Développez une feature** avec [DEVELOPMENT.md](./DEVELOPMENT.md)
4. **Testez vos changements**
5. **Committez avec messages clairs**
6. **Déployez en production** avec [README.md](./README.md)

---

## 📞 Support

- **Questions sur le setup**: Voir [README.md](./README.md) Section "Installation"
- **Questions sur le développement**: Voir [DEVELOPMENT.md](./DEVELOPMENT.md)
- **Questions sur l'API**: Voir [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Questions sur la maintenance**: Voir [MAINTENANCE.md](./MAINTENANCE.md)

---

**Bonne exploration! 🎉**

*Dernière mise à jour: 22 Novembre 2025*
