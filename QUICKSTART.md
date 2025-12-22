# ⚡ Quick Start Guide - Iventello

Guide de démarrage ultra-rapide pour commencer immédiatement.

---

## 🚀 En 5 minutes

### 1. Clone & Install

```bash
# Cloner
git clone https://github.com/LegacyTech-U6/iventello.git
cd iventello

# Backend
cd backend
npm install
cp .env.example .env
# Éditer .env avec vos credentials

# Frontend
cd ../frontend/Stockly
npm install
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

### 2. Start

**Terminal 1:**
```bash
cd backend
npm run dev
```

**Terminal 2:**
```bash
cd frontend/Stockly
npm run dev
```

### 3. Accès

```
Frontend: http://localhost:5173
API: http://localhost:5000/api
```

---

## 🔑 Login Defaults

```
Email: admin@example.com
Password: Admin123!
```

*(Si seed data configurée)*

---

## 📝 Fichiers Importants

### Frontend
| Fichier | Objectif |
|---------|----------|
| `src/router/index.ts` | Routes & navigation |
| `src/stores/*.js` | State management (Pinia) |
| `src/components/` | Composants réutilisables |
| `src/views/` | Pages |
| `vite.config.ts` | Config Vite |
| `tailwind.config.js` | Config TailwindCSS |

### Backend
| Fichier | Objectif |
|---------|----------|
| `index.js` | Entry point + Socket.io |
| `src/routes/` | Définition des endpoints |
| `src/controller/` | Logique métier |
| `src/models/` | Schéma base de données |
| `.env` | Variables d'environnement |
| `config/config.js` | Config database |

---

## 🔧 Commandes Courantes

### Frontend
```bash
npm run dev        # Dev server
npm run build      # Production build
npm run preview    # Préview du build
npm run test:unit  # Tests unitaires
npm run test:e2e   # Tests E2E
npm run lint       # Linter le code
npm run format     # Formater le code
```

### Backend
```bash
npm run dev        # Dev avec nodemon
npm start          # Production
npm test           # Tests
npm run serve      # Production simple
```

---

## 🐛 Problèmes Courants

### Backend ne démarre pas

**Port 5000 déjà utilisé:**
```bash
lsof -i :5000
kill -9 <PID>
npm run dev
```

**Erreur MySQL:**
```bash
# Vérifier que MySQL tourne
# Vérifier les credentials dans .env
# Vérifier la host/port
```

### Frontend affiche page blanche

```bash
# Nettoyer cache
rm -rf node_modules/.vite
npm run dev
```

### CORS Error

Vérifier que backend tourne sur le bon port:
```bash
# Backend deve être sur 5000 (par défaut)
# Frontend peut être sur 5173 (par défaut)
```

---

## 📊 Structure Rapide

```
iventello/
├── backend/                  # API Node/Express
│   ├── src/
│   │   ├── controller/       # Logique métier
│   │   ├── models/           # Modèles Sequelize
│   │   ├── routes/           # Endpoints
│   │   ├── middleware/       # Auth, validation
│   │   └── config/           # DB, socket.io
│   ├── .env                  # Config locale
│   └── package.json
│
├── frontend/Stockly/         # App Vue 3
│   ├── src/
│   │   ├── components/       # Composants
│   │   ├── views/            # Pages
│   │   ├── stores/           # Pinia (état)
│   │   ├── router/           # Routes
│   │   ├── api/              # Axios config
│   │   └── assets/           # Styles, images
│   ├── vite.config.ts        # Config Vite
│   ├── .env                  # VITE_API_URL
│   └── package.json
│
├── README.md                 # Documentation complète
├── DEVELOPMENT.md            # Guide développement
├── API_DOCUMENTATION.md      # Endpoints API
└── MAINTENANCE.md            # Maintenance checklist
```

---

## 🔌 API Rapide

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123!"}'
```

### Get Products
```bash
curl -X GET "http://localhost:5000/api/products?enterpriseId=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Laptop",
    "sku":"LAPTOP-001",
    "price":1200,
    "quantity":5,
    "enterpriseId":1
  }'
```

Plus d'endpoints → Voir `API_DOCUMENTATION.md`

---

## 📚 Docs Essentielles

1. **README.md** - Vue d'ensemble + stack tech
2. **DEVELOPMENT.md** - Comment développer
3. **API_DOCUMENTATION.md** - Tous les endpoints
4. **MAINTENANCE.md** - Maintenance & checklist

---

## 🚀 Déployer en Production

### Frontend (Vercel/Netlify)

```bash
npm run build
# Upload 'dist' folder
```

### Backend (Render/Railway)

```bash
# Push to Git
git add .
git commit -m "Deploy"
git push origin main

# Configurer les env vars sur la plateforme:
# - MYSQL_USER
# - MYSQL_PASSWORD
# - MYSQL_DATABASE
# - MYSQL_HOST
# - JWT_SECRET
# - MAILJET_*
# - CLOUDINARY_*
```

---

## ✅ Checklist Démarrage

- [ ] Cloner le repo
- [ ] Installer dépendances (front + back)
- [ ] Créer .env files
- [ ] Démarrer backend (`npm run dev`)
- [ ] Démarrer frontend (`npm run dev`)
- [ ] Accéder à http://localhost:5173
- [ ] Tester login
- [ ] Tester CRUD produits
- [ ] Vérifier console pour erreurs

---

## 🆘 Besoin d'aide?

1. Vérifier `DEVELOPMENT.md` pour les guides détaillés
2. Vérifier `API_DOCUMENTATION.md` pour les endpoints
3. Vérifier `MAINTENANCE.md` pour le troubleshooting
4. Vérifier les logs:
   ```bash
   # Frontend: F12 -> Console
   # Backend: Terminal output
   ```

---

**Bon codage! 🎉**
